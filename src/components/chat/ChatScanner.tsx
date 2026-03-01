'use client';

import { useEffect, useRef, useState } from 'react';

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
  riskLevel?: 'low' | 'medium' | 'high';
};

type AnalyzeResponse = {
  reply: string;
  riskLevel?: 'low' | 'medium' | 'high';
  riskScore?: number;
  signals?: string[];
};

const STORAGE_KEY = 'trustchekr_chat_history_v1';

const RISK_COLORS: Record<string, string> = {
  low: '#22c55e',
  medium: '#eab308',
  high: '#ef4444',
};

const SUGGESTIONS = [
  "Someone texted me saying I owe money to the CRA",
  "I got a call from my bank's fraud department",
  "Someone I met on Tinder wants me to invest in crypto",
  "Is this email from Amazon real?",
];

export function ChatScanner() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [typingDots, setTypingDots] = useState('');
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Load history
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ChatMessage[];
        if (Array.isArray(parsed)) setMessages(parsed);
      }
    } catch { /* ignore */ }
  }, []);

  // Save history
  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages)); } catch { /* ignore */ }
  }, [messages]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, sending]);

  // Typing animation
  useEffect(() => {
    if (!sending) return;
    const interval = setInterval(() => {
      setTypingDots(d => d.length >= 3 ? '' : d + '.');
    }, 400);
    return () => clearInterval(interval);
  }, [sending]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || sending) return;
    setError(null);
    setSending(true);

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      createdAt: new Date().toISOString(),
    };
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
      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: json.reply,
        createdAt: new Date().toISOString(),
        riskLevel: json.riskLevel,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setError('We could not analyze that right now. Please try again in a moment.');
    } finally {
      setSending(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const clearChat = () => {
    setMessages([]);
    window.localStorage.removeItem(STORAGE_KEY);
  };

  const isEmpty = messages.length === 0;

  return (
    <section style={{
      borderRadius: '20px',
      border: '1px solid rgba(255,0,0,0.15)',
      backgroundColor: '#0a0a0a',
      display: 'flex',
      flexDirection: 'column',
      height: '70vh',
      maxHeight: '600px',
      minHeight: '400px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Watermark logo */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        opacity: 0.04,
        pointerEvents: 'none',
        zIndex: 0,
        width: '280px',
        height: '280px',
        backgroundImage: 'url(/logo.png)',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }} />

      {/* Header bar */}
      <div style={{
        padding: '0.75rem 1rem',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(10,10,10,0.9)',
        zIndex: 2,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#A40000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.85rem',
          }}>
            🛡️
          </div>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>TrustChekr AI</div>
            <div style={{ fontSize: '0.7rem', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{
                width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e',
                display: 'inline-block',
                animation: 'pulse-dot 2s ease-in-out infinite',
              }} />
              Online — ready to help
            </div>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            type="button"
            onClick={clearChat}
            style={{
              fontSize: '0.75rem',
              color: 'rgba(255,255,255,0.4)',
              background: 'none',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              padding: '4px 10px',
              cursor: 'pointer',
            }}
          >
            Clear
          </button>
        )}
        <a
          href="https://t.me/TrustChekrbot"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: '0.7rem',
            color: 'rgba(255,255,255,0.4)',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          Also on Telegram →
        </a>
      </div>

      {/* Messages area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1rem',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Empty state */}
        {isEmpty && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            gap: '1.5rem',
          }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', margin: '0 0 0.5rem' }}>
                Describe what happened
              </p>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', maxWidth: '360px', lineHeight: 1.5 }}>
                Paste a suspicious text, describe a phone call, or tell us about someone you met online.
                No judgement. We&apos;re here to help.
              </p>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.5rem',
              width: '100%',
              maxWidth: '440px',
            }}>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  style={{
                    padding: '0.6rem 0.75rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '0.78rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    lineHeight: 1.4,
                    transition: 'all 0.2s',
                  }}
                  onMouseOver={(e) => {
                    (e.target as HTMLElement).style.backgroundColor = 'rgba(164,0,0,0.15)';
                    (e.target as HTMLElement).style.borderColor = 'rgba(164,0,0,0.4)';
                  }}
                  onMouseOut={(e) => {
                    (e.target as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.03)';
                    (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)';
                  }}
                >
                  &ldquo;{s}&rdquo;
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat messages */}
        {messages.map((m) => (
          <div
            key={m.id}
            style={{
              display: 'flex',
              justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: '0.75rem',
              gap: '0.5rem',
              alignItems: 'flex-end',
            }}
          >
            {m.role === 'assistant' && (
              <div style={{
                width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#A40000',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem',
                flexShrink: 0,
              }}>
                🛡️
              </div>
            )}
            <div style={{
              maxWidth: '75%',
              borderRadius: m.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
              padding: '0.65rem 0.9rem',
              fontSize: '0.9rem',
              lineHeight: 1.55,
              backgroundColor: m.role === 'user'
                ? '#A40000'
                : 'rgba(255,255,255,0.07)',
              color: m.role === 'user' ? '#fff' : 'rgba(255,255,255,0.9)',
              whiteSpace: 'pre-wrap',
              borderLeft: m.role === 'assistant' && m.riskLevel
                ? `3px solid ${RISK_COLORS[m.riskLevel] || '#666'}`
                : undefined,
            }}>
              {m.content}
              {m.role === 'assistant' && m.riskLevel && (
                <div style={{
                  marginTop: '0.5rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  backgroundColor: `${RISK_COLORS[m.riskLevel]}20`,
                  color: RISK_COLORS[m.riskLevel],
                }}>
                  <span style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    backgroundColor: RISK_COLORS[m.riskLevel],
                  }} />
                  {m.riskLevel.toUpperCase()} RISK
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {sending && (
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end', marginBottom: '0.75rem' }}>
            <div style={{
              width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#A40000',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem',
              flexShrink: 0,
            }}>
              🛡️
            </div>
            <div style={{
              borderRadius: '20px 20px 20px 4px',
              padding: '0.65rem 0.9rem',
              backgroundColor: 'rgba(255,255,255,0.07)',
              color: 'rgba(255,255,255,0.5)',
              fontSize: '0.9rem',
            }}>
              Analyzing{typingDots}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div style={{
        padding: '0.75rem 1rem',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        backgroundColor: 'rgba(10,10,10,0.95)',
        zIndex: 2,
      }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Paste a suspicious text, email, or describe what happened..."
            style={{
              flex: 1,
              borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.12)',
              backgroundColor: 'rgba(255,255,255,0.05)',
              padding: '0.65rem 0.85rem',
              fontSize: '0.9rem',
              color: '#fff',
              resize: 'none',
              outline: 'none',
              maxHeight: '120px',
              lineHeight: 1.4,
            }}
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: sending || !input.trim() ? 'rgba(164,0,0,0.3)' : '#A40000',
              color: '#fff',
              cursor: sending || !input.trim() ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.1rem',
              flexShrink: 0,
              transition: 'all 0.2s',
            }}
          >
            ↑
          </button>
        </form>
        {error && (
          <p style={{ marginTop: '0.4rem', fontSize: '0.8rem', color: '#ef4444' }}>{error}</p>
        )}
        <p style={{
          margin: '0.4rem 0 0',
          fontSize: '0.7rem',
          color: 'rgba(255,255,255,0.25)',
          textAlign: 'center',
        }}>
          TrustChekr provides guidance, not guarantees. When in doubt, contact your bank directly.
        </p>
      </div>

      {/* CSS animation for the pulse dot */}
      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </section>
  );
}
