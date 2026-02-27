import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export async function POST(req: Request) {
  let body: {
    source_page?: string;
    source_ref?: string;
    reporter_email?: string;
    report_type?: string;
    message?: string;
    metadata?: any;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { source_page, source_ref, reporter_email, report_type, message, metadata } = body;

  if (!source_page || !source_ref || !report_type || !message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const { error } = await supabaseServer.from('user_reports').insert({
    source_page,
    source_ref,
    reporter_email: reporter_email || null,
    report_type,
    message,
    metadata: metadata ?? {},
  });

  if (error) {
    console.error('user_reports insert error', error);
    return NextResponse.json({ error: 'Failed to submit report' }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
