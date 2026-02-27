'use client';

import { useState, useEffect, useCallback, createContext, useContext } from 'react';

type ToastType = 'success' | 'error' | 'info';
type Toast = { id: number; message: string; type: ToastType };

const ToastContext = createContext<(message: string, type?: ToastType) => void>(() => {});

export function useToast() { return useContext(ToastContext); }

let nextId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = nextId++;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const colors: Record<ToastType, string> = {
    success: '#16a34a',
    error: '#dc2626',
    info: 'var(--tc-primary)',
  };

  const emojis: Record<ToastType, string> = {
    success: '✅',
    error: '⚠️',
    info: 'ℹ️',
  };

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            background: 'white', border: `2px solid ${colors[t.type]}`, borderRadius: '12px',
            padding: '0.75rem 1.25rem', boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            fontSize: '0.9rem', fontWeight: 500, color: 'var(--tc-text-main)',
            animation: 'slideIn 0.3s ease-out',
            maxWidth: '320px',
          }}>
            {emojis[t.type]} {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
