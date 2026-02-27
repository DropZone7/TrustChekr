'use client';

import { useState } from 'react';

const links = [
  { href: '/', label: 'Home' },
  { href: '/academy', label: 'Academy' },
  { href: '/tools', label: 'Tools' },
  { href: '/community', label: 'Community' },
  { href: '/map', label: 'Scam Map' },
  { href: '/report', label: 'Report' },
  { href: '/learn', label: 'Learn' },
  { href: '/help', label: 'Help' },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop nav */}
      <nav className="hidden sm:flex gap-4 text-sm" style={{ color: 'var(--tc-text-muted)' }}>
        {links.map(l => (
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
          {links.map(l => (
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
        </div>
      )}
    </>
  );
}
