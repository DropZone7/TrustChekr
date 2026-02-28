import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Threat Dashboard',
  description: 'Real-time scam threat intelligence for Canada and the US. Track active campaigns, trending scam types, and community reports.',
  openGraph: {
    title: 'Threat Dashboard | TrustChekr',
    description: 'Monitor active scam campaigns targeting Canadians and Americans in real time.',
    url: 'https://trustchekr.com/threats',
  },
};

type Alert = { id: string; title: string; summary: string; category?: string; severity?: string; publishedAt?: string };
type TrendType = { name: string; count: number };
type Report = { id: string; message: string; scam_type?: string; province?: string; created_at?: string };

const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://trustchekr.com';

async function fetchAlerts(): Promise<Alert[]> {
  try {
    const res = await fetch(`${base}/api/scam-intel/latest`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.alerts ?? json ?? []).slice(0, 10);
  } catch { return []; }
}

async function fetchStats(): Promise<{ totalScans: number; reportsThisWeek: number; topTypes: TrendType[] }> {
  try {
    const res = await fetch(`${base}/api/stats/overview`, { next: { revalidate: 300 } });
    if (!res.ok) return { totalScans: 0, reportsThisWeek: 0, topTypes: [] };
    const json = await res.json();
    return {
      totalScans: json.totalScans ?? 0,
      reportsThisWeek: json.reportsThisWeek ?? 0,
      topTypes: json.topTypes ?? [],
    };
  } catch { return { totalScans: 0, reportsThisWeek: 0, topTypes: [] }; }
}

const CANADIAN_ALERTS: Alert[] = [
  { id: 'ca-cra', title: 'CRA Tax Refund Scam', summary: 'Texts and calls claiming overdue tax payments or refunds, asking for gift cards or crypto. The CRA never requests payment this way.', category: 'Phone / SMS', severity: 'high' },
  { id: 'ca-rcmp', title: 'RCMP Arrest Warrant Scam', summary: 'Callers impersonating RCMP officers, threatening arrest for unpaid fines or SIN misuse. Law enforcement never demands payment by phone.', category: 'Phone', severity: 'high' },
  { id: 'ca-etransfer', title: 'Interac e-Transfer Phishing', summary: 'Emails pretending to be Interac e-Transfer notifications with fake deposit links designed to steal banking credentials.', category: 'Email', severity: 'high' },
  { id: 'ca-delivery', title: 'Package Delivery Fee Scam', summary: 'SMS messages from "Canada Post" or couriers requesting small fees through phishing links. Canada Post does not text for fees.', category: 'SMS', severity: 'medium' },
  { id: 'ca-grandparent', title: 'Grandparent Emergency Scam', summary: 'Callers pretending to be a grandchild in legal trouble, asking for bail money via wire transfer or gift cards.', category: 'Phone', severity: 'high' },
];

function severityColor(s?: string) {
  if (s === 'high') return { bg: 'rgba(239,68,68,0.1)', color: '#dc2626', label: 'High' };
  if (s === 'medium') return { bg: 'rgba(245,158,11,0.1)', color: '#d97706', label: 'Medium' };
  return { bg: 'rgba(16,185,129,0.1)', color: '#059669', label: 'Low' };
}

export default async function ThreatsPage() {
  const [alerts, stats] = await Promise.all([fetchAlerts(), fetchStats()]);
  const displayAlerts = alerts.length > 0 ? alerts : CANADIAN_ALERTS;

  return (
    <div>
      <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 700, color: 'var(--tc-primary)' }}>
        Threat Dashboard
      </h1>
      <p style={{ margin: '0.5rem 0 1.5rem', fontSize: '1rem', color: 'var(--tc-text-muted)' }}>
        Active scam campaigns and threat intelligence for Canada and the US. Updated continuously from community reports and threat feeds.
      </p>

      {/* Stats bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total scans', value: stats.totalScans > 0 ? stats.totalScans.toLocaleString() : '—' },
          { label: 'Reports this week', value: stats.reportsThisWeek > 0 ? stats.reportsThisWeek.toLocaleString() : '—' },
          { label: 'Active alerts', value: String(displayAlerts.length) },
        ].map((s) => (
          <div key={s.label} style={{ borderRadius: '12px', border: '1px solid var(--tc-border)', padding: '0.75rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--tc-primary)' }}>{s.value}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--tc-text-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Active alerts */}
      <h2 style={{ margin: '0 0 0.75rem', fontSize: '1.3rem', fontWeight: 600 }}>Active Scam Alerts</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
        {displayAlerts.map((alert) => {
          const sev = severityColor(alert.severity ?? 'medium');
          return (
            <div key={alert.id} style={{ borderRadius: '12px', border: '1px solid var(--tc-border)', padding: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--tc-text-main)' }}>{alert.title}</h3>
                <span style={{ borderRadius: '999px', padding: '0.15rem 0.5rem', fontSize: '0.75rem', fontWeight: 600, backgroundColor: sev.bg, color: sev.color, whiteSpace: 'nowrap' }}>
                  {sev.label}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--tc-text-muted)' }}>
                {alert.summary ?? alert.category ?? ''}
              </p>
            </div>
          );
        })}
      </div>

      {/* Trending types */}
      {stats.topTypes.length > 0 && (
        <>
          <h2 style={{ margin: '0 0 0.75rem', fontSize: '1.3rem', fontWeight: 600 }}>Trending Scam Types</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
            {stats.topTypes.slice(0, 8).map((t) => {
              const maxCount = Math.max(...stats.topTypes.map((x) => x.count), 1);
              const pct = Math.round((t.count / maxCount) * 100);
              return (
                <div key={t.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.2rem' }}>
                    <span style={{ fontWeight: 500 }}>{t.name}</span>
                    <span style={{ color: 'var(--tc-text-muted)' }}>{t.count}</span>
                  </div>
                  <div style={{ height: '8px', borderRadius: '4px', backgroundColor: '#e5e7eb', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, borderRadius: '4px', backgroundColor: 'var(--tc-primary)', transition: 'width 0.3s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* CTA */}
      <div style={{ borderRadius: '12px', border: '1px solid var(--tc-border)', padding: '1rem', textAlign: 'center', backgroundColor: 'rgba(26,82,118,0.03)' }}>
        <p style={{ margin: '0 0 0.5rem', fontSize: '1rem', fontWeight: 600, color: 'var(--tc-text-main)' }}>
          Seen something suspicious?
        </p>
        <p style={{ margin: '0 0 0.75rem', fontSize: '0.9rem', color: 'var(--tc-text-muted)' }}>
          Check it with our scanner or report it to help protect others.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/" style={{ padding: '0.6rem 1.1rem', borderRadius: '999px', backgroundColor: 'var(--tc-primary)', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}>
            Check something
          </a>
          <a href="/report" style={{ padding: '0.6rem 1.1rem', borderRadius: '999px', border: '1px solid var(--tc-border)', color: 'var(--tc-primary)', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem' }}>
            Report a scam
          </a>
        </div>
      </div>
    </div>
  );
}
