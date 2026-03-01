'use client';

import { getRecommendations } from '@/lib/affiliates';

export function AffiliateRecommendations({ riskLevel, scanType }: { riskLevel: string; scanType: string }) {
  const products = getRecommendations(riskLevel, scanType);
  if (!products.length) return null;

  return (
    <section style={{
      marginTop: '1.5rem', padding: '1rem', borderRadius: '12px',
      border: '1px solid var(--tc-border)', backgroundColor: 'var(--tc-surface)',
      display: 'flex', flexDirection: 'column', gap: '0.75rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
        <span style={{ fontSize: '1.1rem' }}>🛡️</span>
        <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 600, color: 'var(--tc-text-main)' }}>Protect Yourself</h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {products.map((product) => (
          <div key={product.name} style={{
            backgroundColor: 'var(--tc-surface)', border: '1px solid var(--tc-border)',
            borderRadius: '12px', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '0.4rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem' }}>{product.emoji}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--tc-text-main)' }}>{product.name}</div>
                <p style={{ margin: 0, marginTop: '0.15rem', fontSize: '0.85rem', color: 'var(--tc-text-muted)' }}>{product.description}</p>
              </div>
            </div>
            <div style={{ marginTop: '0.35rem', display: 'flex', justifyContent: 'flex-start' }}>
              <a
                href={product.url}
                target="_blank"
                rel="noopener sponsored"
                style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  padding: '0.5rem 0.9rem', borderRadius: '12px', backgroundColor: 'var(--tc-primary)',
                  color: '#ffffff', fontWeight: 600, fontSize: '0.85rem', textDecoration: 'none', cursor: 'pointer',
                }}
              >
                {product.cta}
              </a>
            </div>
          </div>
        ))}
      </div>

      <p style={{ margin: 0, marginTop: '0.25rem', fontSize: '0.75rem', color: 'var(--tc-text-muted)', lineHeight: 1.4 }}>
        TrustChekr may earn a commission from partner links. This doesn&apos;t affect our scan results.
      </p>
    </section>
  );
}
