'use client';

import { useState, useRef, useEffect } from 'react';

const mainLinks = [
  { href: '/', label: 'Home' },
  { href: '/chat', label: 'Chat' },
  { href: '/learn', label: 'Learn' },
  { href: '/tools', label: 'Tools' },
  { href: '/help', label: 'Support' },
];

const moreLinks = [
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
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div ref={menuRef} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      {/* Desktop nav — top-level links + hamburger for more */}
      <nav className="hidden sm:flex gap-4 text-sm items-center" style={{ color: 'var(--tc-text-muted)' }}>
        {mainLinks.map(l => (
          <a key={l.href} href={l.href} className="hover:underline">{l.label}</a>
        ))}
        <button
          onClick={() => setOpen(!open)}
          aria-label="More pages"
          style={{
            background: 'none', border: '1px solid var(--tc-border)',
            borderRadius: '8px', padding: '4px 10px',
            fontSize: '0.85rem', cursor: 'pointer',
            color: 'var(--tc-text-muted)',
            display: 'flex', alignItems: 'center', gap: '4px',
          }}
        >
          More {open ? '✕' : '☰'}
        </button>
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

      {/* Dropdown — shared for mobile and desktop */}
      {open && (
        <div style={{
          position: 'absolute', top: '100%', right: 0,
          minWidth: '220px',
          background: 'var(--tc-surface)', border: '1px solid var(--tc-border)',
          borderRadius: '12px',
          zIndex: 9990, padding: '0.5rem 0',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          marginTop: '4px',
        }}>
          {/* Mobile only: show main links too */}
          <div className="sm:hidden">
            {mainLinks.map(l => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                style={{
                  display: 'block', padding: '0.65rem 1.25rem',
                  color: 'var(--tc-text-main)', textDecoration: 'none',
                  fontSize: '0.95rem', fontWeight: 500,
                }}
              >
                {l.label}
              </a>
            ))}
            <div style={{ height: '1px', background: 'var(--tc-border)', margin: '0.25rem 0' }} />
          </div>

          {/* More links — always shown in dropdown */}
          {moreLinks.map(l => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{
                display: 'block', padding: '0.55rem 1.25rem',
                color: 'var(--tc-text-muted)', textDecoration: 'none',
                fontSize: '0.9rem',
              }}
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
