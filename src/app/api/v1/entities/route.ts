import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

// Public API: search the TrustChekr entity database
// Free for researchers, journalists, developers

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type'); // email, phone, url, domain, crypto_wallet
  const value = searchParams.get('value');
  const confirmed = searchParams.get('confirmed'); // true = only confirmed scams
  const limit = Math.min(100, parseInt(searchParams.get('limit') ?? '20') || 20);

  try {
    let query = supabaseServer
      .from('entities')
      .select('id, type, value, first_seen, last_seen, report_count, confirmed_scam')
      .order('report_count', { ascending: false })
      .limit(limit);

    if (type) query = query.eq('type', type);
    if (value) {
      if (value.length < 3 || value.length > 200) {
        return NextResponse.json({ error: 'Search value must be 3-200 characters.' }, { status: 400 });
      }
      // Escape SQL LIKE wildcards to prevent wildcard injection
      const escaped = value.replace(/[%_\\]/g, '\\$&');
      query = query.ilike('value', `%${escaped}%`);
    }
    if (confirmed === 'true') query = query.eq('confirmed_scam', true);

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      entities: data ?? [],
      count: (data ?? []).length,
      api_version: 'v1',
      docs: 'https://trustchekr.com/api-docs',
      note: 'Free for research and non-commercial use. Contact partnerships@trustchekr.com for commercial API access.',
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Cache-Control': 'public, max-age=300', // 5 min cache
      },
    });
  } catch {
    return NextResponse.json({ error: 'Database query failed', entities: [] }, { status: 500 });
  }
}
