'use client';

import { useEffect, useState } from 'react';

const BASE_AMOUNT_2025 = 530_000_000;
const RATE_PER_SECOND = 16.8; // $530M / 365 / 24 / 60 / 60

function getSecondsSinceJan1_2026(): number {
  const start = new Date('2026-01-01T00:00:00Z').getTime();
  return Math.max(0, Math.floor((Date.now() - start) / 1000));
}

function formatCAD(amount: number): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function ScamCostTicker() {
  const [amount, setAmount] = useState(() => BASE_AMOUNT_2025 + getSecondsSinceJan1_2026() * RATE_PER_SECOND);

  useEffect(() => {
    const interval = setInterval(() => {
      setAmount((prev) => prev + RATE_PER_SECOND);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="text-center p-4 rounded-xl"
      style={{ background: 'var(--tc-surface)', border: '1px solid var(--tc-border)' }}
    >
      <p
        className="text-3xl sm:text-4xl font-extrabold tabular-nums"
        style={{ color: '#b91c1c', fontVariantNumeric: 'tabular-nums' }}
      >
        {formatCAD(amount)}
      </p>
      <p className="text-sm mt-1" style={{ color: 'var(--tc-text-muted)' }}>
        Estimated losses to fraud in Canada in 2026 — and counting.
      </p>
      <p className="text-xs mt-1" style={{ color: 'var(--tc-text-muted)', opacity: 0.7 }}>
        Based on CAFC 2025 annual report. Only ~5-10% of fraud is reported.
      </p>
    </div>
  );
}
