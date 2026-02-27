export default function PressPage() {
  const stats = [
    { label: 'Analysis Modules', value: '14', detail: 'Pattern matching, OSINT, graph intelligence, AI detection' },
    { label: 'OSINT Databases', value: '9', detail: 'VirusTotal, Google Safe Browsing, PhishTank, URLhaus, HIBP, RDAP, Etherscan, blockchain.info, XRPL' },
    { label: 'Scan Types', value: '10', detail: 'URLs, messages, emails, phones, crypto, QR codes, screenshots, documents, romance, text AI detection' },
    { label: 'Academy Modules', value: '8', detail: 'Phone, bank, tech support, romance, phishing, social media, and more' },
    { label: 'Quiz Questions', value: '40', detail: 'Interactive SpotTheScam quizzes with per-question feedback' },
    { label: 'Cost to User', value: '$0', detail: 'Free forever. No sign-up. No tracking.' },
  ];

  return (
    <main className="min-h-screen p-4 sm:p-8 flex flex-col items-center" style={{ background: 'var(--tc-bg)' }}>
      <div className="w-full max-w-2xl flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--tc-primary)' }}>
            📰 Press Kit
          </h1>
          <p className="mt-2" style={{ color: 'var(--tc-text-muted)' }}>
            Everything journalists and partners need to cover TrustChekr.
          </p>
        </div>

        {/* One-liner */}
        <div className="p-5 rounded-xl text-center" style={{ background: 'var(--tc-primary)', color: 'white' }}>
          <p className="text-sm uppercase tracking-wide opacity-80 mb-2">The One-Liner</p>
          <p className="text-lg font-bold leading-relaxed">
            "TrustChekr is Canada's free scam detection platform — 14 analysis modules,
            9 intelligence databases, and an online safety academy, built to protect
            Canadians from the $530M+ annual fraud epidemic."
          </p>
        </div>

        {/* Key stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {stats.map((stat) => (
            <div key={stat.label} className="p-3 rounded-xl text-center" style={{ background: 'var(--tc-surface)', border: '1px solid var(--tc-border)' }}>
              <p className="text-2xl font-bold" style={{ color: 'var(--tc-primary)' }}>{stat.value}</p>
              <p className="text-xs font-semibold" style={{ color: 'var(--tc-text-main)' }}>{stat.label}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--tc-text-muted)' }}>{stat.detail}</p>
            </div>
          ))}
        </div>

        {/* The story */}
        <div className="p-5 rounded-xl" style={{ background: 'var(--tc-surface)', border: '1px solid var(--tc-border)' }}>
          <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--tc-primary)' }}>📖 The Story</h2>
          <div className="flex flex-col gap-3 text-sm leading-relaxed" style={{ color: 'var(--tc-text-main)' }}>
            <p>
              In 2025, Canadians reported over $530 million lost to fraud — and experts estimate the true figure
              is 5 to 10 times higher. Seniors are disproportionately targeted, and most existing tools are
              either American-focused, require technical knowledge, or only check one type of scam.
            </p>
            <p>
              TrustChekr was built to fill this gap. It's a free, privacy-first platform where anyone can
              paste a suspicious message, URL, phone number, email, or crypto wallet address and get a
              plain-English risk assessment in seconds. No sign-up required. No data stored.
            </p>
            <p>
              What makes TrustChekr different is the depth of analysis. Each scan runs through 14 modules
              including 9 threat intelligence databases, pattern matching trained on Canadian scam data,
              an entity graph that links suspicious actors across reports, and AI text detection that
              flags machine-generated scam messages.
            </p>
            <p>
              The platform also includes Canada's first free Online Safety Academy — 8 modules covering
              everything from phone scams to romance fraud, with interactive quizzes and completion certificates.
            </p>
          </div>
        </div>

        {/* Key differentiators */}
        <div className="p-5 rounded-xl" style={{ background: 'var(--tc-surface)', border: '1px solid var(--tc-border)' }}>
          <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--tc-primary)' }}>🏆 Key Differentiators</h2>
          <ul className="flex flex-col gap-2 text-sm" style={{ color: 'var(--tc-text-main)' }}>
            <li>🇨🇦 <strong>Only Canadian-focused scam scanner</strong> — CRA, bank impersonation, Canadian phone patterns</li>
            <li>🕸️ <strong>Entity graph intelligence</strong> — links entities across scans, risk scores compound over time</li>
            <li>₿ <strong>First consumer tool with native cryptocurrency analysis</strong> — Bitcoin, Ethereum, and XRP Ledger</li>
            <li>💔 <strong>Dedicated romance scam assessment</strong> — guided intake with behavioral scoring</li>
            <li>🤖 <strong>AI-generated text detection</strong> — flags ChatGPT-written scam messages</li>
            <li>📱 <strong>Screenshot OCR scanning</strong> — upload a photo of a suspicious text message</li>
            <li>🎓 <strong>8-module safety academy</strong> — with quizzes, progress tracking, and certificates</li>
            <li>🔒 <strong>Zero data collection</strong> — no accounts, no cookies, no tracking</li>
            <li>👴 <strong>Senior-first design</strong> — 18px+ fonts, high contrast, blame-free language</li>
          </ul>
        </div>

        {/* Available on */}
        <div className="p-5 rounded-xl" style={{ background: 'var(--tc-surface)', border: '1px solid var(--tc-border)' }}>
          <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--tc-primary)' }}>📱 Available On</h2>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="p-2 rounded-lg" style={{ background: 'var(--tc-primary-soft)' }}>
              <strong>🌐 Web</strong> — trustchekr.com
            </div>
            <div className="p-2 rounded-lg" style={{ background: 'var(--tc-primary-soft)' }}>
              <strong>🧩 Chrome Extension</strong> — coming soon
            </div>
            <div className="p-2 rounded-lg" style={{ background: 'var(--tc-primary-soft)' }}>
              <strong>💬 Telegram Bot</strong> — @TrustChekrBot
            </div>
            <div className="p-2 rounded-lg" style={{ background: 'var(--tc-primary-soft)' }}>
              <strong>📱 SMS</strong> — text to scan (coming soon)
            </div>
            <div className="p-2 rounded-lg col-span-2" style={{ background: 'var(--tc-primary-soft)' }}>
              <strong>🔌 Embeddable Widget</strong> — one line of code for any website
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="p-5 rounded-xl text-center" style={{ background: 'var(--tc-primary-soft)', border: '2px solid var(--tc-primary)' }}>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--tc-primary)' }}>📧 Contact</h2>
          <p className="text-sm" style={{ color: 'var(--tc-text-main)' }}>
            <strong>Media inquiries:</strong> press@trustchekr.com<br />
            <strong>Partnerships:</strong> partnerships@trustchekr.com<br />
            <strong>General:</strong> hello@trustchekr.com
          </p>
        </div>
      </div>
    </main>
  );
}
