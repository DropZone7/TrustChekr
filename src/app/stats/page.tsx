'use client';

import React, { useEffect, useState } from 'react';

type ScamTypeStat = { type: string; count: number };
type MonthStat = { month: string; count: number };
type MostReportedProvince = { province: string; count: number } | null;
type PlatformStats = {
  totalScansEstimate: string;
  analysisModules: number;
  blockedDomains: number;
  countries: number;
};

type OverviewResponse = {
  totalVerifiedReports: number;
  scamTypes: ScamTypeStat[];
  reportsByMonth: MonthStat[];
  mostReportedProvince: MostReportedProvince;
  platformStats: PlatformStats;
};

const SCAM_TYPE_LABELS: Record<string, string> = {
  phone_scam: '📞 Phone Scam',
  cra_impersonation: '🏛 CRA Impersonation',
  bank_impersonation: '🏦 Bank Impersonation',
  tech_support: '💻 Tech Support',
  romance_scam: '💔 Romance Scam',
  crypto_scam: '🪙 Crypto Scam',
  phishing: '🎣 Phishing',
  investment_fraud: '📈 Investment Fraud',
  other: '❓ Other',
  unknown: '❓ Unknown',
};

export default function StatsPage() {
  const [data, setData] = useState<OverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch('/api/stats/overview');
        if (!res.ok) throw new Error('Failed');
        const json = (await res.json()) as OverviewResponse;
        if (!cancelled) setData(json);
      } catch {
        if (!cancelled) setData(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const maxScamTypeCount =
    data && data.scamTypes.length > 0 ? Math.max(...data.scamTypes.map((s) => s.count)) : 1;
  const maxMonthCount =
    data && data.reportsByMonth.length > 0 ? Math.max(...data.reportsByMonth.map((m) => m.count)) : 1;

  const platform = data?.platformStats ?? {
    totalScansEstimate: '—',
    analysisModules: 0,
    blockedDomains: 0,
    countries: 0,
  };

  return (
    <main
      style={{
        width: '100%',
        maxWidth: '960px',
        margin: '0 auto',
        padding: '24px 16px 40px',
        color: 'var(--tc-text-main)',
      }}
    >
      {/* Hero */}
      <section style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span style={{ fontSize: '28px' }}>🛡</span>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700 }}>TrustChekr by the Numbers</h1>
        </div>
        <p style={{ margin: 0, fontSize: '14px', color: 'var(--tc-text-muted)' }}>
          Live usage stats that show how people are spotting scams across Canada and beyond.
        </p>
      </section>

      {/* Platform stat cards */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
          marginBottom: '24px',
        }}
      >
        {[
          { label: 'Total scans (estimate)', value: platform.totalScansEstimate },
          { label: 'Analysis modules', value: String(platform.analysisModules) },
          { label: 'Blocked domains', value: platform.blockedDomains.toLocaleString() },
          { label: 'Countries covered', value: String(platform.countries) },
        ].map((card) => (
          <div
            key={card.label}
            style={{
              padding: '12px 14px',
              borderRadius: '10px',
              border: '1px solid var(--tc-border)',
              backgroundColor: 'var(--tc-surface)',
            }}
          >
            <div
              style={{
                fontSize: '11px',
                textTransform: 'uppercase',
                color: 'var(--tc-text-muted)',
                marginBottom: '4px',
                letterSpacing: '0.04em',
              }}
            >
              {card.label}
            </div>
            <div style={{ fontSize: '20px', fontWeight: 700 }}>{card.value}</div>
          </div>
        ))}
      </section>

      {loading && (
        <p style={{ textAlign: 'center', color: 'var(--tc-text-muted)', padding: '40px 0' }}>
          Loading stats...
        </p>
      )}

      {!loading && !data && (
        <p style={{ textAlign: 'center', color: 'var(--tc-text-muted)', padding: '40px 0' }}>
          Unable to load stats right now. Please try again later.
        </p>
      )}

      {data && (
        <>
          {/* Community reports */}
          <section style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>
              Community Reports: {data.totalVerifiedReports}
            </h2>

            {data.mostReportedProvince && (
              <p style={{ fontSize: '14px', color: 'var(--tc-text-muted)', marginBottom: '16px' }}>
                Most reported province: <strong>{data.mostReportedProvince.province}</strong> ({data.mostReportedProvince.count} reports)
              </p>
            )}

            {/* Scam types bar chart */}
            <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '8px' }}>By Scam Type</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' }}>
              {data.scamTypes.slice(0, 8).map((s) => (
                <div key={s.type} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '160px', fontSize: '13px', flexShrink: 0 }}>
                    {SCAM_TYPE_LABELS[s.type] ?? s.type}
                  </div>
                  <div
                    style={{
                      flex: 1,
                      height: '20px',
                      backgroundColor: 'var(--tc-primary-soft)',
                      borderRadius: '4px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.max(4, (s.count / maxScamTypeCount) * 100)}%`,
                        height: '100%',
                        backgroundColor: 'var(--tc-primary)',
                        borderRadius: '4px',
                        transition: 'width 0.5s ease',
                      }}
                    />
                  </div>
                  <div style={{ width: '40px', textAlign: 'right', fontSize: '13px', fontWeight: 600 }}>
                    {s.count}
                  </div>
                </div>
              ))}
            </div>

            {/* Monthly trend */}
            <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '8px' }}>Reports by Month</h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '120px' }}>
              {data.reportsByMonth.map((m) => (
                <div
                  key={m.month}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    height: '100%',
                  }}
                >
                  <div style={{ fontSize: '11px', fontWeight: 600, marginBottom: '4px' }}>{m.count}</div>
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '48px',
                      height: `${Math.max(4, (m.count / maxMonthCount) * 100)}%`,
                      backgroundColor: 'var(--tc-primary)',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 0.5s ease',
                    }}
                  />
                  <div style={{ fontSize: '10px', color: 'var(--tc-text-muted)', marginTop: '4px' }}>
                    {m.month.slice(5)}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* CTA */}
      <section
        style={{
          marginTop: '32px',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid var(--tc-border)',
          backgroundColor: 'var(--tc-surface)',
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>
          Help protect your community
        </p>
        <p style={{ fontSize: '14px', color: 'var(--tc-text-muted)', marginBottom: '16px' }}>
          Report scams you encounter to help others stay safe.
        </p>
        <a
          href="/community"
          style={{
            display: 'inline-block',
            padding: '10px 24px',
            borderRadius: '8px',
            backgroundColor: 'var(--tc-primary)',
            color: '#fff',
            fontWeight: 600,
            textDecoration: 'none',
            fontSize: '14px',
          }}
        >
          Report a Scam →
        </a>
      </section>
    </main>
  );
}
