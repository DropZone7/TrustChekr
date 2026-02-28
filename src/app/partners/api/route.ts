import { NextRequest, NextResponse } from 'next/server';

/**
 * Authenticated partner API — server-to-server only.
 * Requires header: Authorization: Bearer <PARTNERS_API_KEY>
 * Wraps /api/partnerships for trusted partners to create leads programmatically.
 */
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const expected = process.env.PARTNERS_API_KEY;

  if (!expected || !authHeader || authHeader !== `Bearer ${expected}`) {
    return NextResponse.json({ error: 'Unauthorized. Provide a valid API key.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, organization, email, useCase, message } = body;

    if (!name || !organization || !email) {
      return NextResponse.json({ error: 'name, organization, and email are required.' }, { status: 400 });
    }

    // Forward to the public partnerships endpoint internally
    const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://trustchekr.com';
    const res = await fetch(`${base}/api/partnerships`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: String(name).trim(),
        organization: String(organization).trim(),
        email: String(email).trim(),
        useCase: String(useCase ?? '').trim(),
        message: String(message ?? '').trim(),
      }),
    });

    const result = await res.json();
    return NextResponse.json(result, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'Internal error processing partner request.' }, { status: 500 });
  }
}
