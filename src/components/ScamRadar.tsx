'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Landmark, Building2, Coins, HeartCrack, Bot, Shield } from 'lucide-react';

const EMOJI_ICON_MAP: Record<string, React.ComponentType<any>> = {
  '🏛️': Landmark,
  '🏛': Landmark,
  '🏦': Building2,
  '💰': Coins,
  '💔': HeartCrack,
  '🤖': Bot,
};

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
    } catch { /* keep existing */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchTrends();
    const interval = setInterval(fetchTrends, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchTrends]);

  if (loading) {
    return (
      <div style={{
        background: 'var(--tc-surface)',
        borderRadius: 12,
        padding: 24,
        border: '1px solid var(--tc-border)',
        animation: 'pulse 2s ease-in-out infinite',
      }}>
        <div style={{ color: 'var(--tc-text-muted)', textAlign: 'center' }}>Loading threat data...</div>
      </div>
    );
  }

  if (!data) return null;

  const hasCritical = data.categories.some(c => c.level === 'critical');

  return (
    <div style={{
      background: 'var(--tc-surface)',
      borderRadius: 12,
      border: `1px solid ${hasCritical ? '#ef444466' : 'var(--tc-border)'}`,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        borderBottom: '1px solid var(--tc-border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Shield size={20} strokeWidth={1.75} style={{ color: 'var(--tc-primary)' }} />
          <span style={{ color: 'var(--tc-text-main)', fontWeight: 700, fontSize: 16 }}>Scam Radar</span>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            background: 'rgba(239, 68, 68, 0.15)',
            color: '#ef4444',
            fontSize: 11,
            fontWeight: 600,
            padding: '2px 8px',
            borderRadius: 12,
            letterSpacing: 0.5,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#ef4444', display: 'inline-block',
              animation: 'blink 1.5s ease-in-out infinite',
            }} />
            LIVE
          </span>
        </div>
        <span style={{ color: 'var(--tc-text-muted)', fontSize: 12 }}>
          Updated {timeAgo(data.lastUpdated)}
        </span>
      </div>

      {/* Categories */}
      <div style={{ padding: '8px 0' }}>
        {data.categories.map((cat) => {
          const color = LEVEL_COLORS[cat.level];
          const bg = LEVEL_BG[cat.level];
          const arrow = CHANGE_ARROWS[cat.change];
          const isPulsing = cat.level === 'critical' || cat.level === 'high';

          return (
            <Link
              key={cat.name}
              href="/academy"
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
              }}>
                {/* Icon */}
                <span style={{ fontSize: 24, flexShrink: 0, display: 'flex', alignItems: 'center', color: 'var(--tc-text-muted)' }}>
                  {(() => {
                    const IconComp = EMOJI_ICON_MAP[cat.emoji] || Shield;
                    return <IconComp size={24} strokeWidth={1.75} />;
                  })()}
                </span>

                {/* Name + Description */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ color: 'var(--tc-text-main)', fontWeight: 600, fontSize: 14 }}>{cat.name}</span>
                    <span style={{
                      display: 'inline-block',
                      padding: '1px 8px',
                      borderRadius: 4,
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
                  <div style={{ color: 'var(--tc-text-muted)', fontSize: 12, marginTop: 2, lineHeight: 1.4 }}>
                    {cat.description}
                  </div>
                </div>

                {/* Trend + Count */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{
                    color: cat.change === 'rising' ? '#ef4444' : cat.change === 'falling' ? '#22c55e' : 'var(--tc-text-muted)',
                    fontSize: 18,
                    fontWeight: 700,
                  }}>
                    {arrow}
                  </div>
                  {cat.postCount > 0 && (
                    <div style={{ color: 'var(--tc-text-muted)', fontSize: 11 }}>
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
        borderTop: '1px solid var(--tc-border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{ color: 'var(--tc-text-muted)', fontSize: 10 }}>
          Powered by real-time data
        </span>
        <Link href="/academy" style={{ color: 'var(--tc-primary)', fontSize: 11, textDecoration: 'none', fontWeight: 600 }}>
          Learn to protect yourself →
        </Link>
      </div>

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
