import { scrapeReddit } from './reddit';
import { scrapeBluesky } from './bluesky';
import { scrapeMastodon } from './mastodon';
import { scrapeGovernment } from './government';
import {
  ScamReport, ScamCategory, TrendCategory, ThreatLevel, TrendDirection,
  CATEGORY_LABELS,
} from './types';

const GOV_SOURCES = new Set(['cafc', 'ftc', 'bbb', 'cyber_gc']);

/** Simple content hash for dedup */
function simpleHash(text: string): string {
  const normalized = text.toLowerCase().replace(/\s+/g, ' ').trim().slice(0, 200);
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = ((hash << 5) - hash + normalized.charCodeAt(i)) | 0;
  }
  return hash.toString(36);
}

/** Jaccard similarity between two strings (word-level) */
function jaccardSimilarity(a: string, b: string): number {
  const wordsA = new Set(a.toLowerCase().split(/\s+/).filter(w => w.length > 3));
  const wordsB = new Set(b.toLowerCase().split(/\s+/).filter(w => w.length > 3));
  if (wordsA.size === 0 && wordsB.size === 0) return 1;
  const intersection = new Set([...wordsA].filter(w => wordsB.has(w)));
  const union = new Set([...wordsA, ...wordsB]);
  return union.size === 0 ? 0 : intersection.size / union.size;
}

/** Deduplicate reports */
function deduplicateReports(reports: ScamReport[]): ScamReport[] {
  const seen = new Map<string, ScamReport>();
  const result: ScamReport[] = [];

  for (const report of reports) {
    const hash = simpleHash(report.content || report.title);
    if (seen.has(hash)) continue;

    // Check Jaccard similarity against recent reports
    let isDupe = false;
    for (const existing of result.slice(-50)) {
      if (jaccardSimilarity(report.content, existing.content) > 0.8) {
        isDupe = true;
        break;
      }
    }

    if (!isDupe) {
      seen.set(hash, report);
      result.push(report);
    }
  }

  return result;
}

/** Calculate threat level from report count */
function calculateLevel(count: number, hasSourceDiversity: boolean): ThreatLevel {
  let level: ThreatLevel;
  if (count <= 5) level = 'low';
  else if (count <= 15) level = 'moderate';
  else if (count <= 30) level = 'elevated';
  else if (count <= 50) level = 'high';
  else level = 'critical';

  // Source diversity bonus
  if (hasSourceDiversity && level !== 'critical') {
    const levels: ThreatLevel[] = ['low', 'moderate', 'elevated', 'high', 'critical'];
    const idx = levels.indexOf(level);
    level = levels[Math.min(idx + 1, levels.length - 1)];
  }

  return level;
}

/** Generate a template summary (no AI call needed) */
function generateSummary(category: ScamCategory, reports: ScamReport[], level: ThreatLevel): string {
  const count = reports.length;
  const sources = [...new Set(reports.map(r => r.source))];

  const templates: Record<ScamCategory, string> = {
    phone_scams: `${count} phone scam reports detected across ${sources.length} sources. Common tactics include spoofed numbers and government impersonation calls.`,
    online_scams: `${count} online scam reports including phishing attempts, fake websites, and credential theft campaigns.`,
    financial_fraud: `${count} financial fraud reports covering crypto scams, investment fraud, and pig butchering operations.`,
    romance_scams: `${count} romance scam reports detected. Scammers targeting dating platforms with emotional manipulation tactics.`,
    identity_theft: `${count} identity theft reports including stolen credentials, SIN/SSN fraud, and data breach exploitation.`,
  };

  return templates[category] || `${count} reports detected at ${level} threat level.`;
}

/** Fetch all sources and aggregate into trend categories */
export async function fetchAllSources(): Promise<TrendCategory[]> {
  const results = await Promise.allSettled([
    scrapeReddit(),
    scrapeBluesky(),
    scrapeMastodon(),
    scrapeGovernment(),
  ]);

  // Collect all reports
  let allReports: ScamReport[] = [];
  for (const result of results) {
    if (result.status === 'fulfilled') {
      allReports.push(...result.value);
    } else {
      console.error('[Aggregator] Source failed:', result.reason);
    }
  }

  // Apply government weight (2x engagement)
  allReports = allReports.map((r) => {
    if (GOV_SOURCES.has(r.source)) {
      return { ...r, engagement: r.engagement * 2 };
    }
    return r;
  });

  // Deduplicate
  allReports = deduplicateReports(allReports);

  // Group by category
  const categories: ScamCategory[] = [
    'phone_scams', 'online_scams', 'financial_fraud', 'romance_scams', 'identity_theft',
  ];

  return categories.map((category) => {
    const reports = allReports.filter((r) => r.category === category);
    const sources = [...new Set(reports.map((r) => r.source))];
    const hasSourceDiversity = sources.length >= 3;
    const level = calculateLevel(reports.length, hasSourceDiversity);

    // Simple trend: more engagement = rising
    const avgEngagement = reports.length > 0
      ? reports.reduce((sum, r) => sum + r.engagement, 0) / reports.length
      : 0;
    let change: TrendDirection = 'stable';
    if (avgEngagement > 50) change = 'rising';
    else if (reports.length <= 2) change = 'declining';

    return {
      category,
      label: CATEGORY_LABELS[category],
      level,
      reports: reports.slice(0, 50), // Cap stored reports
      reportCount: reports.length,
      sources,
      summary: generateSummary(category, reports, level),
      change,
      lastUpdated: new Date().toISOString(),
    };
  });
}
