import { Shield } from 'lucide-react';
import type { Metadata } from 'next';
import { BackButton } from '@/components/BackButton';

export const metadata: Metadata = {
  title: 'About the Founder — TrustChekr',
  description:
    'Learn how TrustChekr was built by a Canadian cybersecurity professional who turned personal experience with scams into a privacy-first scam detection tool for everyday people.',
};

export default function FounderPage() {
  return (
    <main style={{ width: '100%', maxWidth: '700px', margin: '0 auto', padding: '32px 16px 48px', color: 'var(--tc-text-main)' }}>
      <BackButton />
      {/* Hero */}
      <section style={{ marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 700 }}>Meet the Founder</h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              width: '120px', height: '120px', borderRadius: '20px',
              border: '1px solid var(--tc-border)', backgroundColor: 'var(--tc-surface)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px',
            }}
          >
            <Shield size={40} strokeWidth={1.75} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ fontSize: '20px', fontWeight: 600 }}>Alex</div>
            <div style={{ fontSize: '14px', color: 'var(--tc-text-muted)' }}>Founder — Toronto, Canada 🇨🇦</div>
          </div>
        </div>
      </section>

      {/* The Story */}
      <section style={{ marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Why I Built TrustChekr</h2>
        <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.7 }}>
          I&apos;ve spent years in telecom and tech — from Samsung to Sprint, learning networking from the
          inside out. Somewhere along the way, I stumbled into cybersecurity (let&apos;s say I learned what&apos;s
          possible when you&apos;re curious enough). That rabbit hole led me to crypto, which showed me a
          much deeper problem: regular people repeatedly getting destroyed by scams.
        </p>
        <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.7 }}>
          Then one Thursday morning, I caught{' '}
          <em>Moore in the Morning</em> on Newstalk 1010 talking about how Canadians keep getting ripped
          off — and there&apos;s nothing out there to help them. The thought basically burnt itself into my
          mind, and I started building immediately.
        </p>
        <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.7 }}>
          I&apos;m the founder and the direction behind TrustChekr — the vision, the research, and the
          decisions on what to build and why. My dev partner Chief handles the technical build, and we
          deploy AI heavily across the platform to stay ahead of the scammers. Every feature and every
          decision about what matters comes from real people who actually care about this problem.
        </p>
        <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.7 }}>
          In 2024, Canadians reported over $638 million in fraud losses — and only 5–10% of victims
          actually report. The real number is likely in the billions.
        </p>
        <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.7, fontWeight: 500 }}>
          Scammers have AI, automation, and scale. Victims have Google and guesswork. TrustChekr is my
          way of evening the odds.
        </p>
        <p style={{ margin: '8px 0 0', fontSize: '12px', color: 'var(--tc-text-muted)' }}>
          Source:{' '}
          <a
            href="https://antifraudcentre-centreantifraude.ca/annual-reports-2024-rapports-annuels-eng.htm"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--tc-text-muted)', textDecoration: 'underline' }}
          >
            Canadian Anti-Fraud Centre, 2024 Annual Report
          </a>
        </p>
      </section>

      {/* What You Get */}
      <section style={{ marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>What TrustChekr does for you</h2>
        <div style={{ marginTop: '8px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {[
            { value: 'Free', label: 'Always — no hidden costs' },
            { value: 'Private', label: 'We never store your data' },
            { value: 'Seconds', label: 'To check if something is a scam' },
            { value: '13', label: 'Types of scams we detect' },
          ].map((stat) => (
            <div key={stat.label} style={{ padding: '10px 12px', borderRadius: '12px', border: '1px solid var(--tc-border)', backgroundColor: 'var(--tc-surface)' }}>
              <div style={{ fontSize: '22px', fontWeight: 700 }}>{stat.value}</div>
              <div style={{ fontSize: '12px', color: 'var(--tc-text-muted)' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Vision */}
      <section style={{ marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Where TrustChekr is going</h2>
        <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6 }}>
          Our vision is simple: make scam detection as easy and invisible as spell-check. You shouldn&apos;t
          have to open ten tabs or decipher security jargon. You paste something in, TrustChekr highlights
          the risky parts, and you move on with confidence.
        </p>
        <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6 }}>
          In the near term, that means expanding beyond the web app: a browser extension that flags suspicious
          pages before you type in your details, an SMS scanner that can check texts as they arrive, and an
          embeddable widget that credit unions, community banks, and libraries can offer directly to their
          members and patrons.
        </p>
        <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6 }}>
          Long term, TrustChekr becomes part of the safety net around everyday life online — a quiet layer
          of defence sitting next to the tools people already use, helping Canadians spot scams before they
          become losses.
        </p>
      </section>

      {/* Connect */}
      <section style={{ borderTop: '1px solid var(--tc-border)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Want to work together?</h2>
        <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6 }}>
          We&apos;re open to partnering with investors, credit unions, libraries, consumer protection groups,
          and anyone serious about reducing scam harm in Canada and beyond.
        </p>
        <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '14px' }}>
          <div>
            <strong>General:</strong>{' '}
            <a href="mailto:hello@trustchekr.com" style={{ color: 'var(--tc-primary)', textDecoration: 'none' }}>hello@trustchekr.com</a>
          </div>
          <div>
            <strong>Partnerships:</strong>{' '}
            <a href="mailto:partnerships@trustchekr.com" style={{ color: 'var(--tc-primary)', textDecoration: 'none' }}>partnerships@trustchekr.com</a>
          </div>
          <div>
            <strong>Media:</strong>{' '}
            <a href="mailto:media@trustchekr.com" style={{ color: 'var(--tc-primary)', textDecoration: 'none' }}>media@trustchekr.com</a>
          </div>
        </div>
      </section>
    </main>
  );
}
