import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export const revalidate = 300;

export async function GET() {
  try {
    // Total reports
    const { count: totalVerified, error: totalError } = await supabaseServer
      .from('user_reports')
      .select('id', { count: 'exact', head: true });

    if (totalError) {
      return NextResponse.json({ error: 'Failed to load stats' }, { status: 500 });
    }

    // Fetch recent rows and group in memory (Supabase JS has no groupBy)
    const { data: recentReports, error: reportsError } = await supabaseServer
      .from('user_reports')
      .select('scam_type, province, created_at')
      .order('created_at', { ascending: false })
      .limit(5000);

    if (reportsError || !recentReports) {
      return NextResponse.json({ error: 'Failed to load stats' }, { status: 500 });
    }

    const scamTypeCounts: Record<string, number> = {};
    const provinceCounts: Record<string, number> = {};
    const monthCounts: Record<string, number> = {};

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastSixMonthsKeys: string[] = [];

    for (let i = 5; i >= 0; i -= 1) {
      const d = new Date(currentYear, currentMonth - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      lastSixMonthsKeys.push(key);
      monthCounts[key] = 0;
    }

    for (const report of recentReports) {
      const scamType = (report as any).scam_type ?? 'unknown';
      const province = (report as any).province ?? 'unknown';
      const createdAt = report.created_at ? new Date(report.created_at) : null;

      scamTypeCounts[scamType] = (scamTypeCounts[scamType] ?? 0) + 1;
      provinceCounts[province] = (provinceCounts[province] ?? 0) + 1;

      if (createdAt) {
        const key = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, '0')}`;
        if (key in monthCounts) {
          monthCounts[key] += 1;
        }
      }
    }

    const scamTypes = Object.entries(scamTypeCounts)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);

    const reportsByMonth = lastSixMonthsKeys.map((key) => ({
      month: key,
      count: monthCounts[key] ?? 0,
    }));

    let mostReportedProvince: { province: string; count: number } | null = null;
    for (const [province, count] of Object.entries(provinceCounts)) {
      if (!mostReportedProvince || count > mostReportedProvince.count) {
        mostReportedProvince = { province, count };
      }
    }

    const platformStats = {
      totalScansEstimate: '10,000+',
      analysisModules: 17,
      blockedDomains: 49762,
      countries: 3,
    };

    const payload = {
      totalVerifiedReports: totalVerified ?? 0,
      scamTypes,
      reportsByMonth,
      mostReportedProvince,
      platformStats,
    };

    const res = NextResponse.json(payload);
    res.headers.set('Cache-Control', 'public, max-age=300, s-maxage=300');
    return res;
  } catch {
    return NextResponse.json({ error: 'Failed to load stats' }, { status: 500 });
  }
}
