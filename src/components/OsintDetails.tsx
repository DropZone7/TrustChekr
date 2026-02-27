'use client';

import { useState } from 'react';

const cardStyle = {
  backgroundColor: 'var(--tc-surface)',
  border: '1px solid var(--tc-border)',
  borderRadius: '12px',
  padding: '16px',
  marginBottom: '8px',
};

const titleStyle = {
  fontWeight: 600 as const,
  fontSize: '0.95rem',
  marginBottom: '0.25rem',
  display: 'flex' as const,
  alignItems: 'center' as const,
  gap: '0.5rem',
};

const bodyStyle = { fontSize: '0.85rem', color: 'var(--tc-text-main)' };

export function OsintDetails({ result }: { result: any }) {
  const [expanded, setExpanded] = useState(false);

  const domain = result?.osint?.domain;
  const virusTotal = result?.osint?.virusTotal;
  const safeBrowsing = result?.osint?.safeBrowsing;
  const phishTank = result?.osint?.phishTank;
  const urlhaus = result?.osint?.urlhaus;
  const graph = result?.graph;
  const ai = result?.ai_detection;

  const hasAny = domain || virusTotal || safeBrowsing || phishTank || urlhaus || graph || ai;
  if (!hasAny) return null;

  let domainIsVeryNew = false;
  let domainCreationDisplay: string | null = null;
  if (domain?.creation_date) {
    try {
      const createdAt = new Date(domain.creation_date);
      if (!Number.isNaN(createdAt.getTime())) {
        domainCreationDisplay = createdAt.toLocaleDateString();
        domainIsVeryNew = (Date.now() - createdAt.getTime()) / 86400000 < 30;
      }
    } catch {
      domainCreationDisplay = domain.creation_date;
    }
  }

  const vtPositives = typeof virusTotal?.positives === 'number' ? virusTotal.positives : null;
  const vtTotal = typeof virusTotal?.total === 'number' ? virusTotal.total : null;
  const sbThreatType = safeBrowsing?.threat_type || safeBrowsing?.threatType;
  const sbStatus = sbThreatType && sbThreatType !== 'NONE' ? sbThreatType : 'No threats found';
  const isPhishing = phishTank?.in_database === true || phishTank?.verified === true;

  return (
    <div style={{ marginTop: '1rem', borderTop: '1px solid var(--tc-border)', paddingTop: '0.75rem' }}>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          backgroundColor: 'transparent', border: 'none', padding: '0.25rem 0', cursor: 'pointer',
          color: 'var(--tc-text-main)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.95rem' }}>
          <span>🔍</span><span>Detailed Analysis</span>
        </div>
        <span style={{ display: 'inline-block', transition: 'transform 0.2s ease', transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
      </button>

      {expanded && (
        <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>

          {domain && (
            <div style={cardStyle}>
              <div style={titleStyle}><span>🌐</span><span>Domain Info</span></div>
              <div style={bodyStyle}>
                {domain.registrar && <div><strong>Registrar:</strong> {domain.registrar}</div>}
                {domainCreationDisplay && <div><strong>Created:</strong> {domainCreationDisplay}</div>}
                {domain.country && <div><strong>Country:</strong> {domain.country}</div>}
                {domainIsVeryNew && <div style={{ marginTop: '0.4rem', color: '#f97316', fontWeight: 500 }}>⚠️ Very new domain</div>}
              </div>
            </div>
          )}

          {virusTotal && (
            <div style={cardStyle}>
              <div style={titleStyle}><span>🛡️</span><span>VirusTotal</span></div>
              <div style={bodyStyle}>
                {vtPositives !== null && vtTotal !== null ? (
                  <div><span style={{ fontWeight: 500, color: vtPositives > 0 ? '#dc2626' : '#16a34a' }}>{vtPositives}/{vtTotal} security vendors</span> flagged this.</div>
                ) : <div>Scan results unavailable.</div>}
                {virusTotal.scan_date && <div style={{ marginTop: '0.25rem' }}><strong>Scan date:</strong> {virusTotal.scan_date}</div>}
              </div>
            </div>
          )}

          {safeBrowsing && (
            <div style={cardStyle}>
              <div style={titleStyle}><span>🔒</span><span>Google Safe Browsing</span></div>
              <div style={{ fontSize: '0.85rem', color: sbStatus === 'No threats found' ? '#16a34a' : '#dc2626', fontWeight: 500 }}>{sbStatus}</div>
            </div>
          )}

          {phishTank && (
            <div style={cardStyle}>
              <div style={titleStyle}><span>🎣</span><span>PhishTank</span></div>
              <div style={{ fontSize: '0.85rem', color: isPhishing ? '#dc2626' : '#16a34a', fontWeight: 500 }}>
                {isPhishing ? 'Known phishing URL' : 'Not in phishing database'}
              </div>
            </div>
          )}

          {urlhaus && (
            <div style={cardStyle}>
              <div style={titleStyle}><span>🦠</span><span>URLhaus Malware Check</span></div>
              <div style={bodyStyle}>
                {urlhaus.status && <div><strong>Status:</strong> {urlhaus.status}</div>}
                {urlhaus.threat && <div><strong>Threat:</strong> {urlhaus.threat}</div>}
                {!urlhaus.status && !urlhaus.threat && <div>Details unavailable.</div>}
              </div>
            </div>
          )}

          {ai && (
            <div style={cardStyle}>
              <div style={titleStyle}><span>🤖</span><span>AI Text Analysis</span></div>
              <div style={bodyStyle}>
                {typeof ai.ai_probability === 'number' && ai.label && (
                  <div style={{ marginBottom: '0.25rem' }}><strong>Probability:</strong> {(ai.ai_probability * 100).toFixed(1)}% ({ai.label})</div>
                )}
                {Array.isArray(ai.signals) && ai.signals.length > 0 && (
                  <div>
                    <strong>Signals:</strong>
                    <ul style={{ listStyle: 'disc', paddingLeft: '1.25rem', marginTop: '0.25rem' }}>
                      {ai.signals.map((s: any, i: number) => (
                        <li key={i}>{s.name ?? 'Signal'} {typeof s.score === 'number' ? `(${(s.score * 100).toFixed(1)}%)` : ''}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {graph && (
            <div style={cardStyle}>
              <div style={titleStyle}><span>🕸️</span><span>Network Analysis</span></div>
              <div style={bodyStyle}>
                {typeof graph.network_risk_score === 'number' && <div><strong>Network risk score:</strong> {graph.network_risk_score}</div>}
                {typeof graph.entities_created === 'number' && <div><strong>Entities created:</strong> {graph.entities_created}</div>}
                {typeof graph.edges_created === 'number' && <div><strong>Edges created:</strong> {graph.edges_created}</div>}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
