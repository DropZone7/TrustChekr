import type { Metadata } from 'next';
import { PartnersDemoForm } from '@/components/partners/PartnersDemoForm';
import { BackButton } from '@/components/BackButton';

export const metadata: Metadata = {
  title: 'TrustChekr Partnerships & Integrations',
  description: 'Embed scam detection into your credit union, telecom, police, or government workflows with TrustChekr APIs, widgets, and data feeds.',
  openGraph: {
    title: 'TrustChekr Partnerships & Integrations',
    description: 'Protect your members and customers from scams with real-time analysis, alerts, and evidence-driven insights.',
    url: 'https://trustchekr.com/partners',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TrustChekr Partnerships',
    description: 'Real-time scam detection for credit unions, telecoms, police, and consumer agencies.',
  },
};

export default function PartnersPage() {
  return (
    <>
      <style>{`
        .tc-container { max-width: 1100px; margin: 0 auto; padding: 1.75rem 1.25rem 3rem; }
        .tc-section { margin-bottom: 1.75rem; }
        .tc-grid-2 { display: grid; grid-template-columns: 1fr; gap: 1rem; }
        .tc-grid-3 { display: grid; grid-template-columns: 1fr; gap: 0.75rem; }
        .tc-grid-4 { display: grid; grid-template-columns: 1fr; gap: 1rem; }
        .tc-form-grid { display: grid; grid-template-columns: 1fr; gap: 0.75rem; }
        .tc-hero-layout { display: flex; flex-direction: column; gap: 1.5rem; }
        @media (min-width: 768px) {
          .tc-grid-2 { grid-template-columns: repeat(2, 1fr); }
          .tc-grid-3 { grid-template-columns: repeat(3, 1fr); }
          .tc-grid-4 { grid-template-columns: repeat(2, 1fr); }
          .tc-form-grid { grid-template-columns: repeat(2, 1fr); gap: 0.75rem 1rem; }
          .tc-hero-layout { flex-direction: row; align-items: center; }
        }
        @media (min-width: 1024px) {
          .tc-section { margin-bottom: 2.5rem; }
          .tc-grid-4 { grid-template-columns: repeat(4, 1fr); }
        }
      `}</style>

      <div className="tc-container">
        <BackButton />
        {/* Hero */}
        <section className="tc-section">
          <div className="tc-hero-layout">
            <div style={{ flex: 3 }}>
              <span style={{ display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '999px', border: '1px solid rgba(26,82,118,0.2)', fontSize: '0.8rem', color: 'var(--tc-primary)', marginBottom: '0.75rem', fontFamily: 'var(--font-heading)' }}>
                For Credit Unions, Telecoms, Police, and Consumer Protection Teams
              </span>
              <h1 style={{ margin: 0, fontSize: '2.2rem', lineHeight: 1.15, fontWeight: 700, color: 'var(--tc-primary)' }}>
                Protect your customers from scams, before the money leaves.
              </h1>
              <p style={{ margin: '0.9rem 0 1.2rem', fontSize: '1rem', color: 'var(--tc-text-muted)' }}>
                TrustChekr turns messy fraud signals into clear, real-time guidance your teams and members can act on — across phone, text, email, web, and crypto.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                <a href="#demo" style={{ display: 'inline-flex', alignItems: 'center', padding: '0.7rem 1.2rem', borderRadius: '999px', backgroundColor: 'var(--tc-primary)', color: '#ffffff', fontSize: '0.95rem', fontWeight: 600, textDecoration: 'none' }}>
                  Request a demo
                </a>
                <a href="#integrations" style={{ display: 'inline-flex', alignItems: 'center', padding: '0.7rem 1.2rem', borderRadius: '999px', border: '1px solid var(--tc-border)', color: 'var(--tc-primary)', fontSize: '0.95rem', fontWeight: 500, textDecoration: 'none' }}>
                  Explore integrations
                </a>
              </div>
              <p style={{ margin: '0.9rem 0 0', fontSize: '0.8rem', color: 'var(--tc-text-muted)' }}>
                Built to plug into Central 1 Forge, telecom fraud platforms, case management tools, and internal security dashboards.
              </p>
            </div>
            <div style={{ flex: 2.5, borderRadius: '20px', border: '1px solid var(--tc-border)', background: 'radial-gradient(circle at top left, rgba(26,82,118,0.18), transparent 55%) var(--tc-surface)', padding: '1rem' }}>
              <h2 style={{ margin: '0 0 0.4rem', fontSize: '1rem', fontWeight: 600 }}>Why partners integrate TrustChekr</h2>
              <ul style={{ margin: 0, paddingLeft: '1.15rem', fontSize: '0.9rem', color: 'var(--tc-text-muted)' }}>
                <li>Reduce fraud losses and write-offs with early scam detection at the edge.</li>
                <li>Give frontline staff a single, plain-language risk view of calls, messages, and URLs.</li>
                <li>Offer members and customers a modern safety feature without rebuilding your stack.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="tc-section" style={{ borderRadius: '12px', border: '1px solid var(--tc-border)', backgroundColor: 'var(--tc-bg-alt, #f9fafb)', padding: '0.9rem 1.1rem' }}>
          <div className="tc-grid-3">
            {[
              { value: '20+', label: 'Analysis modules', desc: 'Phone, text, email, web, device, crypto & behavioural signals.' },
              { value: '50K+', label: 'Threat database', desc: 'Known scam numbers, URLs, templates, and patterns.' },
              { value: 'Real-time', label: 'Decision time', desc: 'Sub-second risk scoring for frontline and self-serve flows.' },
            ].map((s) => (
              <div key={s.label}>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--tc-primary)' }}>{s.value}</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{s.label}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--tc-text-muted)' }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Integration Options */}
        <section id="integrations" className="tc-section">
          <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.6rem', fontWeight: 700 }}>Integration options that fit your stack</h2>
          <p style={{ margin: '0 0 1.2rem', fontSize: '0.95rem', color: 'var(--tc-text-muted)' }}>
            Start with a simple widget, wire in the API, or pipe threat data into your existing fraud tools. No rip-and-replace required.
          </p>
          <div className="tc-grid-4">
            {[
              { title: 'REST API', subtitle: 'Real-time risk scoring', body: 'Send phone numbers, URLs, email headers, or free-text to a single API and get a clear risk level, top signals, and recommended actions back in milliseconds.' },
              { title: 'Embeddable widget', subtitle: 'Drop-in self-serve protection', body: 'Add a "Check for scams" button to online banking, MyAccount portals, or support pages without changing your core UI framework.' },
              { title: 'White-label experience', subtitle: 'Your brand, our engine', body: 'Offer a branded scam checker to your members or customers while TrustChekr handles risk analysis, updates, and threat intel.' },
              { title: 'Data feed & exports', subtitle: 'Threat intel for your SIEM', body: 'Stream normalized scam signals and campaign indicators into your fraud systems, data lake, or SIEM for correlation and modelling.' },
            ].map((opt) => (
              <div key={opt.title} style={{ borderRadius: '12px', border: '1px solid var(--tc-border)', padding: '0.9rem', backgroundColor: 'var(--tc-surface)' }}>
                <div style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.15rem' }}>{opt.title}</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--tc-primary)', marginBottom: '0.4rem' }}>{opt.subtitle}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--tc-text-muted)' }}>{opt.body}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Partner Types */}
        <section className="tc-section">
          <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.6rem', fontWeight: 700 }}>Built for teams on the front line of scams</h2>
          <p style={{ margin: '0 0 1rem', fontSize: '0.95rem', color: 'var(--tc-text-muted)' }}>
            Whether you serve members, subscribers, or citizens, TrustChekr plugs into the places where people first reach out for help.
          </p>
          <div className="tc-grid-2">
            {[
              { title: 'Credit unions & banks', bullets: ['Flag risky e-Transfers, wires, and bill payments before they leave the account.', 'Give branch and call-centre staff a one-click scam check they can walk members through.', 'Feed confirmed scam narratives back into your fraud and AML models.'] },
              { title: 'Telecoms & carriers', bullets: ['Detect call and SMS scam campaigns at the network edge using shared threat intel.', 'Offer members an integrated "Scam Check" inside self-serve apps and portals.', 'Turn scam protection into a differentiating safety feature for your subscribers.'] },
              { title: 'Police & consumer agencies', bullets: ['Triage community reports faster with structured risk scores and common patterns.', 'Spot new campaigns across phone, web, and messaging in days, not months.', 'Generate cleaner evidence packages for investigations and prosecutions.'] },
              { title: 'Government & regulators', bullets: ['Monitor how scams target specific programs, benefits, and regions.', 'Share de-identified trends with financial institutions and telecoms in near real-time.', 'Support education campaigns with current, evidence-based examples.'] },
            ].map((p) => (
              <div key={p.title} style={{ borderRadius: '12px', border: '1px solid var(--tc-border)', padding: '0.9rem', backgroundColor: 'var(--tc-surface)' }}>
                <div style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.35rem' }}>{p.title}</div>
                <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.9rem', color: 'var(--tc-text-muted)' }}>
                  {p.bullets.map((b) => <li key={b} style={{ marginBottom: '0.2rem' }}>{b}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Use Cases */}
        <section className="tc-section">
          <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.6rem', fontWeight: 700 }}>Example use cases</h2>
          <p style={{ margin: '0 0 1rem', fontSize: '0.95rem', color: 'var(--tc-text-muted)' }}>
            Most partners start with one or two high-impact journeys, then expand once they see the reduction in losses and call time.
          </p>
          <div className="tc-grid-2">
            {[
              { title: 'Banking & credit unions', body: 'Flag high-risk payments and e-Transfers, prompt staff with plain-language questions to ask, and document member consent when they proceed against advice.' },
              { title: 'Telecom & wireless', body: 'Surface likely scam calls and SMS patterns, help subscribers check suspicious numbers, and reduce churn from fraud-related frustration.' },
              { title: 'Police & victim services', body: 'Turn raw call notes and screenshots into structured intel your analysts and investigators can search, trend, and act on.' },
              { title: 'E-commerce & marketplaces', body: 'Spot fake support numbers, refund scams, and buyer/seller fraud patterns before they scale across your platform.' },
            ].map((c) => (
              <div key={c.title} style={{ borderRadius: '12px', border: '1px solid var(--tc-border)', padding: '0.9rem', backgroundColor: 'var(--tc-surface)' }}>
                <div style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.35rem' }}>{c.title}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--tc-text-muted)' }}>{c.body}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Demo Form */}
        <section id="demo" className="tc-section" style={{ borderRadius: '20px', border: '1px solid var(--tc-border)', backgroundColor: 'var(--tc-bg-alt, #f9fafb)', padding: '1.2rem 1.1rem 1.4rem' }}>
          <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.6rem', fontWeight: 700 }}>Request a demo</h2>
          <p style={{ margin: '0 0 1rem', fontSize: '0.95rem', color: 'var(--tc-text-muted)' }}>
            Share a few details and we&apos;ll follow up with a short call or live demo tailored to your environment. No pressure, no hard sell.
          </p>
          <PartnersDemoForm />
        </section>
      </div>
    </>
  );
}
