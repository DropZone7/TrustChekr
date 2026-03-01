'use client';

import { useState } from 'react';

export function AcademySuggestionBox() {
  const [text, setText] = useState('');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim() || sending) return;
    setSending(true);
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'academy_suggestion',
          message: text.trim(),
          page: '/academy',
        }),
      });
      setSent(true);
      setText('');
    } catch {
      // Silently fail — we don't want to bother the user
      setSent(true);
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="text-sm text-center py-3" style={{ color: 'var(--tc-text-muted)' }}>
        Thanks for your suggestion! We read every one. 🙌
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={2}
        placeholder="Suggest a topic, share a scam you've seen, or point us to useful research..."
        style={{
          flex: 1,
          borderRadius: '12px',
          border: '1px solid var(--tc-border)',
          backgroundColor: 'var(--tc-bg, #0a0a0a)',
          padding: '0.6rem 0.75rem',
          fontSize: '0.85rem',
          color: 'var(--tc-text-main)',
          resize: 'none',
          outline: 'none',
        }}
      />
      <button
        onClick={handleSubmit}
        disabled={!text.trim() || sending}
        style={{
          borderRadius: '12px',
          border: 'none',
          backgroundColor: text.trim() ? 'var(--tc-primary)' : 'var(--tc-border)',
          color: '#fff',
          padding: '0.6rem 1rem',
          fontSize: '0.85rem',
          fontWeight: 600,
          cursor: text.trim() ? 'pointer' : 'default',
          opacity: text.trim() ? 1 : 0.4,
          whiteSpace: 'nowrap',
        }}
      >
        {sending ? 'Sending...' : 'Send'}
      </button>
    </div>
  );
}
