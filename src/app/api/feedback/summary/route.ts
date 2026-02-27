import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export const revalidate = 60;

type FeedbackRow = {
  id: number;
  helpful: boolean;
  scan_type: string | null;
  risk_level: string | null;
  comment: string | null;
  created_at: string;
};

export async function GET() {
  try {
    const now = new Date();
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabaseServer
      .from('scan_feedback')
      .select('id, helpful, scan_type, risk_level, comment, created_at')
      .gte('created_at', ninetyDaysAgo)
      .order('created_at', { ascending: false })
      .limit(10000);

    if (error) {
      return NextResponse.json({ error: 'Failed to load feedback summary' }, { status: 500 });
    }

    const rows: FeedbackRow[] = data ?? [];
    const totalFeedback = rows.length;
    let helpfulCount = 0;
    let notHelpfulCount = 0;

    const byRiskLevelMap: Record<string, { total: number; helpful: number; notHelpful: number }> = {};
    const byScanTypeMap: Record<string, { total: number; helpful: number; notHelpful: number }> = {};
    const heatmapMap: Record<string, { riskLevel: string; scanType: string; total: number; helpful: number }> = {};
    const trendMap: Record<string, { total: number; helpful: number; notHelpful: number }> = {};

    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    for (const row of rows) {
      const riskLevel = row.risk_level ?? 'unknown';
      const scanType = row.scan_type ?? 'unknown';
      const isHelpful = row.helpful === true;

      if (isHelpful) helpfulCount += 1;
      else notHelpfulCount += 1;

      if (!byRiskLevelMap[riskLevel]) byRiskLevelMap[riskLevel] = { total: 0, helpful: 0, notHelpful: 0 };
      const rl = byRiskLevelMap[riskLevel];
      rl.total += 1;
      if (isHelpful) rl.helpful += 1; else rl.notHelpful += 1;

      if (!byScanTypeMap[scanType]) byScanTypeMap[scanType] = { total: 0, helpful: 0, notHelpful: 0 };
      const st = byScanTypeMap[scanType];
      st.total += 1;
      if (isHelpful) st.helpful += 1; else st.notHelpful += 1;

      const heatKey = `${riskLevel}__${scanType}`;
      if (!heatmapMap[heatKey]) heatmapMap[heatKey] = { riskLevel, scanType, total: 0, helpful: 0 };
      const hm = heatmapMap[heatKey];
      hm.total += 1;
      if (isHelpful) hm.helpful += 1;

      const createdAt = new Date(row.created_at);
      if (createdAt >= thirtyDaysAgo) {
        const dateKey = createdAt.toISOString().slice(0, 10);
        if (!trendMap[dateKey]) trendMap[dateKey] = { total: 0, helpful: 0, notHelpful: 0 };
        const t = trendMap[dateKey];
        t.total += 1;
        if (isHelpful) t.helpful += 1; else t.notHelpful += 1;
      }
    }

    const helpfulRate = totalFeedback > 0 ? helpfulCount / totalFeedback : 0;

    const byRiskLevel = Object.entries(byRiskLevelMap).map(([riskLevel, v]) => ({
      riskLevel, total: v.total, helpful: v.helpful, notHelpful: v.notHelpful,
      helpfulRate: v.total > 0 ? v.helpful / v.total : 0,
    }));

    const byScanType = Object.entries(byScanTypeMap).map(([scanType, v]) => ({
      scanType, total: v.total, helpful: v.helpful, notHelpful: v.notHelpful,
      helpfulRate: v.total > 0 ? v.helpful / v.total : 0,
    }));

    const heatmap = Object.values(heatmapMap).map((v) => ({
      riskLevel: v.riskLevel, scanType: v.scanType, total: v.total,
      helpfulRate: v.total > 0 ? v.helpful / v.total : 0,
    }));

    const trendKeys = Object.keys(trendMap).sort();
    const feedbackTrend = trendKeys.map((date) => ({
      date, total: trendMap[date].total, helpful: trendMap[date].helpful, notHelpful: trendMap[date].notHelpful,
    }));

    const recentNegative = rows
      .filter((r) => r.helpful === false && r.comment && r.comment.trim() !== '')
      .slice(0, 20)
      .map((r) => ({
        id: r.id, scanType: r.scan_type, riskLevel: r.risk_level,
        comment: r.comment ?? '', createdAt: r.created_at,
      }));

    const payload = {
      totalFeedback, helpfulCount, notHelpfulCount, helpfulRate, windowDays: 90,
      byRiskLevel, byScanType, heatmap, feedbackTrend, recentNegative,
    };

    const res = NextResponse.json(payload);
    res.headers.set('Cache-Control', 'public, max-age=60, s-maxage=60');
    return res;
  } catch {
    return NextResponse.json({ error: 'Failed to load feedback summary' }, { status: 500 });
  }
}
