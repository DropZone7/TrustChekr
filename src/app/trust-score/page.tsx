import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How TrustChekr Scores Risk',
  description: 'Understand how TrustChekr analyzes websites, messages, phone numbers, and crypto addresses to calculate risk scores.',
  openGraph: {
    title: 'How TrustChekr Scores Risk',
    description: 'Our multi-layered scan engine combines pattern matching, OSINT, AI analysis, and community data.',
    url: 'https://trustchekr.com/trust-score',
  },
};

const modules = [
  { icon: '🔍', name: 'Pattern Matching', desc: 'Checks for known scam phrases, urgency tactics, impersonation keywords (CRA, RCMP, IRS), and suspicious URL structures.' },
  { icon: '🛡️', name: 'Domain Blocklist', desc: '49,000+ known phishing and malware domains checked instantly via Bloom filter — zero network latency.' },
  { icon: '📧', name: 'Phishing Email Detector', desc: 'Trained on 5,100 labeled phishing emails. Scores keyword density, phrase patterns, and Canadian-specific signals.' },
  { icon: '💬', name: 'Spam Keyword Analysis', desc: 'Trained on 5,572 labeled SMS messages. Identifies spam-associated language patterns.' },
  { icon: '🌐', name: 'OSINT: Domain & RDAP', desc: 'Checks domain age, registrar info, and DNS records. Newly registered domains are higher risk.' },
  { icon: '🔒', name: 'Google Safe Browsing', desc: 'Cross-references URLs against Google\'s continuously updated database of dangerous sites.' },
  { icon: '🦠', name: 'VirusTotal', desc: '70+ antivirus engines scan the URL for malware, phishing, and suspicious behavior.' },
  { icon: '🎣', name: 'PhishTank + URLhaus', desc: 'Community-verified phishing URL database and malware URL tracker.' },
  { icon: '💰', name: 'XRPL Wallet Analysis', desc: 'Analyzes XRP Ledger wallets — transaction patterns, account age, payment velocity, and trust line behavior.' },
  { icon: '🤖', name: 'AI Text Detection', desc: '7-signal heuristic detecting AI-generated content: repetition, vocabulary diversity, sentence structure.' },
  { icon: '🧠', name: 'Gemini AI Analysis', desc: 'Google Gemini 2.5 Flash provides natural-language scam classification, tactic identification, and confidence scoring.' },
  { icon: '📊', name: 'Entity Graph', desc: 'Maps relationships between phone numbers, emails, domains, and crypto addresses to identify coordinated scam networks.' },
  { icon: '👤', name: 'Username OSINT', desc: 'Checks username presence across X/Twitter, Instagram, TikTok, GitHub, and Reddit.' },
  { icon: '🔗', name: 'URL Feature Analysis', desc: 'Trained on 58,645 URLs. Analyzes path length, special characters, subdomain depth, and entropy.' },
];

const scoringRules = [
  { range: '≤ 0', level: 'Low Risk', color: '#059669', bg: 'rgba(16,185,129,0.1)', desc: 'No warning signs found. Still, trust your instincts.' },
  { range: '1 – 30', level: 'Suspicious', color: '#d97706', bg: 'rgba(245,158,11,0.1)', desc: 'Some signals detected. Proceed with caution, verify independently.' },
  { range: '31 – 60', level: 'High-Risk', color: '#dc2626', bg: 'rgba(239,68,68,0.1)', desc: 'Multiple risk indicators. Do not send money or personal info.' },
  { range: '61+', level: 'Very Likely Scam', color: '#991b1b', bg: 'rgba(153,27,27,0.1)', desc: 'Strong scam indicators. Report to CAFC and do not engage.' },
];

export default function TrustScorePage() {
  return (
    <div>
      <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 700, color: 'var(--tc-primary)' }}>How TrustChekr Scores Risk</h1>
      <p style={{ margin: '0.5rem 0 1.5rem', fontSize: '1rem', color: 'var(--tc-text-muted)' }}>
        Every scan runs through multiple independent analysis modules. Signals are weighted and combined into a single risk score. Positive weights mean risk. Negative weights mean trust. The final score determines the risk level.
      </p>

      {/* Scoring table */}
      <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.3rem', fontWeight: 600 }}>Risk Levels</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
        {scoringRules.map((r) => (
          <div key={r.range} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.75rem', borderRadius: '10px', border: '1px solid var(--tc-border)' }}>
            <span style={{ borderRadius: '999px', padding: '0.15rem 0.5rem', fontSize: '0.8rem', fontWeight: 700, backgroundColor: r.bg, color: r.color, whiteSpace: 'nowrap' }}>{r.range}</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem', color: r.color }}>{r.level}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--tc-text-muted)' }}>{r.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Modules */}
      <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.3rem', fontWeight: 600 }}>Analysis Modules ({modules.length})</h2>
      <p style={{ margin: '0 0 1rem', fontSize: '0.9rem', color: 'var(--tc-text-muted)' }}>
        Not every module runs on every scan — only the ones relevant to your input type. Results are combined with deduplication to avoid counting the same signal twice.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
        {modules.map((m) => (
          <div key={m.name} style={{ borderRadius: '12px', border: '1px solid var(--tc-border)', padding: '0.75rem', backgroundColor: 'var(--tc-surface)' }}>
            <div style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{m.icon} <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>{m.name}</span></div>
            <div style={{ fontSize: '0.85rem', color: 'var(--tc-text-muted)' }}>{m.desc}</div>
          </div>
        ))}
      </div>

      {/* How it works */}
      <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.3rem', fontWeight: 600 }}>How Scoring Works</h2>
      <div style={{ borderRadius: '12px', border: '1px solid var(--tc-border)', padding: '1rem', fontSize: '0.9rem', color: 'var(--tc-text-muted)', marginBottom: '2rem' }}>
        <ol style={{ margin: 0, paddingLeft: '1.2rem' }}>
          <li style={{ marginBottom: '0.4rem' }}><strong>Pattern matching</strong> runs first — checking for known scam phrases, urgency keywords, and suspicious structures.</li>
          <li style={{ marginBottom: '0.4rem' }}><strong>Training data</strong> checks the input against 49K+ blocked domains, spam keywords, URL features, and phishing email patterns.</li>
          <li style={{ marginBottom: '0.4rem' }}><strong>OSINT modules</strong> run in parallel (4-second timeout each) — domain analysis, Safe Browsing, VirusTotal, PhishTank, URLhaus.</li>
          <li style={{ marginBottom: '0.4rem' }}><strong>Entity graph and AI detection</strong> map relationships and check for AI-generated content.</li>
          <li style={{ marginBottom: '0.4rem' }}><strong>Gemini AI</strong> provides an optional natural-language analysis with scam type classification.</li>
          <li style={{ marginBottom: '0.4rem' }}><strong>Signals are deduplicated</strong> (60% word overlap threshold) and summed into a final score.</li>
        </ol>
      </div>

      {/* Disclaimer */}
      <div style={{ borderRadius: '12px', backgroundColor: 'rgba(26,82,118,0.04)', border: '1px solid var(--tc-border)', padding: '0.75rem', fontSize: '0.85rem', color: 'var(--tc-text-muted)' }}>
        <strong>Important:</strong> TrustChekr provides risk assessments based on available data and cannot guarantee whether something is legitimate. When in doubt, contact your bank or the company directly using a phone number from their official website. We never say something is &ldquo;safe&rdquo; — only &ldquo;Low Risk.&rdquo;
      </div>
    </div>
  );
}
