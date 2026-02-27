import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

const SAFETY_TIPS = [
  'Never share your SIN or banking password over phone or email',
  'The CRA will never demand payment by gift cards or cryptocurrency',
  "Verify any 'urgent' request by calling the company directly using their official number",
  "If someone you've never met in person asks for money, it's likely a scam",
  'Check website URLs carefully — scammers use lookalike domains',
  'Enable two-factor authentication on all your accounts',
  "If an investment promises guaranteed returns, it's a red flag",
];

function getSeverity(scamType: string | null): 'high' | 'medium' | 'low' {
  if (!scamType) return 'low';
  const s = scamType.toLowerCase();
  if (s.includes('romance') || s.includes('investment')) return 'high';
  if (s.includes('phishing')) return 'medium';
  return 'low';
}

function formatTitle(scamType: string | null): string {
  if (!scamType?.trim()) return 'Unknown scam type';
  return scamType.trim().split(/[\s_-]+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
}

export async function GET(request: NextRequest) {
  const auth = request.headers.get('Authorization');
  if (!auth || auth !== `Bearer ${process.env.TC_ADMIN_TOKEN ?? ''}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [{ data: reports, error: re }, { data: patterns, error: pe }] = await Promise.all([
      supabaseServer.from('user_reports').select('id, message, scam_type, province, verified, upvotes, created_at')
        .eq('verified', true).order('created_at', { ascending: false }).limit(5),
      supabaseServer.from('scam_patterns').select('id, pattern_name, description, severity, category, created_at')
        .order('created_at', { ascending: false }).limit(3),
    ]);

    if (re) return NextResponse.json({ error: 'Failed to fetch reports', details: re.message }, { status: 500 });
    if (pe) return NextResponse.json({ error: 'Failed to fetch patterns', details: pe.message }, { status: 500 });

    const highlights = [
      ...(reports ?? []).map(r => ({
        title: formatTitle(r.scam_type),
        description: typeof r.message === 'string' ? r.message.slice(0, 100) : '',
        severity: getSeverity(r.scam_type),
        source: 'community' as const,
      })),
      ...(patterns ?? []).map(p => ({
        title: p.pattern_name || 'New scam pattern detected',
        description: typeof p.description === 'string' ? p.description.slice(0, 120) : '',
        severity: (['high', 'medium', 'low'].includes(p.severity) ? p.severity : 'medium') as 'high' | 'medium' | 'low',
        source: 'intelligence' as const,
      })),
    ];

    const topScamTypes: Record<string, number> = {};
    (reports ?? []).forEach(r => {
      const k = (r.scam_type || 'unknown').toLowerCase();
      topScamTypes[k] = (topScamTypes[k] || 0) + 1;
    });

    const provinces = [...new Set((reports ?? []).map(r => r.province).filter(Boolean))];

    const dayIndex = new Date().getDay();
    const tips = [0, 1, 2].map(i => SAFETY_TIPS[(dayIndex + i) % SAFETY_TIPS.length]);

    return NextResponse.json({
      generated_at: new Date().toISOString(),
      period: 'Last 7 days',
      highlights,
      top_scam_types: topScamTypes,
      provinces_affected: provinces,
      safety_tips: tips,
      cta: { text: 'Check something suspicious', url: 'https://trustchekr.com' },
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to generate digest', details: error?.message }, { status: 500 });
  }
}
