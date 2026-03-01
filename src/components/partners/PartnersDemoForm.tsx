'use client';

import { useState } from 'react';

type FormState = 'idle' | 'loading' | 'success' | 'error';

const USE_CASES = [
  'Credit union / Central 1 Forge',
  'Banking / fraud operations',
  'Telecom / carrier',
  'Police / law enforcement',
  'Consumer protection / regulator',
  'E-commerce / marketplace',
  'Other',
];

const inputStyle: React.CSSProperties = {
  width: '100%',
  borderRadius: '999px',
  border: '1px solid var(--tc-border)',
  padding: '0.6rem 0.75rem',
  fontSize: '0.95rem',
  backgroundColor: '#ffffff',
  color: 'var(--tc-text-main)',
};

export function PartnersDemoForm() {
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [email, setEmail] = useState('');
  const [useCase, setUseCase] = useState('');
  const [message, setMessage] = useState('');
  const [state, setState] = useState<FormState>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const canSubmit = name.trim() && organization.trim() && email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setState('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/partnerships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          organization: organization.trim(),
          email: email.trim(),
          useCase: useCase || 'Not specified',
          message: message.trim(),
        }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || 'Request failed');
      }

      setState('success');
    } catch (err: any) {
      setState('error');
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    }
  };

  if (state === 'success') {
    return (
      <div style={{ borderRadius: '20px', border: '2px solid #059669', backgroundColor: 'rgba(16,185,129,0.06)', padding: '1.5rem', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
        <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.2rem', fontWeight: 700, color: '#059669' }}>Request received!</h3>
        <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--tc-text-muted)' }}>
          We typically respond within 1–2 business days. Check your inbox at <strong>{email}</strong>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="tc-form-grid">
        <div>
          <label htmlFor="p-name" style={{ display: 'block', marginBottom: '0.2rem', fontSize: '0.9rem', fontWeight: 500 }}>Name *</label>
          <input id="p-name" type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" style={inputStyle} />
        </div>
        <div>
          <label htmlFor="p-org" style={{ display: 'block', marginBottom: '0.2rem', fontSize: '0.9rem', fontWeight: 500 }}>Organization *</label>
          <input id="p-org" type="text" required value={organization} onChange={(e) => setOrganization(e.target.value)} placeholder="Credit union, telecom, agency…" style={inputStyle} />
        </div>
      </div>

      <div className="tc-form-grid" style={{ marginTop: '0.75rem' }}>
        <div>
          <label htmlFor="p-email" style={{ display: 'block', marginBottom: '0.2rem', fontSize: '0.9rem', fontWeight: 500 }}>Work email *</label>
          <input id="p-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@organization.ca" style={inputStyle} />
        </div>
        <div>
          <label htmlFor="p-usecase" style={{ display: 'block', marginBottom: '0.2rem', fontSize: '0.9rem', fontWeight: 500 }}>Primary use case</label>
          <select id="p-usecase" value={useCase} onChange={(e) => setUseCase(e.target.value)} style={inputStyle}>
            <option value="">Select a use case</option>
            {USE_CASES.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
      </div>

      <div style={{ marginTop: '0.75rem' }}>
        <label htmlFor="p-message" style={{ display: 'block', marginBottom: '0.2rem', fontSize: '0.9rem', fontWeight: 500 }}>What would you like to explore?</label>
        <textarea id="p-message" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="For example: red-flagging e-Transfers over $3K, telecom call screening, or an RCMP / OPP pilot." style={{ width: '100%', borderRadius: '12px', border: '1px solid var(--tc-border)', padding: '0.6rem 0.75rem', fontSize: '0.95rem', resize: 'vertical' }} />
      </div>

      {state === 'error' && (
        <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem', color: '#dc2626' }}>{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={!canSubmit || state === 'loading'}
        style={{
          marginTop: '0.9rem',
          padding: '0.7rem 1.4rem',
          borderRadius: '999px',
          border: 'none',
          backgroundColor: canSubmit ? 'var(--tc-primary)' : '#9ca3af',
          color: '#ffffff',
          fontSize: '0.95rem',
          fontWeight: 600,
          cursor: canSubmit && state !== 'loading' ? 'pointer' : 'default',
          opacity: state === 'loading' ? 0.7 : 1,
        }}
      >
        {state === 'loading' ? 'Submitting…' : 'Submit request'}
      </button>

      <p style={{ margin: '0.5rem 0 0', fontSize: '0.8rem', color: 'var(--tc-text-muted)' }}>
        We typically respond within 1–2 business days. If it&apos;s urgent, mention that above.
      </p>
    </form>
  );
}
