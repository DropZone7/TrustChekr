/**
 * Cron-ready trend update script.
 * Can be invoked via Vercel cron, OpenClaw cron, or standalone.
 *
 * Usage: npx tsx src/lib/scrapers/update-trends.ts
 *
 * Env vars:
 *   TRENDS_UPDATE_KEY - auth key for POST /api/trends
 *   TRENDS_API_URL - base URL (default: http://localhost:3000)
 */

import { fetchAllSources } from './aggregator';

async function main() {
  const apiUrl = process.env.TRENDS_API_URL || 'http://localhost:3000';
  const updateKey = process.env.TRENDS_UPDATE_KEY;

  if (!updateKey) {
    console.error('[update-trends] TRENDS_UPDATE_KEY not set');
    process.exit(1);
  }

  console.log('[update-trends] Fetching from all sources...');
  const startTime = Date.now();

  try {
    const trends = await fetchAllSources();

    const totalReports = trends.reduce((sum, t) => sum + t.reportCount, 0);
    const allSources = [...new Set(trends.flatMap((t) => t.sources))];

    console.log(`[update-trends] Aggregated ${totalReports} reports from ${allSources.length} sources in ${Date.now() - startTime}ms`);

    // Map to the existing API format
    const categories = trends.map((t) => ({
      name: t.label,
      level: t.level === 'elevated' ? 'moderate' : t.level, // Map 'elevated' for backward compat
      emoji: getCategoryEmoji(t.category),
      description: t.summary,
      postCount: t.reportCount,
      change: t.change === 'declining' ? 'falling' : t.change, // Map 'declining' -> 'falling'
      sources: t.sources,
      reportCount: t.reportCount,
    }));

    const res = await fetch(`${apiUrl}/api/trends`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${updateKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ categories }),
    });

    if (res.ok) {
      console.log('[update-trends] Successfully pushed trends to API');
    } else {
      console.error('[update-trends] API returned', res.status, await res.text());
      process.exit(1);
    }
  } catch (err) {
    console.error('[update-trends] Fatal error:', err);
    process.exit(1);
  }
}

function getCategoryEmoji(category: string): string {
  const map: Record<string, string> = {
    phone_scams: '📱',
    online_scams: '🌐',
    financial_fraud: '💰',
    romance_scams: '💔',
    identity_theft: '🪪',
  };
  return map[category] || '⚠️';
}

main();
