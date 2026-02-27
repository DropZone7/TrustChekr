'use client';

export function ScamCostTicker() {
  return (
    <div
      className="text-center p-4 rounded-xl"
      style={{ background: 'var(--tc-surface)', border: '1px solid var(--tc-border)' }}
    >
      <p
        className="text-3xl sm:text-4xl font-extrabold"
        style={{ color: '#b91c1c' }}
      >
        $569 Million
      </p>
      <p className="text-sm mt-1" style={{ color: 'var(--tc-text-muted)' }}>
        Lost to fraud in Canada in 2024 — and only 5-10% of victims report it.
      </p>
      <p className="text-xs mt-1" style={{ color: 'var(--tc-text-muted)', opacity: 0.7 }}>
        Source: Canadian Anti-Fraud Centre 2024 Annual Report
      </p>
    </div>
  );
}
