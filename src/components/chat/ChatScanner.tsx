'use client';

import { useEffect, useRef, useState } from 'react';

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
};

type AnalyzeResponse = {
  reply: string;
  riskLevel?: 'low' | 'medium' | 'high';
  riskScore?: number;
  signals?: string[];
};

const STORAGE_KEY = 'trustchekr_chat_history_v1';

export function ChatScanner() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ChatMessage[];
        if (Array.isArray(parsed)) setMessages(parsed);
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages)); } catch { /* ignore */ }
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, sending]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;
    setError(null);
    setSending(true);

    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: 'user', content: text, createdAt: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    try {
      const res = await fetch('/api/chat/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: messages }),
      });
      if (!res.ok) throw new Error('Request failed');
      const json = (await res.json()) as AnalyzeResponse;
      const assistantMsg: ChatMessage = { id: `a-${Date.now()}`, role: 'assistant', content: json.reply, createdAt: new Date().toISOString() };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setError('We could not analyze that right now. Please try again in a moment.');
    } finally {
      setSending(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    window.localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <section style={{ borderRadius: '16px', border: '1px solid var(--tc-border)', backgroundColor: 'var(--tc-surface)', padding: '1rem', display: 'flex', flexDirection: 'column', minHeight: '420px', maxHeight: '70vh' }}>
      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.25rem', marginBottom: '0.75rem' }}>
        {messages.length === 0 && (
          <div style={{ fontSize: '0.95rem', color: 'var(--tc-text-muted)' }}>
            You can paste texts, emails, call scripts, or describe an online relationship. TrustChekr will highlight risks and suggest next steps, in plain language.
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: '0.5rem' }}>
            <div style={{
              maxWidth: '80%',
              borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              padding: '0.55rem 0.8rem',
              fontSize: '0.95rem',
              backgroundColor: m.role === 'user' ? 'rgba(26,82,118,0.08)' : '#f9fafb',
              color: 'var(--tc-text-main)',
              whiteSpace: 'pre-wrap',
            }}>
              {m.content}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit}>
        <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.9rem', color: 'var(--tc-text-muted)' }}>
          Describe what&apos;s happening. You can include texts, emails, or links.
        </label>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={3}
            placeholder='For example: Someone called saying they were from my bank and asked me to move money to a "safe" account.'
            style={{ flex: 1, borderRadius: '12px', border: '1px solid var(--tc-border)', padding: '0.6rem 0.75rem', fontSize: '0.95rem', resize: 'vertical' }}
          />
          <button type="submit" disabled={sending} style={{ alignSelf: 'stretch', minWidth: '90px', borderRadius: '999px', border: 'none', padding: '0.6rem 0.9rem', fontSize: '0.95rem', fontWeight: 600, backgroundColor: 'var(--tc-primary)', color: '#ffffff', cursor: sending ? 'default' : 'pointer', opacity: sending ? 0.7 : 1 }}>
            {sending ? 'Checking…' : 'Send'}
          </button>
        </div>
      </form>

      {error && <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#b91c1c' }}>{error}</p>}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.6rem' }}>
        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--tc-text-muted)' }}>
          This chat gives general guidance and cannot guarantee whether something is legitimate. When in doubt, contact your bank using a phone number from their official website.
        </p>
        {messages.length > 0 && (
          <button type="button" onClick={clearChat} style={{ fontSize: '0.8rem', color: 'var(--tc-text-muted)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', whiteSpace: 'nowrap', marginLeft: '0.5rem' }}>
            Clear chat
          </button>
        )}
      </div>
    </section>
  );
}
