'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

interface TrendCategory {
  name: string;
  level: 'low' | 'moderate' | 'high' | 'critical';
  emoji: string;
  description: string;
  postCount: number;
  change: 'rising' | 'stable' | 'falling';
}

interface TrendData {
  lastUpdated: string;
  categories: TrendCategory[];
}

const LEVEL_COLORS: Record<string, string> = {
  low: '#22c55e',
  moderate: '#eab308',
  high: '#f97316',
  critical: '#ef4444',
};

const LEVEL_BG: Record<string, string> = {
  low: 'rgba(34, 197, 94, 0.15)',
  moderate: 'rgba(234, 179, 8, 0.15)',
  high: 'rgba(249, 115, 22, 0.15)',
  critical: 'rgba(239, 68, 68, 0.15)',
};

const CHANGE_ARROWS: Record<string, string> = {
  rising: '↑',
  stable: '→',
  falling: '↓',
};

const CATEGORY_LINKS: Record<string, string> = {
  'CRA / IRS Tax Scams': '/academy/tax-scams',
  'Bank Impersonation': '/academy/bank-scams',
  'Crypto & Investment': '/academy/crypto-scams',
  'Romance Scams': '/academy/romance-scams',
  'AI-Powered Scams': '/academy/ai-scams',
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function ScamRadar() {
  const [data, setData] = useState<TrendData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTrends = useCallback(async () => {
    try {
      const res = await fetch('/api/trends');
      const json = await res.json();
      setData(json);
    } catch {
      // Keep existing data on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrends();
    const interval = setInterval(fetchTrends, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchTrends]);

  if (loading) {
    return (
      <div style={{
        background: '#111',
        borderRadius: 12,
        padding: 24,
        border: '1px solid #222',
        animation: 'pulse 2s ease-in-out infinite',
      }}>
        <div style={{ color: '#666', textAlign: 'center' }}>Loading threat data...</div>
      </div>
    );
  }

  if (!data) return null;

  const hasCritical = data.categories.some(c => c.level === 'critical');

  return (
    <div style={{
      background: '#0a0a0a',
      borderRadius: 12,
      border: `1px solid ${hasCritical ? '#ef444466' : '#222'}`,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        borderBottom: '1px solid #1a1a1a',
        background: '#111',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20 }}>📡</span>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>Scam Radar</span>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            background: 'rgba(239, 68, 68, 0.2)',
            color: '#ef4444',
            fontSize: 11,
            fontWeight: 600,
            padding: '2px 8px',
            borderRadius: 10,
            letterSpacing: 0.5,
          }}>
            <span style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#ef4444',
              display: 'inline-block',
              animation: 'blink 1.5s ease-in-out infinite',
            }} />
            LIVE
          </span>
        </div>
        <span style={{ color: '#666', fontSize: 12 }}>
          Updated {timeAgo(data.lastUpdated)}
        </span>
      </div>

      {/* Categories */}
      <div style={{ padding: '8px 0' }}>
        {data.categories.map((cat) => {
          const color = LEVEL_COLORS[cat.level];
          const bg = LEVEL_BG[cat.level];
          const arrow = CHANGE_ARROWS[cat.change];
          const link = CATEGORY_LINKS[cat.name] || '/academy';
          const isPulsing = cat.level === 'critical' || cat.level === 'high';

          return (
            <Link
              key={cat.name}
              href={link}
              style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 20px',
                gap: 12,
                transition: 'background 0.2s',
                cursor: 'pointer',
                borderLeft: `3px solid ${color}`,
              }}
                onMouseEnter={e => (e.currentTarget.style.background = '#151515')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                {/* Emoji */}
                <span style={{ fontSize: 24, flexShrink: 0 }}>{cat.emoji}</span>

                {/* Name + Description */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ color: '#e5e5e5', fontWeight: 600, fontSize: 14 }}>{cat.name}</span>
                    <span style={{
                      display: 'inline-block',
                      padding: '1px 8px',
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                      color,
                      background: bg,
                      animation: isPulsing ? 'threatPulse 2s ease-in-out infinite' : 'none',
                    }}>
                      {cat.level}
                    </span>
                  </div>
                  <div style={{ color: '#888', fontSize: 12, marginTop: 2, lineHeight: 1.4 }}>
                    {cat.description}
                  </div>
                </div>

                {/* Trend + Count */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{
                    color: cat.change === 'rising' ? '#ef4444' : cat.change === 'falling' ? '#22c55e' : '#888',
                    fontSize: 18,
                    fontWeight: 700,
                  }}>
                    {arrow}
                  </div>
                  {cat.postCount > 0 && (
                    <div style={{ color: '#555', fontSize: 11 }}>
                      {cat.postCount.toLocaleString()} reports
                    </div>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{
        padding: '10px 20px',
        borderTop: '1px solid #1a1a1a',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{ color: '#444', fontSize: 10 }}>
          Powered by real-time X data via Grok
        </span>
        <Link href="/academy" style={{ color: '#A40000', fontSize: 11, textDecoration: 'none', fontWeight: 600 }}>
          Learn to protect yourself →
        </Link>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes threatPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
