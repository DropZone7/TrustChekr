import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How TrustChekr Scores Risk',
  description: 'Understand how TrustChekr analyzes suspicious content and what our risk levels mean.',
  openGraph: {
    title: 'How TrustChekr Scores Risk',
    description: 'What our risk levels mean and how to use them to protect yourself.',
    url: 'https://trustchekr.com/trust-score',
  },
};

const scoringRules = [
  { range: 'Low Risk', color: '#059669', bg: 'rgba(16,185,129,0.1)', desc: 'We didn\'t find anything suspicious — but trust your instincts. If something still feels off, it might be.' },
  { range: 'Suspicious', color: '#d97706', bg: 'rgba(245,158,11,0.1)', desc: 'Some warning signs were found. Don\'t send money or personal info until you\'ve verified independently.' },
  { range: 'High Risk', color: '#dc2626', bg: 'rgba(239,68,68,0.1)', desc: 'Multiple red flags detected. Do not engage, do not send money, and do not share personal information.' },
  { range: 'Very Likely Scam', color: '#991b1b', bg: 'rgba(153,27,27,0.1)', desc: 'This matches known scam patterns. Report it to the Canadian Anti-Fraud Centre (1-888-495-8501) and do not respond.' },
];

export default function TrustScorePage() {
  return (
    <div>
      <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 700, color: 'var(--tc-primary)' }}>How TrustChekr Scores Risk</h1>
      <p style={{ margin: '0.5rem 0 1.5rem', fontSize: '1rem', color: 'var(--tc-text-muted)' }}>
        When you paste something into TrustChekr, we check it against known scam patterns, fraud databases,
        and AI analysis — all in a few seconds. Here&apos;s what the results mean.
      </p>

      {/* Risk Levels */}
      <h2 style={{ margin: '0 0 0.75rem', fontSize: '1.3rem', fontWeight: 600 }}>Risk Levels</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
        {scoringRules.map((r) => (
          <div key={r.range} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.75rem', borderRadius: '12px', border: '1px solid var(--tc-border)' }}>
            <span style={{ borderRadius: '999px', padding: '0.2rem 0.65rem', fontSize: '0.8rem', fontWeight: 700, backgroundColor: r.bg, color: r.color, whiteSpace: 'nowrap' }}>{r.range}</span>
            <div style={{ fontSize: '0.9rem', color: 'var(--tc-text-muted)' }}>{r.desc}</div>
          </div>
        ))}
      </div>

      {/* What We Check */}
      <h2 style={{ margin: '0 0 0.75rem', fontSize: '1.3rem', fontWeight: 600 }}>What we check</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
        {[
          { title: 'Known scam patterns', desc: 'We look for language, tactics, and tricks that scammers commonly use — like fake urgency, impersonation of banks or government agencies, and pressure to act fast.' },
          { title: 'Fraud databases', desc: 'We check against databases of reported scam websites, phishing links, and malicious URLs that security researchers maintain worldwide.' },
          { title: 'Website reputation', desc: 'If you paste a link, we check how old the website is, who registered it, and whether it\'s been flagged by security companies.' },
          { title: 'AI analysis', desc: 'We use AI to read the content the way a human would — looking for manipulation tactics, emotional pressure, and inconsistencies that suggest a scam.' },
          { title: 'Crypto wallet checks', desc: 'If a crypto address is involved, we check its transaction history and behavior for signs of fraud.' },
        ].map((item) => (
          <div key={item.title} style={{ borderRadius: '12px', border: '1px solid var(--tc-border)', padding: '0.75rem', backgroundColor: 'var(--tc-surface)' }}>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--tc-text-main)', marginBottom: '0.2rem' }}>{item.title}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--tc-text-muted)', lineHeight: 1.5 }}>{item.desc}</div>
          </div>
        ))}
      </div>

      {/* What to do */}
      <h2 style={{ margin: '0 0 0.75rem', fontSize: '1.3rem', fontWeight: 600 }}>What should I do with the results?</h2>
      <div style={{ borderRadius: '12px', border: '1px solid var(--tc-border)', padding: '1rem', fontSize: '0.9rem', color: 'var(--tc-text-main)', marginBottom: '2rem', lineHeight: 1.6 }}>
        <p style={{ margin: '0 0 0.75rem' }}>
          <strong>If TrustChekr says it&apos;s risky:</strong> Don&apos;t respond, don&apos;t click links, don&apos;t send money.
          If you&apos;ve already engaged, contact your bank immediately using the number on the back of your card.
        </p>
        <p style={{ margin: '0 0 0.75rem' }}>
          <strong>If TrustChekr says Low Risk:</strong> That means we didn&apos;t find anything — but no tool catches everything.
          If your gut says something is wrong, trust it. Call the company directly using their official number.
        </p>
        <p style={{ margin: 0 }}>
          <strong>Report it either way:</strong> If something felt suspicious enough to check, it&apos;s worth reporting to the{' '}
          <a href="https://antifraudcentre-centreantifraude.ca/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--tc-primary)' }}>
            Canadian Anti-Fraud Centre
          </a>{' '}
          at 1-888-495-8501. Your report helps protect others.
        </p>
      </div>

      {/* Disclaimer */}
      <div style={{ borderRadius: '12px', border: '1px solid var(--tc-border)', padding: '0.75rem', fontSize: '0.85rem', color: 'var(--tc-text-muted)' }}>
        <strong>Important:</strong> TrustChekr provides risk assessments based on available data and cannot guarantee
        whether something is legitimate. We never say something is &ldquo;safe&rdquo; — only &ldquo;Low Risk.&rdquo;
        When in doubt, contact the organization directly using a phone number from their official website.
      </div>
    </div>
  );
}
