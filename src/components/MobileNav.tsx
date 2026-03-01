'use client';

import { useState } from 'react';

const mainLinks = [
  { href: '/', label: 'Home' },
  { href: '/learn', label: 'Learn' },
  { href: '/tools', label: 'Tools' },
  { href: '/help', label: 'Support' },
];

const moreLinks = [
  { href: '/chat', label: 'Chat with TrustChekr' },
  { href: '/academy', label: 'Safety Academy' },
  { href: '/threats', label: 'Active Threats' },
  { href: '/report', label: 'Report a Scam' },
  { href: '/community', label: 'Community Reports' },
  { href: '/map', label: 'Scam Map' },
  { href: '/partners', label: 'For Partners' },
  { href: '/about', label: 'About' },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop nav — only top-level pages */}
      <nav className="hidden sm:flex gap-4 text-sm" style={{ color: 'var(--tc-text-muted)' }}>
        {mainLinks.map(l => (
          <a key={l.href} href={l.href} className="hover:underline">{l.label}</a>
        ))}
      </nav>

      {/* Mobile hamburger */}
      <button
        className="sm:hidden"
        onClick={() => setOpen(!open)}
        aria-label="Menu"
        style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--tc-text-main)' }}
      >
        {open ? '✕' : '☰'}
      </button>

      {/* Mobile dropdown */}
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: 'var(--tc-surface)', borderBottom: '2px solid var(--tc-border)',
          zIndex: 9990, padding: '0.5rem 0',
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        }}>
          {mainLinks.map(l => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{
                display: 'block', padding: '0.75rem 1.5rem',
                color: 'var(--tc-text-main)', textDecoration: 'none',
                fontSize: '1rem', fontWeight: 500,
                borderBottom: '1px solid var(--tc-border)',
              }}
            >
              {l.label}
            </a>
          ))}
          <div style={{ padding: '0.5rem 1.5rem 0.25rem', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em', color: 'var(--tc-text-muted)' }}>More</div>
          {moreLinks.map(l => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{
                display: 'block', padding: '0.5rem 1.5rem',
                color: 'var(--tc-text-muted)', textDecoration: 'none',
                fontSize: '0.9rem',
              }}
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}
