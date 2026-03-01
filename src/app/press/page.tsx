import type { Metadata } from 'next';
import { BackButton } from '@/components/BackButton';

export const metadata: Metadata = {
  title: 'Press Kit',
  description: 'Media resources and platform stats for journalists covering TrustChekr.',
};

export default function PressPage() {
  return (
    <div className="flex flex-col gap-8">
      <BackButton />
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--tc-text-main)' }}>Press Kit</h1>
        <p className="mt-1" style={{ color: 'var(--tc-text-muted)' }}>
          Resources for journalists and media covering TrustChekr.
        </p>
      </div>

      {/* One-liner */}
      <div className="p-4 rounded-lg" style={{ background: 'var(--tc-surface)', borderLeft: '4px solid var(--tc-primary)' }}>
        <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--tc-text-muted)' }}>Boilerplate</p>
        <p className="font-medium" style={{ color: 'var(--tc-text-main)' }}>
          TrustChekr is a free, privacy-first scam detection platform built in Canada. It checks suspicious
          messages, websites, phone numbers, emails, and crypto wallets against 21+ analysis modules and
          9 threat intelligence databases — no sign-up required.
        </p>
      </div>

      {/* Stats */}
      <section>
        <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--tc-text-main)' }}>Platform numbers</h2>
        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            { value: '13', label: 'Scam types detected' },
            { value: 'Free', label: 'Always, no account needed' },
            { value: '8', label: 'Academy modules' },
            { value: '49K', label: 'Known bad domains' },
            { value: '22', label: 'Phone scam patterns' },
            { value: '$0', label: 'Cost to user' },
          ].map(s => (
            <div key={s.label} className="p-3 rounded-lg" style={{ background: 'var(--tc-surface)', border: '1px solid var(--tc-border)' }}>
              <p className="text-xl font-bold" style={{ color: 'var(--tc-primary)' }}>{s.value}</p>
              <p className="text-xs" style={{ color: 'var(--tc-text-muted)' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What's different */}
      <section>
        <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--tc-text-main)' }}>What makes TrustChekr different</h2>
        <ul className="flex flex-col gap-1.5 text-sm" style={{ color: 'var(--tc-text-main)' }}>
          <li><strong>Multi-surface scanning</strong> — checks URLs, messages, phone numbers, emails, and crypto wallets in one place</li>
          <li><strong>Canadian-first</strong> — trained on CRA impersonation, bank fraud, RCMP threats, and Interac scam patterns</li>
          <li><strong>Entity graph intelligence</strong> — links suspicious actors across scans; risk compounds over time</li>
          <li><strong>Native cryptocurrency analysis</strong> — Bitcoin, Ethereum, and XRP Ledger wallet scanning</li>
          <li><strong>Romance scam assessment</strong> — guided intake with behavioral pattern scoring</li>
          <li><strong>AI text detection</strong> — flags machine-generated scam messages</li>
          <li><strong>Zero data collection</strong> — no accounts, no cookies, no tracking. PIPEDA compliant.</li>
          <li><strong>Senior-first design</strong> — large text, high contrast, plain language, blame-free tone</li>
        </ul>
      </section>

      {/* The story */}
      <section>
        <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--tc-text-main)' }}>Background</h2>
        <div className="flex flex-col gap-3 text-sm" style={{ color: 'var(--tc-text-main)' }}>
          <p>
            Canadians lost $638 million to fraud in 2024 — and experts estimate the real figure is 5–10x higher.
            Seniors are disproportionately targeted, and most existing tools are American-focused, require
            technical knowledge, or only check one type of threat.
          </p>
          <p>
            TrustChekr fills this gap. Anyone can paste something suspicious and get a plain-language risk
            assessment in seconds. The platform also includes Canada's first free Online Safety Academy — 8
            modules with interactive quizzes and completion certificates.
          </p>
        </div>
      </section>

      {/* Available on */}
      <section>
        <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--tc-text-main)' }}>Available on</h2>
        <div className="grid grid-cols-2 gap-2 text-sm" style={{ color: 'var(--tc-text-main)' }}>
          <div className="p-2.5 rounded-lg" style={{ background: 'var(--tc-surface)', border: '1px solid var(--tc-border)' }}>
            <strong>Web</strong> — trustchekr.com
          </div>
          <div className="p-2.5 rounded-lg" style={{ background: 'var(--tc-surface)', border: '1px solid var(--tc-border)' }}>
            <strong>Telegram</strong> — @TrustChekrBot
          </div>
          <div className="p-2.5 rounded-lg" style={{ background: 'var(--tc-surface)', border: '1px solid var(--tc-border)' }}>
            <strong>Chrome Extension</strong> — coming soon
          </div>
          <div className="p-2.5 rounded-lg" style={{ background: 'var(--tc-surface)', border: '1px solid var(--tc-border)' }}>
            <strong>Embeddable Widget</strong> — one line of code
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="text-sm" style={{ color: 'var(--tc-text-main)' }}>
        <h2 className="text-lg font-semibold mb-2">Contact</h2>
        <p>Media: <a href="mailto:press@trustchekr.com" style={{ color: 'var(--tc-primary)' }}>press@trustchekr.com</a></p>
        <p>Partnerships: <a href="mailto:partnerships@trustchekr.com" style={{ color: 'var(--tc-primary)' }}>partnerships@trustchekr.com</a></p>
        <p>General: <a href="mailto:hello@trustchekr.com" style={{ color: 'var(--tc-primary)' }}>hello@trustchekr.com</a></p>
      </section>

      <hr style={{ borderColor: 'var(--tc-border)' }} />
      <p className="text-xs" style={{ color: 'var(--tc-text-muted)' }}>
        TrustChekr is operated by 17734344 Canada Inc.
      </p>
    </div>
  );
}
