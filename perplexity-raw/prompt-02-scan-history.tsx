// PERPLEXITY RAW — Prompt 2: Scan History Component
// Status: SAVED, PARTIAL — need rest of component
// File: src/components/ScanHistory.tsx

'use client';

import { useEffect, useMemo, useState } from 'react';

type ScanType = 'website' | 'message' | 'phone' | 'crypto' | 'romance';
type RiskLevel = 'low' | 'medium' | 'high';

export type ScanHistoryItem = {
  id: string;
  type: ScanType;
  input: string;
  riskLevel: RiskLevel;
  createdAt: string; // ISO string
};

type ScanHistoryProps = {
  onRescan?: (item: ScanHistoryItem) => void;
  hideClearAll?: boolean;
};

const STORAGE_KEY = 'trustchekr_scan_history_v1';
const MAX_ITEMS = 50;

const typeIcon: Record<ScanType, string> = {
  website: '🌐',
  message: '💬',
  phone: '📱',
  crypto: '🔗',
  romance: '❤️',
};

const riskColors: Record<RiskLevel, { bg: string; text: string }> = {
  low: { bg: 'rgba(16, 185, 129, 0.12)', text: '#059669' },
  medium: { bg: 'rgba(245, 158, 11, 0.12)', text: '#d97706' },
  high: { bg: 'rgba(239, 68, 68, 0.12)', text: '#dc2626' },
};

function safeLoadHistory(): ScanHistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ScanHistoryItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed.slice(0, MAX_ITEMS);
  } catch {
    return [];
  }
}

// NOTE: Rest of component was cut off — need the full JSX return,
// filter/search, clear history, CSV export, remove per-row, re-scan click
