import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import type { ScamPattern } from '@/lib/scamIntel/types';
import { mapRowToScamPattern } from '@/lib/scamIntel/supabaseMapper';
import { scamIntelSeed } from '@/lib/scamIntel/staticData';

const MAX_RESULTS = 3;

export async function GET() {
  // Try Supabase first, fall back to static seed
  try {
    const { data, error } = await supabaseServer
      .from('scam_patterns')
      .select(
        'id, name, category, region, primary_targets, short_description, how_it_works, red_flags, official_sources, severity, relevance_to_trustchekr, academy_modules_impacted, last_updated, recommended_ui_messaging'
      )
      .eq('published', true)
      .eq('status', 'live_in_app')
      .in('severity', ['high', 'critical'])
      .order('last_updated', { ascending: false })
      .limit(MAX_RESULTS);

    if (!error && data && data.length > 0) {
      const scams: ScamPattern[] = data.map(mapRowToScamPattern);
      return NextResponse.json(
        { scams, meta: { count: scams.length, source: 'supabase', generated_at: new Date().toISOString() } },
        { status: 200 }
      );
    }
  } catch (e) {
    console.error('Supabase scam-intel error, falling back to static', e);
  }

  // Fallback: static seed
  const filtered = scamIntelSeed
    .filter((s) => ['high', 'critical'].includes(s.severity))
    .sort((a, b) => new Date(b.last_updated).getTime() - new Date(a.last_updated).getTime())
    .slice(0, MAX_RESULTS);

  return NextResponse.json(
    { scams: filtered, meta: { count: filtered.length, source: 'static', generated_at: new Date().toISOString() } },
    { status: 200 }
  );
}
