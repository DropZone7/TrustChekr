import { NextResponse } from 'next/server';

interface TrendCategory {
  name: string;
  level: 'low' | 'moderate' | 'high' | 'critical';
  emoji: string;
  description: string;
  postCount: number;
  change: 'rising' | 'stable' | 'falling';
  academyLink?: string;
}

interface TrendData {
  lastUpdated: string;
  categories: TrendCategory[];
}

// In-memory trend cache — updated by POST /api/trends/update
// Falls back to curated defaults on cold start
let trendCache: TrendData | null = null;

const DEFAULT_TRENDS: TrendData = {
  lastUpdated: new Date().toISOString(),
  categories: [
    {
      name: "CRA / IRS Tax Scams",
      level: "moderate",
      emoji: "🏛️",
      description: "Tax season impersonation calls and texts active",
      postCount: 6,
      change: "stable",
      academyLink: "/academy/government-impersonation",
    },
    {
      name: "Bank Impersonation",
      level: "high",
      emoji: "🏦",
      description: "Fake fraud department calls — victims losing thousands",
      postCount: 10,
      change: "rising",
      academyLink: "/academy/financial-scams",
    },
    {
      name: "Crypto & Investment",
      level: "high",
      emoji: "💰",
      description: "Pig butchering operations — $580M+ in seizures",
      postCount: 14,
      change: "rising",
      academyLink: "/academy/financial-scams",
    },
    {
      name: "Romance Scams",
      level: "high",
      emoji: "💔",
      description: "Billion-dollar losses — dating apps to crypto pipeline",
      postCount: 12,
      change: "stable",
      academyLink: "/academy/romance-scams",
    },
    {
      name: "AI Deepfake Scams",
      level: "high",
      emoji: "🤖",
      description: "Voice cloning and AI vishing attacks growing",
      postCount: 10,
      change: "rising",
    },
  ],
};

export async function GET() {
  const data = trendCache || DEFAULT_TRENDS;
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
    },
  });
}

export async function POST(request: Request) {
  // Protected update endpoint — called by external cron/webhook
  const authHeader = request.headers.get('Authorization');
  const expectedKey = process.env.TRENDS_UPDATE_KEY;

  if (!expectedKey || authHeader !== `Bearer ${expectedKey}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    trendCache = {
      lastUpdated: new Date().toISOString(),
      categories: body.categories,
    };
    return NextResponse.json({ ok: true, lastUpdated: trendCache.lastUpdated });
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}
