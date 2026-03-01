import { NextRequest, NextResponse } from 'next/server';
import { getRecentReports, searchReports, submitScamReport } from '@/lib/community/scamReports';
import { logAudit } from '@/lib/auditLog';
import type { EntityType } from '@/lib/graph/entityGraph';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');
  const limit = Math.min(50, parseInt(searchParams.get('limit') ?? '20') || 20);

  try {
    const reports = query ? await searchReports(query) : await getRecentReports(limit);
    return NextResponse.json({ reports }, { status: 200 });
  } catch {
    return NextResponse.json({ reports: [] }, { status: 200 });
  }
}

const VALID_SCAM_TYPES = [
  'phone_scam', 'cra_impersonation', 'bank_impersonation', 'tech_support',
  'romance_scam', 'crypto_scam', 'phishing', 'investment_fraud', 'other',
];

const VALID_ENTITY_TYPES: EntityType[] = ['email', 'phone', 'url', 'domain', 'crypto_wallet', 'ip', 'username'];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { scam_type, message, entities, province } = body;

    if (!scam_type || !VALID_SCAM_TYPES.includes(scam_type)) {
      return NextResponse.json({ error: 'Invalid scam type' }, { status: 400 });
    }
    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      return NextResponse.json({ error: 'Description must be at least 10 characters' }, { status: 400 });
    }
    if (message.length > 2000) {
      return NextResponse.json({ error: 'Description too long (max 2000 characters)' }, { status: 400 });
    }

    // Validate province against whitelist
    const VALID_PROVINCES = ['AB','BC','MB','NB','NL','NS','NT','NU','ON','PE','QC','SK','YT',
      'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY',
      'LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND',
      'OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC'];
    const cleanProvince = province && VALID_PROVINCES.includes(province.toUpperCase?.()) ? province.toUpperCase() : undefined;

    // Validate entities
    const validEntities = (entities ?? [])
      .filter((e: any) => e.type && e.value && VALID_ENTITY_TYPES.includes(e.type))
      .slice(0, 10); // Max 10 entities per report

    const result = await submitScamReport({
      scam_type,
      message: message.trim(),
      entities: validEntities,
      province: cleanProvince,
    });

    logAudit('report_submitted', { scam_type: body.scam_type, province: body.province });
    return NextResponse.json({ success: true, id: result.id }, { status: 201 });
  } catch (e: any) {
    console.error('Report submission error:', e);
    return NextResponse.json({ error: 'Failed to submit report' }, { status: 500 });
  }
}
