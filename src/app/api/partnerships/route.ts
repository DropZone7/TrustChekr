import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { logAudit, hashIp } from '@/lib/auditLog';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, organization, email, useCase, message } = body;

    if (!name || !organization || !email) {
      return NextResponse.json({ error: 'Name, organization, and email are required.' }, { status: 400 });
    }

    // Store as a user report with type 'partnership_inquiry'
    const { error } = await supabaseServer.from('user_reports').insert({
      source_page: '/partners',
      source_ref: `partner-${Date.now()}`,
      reporter_email: email,
      report_type: 'partnership_inquiry',
      message: `[${organization}] ${useCase ?? 'General'}: ${message ?? 'No details provided'}`,
      metadata: { name, organization, useCase },
    });

    if (error) {
      console.error('Partnership inquiry insert error', error);
      return NextResponse.json({ error: 'Failed to submit inquiry.' }, { status: 500 });
    }

    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
    try { logAudit('partnership_inquiry', { organization, useCase }, hashIp(clientIp)); } catch { /* fire and forget */ }

    return NextResponse.json({ success: true, message: 'Thank you! We will be in touch within 1-2 business days.' }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Unable to process request.' }, { status: 500 });
  }
}
