import {
  ScamReport, ScamCategory, CATEGORY_QUERIES, USER_AGENT,
  delay, extractIndicators, detectRegion, classifyCategory,
} from './types';

const SUBREDDITS = [
  'Scams', 'personalfinance', 'antiMLM', 'PhishingEmails',
  'canadapersonalfinance', 'legaladvicecanada', 'fraud',
];

async function searchSubreddit(
  subreddit: string,
  query: string,
  category: ScamCategory,
): Promise<ScamReport[]> {
  const url = `https://www.reddit.com/r/${subreddit}/search.json?q=${encodeURIComponent(query)}&sort=new&t=day&limit=10`;

  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT },
  });

  if (!res.ok) return [];

  const json = await res.json();
  const posts = json?.data?.children || [];

  return posts.map((child: any) => {
    const p = child.data;
    const text = `${p.title || ''} ${p.selftext || ''}`;
    return {
      id: `reddit_${p.id}`,
      source: 'reddit' as const,
      category,
      title: p.title || '',
      content: (p.selftext || '').slice(0, 500),
      url: `https://reddit.com${p.permalink}`,
      author: p.author || 'anonymous',
      timestamp: new Date((p.created_utc || 0) * 1000).toISOString(),
      engagement: (p.score || 0) + (p.num_comments || 0),
      region: detectRegion(text),
      indicators: extractIndicators(text),
    };
  });
}

export async function scrapeReddit(): Promise<ScamReport[]> {
  const reports: ScamReport[] = [];

  try {
    for (const [category, queries] of Object.entries(CATEGORY_QUERIES)) {
      for (const query of queries) {
        // Pick 2 subreddits per query to limit requests
        const subs = SUBREDDITS.slice(0, 3);
        for (const sub of subs) {
          try {
            const results = await searchSubreddit(sub, query, category as ScamCategory);
            reports.push(...results);
            await delay(1100); // Reddit rate limit: 1 req/sec
          } catch {
            // individual request failure is fine
          }
        }
      }
    }
  } catch (err) {
    console.error('[Reddit scraper] Fatal error:', err);
  }

  return reports;
}
