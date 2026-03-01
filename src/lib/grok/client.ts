/**
 * Grok/xAI API Client for TrustChekr
 *
 * Uses the Responses API (/v1/responses) with x_search built-in tool.
 * Model: grok-4-1-fast-non-reasoning (cheapest with server-side tool support)
 *
 * IMPORTANT: x_search only works with grok-4 family via /v1/responses.
 * Do NOT use /v1/chat/completions — that's a different API.
 */

const XAI_API_KEY = process.env.XAI_API_KEY;
const XAI_BASE_URL = 'https://api.x.ai/v1';

export interface TrendCategory {
  name: string;
  level: 'low' | 'moderate' | 'high' | 'critical';
  emoji: string;
  description: string;
  postCount: number;
  change: 'rising' | 'stable' | 'falling';
  academyLink?: string;
}

interface GrokResponse {
  output: Array<{
    type: string;
    content?: Array<{
      type: string;
      text?: string;
      annotations?: Array<{ type: string; url: string; title: string }>;
    }>;
  }>;
  usage?: { num_sources_used: number };
}

const CATEGORY_CONFIG = [
  { name: 'CRA / IRS Tax Scams', emoji: '🏛️', academyLink: '/academy/government-impersonation' },
  { name: 'Bank Impersonation', emoji: '🏦', academyLink: '/academy/financial-scams' },
  { name: 'Crypto & Investment', emoji: '💰', academyLink: '/academy/financial-scams' },
  { name: 'Romance Scams', emoji: '💔', academyLink: '/academy/romance-scams' },
  { name: 'AI Deepfake Scams', emoji: '🤖', academyLink: undefined },
];

/**
 * Run a full scam trend scan via Grok x_search.
 * Returns structured trend data ready for the /api/trends endpoint.
 */
export async function scanScamTrends(): Promise<TrendCategory[]> {
  if (!XAI_API_KEY) throw new Error('XAI_API_KEY not set');

  const response = await fetch(`${XAI_BASE_URL}/responses`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${XAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'grok-4-1-fast-non-reasoning',
      input: [
        {
          role: 'user',
          content: `Search X for recent posts (last few days) about each of these scam types. Do NOT use geo filters - search globally. For each category give me: post count found, a severity assessment (low/moderate/high/critical), whether activity is rising/stable/falling, and a one-sentence description of what people are reporting.

Categories:
1. CRA tax scam OR IRS tax scam
2. Bank impersonation scam calls
3. Crypto pig butchering OR investment scam
4. Romance scam
5. AI deepfake voice clone scam

Return ONLY valid JSON in this exact format:
{
  "categories": [
    {"name": "...", "post_count": 0, "severity": "low", "trend": "stable", "description": "..."},
    ...
  ]
}`,
        },
      ],
      tools: [{ type: 'x_search' }],
    }),
  });

  const data: GrokResponse = await response.json();

  // Extract the message text (last output item)
  const msgItem = data.output?.find((item) => item.type === 'message');
  if (!msgItem?.content) return [];

  const textContent = msgItem.content.find((c) => c.type === 'output_text' || c.type === 'text');
  if (!textContent?.text) return [];

  // Parse JSON from response
  const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return [];

  const parsed = JSON.parse(jsonMatch[0]);

  // Map to our format
  return parsed.categories.map((cat: any, i: number) => {
    const config = CATEGORY_CONFIG[i] || { name: cat.name, emoji: '⚠️' };
    const severity = cat.severity?.toLowerCase() || 'low';

    return {
      name: config.name,
      emoji: config.emoji,
      level: severity as TrendCategory['level'],
      description: cat.description || cat.summary || '',
      postCount: cat.post_count || cat.post_count_found || 0,
      change: (cat.trend || cat.activity || 'stable') as TrendCategory['change'],
      academyLink: config.academyLink,
    };
  });
}

/**
 * Push trend data to the TrustChekr trends API.
 * Called by external cron (e.g., OpenClaw heartbeat or dedicated cron job).
 */
export async function pushTrendsToApi(
  apiUrl: string,
  updateKey: string,
  categories: TrendCategory[],
): Promise<boolean> {
  const response = await fetch(`${apiUrl}/api/trends`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${updateKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ categories }),
  });

  return response.ok;
}
