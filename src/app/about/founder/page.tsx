import { Shield } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About the Founder — TrustChekr',
  description:
    'Learn how TrustChekr was built by a Canadian cybersecurity professional who turned personal experience with scams into a privacy-first scam detection tool for everyday people.',
};

export default function FounderPage() {
  return (
    <main style={{ width: '100%', maxWidth: '700px', margin: '0 auto', padding: '32px 16px 48px', color: 'var(--tc-text-main)' }}>
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
            <div style={{ fontSize: '20px', fontWeight: 600 }}>The TrustChekr Team</div>
            <div style={{ fontSize: '14px', color: 'var(--tc-text-muted)' }}>Founded in Toronto, Canada</div>
          </div>
        </div>
      </section>

      {/* The Story */}
      <section style={{ marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Why TrustChekr exists</h2>
        <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6 }}>
          TrustChekr didn&apos;t start with a pitch deck. It started with phone calls and messages that made
          family members nervous — threats from fake government agents, too-good-to-be-true investment offers,
          and &quot;urgent&quot; delivery texts that didn&apos;t feel right but were hard to decode under pressure.
        </p>
        <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6 }}>
          Watching loved ones try to navigate those moments without a technical background was a turning point.
          Our founder had spent years studying cybersecurity — earning Google&apos;s IT Support and Security
          certificates, completing York University&apos;s Cybersecurity Certificate, and deepening that path
          with CompTIA Network+ and Security+ to sharpen understanding of how attackers operate.
        </p>
        <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6 }}>
          The gap wasn&apos;t &quot;more security knowledge&quot; for regular people. It was a missing layer
          of translation between scammer tactics and human decisions.
        </p>
        <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6 }}>
          TrustChekr is built with an attacker mindset — understanding how scammers structure messages, where
          they register domains, how they exploit fear and urgency — then flipping that knowledge into analysis
          modules that catch patterns most people never see. Seniors, parents, and everyday Canadians shouldn&apos;t
          need a computer science degree to figure out if a text or email is dangerous. They should be able to
          paste it into a box and get a clear, confident answer in seconds.
        </p>
        <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6 }}>
          From day one, TrustChekr has been Canadian-built and privacy-first. Data handling is designed around
          PIPEDA&apos;s core principles — collecting only what&apos;s needed, using it only for clear purposes,
          and protecting it with appropriate safeguards — so people can ask for help without becoming the
          product themselves.
        </p>
      </section>

      {/* By the Numbers */}
      <section style={{ marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Built like a product, not a prototype</h2>
        <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6 }}>
          TrustChekr has been engineered the way we approach security: small, sharp components that work
          together, shipped quickly and iterated relentlessly.
        </p>
        <div style={{ marginTop: '8px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {[
            { value: '10,000+', label: 'Lines of code' },
            { value: '17', label: 'Analysis modules' },
            { value: '49,762', label: 'Blocked domains' },
            { value: '50+', label: 'Pages & flows built' },
          ].map((stat) => (
            <div key={stat.label} style={{ padding: '10px 12px', borderRadius: '12px', border: '1px solid var(--tc-border)', backgroundColor: 'var(--tc-surface)' }}>
              <div style={{ fontSize: '22px', fontWeight: 700 }}>{stat.value}</div>
              <div style={{ fontSize: '12px', color: 'var(--tc-text-muted)' }}>{stat.label}</div>
            </div>
          ))}
        </div>
        <p style={{ margin: '8px 0 0', fontSize: '13px', color: 'var(--tc-text-muted)' }}>
          Built in weeks, not months — with the kind of velocity investors look for and the kind of care users need.
        </p>
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
