'use client';

import { useState, FormEvent } from 'react';

type Props = {
  sourcePage: 'scam_detail' | 'academy_module' | 'report_page';
  sourceRef: string;
};

export function ReportForm({ sourcePage, sourceRef }: Props) {
  const [email, setEmail] = useState('');
  const [type, setType] = useState<'suspected_scam' | 'feedback'>('suspected_scam');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/user-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source_page: sourcePage,
          source_ref: sourceRef,
          reporter_email: email || undefined,
          report_type: type,
          message,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to submit report');
      }
      setSubmitted(true);
      setMessage('');
    } catch (err: any) {
      setError(err?.message ?? 'Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-xl border-2 p-4 text-center" style={{ borderColor: 'var(--tc-safe)', background: '#eafaf1' }}>
        <p className="text-lg mb-1">✅</p>
        <p className="font-semibold" style={{ color: 'var(--tc-safe)' }}>Thank you — your report has been received.</p>
        <p className="text-sm mt-1" style={{ color: 'var(--tc-text-muted)' }}>
          We review every submission. Your input helps protect others.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-xl border p-4" style={{ borderColor: 'var(--tc-border)', background: 'var(--tc-surface)' }}>
      <h3 className="font-semibold" style={{ color: 'var(--tc-text-main)' }}>
        Report a scam or give feedback
      </h3>

      <div className="flex gap-4 text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            value="suspected_scam"
            checked={type === 'suspected_scam'}
            onChange={() => setType('suspected_scam')}
          />
          <span>Suspected scam</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            value="feedback"
            checked={type === 'feedback'}
            onChange={() => setType('feedback')}
          />
          <span>Feedback</span>
        </label>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium" style={{ color: 'var(--tc-text-main)' }}>
          Your email (optional)
        </label>
        <input
          type="email"
          className="w-full rounded-lg border px-3 py-2 text-base"
          style={{ borderColor: 'var(--tc-border)' }}
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium" style={{ color: 'var(--tc-text-main)' }}>
          Tell us what happened *
        </label>
        <textarea
          className="w-full rounded-lg border px-3 py-2 text-base"
          style={{ borderColor: 'var(--tc-border)' }}
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          placeholder="Describe the scam you encountered or share your feedback..."
        />
      </div>

      {error && (
        <p className="text-sm" style={{ color: 'var(--tc-danger, #e74c3c)' }}>{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting || !message.trim()}
        className="w-full py-3 rounded-xl font-semibold cursor-pointer disabled:opacity-50"
        style={{ background: 'var(--tc-primary)', color: 'white' }}
      >
        {submitting ? 'Sending…' : 'Submit Report'}
      </button>

      <p className="text-xs text-center" style={{ color: 'var(--tc-text-muted)' }}>
        Anonymous by default. We never share your email. <a href="/privacy" className="underline">Privacy Policy</a>
      </p>
    </form>
  );
}
