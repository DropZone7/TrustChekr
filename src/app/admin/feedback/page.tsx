'use client';

import React, { useEffect, useState } from 'react';

type RiskLevelSummary = { riskLevel: string; total: number; helpful: number; notHelpful: number; helpfulRate: number };
type ScanTypeSummary = { scanType: string; total: number; helpful: number; notHelpful: number; helpfulRate: number };
type TrendEntry = { date: string; total: number; helpful: number; notHelpful: number };
type NegativeFeedback = { id: number; scanType: string | null; riskLevel: string | null; comment: string; createdAt: string };

type SummaryResponse = {
  totalFeedback: number;
  helpfulCount: number;
  notHelpfulCount: number;
  helpfulRate: number;
  windowDays: number;
  byRiskLevel: RiskLevelSummary[];
  byScanType: ScanTypeSummary[];
  feedbackTrend: TrendEntry[];
  recentNegative: NegativeFeedback[];
};

export default function FeedbackAdminPage() {
  const [data, setData] = useState<SummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch('/api/feedback/summary');
        if (!res.ok) throw new Error('Failed');
        const json = (await res.json()) as SummaryResponse;
        if (!cancelled) setData(json);
      } catch {
        if (!cancelled) setError('Could not load feedback summary');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const helpfulPercent = data ? Math.round(data.helpfulRate * 100) : 0;
  const maxRiskTotal = data && data.byRiskLevel.length > 0 ? Math.max(...data.byRiskLevel.map((r) => r.total)) : 1;
  const maxScanTypeTotal = data && data.byScanType.length > 0 ? Math.max(...data.byScanType.map((s) => s.total)) : 1;
  const maxTrendTotal = data && data.feedbackTrend.length > 0 ? Math.max(...data.feedbackTrend.map((t) => t.total)) : 1;

  return (
    <main data-admin-feedback style={{ width: '100%', maxWidth: '960px', margin: '0 auto', padding: '24px 16px 40px', color: 'var(--tc-text-main)' }}>
      {/* Hero */}
      <section style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span style={{ fontSize: '28px' }}>📊</span>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700 }}>User Feedback &amp; Impact</h1>
        </div>
        <p style={{ margin: 0, fontSize: '14px', color: 'var(--tc-text-muted)' }}>
          How people feel about TrustChekr&apos;s results over the last {data?.windowDays ?? 90} days.
        </p>
      </section>

      {error && !loading && (
        <div style={{ marginBottom: '16px', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--tc-border)', backgroundColor: 'var(--tc-surface)', color: 'var(--tc-text-main)', fontSize: '13px' }}>
          {error}
        </div>
      )}

      {/* Top metrics */}
      <section className="admin-grid-4" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'Overall helpfulness', value: loading ? null : `${helpfulPercent}%`, sub: !loading && data ? `${data.helpfulCount} of ${data.totalFeedback} marked helpful` : undefined },
          { label: 'Feedback volume', value: loading ? null : String(data?.totalFeedback ?? 0), sub: !loading && data ? `Last ${data.windowDays} days` : undefined },
          { label: 'Positive feedback', value: loading ? null : String(data?.helpfulCount ?? 0) },
          { label: 'Negative feedback', value: loading ? null : String(data?.notHelpfulCount ?? 0) },
        ].map((card) => (
          <div key={card.label} style={{ padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--tc-border)', backgroundColor: 'var(--tc-surface)' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--tc-text-muted)', marginBottom: '4px', letterSpacing: '0.04em' }}>{card.label}</div>
            {card.value === null ? (
              <div style={{ height: '22px', borderRadius: '8px', backgroundColor: 'var(--tc-primary-soft)', opacity: 0.4 }} />
            ) : (
              <div style={{ fontSize: '22px', fontWeight: 700 }}>{card.value}</div>
            )}
            {card.sub && <div style={{ marginTop: '4px', fontSize: '12px', color: 'var(--tc-text-muted)' }}>{card.sub}</div>}
          </div>
        ))}
      </section>

      {/* By risk level & scan type */}
      <section className="admin-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', marginBottom: '24px' }}>
        {/* By risk level */}
        <div>
          <h2 style={{ margin: 0, marginBottom: '8px', fontSize: '16px', fontWeight: 600 }}>Helpfulness by risk level</h2>
          <p style={{ margin: 0, marginBottom: '8px', fontSize: '12px', color: 'var(--tc-text-muted)' }}>Do people agree with our risk assessments?</p>
          {!loading && data && data.byRiskLevel.length > 0 && (
            <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {data.byRiskLevel.map((item) => {
                const widthPercent = maxRiskTotal > 0 ? Math.max(8, (item.total / maxRiskTotal) * 100) : 0;
                const label = item.riskLevel || 'Unknown';
                const rate = Math.round(item.helpfulRate * 100);
                return (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ flex: 1, height: '18px', borderRadius: '999px', backgroundColor: 'var(--tc-primary-soft)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${widthPercent}%`, backgroundColor: 'var(--tc-primary)' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', minWidth: '120px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 500 }}>{label}</span>
                      <span style={{ fontSize: '10px', color: 'var(--tc-text-muted)' }}>{item.total} feedback • {rate}% helpful</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* By scan type */}
        <div>
          <h2 style={{ margin: 0, marginBottom: '8px', fontSize: '16px', fontWeight: 600 }}>Helpfulness by scan type</h2>
          <p style={{ margin: 0, marginBottom: '8px', fontSize: '12px', color: 'var(--tc-text-muted)' }}>Which inputs are we doing best on?</p>
          {!loading && data && data.byScanType.length > 0 && (
            <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {data.byScanType.map((item) => {
                const widthPercent = maxScanTypeTotal > 0 ? Math.max(8, (item.total / maxScanTypeTotal) * 100) : 0;
                const label = item.scanType || 'Unknown';
                const rate = Math.round(item.helpfulRate * 100);
                return (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ flex: 1, height: '18px', borderRadius: '999px', backgroundColor: 'var(--tc-primary-soft)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${widthPercent}%`, backgroundColor: 'var(--tc-primary)' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', minWidth: '140px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 500 }}>{label}</span>
                      <span style={{ fontSize: '10px', color: 'var(--tc-text-muted)' }}>{item.total} feedback • {rate}% helpful</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Trend + Recent negative */}
      <section className="admin-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Trend */}
        <div>
          <h2 style={{ margin: 0, marginBottom: '8px', fontSize: '16px', fontWeight: 600 }}>Feedback trend (last 30 days)</h2>
          {!loading && data && data.feedbackTrend.length > 0 && (
            <div style={{ marginTop: '8px', height: '140px', display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
              {data.feedbackTrend.map((item, index, arr) => {
                const heightPercent = maxTrendTotal > 0 ? Math.max(6, (item.total / maxTrendTotal) * 100) : 0;
                const showLabel = index === 0 || index === arr.length - 1 || index === Math.floor(arr.length / 2);
                return (
                  <div key={item.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                    <div style={{ width: '100%', height: `${heightPercent}%`, borderRadius: '6px 6px 0 0', backgroundColor: 'var(--tc-primary)' }} />
                    {showLabel && <span style={{ fontSize: '9px', color: 'var(--tc-text-muted)' }}>{item.date.slice(5)}</span>}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent negative */}
        <div>
          <h2 style={{ margin: 0, marginBottom: '8px', fontSize: '16px', fontWeight: 600 }}>Recent negative feedback</h2>
          {!loading && data && data.recentNegative.length === 0 && (
            <p style={{ marginTop: '8px', fontSize: '12px', color: 'var(--tc-text-muted)' }}>No recent negative feedback with comments.</p>
          )}
          {!loading && data && data.recentNegative.length > 0 && (
            <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {data.recentNegative.map((item) => (
                <div key={item.id} style={{ padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--tc-border)', backgroundColor: 'var(--tc-surface)', fontSize: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', gap: '8px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {item.riskLevel && <span style={{ padding: '2px 6px', borderRadius: '999px', border: '1px solid var(--tc-border)', fontSize: '10px', backgroundColor: 'var(--tc-primary-soft)' }}>{item.riskLevel}</span>}
                      {item.scanType && <span style={{ padding: '2px 6px', borderRadius: '999px', border: '1px solid var(--tc-border)', fontSize: '10px' }}>{item.scanType}</span>}
                    </div>
                    <span style={{ fontSize: '10px', color: 'var(--tc-text-muted)', whiteSpace: 'nowrap' }}>{item.createdAt.slice(0, 16).replace('T', ' ')}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--tc-text-main)', lineHeight: 1.4 }}>{item.comment}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <style>{`
        @media (min-width: 768px) {
          main[data-admin-feedback] .admin-grid-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
          main[data-admin-feedback] .admin-grid-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
      `}</style>
    </main>
  );
}
