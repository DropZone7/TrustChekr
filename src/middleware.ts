import { NextRequest, NextResponse } from 'next/server';

// --- Rate limiting ---
type Counter = { count: number; resetAt: number };
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const ONE_HOUR_MS = 60 * 60 * 1000;
const ipCounters = new Map<string, Counter>();
const newsletterCounters = new Map<string, Counter>();

function getClientIp(req: NextRequest): string {
  const header = req.headers.get('x-forwarded-for');
  if (!header) return 'unknown';
  return header.split(',')[0].trim() || 'unknown';
}

function checkLimit(ip: string, map: Map<string, Counter>, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const existing = map.get(ip);

  if (!existing) {
    map.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (now > existing.resetAt) {
    existing.count = 1;
    existing.resetAt = now + windowMs;
    return true;
  }

  if (existing.count >= limit) return false;
  existing.count += 1;
  return true;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const ip = getClientIp(req);

  // Rate limit public API: 100/day
  if (pathname.startsWith('/api/v1/')) {
    if (!checkLimit(ip, ipCounters, 100, ONE_DAY_MS)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Free tier: 100 requests/day. Contact partnerships@trustchekr.com for commercial access.' },
        { status: 429 }
      );
    }
  }

  // Rate limit chat API: 30/day per IP
  if (pathname === '/api/chat/analyze') {
    if (!checkLimit(`chat:${ip}`, ipCounters, 30, ONE_DAY_MS)) {
      return NextResponse.json(
        { error: 'You\'ve reached the daily chat limit. Please try again tomorrow.' },
        { status: 429 }
      );
    }
  }

  // Rate limit scan API: 50/day per IP
  if (pathname === '/api/scan') {
    if (!checkLimit(`scan:${ip}`, ipCounters, 50, ONE_DAY_MS)) {
      return NextResponse.json(
        { error: 'You\'ve reached the daily scan limit. Please try again tomorrow.' },
        { status: 429 }
      );
    }

    // Reject oversized payloads (>10KB)
    const contentLength = parseInt(req.headers.get('content-length') || '0', 10);
    if (contentLength > 10240) {
      return NextResponse.json(
        { error: 'Input too large. Please paste text directly instead of uploading files.' },
        { status: 413 }
      );
    }
  }

  // Rate limit newsletter: 5/hour per IP
  if (pathname === '/api/newsletter') {
    if (!checkLimit(ip, newsletterCounters, 5, ONE_HOUR_MS)) {
      return NextResponse.json(
        { error: 'Too many attempts. Please try again later.' },
        { status: 429 }
      );
    }
  }

  // Rate limit user reports: 10/hour per IP
  if (pathname === '/api/user-reports') {
    if (!checkLimit(`reports:${ip}`, newsletterCounters, 10, ONE_HOUR_MS)) {
      return NextResponse.json(
        { error: 'Too many reports. Please try again later.' },
        { status: 429 }
      );
    }
  }

  // Rate limit community reports: 10/hour per IP
  if (pathname.startsWith('/api/community/')) {
    if (!checkLimit(`community:${ip}`, newsletterCounters, 10, ONE_HOUR_MS)) {
      return NextResponse.json(
        { error: 'Too many submissions. Please try again later.' },
        { status: 429 }
      );
    }
  }

  // Block admin paths without token (server-side gate)
  if (pathname.startsWith('/admin/')) {
    const token = req.nextUrl.searchParams.get('k');
    const expected = process.env.TC_ADMIN_TOKEN;
    if (!token || !expected || token !== expected) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
  }

  if (pathname.startsWith('/tc47x/')) {
    const token = req.nextUrl.searchParams.get('k');
    const expected = process.env.TC_ADMIN_TOKEN;
    if (!token || !expected || token !== expected) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/v1/:path*', '/api/scan', '/api/chat/analyze', '/api/newsletter', '/api/user-reports', '/api/community/:path*', '/api/partnerships', '/tc47x/:path*', '/admin/:path*'],
};
