import type { Metadata } from 'next';

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

const inputStyle: React.CSSProperties = {
  width: '100%',
  borderRadius: '999px',
  border: '1px solid var(--tc-border)',
  padding: '0.6rem 0.75rem',
  fontSize: '0.95rem',
  backgroundColor: '#ffffff',
};

export default function PartnersPage() {
  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <HeroSection />
      <StatsBar />
      <IntegrationOptions />
      <PartnerTypes />
      <UseCases />
      <DemoForm />
    </div>
  );
}

function HeroSection() {
  return (
    <section style={{ marginBottom: '2.5rem' }}>
      <span style={{ display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '999px', border: '1px solid rgba(26,82,118,0.2)', fontSize: '0.8rem', color: 'var(--tc-primary)', marginBottom: '0.75rem' }}>
        For credit unions, telecoms, police, and consumer protection teams
      </span>
      <h1 style={{ margin: 0, fontSize: '2.2rem', lineHeight: 1.15, fontWeight: 700, color: 'var(--tc-primary)' }}>
        Protect your customers from scams, before the money leaves.
      </h1>
      <p style={{ margin: '0.9rem 0 1.2rem', fontSize: '1rem', color: 'var(--tc-text-muted)' }}>
        TrustChekr turns messy fraud signals into clear, real-time guidance your teams and members can act on — across phone, text, email, web, and crypto.
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
        <a href="#demo" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0.7rem 1.2rem', borderRadius: '999px', backgroundColor: 'var(--tc-primary)', color: '#ffffff', fontSize: '0.95rem', fontWeight: 600, textDecoration: 'none' }}>
          Request a demo
        </a>
        <a href="#integrations" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0.7rem 1.2rem', borderRadius: '999px', border: '1px solid var(--tc-border)', backgroundColor: '#ffffff', color: 'var(--tc-primary)', fontSize: '0.95rem', fontWeight: 500, textDecoration: 'none' }}>
          Explore integration options
        </a>
      </div>
      <p style={{ margin: '0.9rem 0 0', fontSize: '0.8rem', color: 'var(--tc-text-muted)' }}>
        Built to plug into Central 1 Forge, telecom fraud platforms, case management tools, and internal security dashboards.
      </p>
    </section>
  );
}

function StatsBar() {
  const items = [
    { label: 'Analysis modules', value: '20+', desc: 'Phone, text, email, web, device, crypto & behavioural signals.' },
    { label: 'Threat database', value: '50K+', desc: 'Known scam numbers, URLs, templates, and patterns.' },
    { label: 'Decision time', value: 'Real-time', desc: 'Sub-second risk scoring for frontline and self-serve flows.' },
  ];
  return (
    <section style={{ borderRadius: '14px', border: '1px solid var(--tc-border)', backgroundColor: 'var(--tc-bg-alt, #f9fafb)', padding: '0.9rem 1.1rem', marginBottom: '2.25rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
        {items.map((item) => (
          <div key={item.label}>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--tc-primary)' }}>{item.value}</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{item.label}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--tc-text-muted)' }}>{item.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function IntegrationOptions() {
  const options = [
    { title: 'REST API', subtitle: 'Real-time risk scoring', body: 'Send phone numbers, URLs, email headers, or free-text to a single API and get a clear risk level, top signals, and recommended actions back in milliseconds.' },
    { title: 'Embeddable widget', subtitle: 'Drop-in self-serve protection', body: 'Add a "Check for scams" button to online banking, MyAccount portals, or support pages without changing your core UI framework.' },
    { title: 'White-label experience', subtitle: 'Your brand, our engine', body: 'Offer a branded scam checker to your members or customers while TrustChekr handles risk analysis, updates, and threat intel.' },
    { title: 'Data feed & exports', subtitle: 'Threat intel for your SIEM', body: 'Stream normalized scam signals and campaign indicators into your fraud systems, data lake, or SIEM for correlation and modelling.' },
  ];
  return (
    <section id="integrations" style={{ marginBottom: '2.5rem' }}>
      <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.6rem', fontWeight: 700 }}>Integration options that fit your stack</h2>
      <p style={{ margin: '0 0 1.2rem', fontSize: '0.95rem', color: 'var(--tc-text-muted)' }}>
        Start with a simple widget, wire in the API, or pipe threat data into your existing fraud tools. No rip-and-replace required.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        {options.map((opt) => (
          <div key={opt.title} style={{ borderRadius: '14px', border: '1px solid var(--tc-border)', padding: '0.9rem 0.9rem 1rem', backgroundColor: 'var(--tc-surface)' }}>
            <div style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.15rem' }}>{opt.title}</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--tc-primary)', marginBottom: '0.4rem' }}>{opt.subtitle}</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--tc-text-muted)' }}>{opt.body}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PartnerTypes() {
  const partners = [
    { title: 'Credit unions & banks', bullets: ['Flag risky e-Transfers, wires, and bill payments before they leave the account.', 'Give branch and call-centre staff a one-click scam check they can walk members through.', 'Feed confirmed scam narratives back into your fraud and AML models.'] },
    { title: 'Telecoms & carriers', bullets: ['Detect call and SMS scam campaigns at the network edge using shared threat intel.', 'Offer members an integrated "Scam Check" inside self-serve apps and portals.', 'Turn scam protection into a differentiating safety feature for your subscribers.'] },
    { title: 'Police & consumer agencies', bullets: ['Triage community reports faster with structured risk scores and common patterns.', 'Spot new campaigns across phone, web, and messaging in days, not months.', 'Generate cleaner evidence packages for investigations and prosecutions.'] },
    { title: 'Government & regulators', bullets: ['Monitor how scams target specific programs, benefits, and regions.', 'Share de-identified trends with financial institutions and telecoms in near real-time.', 'Support education campaigns with current, evidence-based examples.'] },
  ];
  return (
    <section style={{ marginBottom: '2.5rem' }}>
      <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.6rem', fontWeight: 700 }}>Built for teams on the front line of scams</h2>
      <p style={{ margin: '0 0 1rem', fontSize: '0.95rem', color: 'var(--tc-text-muted)' }}>
        Whether you serve members, subscribers, or citizens, TrustChekr plugs into the places where people first reach out for help.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1rem' }}>
        {partners.map((p) => (
          <div key={p.title} style={{ borderRadius: '14px', border: '1px solid var(--tc-border)', padding: '0.9rem 0.9rem 1rem', backgroundColor: 'var(--tc-surface)' }}>
            <div style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.35rem' }}>{p.title}</div>
            <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.9rem', color: 'var(--tc-text-muted)' }}>
              {p.bullets.map((b) => <li key={b} style={{ marginBottom: '0.2rem' }}>{b}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function UseCases() {
  const cards = [
    { title: 'Banking & credit unions', body: 'Flag high-risk payments and e-Transfers, prompt staff with plain-language questions to ask, and document member consent when they proceed against advice.' },
    { title: 'Telecom & wireless', body: 'Surface likely scam calls and SMS patterns, help subscribers check suspicious numbers, and reduce churn from fraud-related frustration.' },
    { title: 'Police & victim services', body: 'Turn raw call notes and screenshots into structured intel your analysts and investigators can search, trend, and act on.' },
    { title: 'E-commerce & marketplaces', body: 'Spot fake support numbers, refund scams, and buyer/seller fraud patterns before they scale across your platform.' },
  ];
  return (
    <section style={{ marginBottom: '2.5rem' }}>
      <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.6rem', fontWeight: 700 }}>Example use cases</h2>
      <p style={{ margin: '0 0 1rem', fontSize: '0.95rem', color: 'var(--tc-text-muted)' }}>
        Most partners start with one or two high-impact journeys, then expand once they see the reduction in losses and call time.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        {cards.map((c) => (
          <div key={c.title} style={{ borderRadius: '14px', border: '1px solid var(--tc-border)', padding: '0.9rem 0.9rem 1rem', backgroundColor: 'var(--tc-surface)' }}>
            <div style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.35rem' }}>{c.title}</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--tc-text-muted)' }}>{c.body}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function DemoForm() {
  const useCases = [
    'Credit union / Central 1 Forge',
    'Banking / fraud operations',
    'Telecom / carrier',
    'Police / law enforcement',
    'Consumer protection / regulator',
    'E-commerce / marketplace',
    'Other',
  ];

  return (
    <section id="demo" style={{ borderRadius: '16px', border: '1px solid var(--tc-border)', backgroundColor: 'var(--tc-bg-alt, #f9fafb)', padding: '1.2rem 1.1rem 1.4rem', marginBottom: '1.5rem' }}>
      <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.6rem', fontWeight: 700 }}>Request a demo</h2>
      <p style={{ margin: '0 0 1rem', fontSize: '0.95rem', color: 'var(--tc-text-muted)' }}>
        Share a few details and we&apos;ll follow up with a short call or live demo tailored to your environment. No pressure, no hard sell.
      </p>
      <form action="/api/partnerships" method="POST">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem 1rem', marginBottom: '0.75rem' }}>
          <div>
            <label htmlFor="name" style={{ display: 'block', marginBottom: '0.2rem', fontSize: '0.9rem', fontWeight: 500 }}>Name</label>
            <input id="name" name="name" type="text" required placeholder="Your name" style={inputStyle} />
          </div>
          <div>
            <label htmlFor="organization" style={{ display: 'block', marginBottom: '0.2rem', fontSize: '0.9rem', fontWeight: 500 }}>Organization</label>
            <input id="organization" name="organization" type="text" required placeholder="Credit union, telecom, agency…" style={inputStyle} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem 1rem', marginBottom: '0.75rem' }}>
          <div>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '0.2rem', fontSize: '0.9rem', fontWeight: 500 }}>Work email</label>
            <input id="email" name="email" type="email" required placeholder="you@organization.ca" style={inputStyle} />
          </div>
          <div>
            <label htmlFor="useCase" style={{ display: 'block', marginBottom: '0.2rem', fontSize: '0.9rem', fontWeight: 500 }}>Primary use case</label>
            <select id="useCase" name="useCase" defaultValue="" style={inputStyle}>
              <option value="" disabled>Select a use case</option>
              {useCases.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>
        <div style={{ marginBottom: '0.9rem' }}>
          <label htmlFor="message" style={{ display: 'block', marginBottom: '0.2rem', fontSize: '0.9rem', fontWeight: 500 }}>What would you like to explore?</label>
          <textarea id="message" name="message" rows={4} placeholder="For example: red-flagging e-Transfers over $3K, telecom call screening, or an RCMP / OPP pilot." style={{ width: '100%', borderRadius: '12px', border: '1px solid var(--tc-border)', padding: '0.6rem 0.75rem', fontSize: '0.95rem', resize: 'vertical' }} />
        </div>
        <button type="submit" style={{ padding: '0.7rem 1.4rem', borderRadius: '999px', border: 'none', backgroundColor: 'var(--tc-primary)', color: '#ffffff', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer' }}>
          Submit request
        </button>
        <p style={{ margin: '0.5rem 0 0', fontSize: '0.8rem', color: 'var(--tc-text-muted)' }}>
          We typically respond within 1–2 business days. If it&apos;s urgent, mention that above.
        </p>
      </form>
    </section>
  );
}
