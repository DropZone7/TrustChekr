'use client';

import { FormEvent, useEffect, useState } from 'react';

type Status = 'idle' | 'loading' | 'success' | 'error';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (status === 'success' || status === 'error') {
      const timer = setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === 'loading') return;

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data?.success) {
        setStatus('success');
        setMessage(data.message ?? "You're subscribed!");
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data?.error ?? 'Something went wrong. Please try again in a moment.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  const isLoading = status === 'loading';

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        maxWidth: '480px',
        width: '100%',
      }}
    >
      <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          style={{
            flex: 1,
            border: '2px solid var(--tc-border)',
            borderRadius: '8px',
            padding: '12px',
            fontSize: '0.95rem',
            outline: 'none',
            color: 'var(--tc-text-main)',
            backgroundColor: 'var(--tc-surface)',
          }}
        />
        <button
          type="submit"
          disabled={isLoading}
          style={{
            borderRadius: '8px',
            padding: '12px 16px',
            border: 'none',
            cursor: isLoading ? 'default' : 'pointer',
            backgroundColor: '#ffffff',
            color: 'var(--tc-primary)',
            fontWeight: 600,
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '120px',
            opacity: isLoading ? 0.8 : 1,
          }}
        >
          {isLoading ? '...' : 'Subscribe'}
        </button>
      </div>

      {status === 'success' && message && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#16a34a', fontSize: '0.9rem', fontWeight: 500 }}>
          <span>✅</span>
          <span>{message}</span>
        </div>
      )}

      {status === 'error' && message && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#dc2626', fontSize: '0.9rem', fontWeight: 500 }}>
          <span>⚠️</span>
          <span>{message}</span>
        </div>
      )}
    </form>
  );
}
