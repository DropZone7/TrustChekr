'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const PAGE_NAMES: Record<string, string> = {
  '/': 'Home',
  '/chat': 'Chat',
  '/learn': 'Learn',
  '/tools': 'Tools',
  '/help': 'Support',
  '/academy': 'Academy',
  '/about': 'About',
  '/about/founder': 'About',
  '/threats': 'Threats',
  '/report': 'Report',
  '/community': 'Community',
  '/map': 'Scam Map',
  '/partners': 'Partners',
  '/privacy': 'Privacy',
  '/press': 'Press',
  '/romance': 'Romance Check',
  '/trust-score': 'How Scoring Works',
  '/stats': 'Stats',
  '/claim': 'Claim',
  '/scan': 'Scan',
};

function getPageName(path: string): string {
  if (PAGE_NAMES[path]) return PAGE_NAMES[path];
  // Check partial matches (e.g., /academy/phone-scams → Academy)
  for (const [route, name] of Object.entries(PAGE_NAMES)) {
    if (route !== '/' && path.startsWith(route)) return name;
  }
  return 'previous page';
}

export function BackButton() {
  const router = useRouter();
  const [prevName, setPrevName] = useState('previous page');

  useEffect(() => {
    // Get referrer to determine where user came from
    if (document.referrer) {
      try {
        const url = new URL(document.referrer);
        if (url.origin === window.location.origin) {
          setPrevName(getPageName(url.pathname));
        }
      } catch { /* ignore */ }
    }
  }, []);

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
      ← Back to {prevName}
    </button>
  );
}
