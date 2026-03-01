/**
 * Grok/xAI API Client for TrustChekr
 * 
 * Uses the Responses API with x_search for real-time scam trend monitoring.
 * Endpoint: https://api.x.ai/v1/responses
 * Model: grok-4-1-fast-non-reasoning (cheapest with tool support)
 */

const XAI_API_KEY = process.env.XAI_API_KEY;
const XAI_BASE_URL = 'https://api.x.ai/v1';

export interface GrokSearchResult {
  content: string;
  citations: Array<{
    url: string;
    title: string;
  }>;
  sourcesUsed: number;
}

export interface ScamTrend {
  category: string;
  description: string;
  postCount: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  samplePosts: string[];
  citations: string[];
  detectedAt: string;
}

/**
 * Search X/Twitter for scam-related posts using Grok's x_search tool.
 * This is the core intelligence-gathering function.
 */
export async function searchXForScams(
  query: string,
  timeframe: '24h' | '7d' | '30d' = '24h',
): Promise<GrokSearchResult> {
  if (!XAI_API_KEY) {
    throw new Error('XAI_API_KEY not set');
  }

  const timeframeText = {
    '24h': 'in the last 24 hours',
    '7d': 'in the last 7 days',
    '30d': 'in the last 30 days',
  }[timeframe];

  const response = await fetch(`${XAI_BASE_URL}/responses`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${XAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'grok-4-1-fast-non-reasoning',
      input: [
        {
          role: 'user',
          content: `Search X/Twitter posts ${timeframeText}. ${query} Give specific posts with usernames, engagement counts, and any emerging patterns.`,
        },
      ],
      tools: [{ type: 'x_search' }],
    }),
  });

  const data = await response.json();

  // Extract text content and citations from the response
  let content = '';
  const citations: Array<{ url: string; title: string }> = [];

  for (const item of data.output || []) {
    if (item.type === 'message') {
      for (const c of item.content || []) {
        if (c.type === 'text') {
          content += c.text;
          // Extract annotations/citations
          for (const ann of c.annotations || []) {
            if (ann.type === 'url_citation') {
              citations.push({ url: ann.url, title: ann.title || '' });
            }
          }
        }
      }
    }
  }

  return {
    content,
    citations,
    sourcesUsed: data.usage?.num_sources_used || 0,
  };
}

/**
 * Run a comprehensive scam trend scan across all TrustChekr categories.
 * Designed to be called by cron job (e.g., every 6 hours).
 */
export async function scanScamTrends(): Promise<ScamTrend[]> {
  const categories = [
    {
      name: 'CRA/IRS Tax Scams',
      query: 'CRA scam OR IRS scam OR tax scam OR "revenue agency" scam OR SAT fraude. Report on government tax impersonation scam calls, texts, and emails targeting North Americans.',
    },
    {
      name: 'Bank Impersonation',
      query: 'bank scam call OR "fraud department" scam OR Zelle scam OR Venmo scam OR Interac scam OR "e-transfer" scam. Report on people receiving fake bank fraud alerts.',
    },
    {
      name: 'Crypto & Investment Fraud',
      query: 'crypto scam OR bitcoin scam OR "guaranteed returns" OR pig butchering OR "trading platform" scam. Focus on investment fraud and fake crypto platforms.',
    },
    {
      name: 'Romance & Social Engineering',
      query: 'romance scam OR dating scam OR "met someone online" scam OR catfish OR love scam. Focus on emotional manipulation and romance-to-crypto schemes.',
    },
    {
      name: 'AI-Powered Scams',
      query: 'AI scam OR deepfake scam OR voice clone scam OR "AI generated" fraud OR "sounds like" family emergency. Focus on AI-enabled fraud.',
    },
  ];

  const trends: ScamTrend[] = [];

  for (const cat of categories) {
    try {
      const result = await searchXForScams(cat.query, '24h');
      
      if (result.content) {
        trends.push({
          category: cat.name,
          description: result.content.slice(0, 500),
          postCount: result.sourcesUsed,
          severity: result.sourcesUsed > 10 ? 'high' : result.sourcesUsed > 5 ? 'medium' : 'low',
          samplePosts: [],
          citations: result.citations.map(c => c.url),
          detectedAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error(`Grok scan failed for ${cat.name}:`, err);
    }
  }

  return trends;
}

/**
 * Map ScamTrend results to the TrendData format used by /api/trends
 * and write to the cache file for the frontend to consume.
 */
export async function updateTrendCache(): Promise<void> {
  const { writeFile, mkdir } = await import('fs/promises');
  const { join } = await import('path');

  const trends = await scanScamTrends();

  const severityToLevel: Record<string, 'low' | 'moderate' | 'high' | 'critical'> = {
    low: 'low',
    medium: 'moderate',
    high: 'high',
    critical: 'critical',
  };

  const categoryMeta: Record<string, { emoji: string; change: 'rising' | 'stable' | 'falling' }> = {
    'CRA/IRS Tax Scams': { emoji: '🏛️', change: 'stable' },
    'Bank Impersonation': { emoji: '🏦', change: 'stable' },
    'Crypto & Investment Fraud': { emoji: '💰', change: 'rising' },
    'Romance & Social Engineering': { emoji: '💔', change: 'stable' },
    'AI-Powered Scams': { emoji: '🤖', change: 'rising' },
  };

  const categoryNameMap: Record<string, string> = {
    'CRA/IRS Tax Scams': 'CRA / IRS Tax Scams',
    'Bank Impersonation': 'Bank Impersonation',
    'Crypto & Investment Fraud': 'Crypto & Investment',
    'Romance & Social Engineering': 'Romance Scams',
    'AI-Powered Scams': 'AI-Powered Scams',
  };

  const trendData = {
    lastUpdated: new Date().toISOString(),
    categories: trends.map((t) => {
      const meta = categoryMeta[t.category] || { emoji: '⚠️', change: 'stable' as const };
      return {
        name: categoryNameMap[t.category] || t.category,
        level: severityToLevel[t.severity] || 'moderate',
        emoji: meta.emoji,
        description: t.description.slice(0, 200),
        postCount: t.postCount,
        change: t.postCount > 8 ? 'rising' as const : meta.change,
      };
    }),
  };

  const dataDir = join(process.cwd(), 'data');
  await mkdir(dataDir, { recursive: true });
  await writeFile(join(dataDir, 'scam-trends.json'), JSON.stringify(trendData, null, 2));
}
