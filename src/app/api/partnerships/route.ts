import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

type PartnershipLead = {
  name: string;
  organization: string;
  email: string;
  useCase: string;
  message: string;
  source: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json();

    const name = String(raw.name ?? '').trim();
    const organization = String(raw.organization ?? '').trim();
    const email = String(raw.email ?? '').trim();
    const useCase = String(raw.useCase ?? '').trim();
    const message = String(raw.message ?? '').trim();
    const source = String(raw.source ?? 'partners-page').trim();

    if (!name || !organization || !email) {
      return NextResponse.json({ error: 'Name, organization, and email are required.' }, { status: 400 });
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
    }

    const lead: PartnershipLead = { name, organization, email, useCase, message, source };

    // Persist to Supabase (user_reports table as partnership_inquiry)
    try {
      await supabaseServer.from('user_reports').insert({
        source_page: '/partners',
        source_ref: `partner-${Date.now()}`,
        reporter_email: email,
        report_type: 'partnership_inquiry',
        message: `[${organization}] ${useCase || 'General'}: ${message || 'No details provided'}`,
        metadata: { name, organization, useCase, source },
      });
    } catch { /* DB insert is best-effort */ }

    // Forward to webhook if configured (fire-and-forget)
    const webhookUrl = process.env.PARTNERSHIP_WEBHOOK_URL;
    if (webhookUrl) {
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead),
      }).catch(() => { /* fire and forget */ });
    }

    return NextResponse.json(
      { ok: true, message: 'Partnership request received. We typically respond within 1–2 business days.' },
      { status: 201 },
    );
  } catch {
    return NextResponse.json({ error: 'Unable to process request right now.' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: 'POST /api/partnerships',
    description: 'Submit a partnership inquiry. Write-only from external clients.',
    required_fields: ['name', 'organization', 'email'],
    optional_fields: ['useCase', 'message', 'source'],
    example: {
      name: 'Jane Doe',
      organization: 'Maple Credit Union',
      email: 'jane@maplecreditunion.ca',
      useCase: 'Credit union / Central 1 Forge',
      message: 'Interested in API integration for e-Transfer screening.',
    },
  });
}
