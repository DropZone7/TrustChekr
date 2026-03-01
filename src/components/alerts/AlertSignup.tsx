'use client';

import { useState } from 'react';
import { Shield, Check } from 'lucide-react';

const PROVINCES = [
  { code: 'AB', name: 'Alberta' }, { code: 'BC', name: 'British Columbia' },
  { code: 'MB', name: 'Manitoba' }, { code: 'NB', name: 'New Brunswick' },
  { code: 'NL', name: 'Newfoundland and Labrador' }, { code: 'NS', name: 'Nova Scotia' },
  { code: 'NT', name: 'Northwest Territories' }, { code: 'NU', name: 'Nunavut' },
  { code: 'ON', name: 'Ontario' }, { code: 'PE', name: 'Prince Edward Island' },
  { code: 'QC', name: 'Quebec' }, { code: 'SK', name: 'Saskatchewan' },
  { code: 'YT', name: 'Yukon' },
];

const CARRIERS = ['Rogers', 'Bell', 'Telus', 'Freedom', 'Koodo', 'Fido', 'Virgin Plus', 'Other'];
const BANKS = ['TD', 'RBC', 'Scotiabank', 'BMO', 'CIBC', 'Desjardins', 'National Bank', 'Credit Union', 'Other'];
const AGE_RANGES = ['18-30', '31-50', '51-65', '65+'];
const FREQUENCIES: { value: 'instant' | 'daily' | 'weekly'; label: string }[] = [
  { value: 'instant', label: 'Instant' },
  { value: 'daily', label: 'Daily Digest' },
  { value: 'weekly', label: 'Weekly Summary' },
];

export function AlertSignup() {
  const [province, setProvince] = useState('');
  const [carrier, setCarrier] = useState('');
  const [bank, setBank] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [email, setEmail] = useState('');
  const [frequency, setFrequency] = useState<'instant' | 'daily' | 'weekly'>('daily');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!province) { setError('Please select your province'); return; }
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/alerts/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          province,
          carrier: carrier || undefined,
          bank: bank || undefined,
          age_range: ageRange || undefined,
          email: email || undefined,
          frequency,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="p-6 rounded-xl text-center" style={{ background: 'var(--tc-surface)', border: '1px solid var(--tc-border)' }}>
        <Check size={48} style={{ color: '#22c55e', margin: '0 auto 12px' }} />
        <h3 className="text-lg font-bold" style={{ color: 'var(--tc-text-main)' }}>You&apos;re subscribed!</h3>
        <p className="mt-2 text-sm" style={{ color: 'var(--tc-text-muted)' }}>
          You&apos;ll receive {frequency} alerts about scams targeting your area.
        </p>
      </div>
    );
  }

  const selectStyle = {
    background: 'var(--tc-surface)',
    border: '1px solid var(--tc-border)',
    color: 'var(--tc-text-main)',
    padding: '10px 12px',
    borderRadius: '8px',
    width: '100%',
    fontSize: '0.875rem',
    minHeight: '44px',
  };

  return (
    <form onSubmit={handleSubmit} className="p-5 rounded-xl flex flex-col gap-4" style={{ background: 'var(--tc-surface)', border: '1px solid var(--tc-border)' }}>
      <h3 className="text-lg font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--tc-text-main)' }}>
        Get Scam Alerts
      </h3>

      <div>
        <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--tc-text-muted)' }}>Province / Territory *</label>
        <select value={province} onChange={(e) => setProvince(e.target.value)} style={selectStyle}>
          <option value="">Select...</option>
          {PROVINCES.map((p) => <option key={p.code} value={p.code}>{p.name}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--tc-text-muted)' }}>Carrier (optional)</label>
          <select value={carrier} onChange={(e) => setCarrier(e.target.value)} style={selectStyle}>
            <option value="">Any</option>
            {CARRIERS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--tc-text-muted)' }}>Bank (optional)</label>
          <select value={bank} onChange={(e) => setBank(e.target.value)} style={selectStyle}>
            <option value="">Any</option>
            {BANKS.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--tc-text-muted)' }}>Age Range (optional)</label>
        <select value={ageRange} onChange={(e) => setAgeRange(e.target.value)} style={selectStyle}>
          <option value="">Any</option>
          {AGE_RANGES.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>

      <div>
        <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--tc-text-muted)' }}>Email (for digest)</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          style={{ ...selectStyle, outline: 'none' }}
        />
      </div>

      <div>
        <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--tc-text-muted)' }}>Alert Frequency</label>
        <div className="flex gap-2">
          {FREQUENCIES.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFrequency(f.value)}
              className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: frequency === f.value ? 'var(--tc-primary)' : 'var(--tc-bg)',
                color: frequency === f.value ? 'white' : 'var(--tc-text-main)',
                border: `1px solid ${frequency === f.value ? 'var(--tc-primary)' : 'var(--tc-border)'}`,
                cursor: 'pointer',
                minHeight: '44px',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-sm" style={{ color: '#ef4444' }}>{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl font-semibold text-base"
        style={{
          background: 'var(--tc-primary)',
          color: 'white',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1,
          border: 'none',
          minHeight: '48px',
        }}
      >
        {loading ? 'Subscribing...' : 'Subscribe to Alerts'}
      </button>

      <div className="flex items-center gap-2 justify-center text-xs" style={{ color: 'var(--tc-text-muted)' }}>
        <Shield size={14} /> We never store your name or personal info
      </div>
    </form>
  );
}
