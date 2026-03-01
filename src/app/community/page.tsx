'use client';

import { useState, useEffect, useCallback } from 'react';
import { Phone, Landmark, Building2, Monitor, HeartCrack, AlertTriangle } from 'lucide-react';

const SCAM_ICON_MAP: Record<string, React.ComponentType<any>> = {
  phone_scam: Phone,
  cra_impersonation: Landmark,
  bank_impersonation: Building2,
  tech_support: Monitor,
  romance_scam: HeartCrack,
  other: AlertTriangle,
};

interface ScamReport {
  id: string;
  scam_type: string;
  message: string;
  province?: string;
  upvotes: number;
  created_at: string;
  verified: boolean;
}

const SCAM_TYPE_LABELS: Record<string, { emoji: string; label: string }> = {
  phone_scam: { emoji: '📞', label: 'Phone Scam' },
  cra_impersonation: { emoji: '🏛️', label: 'CRA Impersonation' },
  bank_impersonation: { emoji: '🏦', label: 'Bank Impersonation' },
  tech_support: { emoji: '💻', label: 'Tech Support' },
  romance_scam: { emoji: '💔', label: 'Romance Scam' },
  crypto_scam: { emoji: '₿', label: 'Crypto Scam' },
  phishing: { emoji: '🎣', label: 'Phishing' },
  investment_fraud: { emoji: '📈', label: 'Investment Fraud' },
  other: { emoji: '⚠️', label: 'Other' },
};

const PROVINCES = ['ON', 'QC', 'BC', 'AB', 'MB', 'SK', 'NS', 'NB', 'NL', 'PE', 'NT', 'YT', 'NU'];

export default function CommunityPage() {
  const [reports, setReports] = useState<ScamReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formType, setFormType] = useState('phone_scam');
  const [formMessage, setFormMessage] = useState('');
  const [formProvince, setFormProvince] = useState('');
  const [formEntities, setFormEntities] = useState([{ type: 'phone', value: '' }]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const fetchReports = useCallback(async (query?: string) => {
    setLoading(true);
    try {
      const url = query ? `/api/community/reports?q=${encodeURIComponent(query)}` : '/api/community/reports';
      const res = await fetch(url);
      const data = await res.json();
      setReports(data.reports ?? []);
    } catch { setReports([]); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    fetchReports(searchQuery || undefined);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    // Client-side rate limit
    const lastSubmit = localStorage.getItem('tc-last-report');
    if (lastSubmit && Date.now() - parseInt(lastSubmit) < 300000) { // 5 min cooldown
      alert('Please wait a few minutes between reports.');
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/community/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scam_type: formType,
          message: formMessage,
          province: formProvince || undefined,
          entities: formEntities.filter((e) => e.value.trim()),
        }),
      });

      if (res.ok) {
        localStorage.setItem('tc-last-report', Date.now().toString());
        setSubmitted(true);
        setFormMessage('');
        setFormEntities([{ type: 'phone', value: '' }]);
        setShowForm(false);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to submit report');
      }
    } catch { alert('Network error — try again'); }
    setSubmitting(false);
  }

  function addEntity() {
    if (formEntities.length < 5) {
      setFormEntities([...formEntities, { type: 'phone', value: '' }]);
    }
  }

  function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString('en-CA');
  }

  return (
    <main className="min-h-screen p-4 sm:p-8 flex flex-col items-center" style={{ background: 'var(--tc-bg)' }}>
      <div className="w-full max-w-2xl flex flex-col gap-5">
        <div className="text-center">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--tc-primary)' }}>
            Community Scam Reports
          </h1>
          <p className="mt-2" style={{ color: 'var(--tc-text-muted)' }}>
            Real reports from Canadians. See what scams are active and help warn others.
          </p>
        </div>

        {/* Search + Report buttons */}
        <div className="flex gap-2">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search scam reports..."
              className="flex-1 px-3 py-2 rounded-lg text-sm"
              style={{ border: '1px solid var(--tc-border)' }}
            />
            <button type="submit" className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: 'var(--tc-primary)' }}>
              
            </button>
          </form>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
            style={{ background: showForm ? 'var(--tc-text-muted)' : '#dc2626' }}
          >
            {showForm ? '✕ Cancel' : '+ Report'}
          </button>
        </div>

        {/* Success message */}
        {submitted && (
          <div className="p-3 rounded-xl text-center" style={{ background: '#eafaf1', border: '1px solid var(--tc-safe)' }}>
            <p className="font-semibold" style={{ color: 'var(--tc-safe)' }}>
              Report submitted. It will appear after verification. Thank you for helping protect others.
            </p>
          </div>
        )}

        {/* Report form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="p-4 rounded-xl flex flex-col gap-3" style={{ background: 'var(--tc-surface)', border: '1px solid var(--tc-border)' }}>
            <h3 className="font-bold" style={{ color: 'var(--tc-primary)' }}>Report a Scam</h3>

            <div>
              <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--tc-text-muted)' }}>Scam Type</label>
              <select value={formType} onChange={(e) => setFormType(e.target.value)} className="w-full px-3 py-2 rounded-lg text-sm" style={{ border: '1px solid var(--tc-border)' }}>
                {Object.entries(SCAM_TYPE_LABELS).map(([key, { emoji, label }]) => (
                  <option key={key} value={key}>{emoji} {label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--tc-text-muted)' }}>What happened? (be specific, don't include personal info)</label>
              <textarea
                value={formMessage}
                onChange={(e) => setFormMessage(e.target.value)}
                rows={4}
                maxLength={2000}
                required
                className="w-full px-3 py-2 rounded-lg text-sm"
                style={{ border: '1px solid var(--tc-border)', resize: 'vertical' }}
                placeholder="Describe the scam — what did they say/send? How did they contact you?"
              />
              <p className="text-xs text-right" style={{ color: 'var(--tc-text-muted)' }}>{formMessage.length}/2000</p>
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--tc-text-muted)' }}>Province (optional)</label>
              <select value={formProvince} onChange={(e) => setFormProvince(e.target.value)} className="w-full px-3 py-2 rounded-lg text-sm" style={{ border: '1px solid var(--tc-border)' }}>
                <option value="">Select province</option>
                {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            {/* Entities */}
            <div>
              <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--tc-text-muted)' }}>Suspicious phone/email/URL (optional)</label>
              {formEntities.map((ent, i) => (
                <div key={i} className="flex gap-2 mb-1">
                  <select
                    value={ent.type}
                    onChange={(e) => {
                      const updated = [...formEntities];
                      updated[i].type = e.target.value;
                      setFormEntities(updated);
                    }}
                    className="px-2 py-1 rounded text-sm"
                    style={{ border: '1px solid var(--tc-border)', width: '110px' }}
                  >
                    <option value="phone">Phone</option>
                    <option value="email">Email</option>
                    <option value="url">URL</option>
                    <option value="crypto_wallet">Wallet</option>
                  </select>
                  <input
                    type="text"
                    value={ent.value}
                    onChange={(e) => {
                      const updated = [...formEntities];
                      updated[i].value = e.target.value;
                      setFormEntities(updated);
                    }}
                    placeholder="Enter the suspicious info"
                    className="flex-1 px-2 py-1 rounded text-sm"
                    style={{ border: '1px solid var(--tc-border)' }}
                  />
                </div>
              ))}
              {formEntities.length < 5 && (
                <button type="button" onClick={addEntity} className="text-xs mt-1" style={{ color: 'var(--tc-primary)' }}>
                  + Add another
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting || formMessage.trim().length < 10}
              className="px-4 py-2 rounded-lg font-semibold text-white"
              style={{ background: formMessage.trim().length >= 10 ? '#dc2626' : 'var(--tc-border)', cursor: formMessage.trim().length >= 10 ? 'pointer' : 'not-allowed' }}
            >
              {submitting ? 'Submitting...' : 'Submit Report'}
            </button>

            <p className="text-xs" style={{ color: 'var(--tc-text-muted)' }}>
              Reports are reviewed before publishing. Don't include personal info about yourself.
            </p>
          </form>
        )}

        {/* Reports feed */}
        {loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 rounded-full animate-spin mx-auto" style={{ borderColor: 'var(--tc-primary-soft)', borderTopColor: 'var(--tc-primary)' }} />
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-8 rounded-xl" style={{ background: 'var(--tc-surface)', border: '1px solid var(--tc-border)' }}>
            <p className="text-lg"></p>
            <p className="font-semibold" style={{ color: 'var(--tc-text-muted)' }}>
              {searchQuery ? 'No reports match your search' : 'No verified reports yet — be the first to report a scam!'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {reports.map((report) => {
              const typeInfo = SCAM_TYPE_LABELS[report.scam_type] ?? { emoji: '⚠️', label: report.scam_type };
              return (
                <div key={report.id} className="p-4 rounded-xl" style={{ background: 'var(--tc-surface)', border: '1px solid var(--tc-border)' }}>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1" style={{ background: 'var(--tc-primary-soft)', color: 'var(--tc-primary)' }}>
                      {(() => { const Icon = SCAM_ICON_MAP[report.scam_type]; return Icon ? <Icon size={12} strokeWidth={1.75} /> : null; })()}
                      {typeInfo.label}
                    </span>
                    <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--tc-text-muted)' }}>
                      {report.province && <span>{report.province}</span>}
                      <span>{timeAgo(report.created_at)}</span>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--tc-text-main)' }}>
                    {report.message.length > 300 ? report.message.slice(0, 300) + '...' : report.message}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs" style={{ color: 'var(--tc-text-muted)' }}>
                      {report.upvotes} {report.upvotes === 1 ? 'person' : 'people'} found this helpful
                    </span>
                    {report.verified && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: '#eafaf1', color: 'var(--tc-safe)' }}>
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CTA */}
        <div className="text-center p-4 rounded-xl" style={{ background: 'var(--tc-primary-soft)' }}>
          <p className="text-sm" style={{ color: 'var(--tc-primary)' }}>
            Think you've been targeted? <a href="/" className="font-bold underline">Scan it here</a> for a full analysis, or <a href="/report" className="font-bold underline">file a detailed report</a>.
          </p>
        </div>
      </div>
    </main>
  );
}
