'use client';

import { useRouter } from 'next/navigation';

export function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      style={{
        background: 'none',
        border: 'none',
        padding: '0',
        cursor: 'pointer',
        color: 'var(--tc-text-muted)',
        fontSize: '0.85rem',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        marginBottom: '1rem',
      }}
    >
      ← Back
    </button>
  );
}
