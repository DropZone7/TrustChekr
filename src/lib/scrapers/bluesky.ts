import {
  ScamReport, ScamCategory, CATEGORY_QUERIES, USER_AGENT,
  delay, extractIndicators, detectRegion,
} from './types';

const BSKY_API = 'https://public.api.bsky.app/xrpc/app.bsky.feed.searchPosts';

async function searchBluesky(query: string, category: ScamCategory): Promise<ScamReport[]> {
  const url = `${BSKY_API}?q=${encodeURIComponent(query)}&limit=25&sort=latest`;

  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT },
  });

  if (!res.ok) return [];

  const json = await res.json();
  const posts = json?.posts || [];

  return posts.map((post: any) => {
    const record = post.record || {};
    const text = record.text || '';
    const author = post.author?.handle || 'unknown';
    const likes = post.likeCount || 0;
    const reposts = post.repostCount || 0;

    return {
      id: `bsky_${post.uri?.split('/').pop() || Math.random().toString(36).slice(2)}`,
      source: 'bluesky' as const,
      category,
      title: text.slice(0, 100),
      content: text.slice(0, 500),
      url: `https://bsky.app/profile/${author}/post/${post.uri?.split('/').pop() || ''}`,
      author,
      timestamp: record.createdAt || new Date().toISOString(),
      engagement: likes + reposts,
      region: detectRegion(text),
      indicators: extractIndicators(text),
    };
  });
}

export async function scrapeBluesky(): Promise<ScamReport[]> {
  const reports: ScamReport[] = [];

  try {
    for (const [category, queries] of Object.entries(CATEGORY_QUERIES)) {
      for (const query of queries) {
        try {
          const results = await searchBluesky(query, category as ScamCategory);
          reports.push(...results);
          await delay(500);
        } catch {
          // continue
        }
      }
    }
  } catch (err) {
    console.error('[Bluesky scraper] Fatal error:', err);
  }

  return reports;
}
