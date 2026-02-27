import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About TrustChekr',
  description: 'Canadian-built, privacy-first scam detection platform. Learn about our mission to make scam checking as easy as spell-check.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen p-4 sm:p-8 flex flex-col items-center" style={{ background: 'var(--tc-bg)' }}>
      <div className="w-full max-w-2xl flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--tc-primary)' }}>
            About TrustChekr
          </h1>
          <p className="mt-2 text-lg" style={{ color: 'var(--tc-text-muted)' }}>
            Free scam detection for every Canadian. No sign-up. No tracking. Just answers.
          </p>
        </div>

        {/* Mission */}
        <div className="p-5 rounded-xl" style={{ background: 'var(--tc-surface)', border: '1px solid var(--tc-border)' }}>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--tc-primary)' }}>🎯 Our Mission</h2>
          <p className="leading-relaxed" style={{ color: 'var(--tc-text-main)' }}>
            Canadians lost <strong>over $530 million</strong> to fraud in 2025 — and that's only what was reported.
            The real number is estimated to be 5-10x higher. Seniors are hit hardest, and most don't know
            who to ask for help.
          </p>
          <p className="leading-relaxed mt-3" style={{ color: 'var(--tc-text-main)' }}>
            TrustChekr exists to change that. We built a free tool that lets anyone — regardless of age or
            tech experience — check if something might be a scam. No jargon. No judgment. No sign-up required.
          </p>
        </div>

        {/* What we check */}
        <div className="p-5 rounded-xl" style={{ background: 'var(--tc-surface)', border: '1px solid var(--tc-border)' }}>
          <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--tc-primary)' }}>🔍 What We Check</h2>
          <div className="grid grid-cols-2 gap-2">
            {[
              { emoji: '🔗', text: 'Websites & URLs' },
              { emoji: '💬', text: 'Suspicious messages & emails' },
              { emoji: '📞', text: 'Phone numbers' },
              { emoji: '📧', text: 'Email addresses' },
              { emoji: '₿', text: 'Crypto wallet addresses' },
              { emoji: '📷', text: 'QR codes' },
              { emoji: '📱', text: 'Screenshots (OCR)' },
              { emoji: '📄', text: 'Document manipulation' },
              { emoji: '💔', text: 'Romance scam patterns' },
              { emoji: '🤖', text: 'AI-generated text detection' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded-lg" style={{ background: 'var(--tc-primary-soft)' }}>
                <span>{item.emoji}</span>
                <span className="text-sm font-medium" style={{ color: 'var(--tc-primary)' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="p-5 rounded-xl" style={{ background: 'var(--tc-surface)', border: '1px solid var(--tc-border)' }}>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--tc-primary)' }}>⚙️ How It Works</h2>
          <p className="leading-relaxed" style={{ color: 'var(--tc-text-main)' }}>
            When you submit something to check, TrustChekr runs it through <strong>14 analysis modules</strong> including:
          </p>
          <ul className="mt-2 flex flex-col gap-1 text-sm" style={{ color: 'var(--tc-text-main)' }}>
            <li>• <strong>Pattern matching</strong> — 50+ scam signals trained on real Canadian fraud data</li>
            <li>• <strong>9 OSINT databases</strong> — domain records, breach databases, malware feeds, phishing databases</li>
            <li>• <strong>Entity graph intelligence</strong> — links entities across scans to detect networks</li>
            <li>• <strong>AI text detection</strong> — identifies AI-generated scam messages</li>
            <li>• <strong>Real-time blockchain analysis</strong> — Bitcoin, Ethereum, and XRP Ledger wallet scanning</li>
          </ul>
          <p className="mt-3 leading-relaxed" style={{ color: 'var(--tc-text-main)' }}>
            Every scan makes the system smarter. When a phone number appears in multiple reports,
            the network risk score rises automatically. This is intelligence that compounds over time.
          </p>
        </div>

        {/* Privacy */}
        <div className="p-5 rounded-xl" style={{ background: 'var(--tc-surface)', border: '1px solid var(--tc-border)' }}>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--tc-primary)' }}>🔒 Privacy First</h2>
          <ul className="flex flex-col gap-2 text-sm" style={{ color: 'var(--tc-text-main)' }}>
            <li>✅ <strong>No accounts or sign-up required</strong></li>
            <li>✅ <strong>We don't store your scan inputs</strong></li>
            <li>✅ <strong>No cookies, no tracking, no analytics</strong></li>
            <li>✅ <strong>Screenshot & document analysis runs in your browser</strong> — files never leave your device</li>
            <li>✅ <strong>PIPEDA and CCPA compliant</strong></li>
          </ul>
        </div>

        {/* Built in Canada */}
        <div className="p-5 rounded-xl" style={{ background: 'var(--tc-surface)', border: '1px solid var(--tc-border)' }}>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--tc-primary)' }}>🇨🇦 Built in Canada</h2>
          <p className="leading-relaxed" style={{ color: 'var(--tc-text-main)' }}>
            TrustChekr is a Canadian-built platform designed specifically for the scam landscape
            Canadians face — from CRA impersonation calls to investment fraud targeting retirement savings.
            We understand Canadian banking, telecommunications, and the regulatory environment because we live here.
          </p>
        </div>

        {/* Media & Partnership */}
        <div className="p-5 rounded-xl" style={{ background: 'var(--tc-primary-soft)', border: '2px solid var(--tc-primary)' }}>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--tc-primary)' }}>📰 Media & Partnerships</h2>
          <p className="leading-relaxed text-sm" style={{ color: 'var(--tc-text-main)' }}>
            We're actively seeking partnerships with:
          </p>
          <ul className="mt-2 flex flex-col gap-1 text-sm" style={{ color: 'var(--tc-text-main)' }}>
            <li>• <strong>CARP</strong> and senior advocacy organizations</li>
            <li>• <strong>Credit unions</strong> and financial institutions (via Central 1 Forge)</li>
            <li>• <strong>School boards</strong> for digital literacy programs</li>
            <li>• <strong>Libraries</strong> and community centers</li>
            <li>• <strong>Government agencies</strong> (CAFC, consumer protection offices)</li>
            <li>• <strong>Media outlets</strong> for scam awareness coverage</li>
          </ul>
          <p className="mt-3 text-sm" style={{ color: 'var(--tc-text-main)' }}>
            <strong>Media inquiries:</strong> press@trustchekr.com<br />
            <strong>Partnerships:</strong> partnerships@trustchekr.com<br />
            <strong>Embed our scanner:</strong> Add <code className="text-xs px-1 py-0.5 rounded" style={{ background: 'white' }}>&lt;script src=&quot;trustchekr.com/widget.js&quot;&gt;&lt;/script&gt;</code> to your site
          </p>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-center leading-relaxed" style={{ color: 'var(--tc-text-muted)' }}>
          ⚠️ TrustChekr provides automated analysis based on pattern matching and public databases.
          Our results are informational and do not constitute professional, legal, or financial advice.
          Always contact the <a href="https://antifraudcentre-centreantifraude.ca/" target="_blank" rel="noopener" style={{ color: 'var(--tc-primary)' }}>Canadian Anti-Fraud Centre</a> (1-888-495-8501)
          if you believe you've been targeted by fraud.
        </p>
      </div>
    </main>
  );
}
