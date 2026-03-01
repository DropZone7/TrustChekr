'use client';

export function SkipToContent() {
  return (
    <a
      href="#main-content"
      style={{
        position: 'absolute', top: '-100px', left: '1rem', zIndex: 99999,
        background: 'var(--tc-primary)', color: 'white',
        padding: '0.75rem 1.5rem', borderRadius: '0 0 12px 12px',
        fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none',
        transition: 'top 0.2s',
      }}
      onFocus={e => { e.currentTarget.style.top = '0'; }}
      onBlur={e => { e.currentTarget.style.top = '-100px'; }}
    >
      Skip to main content
    </a>
  );
}
