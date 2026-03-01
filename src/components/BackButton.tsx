'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const PAGE_NAMES: Record<string, string> = {
  '/': 'Home',
  '/chat': 'Chat',
  '/learn': 'Learn',
  '/tools': 'Tools',
  '/help': 'Support',
  '/academy': 'Academy',
  '/about': 'About',
  '/about/founder': 'Founder',
  '/threats': 'Threats',
  '/report': 'Report',
  '/community': 'Community',
  '/map': 'Scam Map',
  '/partners': 'Partners',
  '/privacy': 'Privacy',
  '/press': 'Press',
  '/romance': 'Romance Check',
  '/trust-score': 'Scoring',
  '/stats': 'Stats',
  '/claim': 'Claim',
  '/claim/status': 'Claim',
  '/scan': 'Scan Results',
  '/scam-check': 'Scam Check',
  '/safety': 'Safety',
  '/api-docs': 'API Docs',
  '/tools/email-headers': 'Tools',
  '/tools/lookup': 'Tools',
  '/alerts': 'Home',
};

function getPageName(path: string): string {
  // Direct match
  if (PAGE_NAMES[path]) return PAGE_NAMES[path];

  // Try parent paths for dynamic routes like /academy/phone-scams
  const segments = path.split('/').filter(Boolean);
  for (let i = segments.length - 1; i > 0; i--) {
    const parentPath = '/' + segments.slice(0, i).join('/');
    if (PAGE_NAMES[parentPath]) return PAGE_NAMES[parentPath];
  }

  return 'Home';
}

const HISTORY_KEY = 'tc_nav_history';

export function BackButton() {
  const router = useRouter();
  const pathname = usePathname();
  const [prevName, setPrevName] = useState('Home');

  useEffect(() => {
    // Read the stored previous page
    try {
      const stored = sessionStorage.getItem(HISTORY_KEY);
      if (stored) {
        const history: string[] = JSON.parse(stored);
        // Find the last page that isn't the current one
        for (let i = history.length - 1; i >= 0; i--) {
          if (history[i] !== pathname) {
            setPrevName(getPageName(history[i]));
            break;
          }
        }
      }
    } catch { /* ignore */ }

    // Store current page in history
    try {
      const stored = sessionStorage.getItem(HISTORY_KEY);
      const history: string[] = stored ? JSON.parse(stored) : [];
      // Only push if different from last entry
      if (history[history.length - 1] !== pathname) {
        history.push(pathname);
        // Keep last 20 entries
        if (history.length > 20) history.shift();
        sessionStorage.setItem(HISTORY_KEY, JSON.stringify(history));
      }
    } catch { /* ignore */ }
  }, [pathname]);

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
