import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { hashIp } from '@/lib/auditLog';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { helpful, scan_type, risk_level, comment } = body;

    if (typeof helpful !== 'boolean') {
      return NextResponse.json({ error: 'Invalid feedback' }, { status: 400 });
    }

    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

    const { error } = await supabaseServer.from('scan_feedback').insert({
      helpful,
      scan_type: scan_type ?? null,
      risk_level: risk_level ?? null,
      comment: typeof comment === 'string' ? comment.slice(0, 500) : null,
      ip_hash: hashIp(clientIp),
    });

    if (error) {
      console.error('scan_feedback insert error', error);
      return NextResponse.json({ error: 'Failed to save feedback' }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
