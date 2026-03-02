import {
  ScamReport, USER_AGENT, extractIndicators, classifyCategory,
} from './types';

interface GovSource {
  name: string;
  source: ScamReport['source'];
  url: string;
  region: string;
}

const GOV_SOURCES: GovSource[] = [
  {
    name: 'CAFC',
    source: 'cafc',
    url: 'https://www.antifraudcentre-centreantifraude.ca/scams-fraudes/',
    region: 'CA',
  },
  {
    name: 'FTC',
    source: 'ftc',
    url: 'https://consumer.ftc.gov/scam-alerts',
    region: 'US',
  },
  {
    name: 'BBB',
    source: 'bbb',
    url: 'https://www.bbb.org/scamtracker',
    region: 'US',
  },
  {
    name: 'Cyber.gc.ca',
    source: 'cyber_gc',
    url: 'https://www.cyber.gc.ca/en/alerts-advisories',
    region: 'CA',
  },
];

async function fetchAndParse(src: GovSource): Promise<ScamReport[]> {
  try {
    const res = await fetch(src.url, {
      headers: { 'User-Agent': USER_AGENT },
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) return [];

    const html = await res.text();

    // Extract text content from HTML — simple extraction
    const textContent = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Look for alert/scam-related sections
    // Extract sentences that contain scam-related keywords
    const sentences = textContent.split(/[.!?]+/).filter((s) => {
      const lower = s.toLowerCase();
      return (
        lower.includes('scam') || lower.includes('fraud') || lower.includes('phishing') ||
        lower.includes('alert') || lower.includes('warning') || lower.includes('threat') ||
        lower.includes('malware') || lower.includes('ransomware') || lower.includes('identity')
      );
    });

    if (sentences.length === 0) {
      // Create a single report from the source as a signal it's active
      return [{
        id: `${src.source}_${Date.now()}`,
        source: src.source,
        category: classifyCategory(textContent.slice(0, 2000)),
        title: `${src.name} - Active Alerts`,
        content: textContent.slice(0, 500),
        url: src.url,
        author: src.name,
        timestamp: new Date().toISOString(),
        engagement: 100, // Government sources get baseline high engagement
        region: src.region,
        indicators: extractIndicators(textContent.slice(0, 2000)),
      }];
    }

    // Create reports from extracted sentences (up to 10)
    return sentences.slice(0, 10).map((sentence, i) => ({
      id: `${src.source}_${Date.now()}_${i}`,
      source: src.source,
      category: classifyCategory(sentence),
      title: sentence.trim().slice(0, 120),
      content: sentence.trim().slice(0, 500),
      url: src.url,
      author: src.name,
      timestamp: new Date().toISOString(),
      engagement: 100, // Government = authoritative baseline
      region: src.region,
      indicators: extractIndicators(sentence),
    }));
  } catch (err) {
    console.error(`[Gov scraper] Failed to fetch ${src.name}:`, err);
    return [];
  }
}

export async function scrapeGovernment(): Promise<ScamReport[]> {
  const results = await Promise.allSettled(GOV_SOURCES.map(fetchAndParse));

  return results.flatMap((r) => (r.status === 'fulfilled' ? r.value : []));
}
