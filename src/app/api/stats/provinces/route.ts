import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from('user_reports')
      .select('province, scam_type')
      .not('province', 'is', null);

    if (error || !data) {
      return NextResponse.json({ provinces: [] });
    }

    // Aggregate by province
    const provinceMap: Record<string, { reports: number; scamTypes: Record<string, number> }> = {};

    for (const row of data) {
      const p = row.province;
      if (!p) continue;
      if (!provinceMap[p]) provinceMap[p] = { reports: 0, scamTypes: {} };
      provinceMap[p].reports++;
      const st = row.scam_type ?? 'other';
      provinceMap[p].scamTypes[st] = (provinceMap[p].scamTypes[st] ?? 0) + 1;
    }

    const provinces = Object.entries(provinceMap).map(([code, stats]) => {
      const topScam = Object.entries(stats.scamTypes).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'unknown';
      return { code, reports: stats.reports, topScam };
    });

    return NextResponse.json({ provinces }, {
      headers: { 'Cache-Control': 'public, max-age=300' },
    });
  } catch {
    return NextResponse.json({ provinces: [] });
  }
}
