import { NextResponse } from 'next/server';
import { fetchAllSources } from '@/lib/scrapers/aggregator';

interface TrendCategoryData {
  name: string;
  level: 'low' | 'moderate' | 'elevated' | 'high' | 'critical';
  emoji: string;
  description: string;
  postCount: number;
  change: 'rising' | 'stable' | 'falling' | 'declining';
  academyLink?: string;
  sources?: string[];
  reportCount?: number;
}

interface TrendData {
  lastUpdated: string;
  categories: TrendCategoryData[];
  sourceCount?: number;
}

// In-memory trend cache — updated by POST /api/trends or background fetch
let trendCache: TrendData | null = null;
let lastFetchTime = 0;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

const DEFAULT_TRENDS: TrendData = {
  lastUpdated: new Date().toISOString(),
  sourceCount: 6,
  categories: [
    {
      name: "Phone Scams",
      level: "moderate",
      emoji: "📱",
      description: "Spoofed calls and government impersonation active across multiple platforms",
      postCount: 8,
      change: "stable",
      sources: ['x', 'reddit'],
      reportCount: 8,
    },
    {
      name: "Online Scams",
      level: "high",
      emoji: "🌐",
      description: "Phishing campaigns and fake websites targeting credentials",
      postCount: 15,
      change: "rising",
      sources: ['x', 'reddit', 'mastodon'],
      reportCount: 15,
    },
    {
      name: "Financial Fraud",
      level: "high",
      emoji: "💰",
      description: "Crypto scams and pig butchering operations — significant losses reported",
      postCount: 18,
      change: "rising",
      sources: ['x', 'reddit', 'bluesky'],
      reportCount: 18,
    },
    {
      name: "Romance Scams",
      level: "moderate",
      emoji: "💔",
      description: "Dating app scams funneling victims into crypto investments",
      postCount: 10,
      change: "stable",
      sources: ['x', 'reddit'],
      reportCount: 10,
    },
    {
      name: "Identity Theft",
      level: "elevated",
      emoji: "🪪",
      description: "Data breach exploitation and SIN/SSN fraud reports increasing",
      postCount: 12,
      change: "rising",
      sources: ['x', 'reddit', 'cyber_gc'],
      reportCount: 12,
    },
  ],
};

async function getOrFetchTrends(): Promise<TrendData> {
  if (trendCache && Date.now() - lastFetchTime < CACHE_TTL) {
    return trendCache;
  }

  // Try background fetch from aggregator (non-blocking for first request)
  try {
    const trends = await fetchAllSources();
    const allSources = [...new Set(trends.flatMap((t) => t.sources))];

    trendCache = {
      lastUpdated: new Date().toISOString(),
      sourceCount: allSources.length,
      categories: trends.map((t) => ({
        name: t.label,
        level: t.level,
        emoji: getCategoryEmoji(t.category),
        description: t.summary,
        postCount: t.reportCount,
        change: t.change === 'declining' ? ('falling' as const) : t.change,
        sources: t.sources,
        reportCount: t.reportCount,
      })),
    };
    lastFetchTime = Date.now();
    return trendCache;
  } catch (err) {
    console.error('[trends] Aggregator fetch failed, using cache/defaults:', err);
    return trendCache || DEFAULT_TRENDS;
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

export async function GET() {
  const data = await getOrFetchTrends();
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
    },
  });
}

export async function POST(request: Request) {
  const authHeader = request.headers.get('Authorization');
  const expectedKey = process.env.TRENDS_UPDATE_KEY;

  if (!expectedKey || authHeader !== `Bearer ${expectedKey}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    trendCache = {
      lastUpdated: new Date().toISOString(),
      sourceCount: body.sourceCount || undefined,
      categories: body.categories,
    };
    lastFetchTime = Date.now();
    return NextResponse.json({ ok: true, lastUpdated: trendCache.lastUpdated });
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}
