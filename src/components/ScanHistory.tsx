'use client';

import { useEffect, useMemo, useState } from 'react';

type ScanType = 'website' | 'message' | 'phone' | 'crypto' | 'romance' | 'other';
type HistoryRiskLevel = 'low' | 'medium' | 'high';

export type ScanHistoryItem = {
  id: string;
  type: ScanType;
  input: string;
  riskLevel: HistoryRiskLevel;
  createdAt: string;
};

const STORAGE_KEY = 'trustchekr_scan_history_v1';
const MAX_ITEMS = 50;

const typeIcon: Record<string, string> = {
  website: '🌐', message: '💬', phone: '📱', crypto: '🔗', romance: '❤️', other: '❓',
};

const riskColors: Record<HistoryRiskLevel, { bg: string; text: string; label: string }> = {
  low: { bg: 'rgba(16,185,129,0.12)', text: '#059669', label: 'Low Risk' },
  medium: { bg: 'rgba(245,158,11,0.12)', text: '#d97706', label: 'Suspicious' },
  high: { bg: 'rgba(239,68,68,0.12)', text: '#dc2626', label: 'High Risk' },
};

function loadHistory(): ScanHistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.slice(0, MAX_ITEMS) : [];
  } catch { return []; }
}

function saveHistory(items: ScanHistoryItem[]) {
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_ITEMS))); } catch { /* ignore */ }
}

/** Call this from ScanForm after a successful scan to add to history */
export function addToScanHistory(item: Omit<ScanHistoryItem, 'id' | 'createdAt'>) {
  if (typeof window === 'undefined') return;
  const entry: ScanHistoryItem = { ...item, id: `sh-${Date.now()}`, createdAt: new Date().toISOString() };
  const existing = loadHistory();
  saveHistory([entry, ...existing]);
}

/** Compat alias used by homepage */
export function addToHistory(input: string, type: string, riskLevel: string) {
  const mapped: HistoryRiskLevel =
    riskLevel === 'safe' ? 'low' :
    riskLevel === 'suspicious' ? 'medium' :
    'high';
  addToScanHistory({ type: type as ScanType, input, riskLevel: mapped });
}



export function ScanHistory({ onRescan }: { onRescan?: (input: string, type: string) => void }) {
  const [items, setItems] = useState<ScanHistoryItem[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<ScanType | 'all'>('all');
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => { setItems(loadHistory()); }, []);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesType = typeFilter === 'all' || item.type === typeFilter;
      const matchesSearch = !search.trim() || item.input.toLowerCase().includes(search.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [items, search, typeFilter]);

  const handleClear = () => {
    if (!confirmClear) { setConfirmClear(true); return; }
    setItems([]);
    saveHistory([]);
    setConfirmClear(false);
  };

  const handleRemove = (id: string) => {
    const next = items.filter((i) => i.id !== id);
    setItems(next);
    saveHistory(next);
  };

  const exportCsv = () => {
    if (!items.length) return;
    const lines = ['Type,Input,Risk Level,Date'];
    for (const item of items) {
      lines.push(`${item.type},"${item.input.replace(/"/g, '""')}",${item.riskLevel},${item.createdAt}`);
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'trustchekr-scan-history.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString(undefined, { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  const truncate = (text: string, max = 60) => text.length <= max ? text : text.slice(0, max - 1) + '…';

  if (items.length === 0) return null;

  return (
    <section style={{ marginTop: '1.5rem', borderRadius: '16px', border: '1px solid var(--tc-border)', padding: '1rem', backgroundColor: 'var(--tc-surface)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: 'var(--tc-primary)' }}>Recent Scans</h2>
        <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem' }}>
          <button type="button" onClick={exportCsv} style={{ background: 'none', border: '1px solid var(--tc-border)', borderRadius: '999px', padding: '0.25rem 0.6rem', cursor: 'pointer', color: 'var(--tc-text-muted)' }}>
            Export CSV
          </button>
          <button type="button" onClick={handleClear} style={{ background: 'none', border: '1px solid var(--tc-border)', borderRadius: '999px', padding: '0.25rem 0.6rem', cursor: 'pointer', color: confirmClear ? '#dc2626' : 'var(--tc-text-muted)' }}>
            {confirmClear ? 'Confirm clear?' : 'Clear all'}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search scans…" style={{ flex: 1, minWidth: '140px', borderRadius: '999px', border: '1px solid var(--tc-border)', padding: '0.35rem 0.65rem', fontSize: '0.85rem' }} />
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as any)} style={{ borderRadius: '999px', border: '1px solid var(--tc-border)', padding: '0.35rem 0.65rem', fontSize: '0.85rem' }}>
          <option value="all">All types</option>
          <option value="website">🌐 Website</option>
          <option value="message">💬 Message</option>
          <option value="phone">📱 Phone</option>
          <option value="crypto">🔗 Crypto</option>
          <option value="romance">❤️ Romance</option>
          <option value="other">❓ Other</option>
        </select>
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {filtered.length === 0 && (
          <p style={{ fontSize: '0.9rem', color: 'var(--tc-text-muted)', textAlign: 'center', padding: '0.5rem' }}>No matching scans found.</p>
        )}
        {filtered.map((item) => {
          const risk = riskColors[item.riskLevel] ?? riskColors.low;
          return (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 0.6rem', borderRadius: '10px', border: '1px solid var(--tc-border)', fontSize: '0.9rem' }}>
              <span style={{ fontSize: '1.1rem' }}>{typeIcon[item.type] ?? '❓'}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{truncate(item.input)}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--tc-text-muted)' }}>{formatDate(item.createdAt)}</div>
              </div>
              <span style={{ borderRadius: '999px', padding: '0.12rem 0.5rem', fontSize: '0.75rem', fontWeight: 600, backgroundColor: risk.bg, color: risk.text, whiteSpace: 'nowrap' }}>
                {risk.label}
              </span>
              {onRescan && (
                <button type="button" onClick={() => onRescan(item.input, item.type)} title="Re-scan" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--tc-primary)' }}>🔄</button>
              )}
              <button type="button" onClick={() => handleRemove(item.id)} title="Remove" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--tc-text-muted)' }}>✕</button>
            </div>
          );
        })}
      </div>

      <p style={{ margin: '0.5rem 0 0', fontSize: '0.75rem', color: 'var(--tc-text-muted)' }}>
        Stored in your browser only — not sent anywhere. Up to 50 entries.
      </p>
    </section>
  );
}
