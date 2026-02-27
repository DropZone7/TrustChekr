'use client';

import React, { useState } from 'react';

type FeedbackWidgetProps = {
  scanType: string;
  riskLevel: string;
};

export function FeedbackWidget({ scanType, riskLevel }: FeedbackWidgetProps) {
  const [submitted, setSubmitted] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState('');
  const [sending, setSending] = useState(false);

  const submit = async (helpful: boolean, userComment?: string) => {
    setSending(true);
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          helpful,
          scan_type: scanType,
          risk_level: riskLevel,
          comment: userComment?.trim() || null,
        }),
      });
    } catch {
      // silent fail — feedback is optional
    }
    setSubmitted(true);
    setSending(false);
  };

  if (submitted) {
    return (
      <div style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--tc-border)', backgroundColor: 'var(--tc-surface)', textAlign: 'center', fontSize: '14px', color: 'var(--tc-text-muted)' }}>
        ✅ Thanks for your feedback — it helps us improve.
      </div>
    );
  }

  return (
    <div style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--tc-border)', backgroundColor: 'var(--tc-surface)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--tc-text-main)' }}>
        Was this result helpful?
      </p>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          type="button"
          disabled={sending}
          onClick={() => submit(true)}
          style={{
            padding: '8px 20px', borderRadius: '8px', border: '1px solid var(--tc-border)',
            backgroundColor: 'var(--tc-primary-soft)', color: 'var(--tc-text-main)',
            fontSize: '14px', cursor: 'pointer', fontWeight: 500,
          }}
        >
          👍 Yes
        </button>
        <button
          type="button"
          disabled={sending}
          onClick={() => setShowComment(true)}
          style={{
            padding: '8px 20px', borderRadius: '8px', border: '1px solid var(--tc-border)',
            backgroundColor: 'var(--tc-surface)', color: 'var(--tc-text-main)',
            fontSize: '14px', cursor: 'pointer', fontWeight: 500,
          }}
        >
          👎 No
        </button>
      </div>
      {showComment && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What could we improve? (optional)"
            maxLength={500}
            rows={2}
            style={{
              width: '100%', padding: '8px 10px', borderRadius: '8px',
              border: '1px solid var(--tc-border)', backgroundColor: 'var(--tc-bg)',
              color: 'var(--tc-text-main)', fontSize: '13px', resize: 'vertical',
              fontFamily: 'inherit',
            }}
          />
          <button
            type="button"
            disabled={sending}
            onClick={() => submit(false, comment)}
            style={{
              alignSelf: 'flex-start', padding: '6px 16px', borderRadius: '8px',
              border: '1px solid var(--tc-border)', backgroundColor: 'var(--tc-primary)',
              color: '#fff', fontSize: '13px', cursor: 'pointer', fontWeight: 500,
            }}
          >
            {sending ? 'Sending...' : 'Submit'}
          </button>
        </div>
      )}
    </div>
  );
}
