'use client';

import { useState, useEffect } from 'react';
import { Fingerprint, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import type { FingerprintResult } from '@/lib/scam-intel/types';

interface Props {
  content: string;
}

export function ScamIntelCard({ content }: Props) {
  const [result, setResult] = useState<FingerprintResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!content) { setLoading(false); return; }
    fetch('/api/fingerprint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, type: 'text' }),
    })
      .then((r) => r.json())
      .then((data) => { setResult(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [content]);

  if (loading || !result || !result.matched || !result.campaign) return null;

  const campaign = result.campaign;
  const confidence = Math.round(result.confidence * 100);

  const statusColors: Record<string, string> = {
    active: '#ef4444',
    declining: '#f97316',
    dormant: '#6b7280',
  };

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: 'var(--tc-surface)', border: '2px solid var(--tc-warning, #f97316)' }}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center gap-3 text-left"
        style={{ cursor: 'pointer', background: 'transparent', border: 'none' }}
      >
        <Fingerprint size={24} style={{ color: 'var(--tc-warning, #f97316)', flexShrink: 0 }} />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm" style={{ color: 'var(--tc-text-main)' }}>
            This matches a known scam campaign
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--tc-text-muted)' }}>
            {campaign.family_name} · {confidence}% match · {campaign.report_count.toLocaleString()} reports
          </p>
        </div>
        <span style={{ color: 'var(--tc-text-muted)' }}>
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </span>
      </button>

      {expanded && (
        <div className="px-4 pb-4 flex flex-col gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: statusColors[campaign.status] + '20', color: statusColors[campaign.status] }}>
              {campaign.status.toUpperCase()}
            </span>
            <span className="text-xs" style={{ color: 'var(--tc-text-muted)' }}>
              First seen {new Date(campaign.first_seen).toLocaleDateString('en-CA')}
            </span>
            <span className="text-xs" style={{ color: 'var(--tc-text-muted)' }}>
              Regions: {campaign.regions.join(', ')}
            </span>
          </div>

          {result.related_indicators.length > 0 && (
            <div>
              <p className="text-xs font-medium mb-1" style={{ color: 'var(--tc-text-muted)' }}>Known indicators from this scam:</p>
              <div className="flex flex-wrap gap-1">
                {result.related_indicators.slice(0, 5).map((ind) => (
                  <span key={ind.id} className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: 'var(--tc-bg)', color: 'var(--tc-text-muted)' }}>
                    {ind.type}: {ind.value.length > 30 ? ind.value.slice(0, 27) + '...' : ind.value}
                  </span>
                ))}
              </div>
            </div>
          )}

          {result.similar_campaigns.length > 0 && (
            <div>
              <p className="text-xs font-medium mb-1" style={{ color: 'var(--tc-text-muted)' }}>Similar active scams:</p>
              {result.similar_campaigns.map((sc) => (
                <p key={sc.id} className="text-xs" style={{ color: 'var(--tc-text-main)' }}>
                  · {sc.family_name} ({sc.report_count.toLocaleString()} reports)
                </p>
              ))}
            </div>
          )}

          <a href={`/tools/lookup`} className="text-xs font-medium" style={{ color: 'var(--tc-primary)' }}>
            Look up specific phone numbers, emails, or URLs from this scam →
          </a>
        </div>
      )}
    </div>
  );
}
