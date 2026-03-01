import { NextRequest, NextResponse } from 'next/server';

// --- Rate limiting ---
type Counter = { count: number; resetAt: number };
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const ONE_HOUR_MS = 60 * 60 * 1000;
const ipCounters = new Map<string, Counter>();
const newsletterCounters = new Map<string, Counter>();

// Periodic pruning to prevent unbounded memory growth (#8)
let lastPrune = Date.now();
const PRUNE_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

function pruneExpired(map: Map<string, Counter>) {
  const now = Date.now();
  for (const [key, val] of map) {
    if (now > val.resetAt) map.delete(key);
  }
}

function maybePrune() {
  const now = Date.now();
  if (now - lastPrune > PRUNE_INTERVAL_MS) {
    lastPrune = now;
    pruneExpired(ipCounters);
    pruneExpired(newsletterCounters);
  }
}

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

  // Prune expired entries periodically
  maybePrune();

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

  // Rate limit romance/crypto/ai-text scan endpoints: 30/day per IP
  if (pathname.startsWith('/api/scan/') && pathname !== '/api/scan') {
    if (!checkLimit(`subscan:${ip}`, ipCounters, 30, ONE_DAY_MS)) {
      return NextResponse.json(
        { error: 'You\'ve reached the daily limit for this scan type. Please try again tomorrow.' },
        { status: 429 }
      );
    }
  }

  // Rate limit feed endpoints: 60/hour per IP
  if (pathname.startsWith('/api/feed/')) {
    if (!checkLimit(`feed:${ip}`, newsletterCounters, 60, ONE_HOUR_MS)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }
  }

  // Rate limit phone scam patterns: 100/day per IP
  if (pathname.startsWith('/api/phone/')) {
    if (!checkLimit(`phone:${ip}`, ipCounters, 100, ONE_DAY_MS)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded.' },
        { status: 429 }
      );
    }
  }

  // Rate limit partnerships: 5/hour per IP
  if (pathname === '/api/partnerships') {
    if (!checkLimit(`partner:${ip}`, newsletterCounters, 5, ONE_HOUR_MS)) {
      return NextResponse.json(
        { error: 'Too many submissions. Please try again later.' },
        { status: 429 }
      );
    }
  }

  // Rate limit claim endpoints: 10/hour per IP
  if (pathname.startsWith('/api/claim')) {
    if (!checkLimit(`claim:${ip}`, newsletterCounters, 10, ONE_HOUR_MS)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }
  }

  // Rate limit certificate generation: 20/hour per IP
  if (pathname === '/api/certificate') {
    if (!checkLimit(`cert:${ip}`, newsletterCounters, 20, ONE_HOUR_MS)) {
      return NextResponse.json(
        { error: 'Too many certificate requests. Please try again later.' },
        { status: 429 }
      );
    }
  }

  // Rate limit feedback: 20/hour per IP
  if (pathname.startsWith('/api/feedback')) {
    if (!checkLimit(`feedback:${ip}`, newsletterCounters, 20, ONE_HOUR_MS)) {
      return NextResponse.json(
        { error: 'Too many submissions. Please try again later.' },
        { status: 429 }
      );
    }
  }

  // Rate limit scam intel: 60/hour per IP
  if (pathname.startsWith('/api/scam-intel/')) {
    if (!checkLimit(`intel:${ip}`, newsletterCounters, 60, ONE_HOUR_MS)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded.' },
        { status: 429 }
      );
    }
  }

  // Rate limit stats: 30/hour per IP
  if (pathname.startsWith('/api/stats/')) {
    if (!checkLimit(`stats:${ip}`, newsletterCounters, 30, ONE_HOUR_MS)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded.' },
        { status: 429 }
      );
    }
  }

  // Rate limit SMS webhook: 60/hour per IP
  if (pathname === '/api/sms') {
    if (!checkLimit(`sms:${ip}`, newsletterCounters, 60, ONE_HOUR_MS)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded.' },
        { status: 429 }
      );
    }
  }

  // Rate limit digest: 10/hour per IP
  if (pathname === '/api/digest') {
    if (!checkLimit(`digest:${ip}`, newsletterCounters, 10, ONE_HOUR_MS)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded.' },
        { status: 429 }
      );
    }
  }

  // Rate limit health: 120/hour per IP
  if (pathname === '/api/health') {
    if (!checkLimit(`health:${ip}`, newsletterCounters, 120, ONE_HOUR_MS)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded.' },
        { status: 429 }
      );
    }
  }

  // Admin auth — accept both query string and Authorization header (#6)
  if (pathname.startsWith('/admin/') || pathname.startsWith('/tc47x/')) {
    const expected = process.env.TC_ADMIN_TOKEN;
    const queryToken = req.nextUrl.searchParams.get('k');
    const headerToken = req.headers.get('authorization')?.replace('Bearer ', '');
    const token = headerToken || queryToken;
    if (!token || !expected || token !== expected) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/v1/:path*', '/api/scan', '/api/scan/:path*', '/api/chat/analyze', '/api/newsletter', '/api/user-reports', '/api/community/:path*', '/api/partnerships', '/api/feed/:path*', '/api/phone/:path*', '/api/claim/:path*', '/api/certificate', '/api/digest', '/api/feedback', '/api/feedback/:path*', '/api/health', '/api/scam-intel/:path*', '/api/sms', '/api/stats/:path*', '/tc47x/:path*', '/admin/:path*'],
};
