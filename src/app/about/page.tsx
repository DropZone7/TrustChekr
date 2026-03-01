import type { Metadata } from 'next';
import { BackButton } from '@/components/BackButton';

export const metadata: Metadata = {
  title: 'About TrustChekr',
  description: 'Canadian-built, privacy-first scam detection platform. Free scam checking for everyone.',
};

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-8">
      <BackButton />
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--tc-text-main)' }}>About TrustChekr</h1>
        <p className="mt-2" style={{ color: 'var(--tc-text-muted)' }}>
          Free scam detection for Canadians and Americans. No sign-up. No tracking.
        </p>
      </div>

      <section>
        <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--tc-text-main)' }}>Why we built this</h2>
        <p style={{ color: 'var(--tc-text-main)' }}>
          Canadians lost <strong>$638 million</strong> to fraud in 2024 — and that's only what gets reported.
          The real number is estimated at 5–10x higher. Seniors are hit hardest. Most people don't know
          where to check or who to ask.
        </p>
        <p className="mt-3" style={{ color: 'var(--tc-text-main)' }}>
          TrustChekr lets anyone check if something is a scam — no jargon, no judgment, no account needed.
          Paste a suspicious message, URL, phone number, or email and get a plain-language risk assessment in seconds.
        </p>
        <a href="/about/founder" className="mt-3 inline-block font-semibold text-sm" style={{ color: 'var(--tc-primary)' }}>
          Read the full founder story →
        </a>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--tc-text-main)' }}>What we check</h2>
        <p className="text-sm mb-3" style={{ color: 'var(--tc-text-muted)' }}>
          Every scan checks multiple sources at once:
        </p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm" style={{ color: 'var(--tc-text-main)' }}>
          {[
            'Phishing & malware databases', 'Domain age & registration',
            'Known scam phone patterns', 'Crypto wallet risk signals',
            'AI-generated text detection', 'Romance scam indicators',
            'Spam keyword analysis', 'Brand impersonation detection',
            'Email header forensics', 'Blockchain transaction analysis',
          ].map((item) => (
            <div key={item} className="py-1 flex items-start gap-2">
              <span style={{ color: 'var(--tc-primary)', fontWeight: 700 }}>—</span>
              {item}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--tc-text-main)' }}>Privacy</h2>
        <ul className="flex flex-col gap-1.5 text-sm" style={{ color: 'var(--tc-text-main)' }}>
          <li><strong>No accounts or sign-up required.</strong></li>
          <li><strong>We don't store your scan inputs.</strong></li>
          <li><strong>No cookies, no tracking, no analytics.</strong></li>
          <li><strong>Screenshot & document analysis runs in your browser</strong> — files never leave your device.</li>
          <li><strong>PIPEDA and CCPA compliant.</strong></li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--tc-text-main)' }}>Contact</h2>
        <div className="text-sm flex flex-col gap-1" style={{ color: 'var(--tc-text-main)' }}>
          <p>General: <a href="mailto:hello@trustchekr.com" style={{ color: 'var(--tc-primary)' }}>hello@trustchekr.com</a></p>
          <p>Media: <a href="mailto:press@trustchekr.com" style={{ color: 'var(--tc-primary)' }}>press@trustchekr.com</a></p>
          <p>Partnerships: <a href="mailto:partnerships@trustchekr.com" style={{ color: 'var(--tc-primary)' }}>partnerships@trustchekr.com</a></p>
        </div>
      </section>

      <hr style={{ borderColor: 'var(--tc-border)' }} />

      <p className="text-xs" style={{ color: 'var(--tc-text-muted)' }}>
        TrustChekr is operated by 17734344 Canada Inc. Our results are informational and do not constitute
        professional, legal, or financial advice. If you believe you've been targeted by fraud, contact the{' '}
        <a href="https://antifraudcentre-centreantifraude.ca/" target="_blank" rel="noopener" style={{ color: 'var(--tc-primary)' }}>
          Canadian Anti-Fraud Centre
        </a>{' '}
        at 1-888-495-8501.
      </p>
    </div>
  );
}
