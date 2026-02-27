import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n';

// --- i18n middleware ---
const intlMiddleware = createMiddleware(routing);

// --- Rate limiting ---
type Counter = { count: number; resetAt: number };
const RATE_LIMIT = 100;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const ipCounters = new Map<string, Counter>();

function getClientIp(req: NextRequest): string {
  const header = req.headers.get('x-forwarded-for');
  if (!header) return 'unknown';
  return header.split(',')[0].trim() || 'unknown';
}

function checkLimit(ip: string): boolean {
  const now = Date.now();
  const existing = ipCounters.get(ip);

  if (!existing) {
    ipCounters.set(ip, { count: 1, resetAt: now + ONE_DAY_MS });
    return true;
  }

  if (now > existing.resetAt) {
    existing.count = 1;
    existing.resetAt = now + ONE_DAY_MS;
    return true;
  }

  if (existing.count >= RATE_LIMIT) return false;

  existing.count += 1;
  return true;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Rate limit public API
  if (pathname.startsWith('/api/v1/')) {
    const ip = getClientIp(req);
    const ok = checkLimit(ip);

    if (!ok) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded. Free tier: 100 requests/day. Contact partnerships@trustchekr.com for commercial access.',
        },
        { status: 429 }
      );
    }
    return NextResponse.next();
  }

  // 2. Skip i18n for all API routes and static assets
  if (pathname.startsWith('/api/') || pathname.startsWith('/_next/') || pathname.includes('.')) {
    return NextResponse.next();
  }

  // 3. Locale detection and routing for pages
  return intlMiddleware(req);
}

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
};
