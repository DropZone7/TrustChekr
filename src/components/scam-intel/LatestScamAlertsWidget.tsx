'use client';

import { useEffect, useState } from 'react';
import type { ScamPattern } from '@/lib/scamIntel/types';

interface LatestScamIntelResponse {
  scams: ScamPattern[];
  meta: { count: number; generated_at: string };
}

export function LatestScamAlertsWidget() {
  const [scams, setScams] = useState<ScamPattern[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchScams() {
      try {
        setLoading(true);
        const res = await fetch('/api/scam-intel/latest', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
        });
        if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
        const data: LatestScamIntelResponse = await res.json();
        if (!cancelled) { setScams(data.scams); setError(null); }
      } catch (err: any) {
        if (!cancelled) setError(err?.message ?? 'Failed to load scam alerts');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchScams();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="rounded-xl border p-4 text-sm" style={{ borderColor: 'var(--tc-border)', background: 'var(--tc-surface)', color: 'var(--tc-text-muted)' }}>
        Loading latest scam alerts…
      </div>
    );
  }

  if (error || !scams || scams.length === 0) {
    return (
      <div className="rounded-xl border p-4 text-sm" style={{ borderColor: 'var(--tc-border)', background: 'var(--tc-surface)', color: 'var(--tc-text-muted)' }}>
        {error ? 'Unable to load scam alerts right now.' : 'No current scam alerts to show.'}
      </div>
    );
  }

  return (
    <div className="rounded-xl border p-4" style={{ borderColor: 'var(--tc-border)', background: 'var(--tc-surface)' }}>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold" style={{ color: 'var(--tc-text-main)' }}>
          🚨 Latest Scam Alerts (Canada)
        </h2>
      </div>
      <ul className="flex flex-col gap-3">
        {scams.map((scam) => (
          <li key={scam.id}>
            <a
              href={`/safety/scams/${scam.id}`}
              className="block rounded-lg border p-3 transition-all hover:shadow-sm"
              style={{ borderColor: 'var(--tc-border)' }}
            >
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="font-medium" style={{ color: 'var(--tc-text-main)' }}>{scam.name}</span>
                <SeverityBadge severity={scam.severity} />
              </div>
              <p className="mb-2 text-xs" style={{ color: 'var(--tc-text-muted)' }}>
                {scam.red_flags[0] ?? scam.short_description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wide" style={{ color: 'var(--tc-text-muted)' }}>
                  {scam.category.toUpperCase()} · {new Date(scam.last_updated).toLocaleDateString()}
                </span>
                <span className="text-xs font-medium" style={{ color: 'var(--tc-primary)' }}>Learn more →</span>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SeverityBadge({ severity }: { severity: ScamPattern['severity'] }) {
  const colors: Record<ScamPattern['severity'], { bg: string; text: string; border: string }> = {
    info:     { bg: '#e0f2fe', text: '#0369a1', border: '#bae6fd' },
    low:      { bg: '#d1fae5', text: '#065f46', border: '#a7f3d0' },
    medium:   { bg: '#fef3c7', text: '#92400e', border: '#fde68a' },
    high:     { bg: '#ffedd5', text: '#9a3412', border: '#fed7aa' },
    critical: { bg: '#fee2e2', text: '#991b1b', border: '#fecaca' },
  };
  const c = colors[severity];
  return (
    <span
      className="inline-flex items-center rounded border px-1.5 py-0.5 text-xs font-semibold"
      style={{ background: c.bg, color: c.text, borderColor: c.border }}
    >
      {severity.toUpperCase()}
    </span>
  );
}
