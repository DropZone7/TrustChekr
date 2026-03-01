'use client';

import { useMemo, useState } from 'react';

type AuthStatus = 'pass' | 'fail' | 'none' | 'unknown';
type Hop = { raw: string; from?: string; by?: string; timestamp?: string };

type ParsedHeaders = {
  from?: string;
  replyTo?: string;
  returnPath?: string;
  authResults?: {
    spf: { status: AuthStatus; raw: string | null };
    dkim: { status: AuthStatus; raw: string | null };
    dmarc: { status: AuthStatus; raw: string | null };
  };
  hops: Hop[];
  spoofingSignals: string[];
  overallRisk: { score: number; level: 'low' | 'medium' | 'high'; reasons: string[] };
};

function parseField(headers: string, name: string): string | undefined {
  const regex = new RegExp(`^${name}:\\s*(.+)$`, 'im');
  const m = headers.match(regex);
  return m ? m[1].trim() : undefined;
}

function parseAuthenticationResults(headers: string): ParsedHeaders['authResults'] {
  const lines = headers
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => /^Authentication-Results:/i.test(l) || /^[a-z]+=/.test(l));
  const joined = lines.join(' ');

  const extract = (keyword: 'spf' | 'dkim' | 'dmarc'): { status: AuthStatus; raw: string | null } => {
    const re = new RegExp(`${keyword}\\s*=\\s*([a-z]+)([^;]*)`, 'i');
    const m = joined.match(re);
    if (!m) return { status: 'none', raw: null };
    const status = m[1].toLowerCase();
    let mapped: AuthStatus = 'unknown';
    if (status === 'pass') mapped = 'pass';
    else if (status === 'fail') mapped = 'fail';
    else if (status === 'none') mapped = 'none';
    return { status: mapped, raw: m[0] };
  };

  return { spf: extract('spf'), dkim: extract('dkim'), dmarc: extract('dmarc') };
}

function parseHops(headers: string): Hop[] {
  const lines = headers.split(/\r?\n/);
  const receivedBlocks: string[] = [];
  let current: string[] = [];

  for (const line of lines) {
    if (/^Received:/i.test(line)) {
      if (current.length) receivedBlocks.push(current.join(' '));
      current = [line.replace(/^Received:\s*/i, '').trim()];
    } else if (/^\s/.test(line) && current.length) {
      current.push(line.trim());
    }
  }
  if (current.length) receivedBlocks.push(current.join(' '));

  const hops: Hop[] = receivedBlocks.map((raw) => {
    const hop: Hop = { raw };
    const fromMatch = raw.match(/from\s+([^;\s]+)/i);
    const byMatch = raw.match(/\sby\s+([^;\s]+)/i);
    const dateMatch = raw.match(/;\s*(.+)$/);
    if (fromMatch) hop.from = fromMatch[1];
    if (byMatch) hop.by = byMatch[1];
    if (dateMatch) hop.timestamp = dateMatch[1].trim();
    return hop;
  });

  return hops.reverse();
}

function evaluateSpoofing(
  from: string | undefined,
  returnPath: string | undefined,
  replyTo: string | undefined,
  hops: Hop[],
  auth?: ParsedHeaders['authResults'],
): string[] {
  const signals: string[] = [];

  const extractDomain = (value?: string) => {
    if (!value) return null;
    const emailMatch = value.match(/<([^>]+)>/);
    const address = emailMatch ? emailMatch[1] : value;
    const atParts = address.split('@');
    if (atParts.length !== 2) return null;
    return atParts[1].trim().toLowerCase();
  };

  const fromDomain = extractDomain(from);
  const returnDomain = extractDomain(returnPath);
  const replyDomain = extractDomain(replyTo);

  if (fromDomain && returnDomain && fromDomain !== returnDomain) {
    signals.push('From domain is different from envelope sender (Return-Path).');
  }
  if (fromDomain && replyDomain && fromDomain !== replyDomain) {
    signals.push('From domain is different from Reply-To domain.');
  }

  if (auth) {
    if (auth.dmarc.status === 'fail') signals.push('DMARC reports failure for this message.');
    if (auth.spf.status === 'fail') signals.push('SPF failed for this message.');
    if (auth.dkim.status === 'fail') signals.push('DKIM signature did not validate.');
  }

  if (hops.length > 0) {
    const firstHop = hops[0];
    if (firstHop.from && firstHop.from.match(/(dynamic|dsl|pool|pppoe)/i)) {
      signals.push('Earliest sending server looks like a consumer/dynamic connection, which is unusual for many legitimate senders.');
    }
  }

  return signals;
}

function assessRisk(
  auth: ParsedHeaders['authResults'] | undefined,
  spoofingSignals: string[],
): ParsedHeaders['overallRisk'] {
  let score = 20;
  const reasons: string[] = [];

  if (!auth || auth.dmarc.status === 'none') {
    score += 20;
    reasons.push('No clear DMARC result found in headers.');
  } else if (auth.dmarc.status === 'fail') {
    score += 35;
    reasons.push('DMARC failed for this message.');
  }

  if (auth) {
    if (auth.spf.status === 'fail') { score += 20; reasons.push('SPF check failed.'); }
    if (auth.dkim.status === 'fail') { score += 20; reasons.push('DKIM check failed.'); }
  }

  if (spoofingSignals.length > 0) {
    score += 15;
    reasons.push('Header fields and routing suggest possible spoofing.');
  }

  if (score > 100) score = 100;
  if (score < 0) score = 0;

  let level: 'low' | 'medium' | 'high' = 'low';
  if (score >= 70) level = 'high';
  else if (score >= 40) level = 'medium';

  return { score, level, reasons };
}

function getRiskBadge(overall: ParsedHeaders['overallRisk']) {
  if (overall.level === 'low') return { label: 'Low Risk', bg: 'rgba(16,185,129,0.12)', color: '#059669' };
  if (overall.level === 'medium') return { label: 'Medium Risk', bg: 'rgba(245,158,11,0.12)', color: '#d97706' };
  return { label: 'High Risk', bg: 'rgba(239,68,68,0.12)', color: '#dc2626' };
}

export function EmailHeaderAnalyzer() {
  const [raw, setRaw] = useState('');
  const [parsed, setParsed] = useState<ParsedHeaders | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [accordion, setAccordion] = useState<'gmail' | 'outlook' | 'apple' | null>(null);

  const handleAnalyze = () => {
    const trimmed = raw.trim();
    if (!trimmed) {
      setParsed(null);
      setError('Paste the full raw headers from your email client.');
      return;
    }
    setError(null);

    const from = parseField(trimmed, 'From');
    const replyTo = parseField(trimmed, 'Reply-To');
    const returnPath = parseField(trimmed, 'Return-Path');
    const auth = parseAuthenticationResults(trimmed);
    const hops = parseHops(trimmed);
    const spoofingSignals = evaluateSpoofing(from, returnPath, replyTo, hops, auth);
    const overallRisk = assessRisk(auth, spoofingSignals);

    setParsed({ from, replyTo, returnPath, authResults: auth, hops, spoofingSignals, overallRisk });
  };

  const riskBadge = useMemo(() => (parsed ? getRiskBadge(parsed.overallRisk) : null), [parsed]);

  return (
    <section style={{ borderRadius: '20px', border: '1px solid var(--tc-border)', backgroundColor: 'var(--tc-surface)', padding: '1.25rem 1.1rem 1.5rem', fontSize: '18px' }}>
      {/* Input */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
        <label htmlFor="email-headers" style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--tc-primary)' }}>
          Paste raw email headers
        </label>
        <textarea
          id="email-headers"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          rows={10}
          placeholder={'Authentication-Results: mx.google.com;\n  spf=pass ...\n  dkim=pass ...\nReceived: from ...'}
          style={{ width: '100%', borderRadius: '12px', border: '1px solid var(--tc-border)', padding: '0.75rem 0.8rem', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace', fontSize: '0.85rem', minHeight: '200px', resize: 'vertical', color: 'var(--tc-text-main)', backgroundColor: '#f9fafb', whiteSpace: 'pre' }}
        />
        <button type="button" onClick={handleAnalyze} style={{ alignSelf: 'flex-start', padding: '0.6rem 1.1rem', borderRadius: '999px', border: 'none', backgroundColor: 'var(--tc-primary)', color: '#ffffff', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer' }}>
          Analyze headers
        </button>
        {error && <p style={{ margin: 0, fontSize: '0.9rem', color: '#b91c1c' }}>{error}</p>}
      </div>

      {/* Results */}
      {parsed && (
        <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Risk assessment */}
          <section style={{ borderRadius: '12px', border: '1px solid var(--tc-border)', padding: '0.9rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: 'var(--tc-text-main)' }}>Overall risk assessment</h2>
              {riskBadge && (
                <span style={{ borderRadius: '999px', padding: '0.2rem 0.7rem', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', backgroundColor: riskBadge.bg, color: riskBadge.color }}>
                  {riskBadge.label}
                </span>
              )}
            </div>
            <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--tc-text-muted)' }}>
              Risk score: {parsed.overallRisk.score} / 100. This is an automated signal to help you decide whether to trust the message — not a guarantee.
            </p>
            {parsed.overallRisk.reasons.length > 0 && (
              <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.1rem', fontSize: '0.9rem', color: '#374151' }}>
                {parsed.overallRisk.reasons.map((r, idx) => <li key={idx} style={{ marginBottom: '0.15rem' }}>{r}</li>)}
              </ul>
            )}
          </section>

          {/* Sender info */}
          <section style={{ borderRadius: '12px', border: '1px solid var(--tc-border)', padding: '0.9rem' }}>
            <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.05rem', fontWeight: 600 }}>Sender information</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.6rem 1.2rem', fontSize: '0.95rem' }}>
              {[
                { label: 'From', value: parsed.from },
                { label: 'Reply-To', value: parsed.replyTo },
                { label: 'Return-Path', value: parsed.returnPath },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--tc-text-muted)', marginBottom: '0.15rem' }}>{label}</div>
                  <div style={{ wordBreak: 'break-all' }}>{value ?? <span style={{ color: '#9ca3af' }}>Not found</span>}</div>
                </div>
              ))}
            </div>
            {parsed.spoofingSignals.length > 0 && (
              <p style={{ margin: '0.6rem 0 0', fontSize: '0.9rem', color: '#b91c1c' }}>
                Header mismatches and routing suggest this message may have been spoofed.
              </p>
            )}
          </section>

          {/* Authentication */}
          {parsed.authResults && (
            <section style={{ borderRadius: '12px', border: '1px solid var(--tc-border)', padding: '0.9rem' }}>
              <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.05rem', fontWeight: 600 }}>Authentication results</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.6rem 1rem', fontSize: '0.95rem' }}>
                {(['spf', 'dkim', 'dmarc'] as const).map((key) => {
                  const data = parsed.authResults![key];
                  let color = '#6b7280';
                  if (data.status === 'pass') color = '#059669';
                  else if (data.status === 'fail') color = '#dc2626';
                  else if (data.status === 'none') color = '#9ca3af';
                  return (
                    <div key={key}>
                      <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--tc-text-muted)', marginBottom: '0.15rem' }}>{key.toUpperCase()}</div>
                      <div style={{ display: 'inline-flex', alignItems: 'center', borderRadius: '999px', padding: '0.15rem 0.6rem', border: '1px solid #e5e7eb', fontSize: '0.85rem', color }}>
                        {data.status === 'none' ? 'No result' : data.status === 'unknown' ? 'Unknown' : data.status === 'pass' ? 'Pass' : 'Fail'}
                      </div>
                      {data.raw && <div style={{ marginTop: '0.25rem', fontSize: '0.8rem', color: 'var(--tc-text-muted)' }}>{data.raw}</div>}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Hops */}
          {parsed.hops.length > 0 && (
            <section style={{ borderRadius: '12px', border: '1px solid var(--tc-border)', padding: '0.9rem' }}>
              <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.05rem', fontWeight: 600 }}>Routing trace (hops)</h2>
              <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: 'var(--tc-text-muted)' }}>
                Read from top to bottom. The first hop is the original sending server.
              </p>
              <ol style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.9rem', color: '#374151' }}>
                {parsed.hops.map((hop, idx) => (
                  <li key={idx} style={{ marginBottom: '0.4rem' }}>
                    <div><strong>From:</strong> {hop.from ?? 'Unknown'} <strong>→ By:</strong> {hop.by ?? 'Unknown'}</div>
                    {hop.timestamp && <div style={{ fontSize: '0.8rem', color: 'var(--tc-text-muted)' }}>{hop.timestamp}</div>}
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* Spoofing */}
          {parsed.spoofingSignals.length > 0 && (
            <section style={{ borderRadius: '12px', border: '1px solid var(--tc-border)', padding: '0.9rem' }}>
              <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.05rem', fontWeight: 600 }}>Spoofing indicators</h2>
              <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.9rem', color: '#374151' }}>
                {parsed.spoofingSignals.map((s, idx) => <li key={idx} style={{ marginBottom: '0.15rem' }}>{s}</li>)}
              </ul>
            </section>
          )}
        </div>
      )}

      {/* How to find headers */}
      <section style={{ marginTop: '1.5rem', borderRadius: '12px', border: '1px solid var(--tc-border)', padding: '0.9rem' }}>
        <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.05rem', fontWeight: 600 }}>How to find email headers</h2>
        {([['gmail', 'Gmail'], ['outlook', 'Outlook / Microsoft 365'], ['apple', 'Apple Mail']] as const).map(([id, label]) => {
          const open = accordion === id;
          return (
            <div key={id} style={{ marginBottom: '0.4rem' }}>
              <button
                type="button"
                onClick={() => setAccordion(open ? null : id)}
                style={{ width: '100%', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: 'none', background: 'transparent', padding: '0.35rem 0.1rem', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 500, color: 'var(--tc-primary)' }}
              >
                <span>{label}</span>
                <span style={{ fontSize: '0.9rem', color: 'var(--tc-text-muted)' }}>{open ? '▲' : '▼'}</span>
              </button>
              {open && (
                <div style={{ padding: '0.1rem 0.1rem 0.35rem 0.15rem', fontSize: '0.9rem', color: 'var(--tc-text-muted)' }}>
                  {id === 'gmail' && (
                    <ol style={{ margin: 0, paddingLeft: '1.1rem' }}>
                      <li>Open the email in Gmail.</li>
                      <li>Click the three vertical dots next to Reply, then choose <strong>Show original</strong>.</li>
                      <li>Copy everything from the page and paste it into the box above.</li>
                    </ol>
                  )}
                  {id === 'outlook' && (
                    <ol style={{ margin: 0, paddingLeft: '1.1rem' }}>
                      <li>Open the email in Outlook or Outlook on the web.</li>
                      <li>Look for <strong>Message source</strong> or <strong>View message details</strong> in the message menu.</li>
                      <li>Copy the Internet headers and paste them into the box above.</li>
                    </ol>
                  )}
                  {id === 'apple' && (
                    <ol style={{ margin: 0, paddingLeft: '1.1rem' }}>
                      <li>Open the email in Apple Mail.</li>
                      <li>In the menu bar choose <strong>View → Message → All Headers</strong> or <strong>Raw Source</strong>.</li>
                      <li>Copy the full header section and paste it into the box above.</li>
                    </ol>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </section>
    </section>
  );
}
