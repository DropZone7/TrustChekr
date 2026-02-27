'use client';

import { useState, useEffect } from 'react';
import { riskConfig } from '@/lib/types';
import type { RiskLevel } from '@/lib/types';

type HistoryItem = {
  input: string;
  type: string;
  riskLevel: RiskLevel;
  date: string;
};

const MAX_HISTORY = 10;
const STORAGE_KEY = 'tc_scan_history';

export function addToHistory(input: string, type: string, riskLevel: RiskLevel) {
  try {
    const existing: HistoryItem[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const item: HistoryItem = {
      input: input.length > 80 ? input.slice(0, 80) + '…' : input,
      type, riskLevel,
      date: new Date().toLocaleDateString('en-CA'),
    };
    const updated = [item, ...existing.filter(h => h.input !== item.input)].slice(0, MAX_HISTORY);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch { /* localStorage unavailable */ }
}

export function ScanHistory({ onRescan }: { onRescan: (type: string, input: string) => void }) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      setHistory(stored);
    } catch { /* */ }
  }, []);

  if (history.length === 0) return null;

  return (
    <div style={{ marginTop: '0.5rem' }}>
      <button
        onClick={() => setShow(!show)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--tc-text-muted)', fontSize: '0.85rem',
          textDecoration: 'underline', padding: 0,
        }}
      >
        {show ? 'Hide' : 'Show'} recent checks ({history.length})
      </button>

      {show && (
        <div style={{
          marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem',
        }}>
          {history.map((item, i) => {
            const risk = riskConfig[item.riskLevel];
            return (
              <button
                key={i}
                onClick={() => onRescan(item.type, item.input)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.6rem 0.75rem', borderRadius: '8px',
                  border: '1px solid var(--tc-border)', background: 'var(--tc-surface)',
                  cursor: 'pointer', textAlign: 'left', width: '100%',
                }}
              >
                <span style={{
                  width: '10px', height: '10px', borderRadius: '50%',
                  background: risk?.color ?? 'var(--tc-border)', flexShrink: 0,
                }} />
                <span style={{ flex: 1, fontSize: '0.85rem', color: 'var(--tc-text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.input}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--tc-text-muted)', flexShrink: 0 }}>
                  {item.date}
                </span>
              </button>
            );
          })}
          <button
            onClick={() => { localStorage.removeItem(STORAGE_KEY); setHistory([]); setShow(false); }}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--tc-text-muted)', fontSize: '0.75rem',
              textDecoration: 'underline', padding: '0.25rem 0',
            }}
          >
            Clear history
          </button>
        </div>
      )}
    </div>
  );
}
