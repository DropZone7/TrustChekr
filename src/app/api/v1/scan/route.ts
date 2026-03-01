import { NextRequest, NextResponse } from 'next/server';

// Public scan API — same as /api/scan but with CORS and rate info
// Free tier: 100 requests/day (enforced by Vercel edge, not here yet)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, input } = body;

    if (!type || !input) {
      return NextResponse.json({ error: 'Missing type and input fields' }, { status: 400 });
    }

    // Proxy to internal scan API (hardcoded base to prevent SSRF via Host header)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.trustchekr.com';
    const scanRes = await fetch(`${baseUrl}/api/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, input }),
    });

    const data = await scanRes.json();

    return NextResponse.json({
      ...data,
      api_version: 'v1',
      scanned_at: new Date().toISOString(),
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Scan failed' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
