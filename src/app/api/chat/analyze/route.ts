import { NextRequest, NextResponse } from 'next/server';
import { runScan } from '@/lib/scanner';
import { batchWebsiteOsint } from '@/lib/osint/batchOsint';
import { isDomainBlocked } from '@/lib/training/domainBlocklist';
import { scorePhishingEmail } from '@/lib/training/phishingEmailDetector';
import { scoreSpamLikelihood } from '@/lib/training/spamDetector';

const GEMINI_ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

/* ── Entity extraction ─────────────────────────────────── */

function extractUrls(text: string): string[] {
  const matches = text.match(/\bhttps?:\/\/[^\s"'<>]+/gi);
  return matches ? Array.from(new Set(matches)) : [];
}

function extractEmails(text: string): string[] {
  const matches = text.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi);
  return matches ? Array.from(new Set(matches)) : [];
}

function extractPhones(text: string): string[] {
  const matches = text.match(/\b(?:\+?\d{1,3}[\s-]?)?(?:\(?\d{3}\)?[\s-]?)?\d{3}[\s-]?\d{4}\b/g);
  return matches ? Array.from(new Set(matches)) : [];
}

function extractCryptoAddresses(text: string): string[] {
  const candidates: string[] = [];
  const btc = text.match(/\b[13][a-km-zA-HJ-NP-Z1-9]{25,34}\b/g);
  const eth = text.match(/\b0x[a-fA-F0-9]{40}\b/g);
  if (btc) candidates.push(...btc);
  if (eth) candidates.push(...eth);
  return Array.from(new Set(candidates));
}

/* ── Internal scan (reuse our engine, no HTTP roundtrip) ── */

type ScanFinding = { type: string; value: string; riskScore?: number; signals?: string[] };

async function scanUrlInternal(url: string): Promise<ScanFinding> {
  try {
    const result = runScan('website', url);
    const riskSignals = (result._signalWeights ?? []).filter((w) => w > 0);
    const score = riskSignals.reduce((a, b) => a + b, 0);

    // Check blocklist
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    const blockCheck = isDomainBlocked(urlObj.hostname);
    const blocked = blockCheck.blocked;

    // OSINT (parallel, 4s timeout each)
    const osint = await batchWebsiteOsint(url);
    const osintSignals: string[] = [];
    if (osint.safeBrowsing?.signals) osintSignals.push(...osint.safeBrowsing.signals.map((s) => s.text));
    if (osint.virusTotal?.signals) osintSignals.push(...osint.virusTotal.signals.map((s) => s.text));
    if (osint.phishTank?.signals) osintSignals.push(...osint.phishTank.signals.map((s) => s.text));

    const allSignals = [...result.whyBullets.slice(0, 3), ...osintSignals.slice(0, 2)];
    if (blocked) allSignals.unshift(`Domain found in known phishing/malware blocklist`);

    const finalScore = Math.min(100, score + (blocked ? 50 : 0));

    return { type: 'url', value: url, riskScore: finalScore, signals: allSignals };
  } catch {
    return { type: 'url', value: url };
  }
}

async function scanMessageInternal(text: string): Promise<ScanFinding> {
  const spam = scoreSpamLikelihood(text);
  const phish = scorePhishingEmail(text);
  const signals: string[] = [];
  let score = 0;

  if (spam.isLikelySpam) {
    signals.push(`Contains ${spam.matchedKeywords.length} spam-associated keywords`);
    score += Math.round(spam.score * 0.2);
  }
  if (phish.score >= 30) {
    const topMatches = [...phish.matchedPhrases, ...phish.matchedKeywords].slice(0, 3).join(', ');
    signals.push(`Phishing indicators: ${topMatches}`);
    score += Math.round(phish.score * 0.3);
  }

  return { type: 'message', value: text.slice(0, 100), riskScore: score, signals };
}

/* ── Build context summary for Gemini ───────────────────── */

function buildScanSummary(findings: ScanFinding[], msgFinding?: ScanFinding): string {
  const lines: string[] = [];

  for (const f of findings) {
    if (f.type === 'url') {
      const label = (f.riskScore ?? 0) >= 60 ? 'High Risk' : (f.riskScore ?? 0) >= 30 ? 'Medium Risk' : 'Low Risk';
      lines.push(`- Website ${f.value} — ${label} (score ${f.riskScore ?? 'n/a'}).`);
      if (f.signals?.length) lines.push(`  Signals: ${f.signals.join('; ')}`);
    } else if (f.type === 'phone') {
      lines.push(`- Phone number ${f.value} — needs manual checking.`);
    } else if (f.type === 'email') {
      lines.push(`- Email ${f.value} — check headers and spelling carefully.`);
    } else if (f.type === 'crypto') {
      lines.push(`- Crypto address ${f.value} — crypto payments are usually irreversible.`);
    }
  }

  if (msgFinding?.signals?.length) {
    lines.push(`- Message analysis: ${msgFinding.signals.join('; ')}`);
  }

  if (!lines.length) {
    return 'No specific phone numbers, emails, URLs, or crypto addresses stood out technically. The main risk comes from the story and behaviour.';
  }
  return lines.join('\n');
}

/* ── Gemini call ────────────────────────────────────────── */

async function callGemini(message: string, scanSummary: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return 'I am not able to contact the AI model right now, but you should pause and double-check this using trusted phone numbers from official websites.';
  }

  const systemInstruction = `You are TrustChekr, a Canadian scam detection assistant. Rules:
- Be direct, use plain language suitable for seniors.
- Never say something is "safe" — use "Low Risk" instead.
- Focus on actionable advice.
- If someone mentions CRA, RCMP, SIN, or arrest warrants — those are almost always scam tactics.
- Keep responses 2-5 paragraphs, then 2-4 bullet points of next steps.
- Be blame-free — never imply the person did something wrong.`;

  const body = {
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: `${systemInstruction}\n\nUser description:\n${message}\n\nTechnical scan findings:\n${scanSummary}\n\nGive a short explanation in 2–5 paragraphs, then 2–4 bullet points of next steps.`,
          },
        ],
      },
    ],
  };

  try {
    const res = await fetch(`${GEMINI_ENDPOINT}?key=${encodeURIComponent(apiKey)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      return 'I could not get an AI response right now. Based on what you shared, be cautious, slow things down, and contact your bank or the real company using a number from their official website.';
    }

    const data = await res.json();
    return (
      data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join('') ??
      'Based on what you shared, treat this as at least Medium Risk and do not send money or personal information until you have checked with a trusted person or your bank.'
    );
  } catch {
    return 'I could not get an AI response right now. Be cautious, slow things down, and contact your bank or the real company using a number from their official website.';
  }
}

/* ── Route handler ──────────────────────────────────────── */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = (body.message ?? '').trim();
    if (!message) {
      return NextResponse.json({ error: 'Missing message.' }, { status: 400 });
    }

    // Extract entities
    const urls = extractUrls(message);
    const phones = extractPhones(message);
    const emails = extractEmails(message);
    const cryptos = extractCryptoAddresses(message);

    // Scan URLs in parallel
    const urlFindings = await Promise.all(urls.slice(0, 3).map(scanUrlInternal));
    const phonFindings: ScanFinding[] = phones.map((p) => ({ type: 'phone', value: p }));
    const emailFindings: ScanFinding[] = emails.map((e) => ({ type: 'email', value: e }));
    const cryptoFindings: ScanFinding[] = cryptos.map((c) => ({ type: 'crypto', value: c }));

    // Also scan the message text itself
    const msgFinding = await scanMessageInternal(message);

    const allFindings = [...urlFindings, ...phonFindings, ...emailFindings, ...cryptoFindings];
    const scanSummary = buildScanSummary(allFindings, msgFinding);
    const reply = await callGemini(message, scanSummary);

    // Best risk from URL scans
    const bestUrl = urlFindings.find((f) => f.riskScore !== undefined);

    return NextResponse.json({
      reply,
      riskScore: bestUrl?.riskScore ?? msgFinding.riskScore,
      riskLevel: (() => {
        const s = bestUrl?.riskScore ?? msgFinding.riskScore ?? 0;
        if (s >= 60) return 'high';
        if (s >= 30) return 'medium';
        return 'low';
      })(),
      signals: bestUrl?.signals ?? msgFinding.signals ?? [],
      entities: { urls, phones, emails, cryptos },
    });
  } catch {
    return NextResponse.json({ error: 'Unable to analyze this message right now.' }, { status: 500 });
  }
}
