import {
  ScamReport, ScamCategory, CATEGORY_QUERIES, USER_AGENT,
  delay, extractIndicators, detectRegion,
} from './types';

const INSTANCES = [
  'https://mastodon.social',
  'https://infosec.exchange',
];

const EXTRA_INFOSEC_QUERIES = ['phishing campaign', 'threat intel', 'scam alert'];

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

async function searchInstance(
  instance: string,
  query: string,
  category: ScamCategory,
): Promise<ScamReport[]> {
  const url = `${instance}/api/v2/search?q=${encodeURIComponent(query)}&type=statuses&limit=20`;

  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT },
  });

  if (!res.ok) return [];

  const json = await res.json();
  const statuses = json?.statuses || [];

  return statuses.map((status: any) => {
    const text = stripHtml(status.content || '');
    const acct = status.account?.acct || 'unknown';

    return {
      id: `mastodon_${status.id}`,
      source: 'mastodon' as const,
      category,
      title: text.slice(0, 100),
      content: text.slice(0, 500),
      url: status.url || status.uri || '',
      author: acct,
      timestamp: status.created_at || new Date().toISOString(),
      engagement: (status.favourites_count || 0) + (status.reblogs_count || 0),
      region: detectRegion(text),
      indicators: extractIndicators(text),
    };
  });
}

export async function scrapeMastodon(): Promise<ScamReport[]> {
  const reports: ScamReport[] = [];

  try {
    for (const [category, queries] of Object.entries(CATEGORY_QUERIES)) {
      const allQueries = [...queries];
      // Add infosec queries to online_scams
      if (category === 'online_scams') {
        allQueries.push(...EXTRA_INFOSEC_QUERIES);
      }

      for (const query of allQueries) {
        for (const instance of INSTANCES) {
          try {
            const results = await searchInstance(instance, query, category as ScamCategory);
            reports.push(...results);
            await delay(1000);
          } catch {
            // continue
          }
        }
      }
    }
  } catch (err) {
    console.error('[Mastodon scraper] Fatal error:', err);
  }

  return reports;
}
