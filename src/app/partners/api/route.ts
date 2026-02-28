import { NextRequest, NextResponse } from 'next/server';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isAuthorized(req: NextRequest): boolean {
  const expectedKey = process.env.PARTNERS_API_KEY;
  if (!expectedKey) return false;
  const headerKey =
    req.headers.get('x-partners-api-key') ??
    req.headers.get('x-api-key') ??
    '';
  return headerKey === expectedKey;
}

/**
 * Authenticated server-to-server partner API.
 * Requires header: x-partners-api-key or x-api-key
 * Wraps POST /api/partnerships for trusted integrations.
 */
export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json(
      { error: 'Unauthorized. Provide a valid API key via x-partners-api-key header.' },
      { status: 401 },
    );
  }

  try {
    const raw = await req.json();

    const name = String(raw.name ?? '').trim();
    const organization = String(raw.organization ?? '').trim();
    const email = String(raw.email ?? '').trim();
    const useCase = String(raw.useCase ?? '').trim();
    const message = String(raw.message ?? '').trim();

    if (!name || !organization || !email) {
      return NextResponse.json({ error: 'name, organization, and email are required.' }, { status: 400 });
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://trustchekr.com';
    const res = await fetch(`${base}/api/partnerships`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, organization, email, useCase, message, source: 'public-partners-api' }),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Internal processing failed. Please try again later.' },
        { status: 502 },
      );
    }

    const result = await res.json();
    return NextResponse.json(
      { ok: true, message: result.message ?? 'Partnership request received.', ref: `api-${Date.now()}` },
      { status: 201 },
    );
  } catch {
    return NextResponse.json({ error: 'Internal error.' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  return NextResponse.json({
    endpoint: 'POST /partners/api',
    auth: 'Header: x-partners-api-key or x-api-key',
    required_fields: ['name', 'organization', 'email'],
    optional_fields: ['useCase', 'message'],
    example_request: {
      headers: { 'x-partners-api-key': '<your-key>', 'Content-Type': 'application/json' },
      body: {
        name: 'Jane Doe',
        organization: 'Maple Credit Union',
        email: 'jane@maplecreditunion.ca',
        useCase: 'Credit union / Central 1 Forge',
        message: 'Interested in API integration.',
      },
    },
  });
}
