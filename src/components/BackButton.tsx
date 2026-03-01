'use client';

import { useRouter, usePathname } from 'next/navigation';

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
  '/claim/status': 'Claim',
  '/scan': 'Scan Results',
  '/scam-check': 'Scam Check',
  '/safety': 'Safety',
  '/safety/scams': 'Safety',
  '/api-docs': 'API Docs',
  '/tools/email-headers': 'Tools',
};

function getParentName(pathname: string): string {
  // For nested routes, find the parent path name
  // e.g., /academy/phone-scams → "Academy"
  // e.g., /about/founder → "About"
  // e.g., /tools/email-headers → "Tools"
  // e.g., /learn/ai-deanonymization → "Learn"

  // Direct match first
  if (PAGE_NAMES[pathname]) {
    // This page is a top-level page, go back to Home
    return 'Home';
  }

  // Try parent paths
  const segments = pathname.split('/').filter(Boolean);
  for (let i = segments.length - 1; i > 0; i--) {
    const parentPath = '/' + segments.slice(0, i).join('/');
    if (PAGE_NAMES[parentPath]) {
      return PAGE_NAMES[parentPath];
    }
  }

  return 'Home';
}

function getParentPath(pathname: string): string {
  if (PAGE_NAMES[pathname]) {
    return '/';
  }

  const segments = pathname.split('/').filter(Boolean);
  for (let i = segments.length - 1; i > 0; i--) {
    const parentPath = '/' + segments.slice(0, i).join('/');
    if (PAGE_NAMES[parentPath]) {
      return parentPath;
    }
  }

  return '/';
}

export function BackButton() {
  const router = useRouter();
  const pathname = usePathname();

  const parentName = getParentName(pathname);
  const parentPath = getParentPath(pathname);

  return (
    <a
      href={parentPath}
      onClick={(e) => {
        e.preventDefault();
        router.back();
      }}
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
        textDecoration: 'none',
      }}
    >
      ← Back to {parentName}
    </a>
  );
}
