'use client';

import { useState, useEffect } from 'react';
import { BackButton } from '@/components/BackButton';
import { Search, Phone, Mail, Globe, Wallet, AlertTriangle, Shield, ChevronDown, ChevronUp, Flag } from 'lucide-react';

type InputType = 'unknown' | 'phone' | 'email' | 'url' | 'domain' | 'wallet';

function detectType(q: string): InputType {
  const t = q.trim();
  if (!t) return 'unknown';
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)) return 'email';
  if (/^https?:\/\//i.test(t)) return 'url';
  if (/^(1|3|bc1)[a-zA-HJ-NP-Z0-9]{25,62}$/.test(t)) return 'wallet';
  if (/^0x[a-fA-F0-9]{40}$/.test(t)) return 'wallet';
  if (/^\+?[0-9\-\(\)\s]{7,15}$/.test(t)) return 'phone';
  if (/^[a-zA-Z0-9][a-zA-Z0-9\-]*\.[a-zA-Z]{2,}/.test(t) && !t.includes(' ')) return 'domain';
  return 'unknown';
}

const TYPE_ICONS: Record<InputType, typeof Search> = {
  unknown: Search,
  phone: Phone,
  email: Mail,
  url: Globe,
  domain: Globe,
  wallet: Wallet,
};

const RISK_COLORS: Record<string, string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#22c55e',
};

interface LookupResultData {
  found: boolean;
  indicator: {
    value: string;
    type: string;
    first_seen: string;
    last_seen: string;
    report_count: number;
    risk_level: string;
    status: string;
  } | null;
  campaigns: {
    name: string;
    category: string;
    role: string;
    report_count: number;
    date_range: { from: string; to: string };
  }[];
  related_indicators: {
    type: string;
    value: string;
    relationship: string;
  }[];
  community_reports: {
    date: string;
    region: string;
    excerpt: string;
  }[];
}

export default function LookupPage() {
  const [query, setQuery] = useState('');
  const [inputType, setInputType] = useState<InputType>('unknown');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LookupResultData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedCampaign, setExpandedCampaign] = useState<number | null>(null);

  useEffect(() => {
    setInputType(detectType(query));
  }, [query]);

  const handleLookup = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch('/api/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim(), type: inputType === 'unknown' ? 'auto' : inputType }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  const Icon = TYPE_ICONS[inputType];

  return (
    <main className="min-h-screen p-4 sm:p-8 flex flex-col items-center" style={{ background: 'var(--tc-bg)' }}>
      <BackButton />
      <div className="w-full max-w-2xl flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--tc-text-main)' }}>
            Scam Lookup
          </h1>
          <p className="mt-2" style={{ color: 'var(--tc-text-muted)' }}>
            Check if a phone number, email, URL, or crypto wallet has been reported in a scam.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--tc-text-muted)' }}>
            <Icon size={20} />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
            placeholder="Paste a phone number, email, URL, or wallet address"
            className="w-full pl-12 pr-4 py-4 rounded-xl text-base"
            style={{
              background: 'var(--tc-surface)',
              border: '2px solid var(--tc-border)',
              color: 'var(--tc-text-main)',
              outline: 'none',
              minHeight: '52px',
            }}
          />
          {inputType !== 'unknown' && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs px-2 py-1 rounded-full"
              style={{ background: 'var(--tc-primary-soft)', color: 'var(--tc-primary)' }}>
              {inputType}
            </span>
          )}
        </div>

        <button
          onClick={handleLookup}
          disabled={loading || !query.trim()}
          className="w-full py-3 rounded-xl font-semibold text-base transition-all"
          style={{
            background: loading ? 'var(--tc-border)' : 'var(--tc-primary)',
            color: 'white',
            cursor: loading || !query.trim() ? 'not-allowed' : 'pointer',
            opacity: loading || !query.trim() ? 0.6 : 1,
            minHeight: '48px',
          }}
        >
          {loading ? 'Searching...' : 'Look Up'}
        </button>

        {error && (
          <div className="p-4 rounded-xl text-center" style={{ border: '2px solid var(--tc-warning)', background: 'var(--tc-surface)' }}>
            <p style={{ color: 'var(--tc-warning)' }}>{error}</p>
          </div>
        )}

        {/* Results */}
        {result && !result.found && (
          <div className="p-6 rounded-xl text-center" style={{ background: 'var(--tc-surface)', border: '1px solid var(--tc-border)' }}>
            <Shield size={48} style={{ color: '#22c55e', margin: '0 auto 12px' }} />
            <h2 className="text-xl font-bold" style={{ color: 'var(--tc-text-main)' }}>Not Found in Our Database</h2>
            <p className="mt-2 text-sm" style={{ color: 'var(--tc-text-muted)' }}>
              This doesn&apos;t mean it&apos;s safe — it just hasn&apos;t been reported yet. Stay cautious.
            </p>
            <a href="/report" className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg text-sm font-medium"
              style={{ background: 'var(--tc-primary-soft)', color: 'var(--tc-primary)' }}>
              <Flag size={16} /> Report this as suspicious
            </a>
          </div>
        )}

        {result && result.found && result.indicator && (
          <>
            {/* Risk Badge */}
            <div className="p-6 rounded-xl flex flex-col items-center gap-3" style={{ background: 'var(--tc-surface)', border: '1px solid var(--tc-border)' }}>
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-sm font-bold"
                style={{ background: RISK_COLORS[result.indicator.risk_level] || '#6b7280' }}>
                {result.indicator.risk_level.toUpperCase()}
              </div>
              <h2 className="text-lg font-bold" style={{ color: 'var(--tc-text-main)' }}>
                Reported {result.indicator.report_count.toLocaleString()} times
              </h2>
              <p className="text-sm" style={{ color: 'var(--tc-text-muted)' }}>
                First seen {new Date(result.indicator.first_seen).toLocaleDateString('en-CA')} · 
                Last seen {new Date(result.indicator.last_seen).toLocaleDateString('en-CA')}
              </p>
              <span className="text-xs px-3 py-1 rounded-full font-medium"
                style={{
                  background: result.indicator.status === 'active' ? '#fef2f2' : '#f0fdf4',
                  color: result.indicator.status === 'active' ? '#ef4444' : '#22c55e',
                }}>
                {result.indicator.status === 'active' ? '⚠ Currently Active' : '✓ Inactive'}
              </span>
            </div>

            {/* Connected Campaigns */}
            {result.campaigns.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--tc-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Connected Scam Campaigns
                </h3>
                <div className="flex flex-col gap-2">
                  {result.campaigns.map((c, i) => (
                    <div key={i} className="rounded-xl overflow-hidden" style={{ background: 'var(--tc-surface)', border: '1px solid var(--tc-border)' }}>
                      <button
                        onClick={() => setExpandedCampaign(expandedCampaign === i ? null : i)}
                        className="w-full p-4 flex items-center justify-between text-left"
                        style={{ cursor: 'pointer', background: 'transparent', border: 'none', color: 'var(--tc-text-main)' }}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{c.name}</span>
                            {c.role === 'primary' && (
                              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--tc-primary-soft)', color: 'var(--tc-primary)' }}>
                                Direct Match
                              </span>
                            )}
                          </div>
                          <p className="text-xs mt-1" style={{ color: 'var(--tc-text-muted)' }}>
                            {c.report_count.toLocaleString()} reports
                          </p>
                        </div>
                        {expandedCampaign === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>
                      {expandedCampaign === i && (
                        <div className="px-4 pb-4 text-sm" style={{ color: 'var(--tc-text-muted)' }}>
                          <p>Category: {c.category.replace(/_/g, ' ')}</p>
                          <p>Active: {new Date(c.date_range.from).toLocaleDateString('en-CA')} — {new Date(c.date_range.to).toLocaleDateString('en-CA')}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Indicators */}
            {result.related_indicators.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--tc-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Other Indicators From This Scam
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.related_indicators.map((ri, i) => (
                    <span key={i} className="text-xs px-3 py-1.5 rounded-lg"
                      style={{ background: 'var(--tc-surface)', border: '1px solid var(--tc-border)', color: 'var(--tc-text-main)' }}>
                      {ri.type === 'phone' && <Phone size={12} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 4 }} />}
                      {ri.type === 'email' && <Mail size={12} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 4 }} />}
                      {(ri.type === 'url' || ri.type === 'domain') && <Globe size={12} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 4 }} />}
                      {ri.value.length > 40 ? ri.value.slice(0, 37) + '...' : ri.value}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Report button */}
            <a href="/report" className="block p-4 rounded-xl text-center font-medium"
              style={{ background: 'var(--tc-primary-soft)', color: 'var(--tc-primary)' }}>
              <Flag size={16} style={{ display: 'inline', verticalAlign: '-3px', marginRight: 6 }} />
              Report additional information about this scam
            </a>
          </>
        )}

        {/* Info note */}
        <p className="text-xs text-center" style={{ color: 'var(--tc-text-muted)' }}>
          <AlertTriangle size={14} style={{ display: 'inline', verticalAlign: '-2px' }} /> Results are based on community reports and may not be complete.
          Not finding something doesn&apos;t mean it&apos;s safe.
        </p>
      </div>
    </main>
  );
}
