import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import type { ScamPattern } from '@/lib/scamIntel/types';
import { mapRowToScamPattern } from '@/lib/scamIntel/supabaseMapper';
import { scamIntelSeed } from '@/lib/scamIntel/staticData';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;

  // Try Supabase first
  try {
    const { data, error } = await supabaseServer
      .from('scam_patterns')
      .select(
        'id, name, category, region, primary_targets, short_description, how_it_works, red_flags, official_sources, severity, relevance_to_trustchekr, academy_modules_impacted, last_updated, recommended_ui_messaging'
      )
      .eq('id', id)
      .eq('published', true)
      .limit(1)
      .maybeSingle();

    if (!error && data) {
      const scam: ScamPattern = mapRowToScamPattern(data as any);
      return NextResponse.json(
        { scam, meta: { generated_at: new Date().toISOString() } },
        { status: 200 }
      );
    }
  } catch (e) {
    console.error('Supabase scam-intel [id] error', e);
  }

  // Fallback: static seed
  const staticScam = scamIntelSeed.find((s) => s.id === id);
  if (staticScam) {
    return NextResponse.json(
      { scam: staticScam, meta: { generated_at: new Date().toISOString() } },
      { status: 200 }
    );
  }

  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}
