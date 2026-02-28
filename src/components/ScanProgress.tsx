'use client';

import { useState, useEffect } from 'react';

const steps = [
  { emoji: 'Checking', text: 'Analyzing patterns…' },
  { emoji: '🌐', text: 'Checking security databases…' },
  { emoji: 'Scanning', text: 'Running risk assessment…' },
  { emoji: '📋', text: 'Preparing your report…' },
];

export function ScanProgress() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep(s => (s < steps.length - 1 ? s + 1 : s));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 py-12">
      {/* Animated spinner */}
      <div style={{ position: 'relative', width: '64px', height: '64px' }}>
        <div
          className="animate-spin"
          style={{
            width: '64px', height: '64px', borderRadius: '50%',
            border: '4px solid var(--tc-primary-soft)',
            borderTopColor: 'var(--tc-primary)',
          }}
        />
        <span style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)', fontSize: '1.5rem',
        }}>
          {steps[step].emoji}
        </span>
      </div>

      {/* Step text */}
      <h2 className="text-xl font-semibold" style={{ color: 'var(--tc-primary)' }}>
        {steps[step].text}
      </h2>

      {/* Progress dots */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {steps.map((_, i) => (
          <div key={i} style={{
            width: '10px', height: '10px', borderRadius: '50%',
            background: i <= step ? 'var(--tc-primary)' : 'var(--tc-border)',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>

      <p style={{ color: 'var(--tc-text-muted)', fontSize: '0.9rem' }}>
        Your information stays private. We never store what you paste.
      </p>
    </div>
  );
}
