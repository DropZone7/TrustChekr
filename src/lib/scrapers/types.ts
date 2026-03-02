export type ScamSource = 'x' | 'reddit' | 'bluesky' | 'mastodon' | 'cafc' | 'ftc' | 'bbb' | 'cyber_gc';
export type ScamCategory = 'phone_scams' | 'online_scams' | 'financial_fraud' | 'romance_scams' | 'identity_theft';
export type ThreatLevel = 'low' | 'moderate' | 'elevated' | 'high' | 'critical';
export type TrendDirection = 'rising' | 'stable' | 'declining';

export interface ScamReport {
  id: string;
  source: ScamSource;
  category: ScamCategory;
  title: string;
  content: string;
  url: string;
  author: string;
  timestamp: string;
  engagement: number;
  region: string | null;
  indicators: string[];
}

export interface TrendCategory {
  category: ScamCategory;
  label: string;
  level: ThreatLevel;
  reports: ScamReport[];
  reportCount: number;
  sources: string[];
  summary: string;
  change: TrendDirection;
  lastUpdated: string;
}

export const CATEGORY_QUERIES: Record<ScamCategory, string[]> = {
  phone_scams: ['phone scam', 'scam call', 'CRA scam', 'spoofed number'],
  online_scams: ['phishing', 'fake website', 'scam email', 'hacked account'],
  financial_fraud: ['crypto scam', 'investment scam', 'pig butchering', 'ponzi'],
  romance_scams: ['romance scam', 'catfish', 'dating scam', 'love bomb'],
  identity_theft: ['identity stolen', 'SIN scam', 'data breach', 'credit fraud'],
};

export const CATEGORY_LABELS: Record<ScamCategory, string> = {
  phone_scams: 'Phone Scams',
  online_scams: 'Online Scams',
  financial_fraud: 'Financial Fraud',
  romance_scams: 'Romance Scams',
  identity_theft: 'Identity Theft',
};

export const USER_AGENT = 'TrustChekr/1.0 (scam-research; trustchekr.com)';

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Extract phone numbers, URLs, and emails from text */
export function extractIndicators(text: string): string[] {
  const indicators: string[] = [];
  const phoneRegex = /(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
  const urlRegex = /https?:\/\/[^\s<>"]+/gi;
  const emailRegex = /[\w.-]+@[\w.-]+\.\w{2,}/g;

  const phones = text.match(phoneRegex);
  const urls = text.match(urlRegex);
  const emails = text.match(emailRegex);

  if (phones) indicators.push(...phones.slice(0, 5));
  if (urls) indicators.push(...urls.slice(0, 5));
  if (emails) indicators.push(...emails.slice(0, 5));

  return indicators;
}

/** Detect region from text content */
export function detectRegion(text: string): string | null {
  const lower = text.toLowerCase();

  const caProvinces: Record<string, string> = {
    'ontario': 'CA-ON', 'quebec': 'CA-QC', 'british columbia': 'CA-BC',
    'alberta': 'CA-AB', 'manitoba': 'CA-MB', 'saskatchewan': 'CA-SK',
    'nova scotia': 'CA-NS', 'new brunswick': 'CA-NB', 'newfoundland': 'CA-NL',
    'pei': 'CA-PE', 'prince edward island': 'CA-PE',
    'toronto': 'CA-ON', 'vancouver': 'CA-BC', 'montreal': 'CA-QC',
    'calgary': 'CA-AB', 'edmonton': 'CA-AB', 'ottawa': 'CA-ON',
    'winnipeg': 'CA-MB',
  };

  for (const [key, region] of Object.entries(caProvinces)) {
    if (lower.includes(key)) return region;
  }

  if (/\b(canada|canadian|cra|rcmp)\b/i.test(text)) return 'CA';
  if (/\b[A-Z]\d[A-Z]\s?\d[A-Z]\d\b/.test(text)) return 'CA';
  // Canadian area codes
  if (/\b(416|647|437|905|289|613|343|519|226|705|249|807|902|204|306|403|587|780|604|778|250)\b/.test(text)) return 'CA';

  if (/\b(irs|fbi|ftc|usa|united states|american)\b/i.test(text)) return 'US';

  return null;
}

/** Classify text into a scam category by keyword matching */
export function classifyCategory(text: string): ScamCategory {
  const lower = text.toLowerCase();

  const scores: Record<ScamCategory, number> = {
    phone_scams: 0, online_scams: 0, financial_fraud: 0,
    romance_scams: 0, identity_theft: 0,
  };

  for (const [category, queries] of Object.entries(CATEGORY_QUERIES)) {
    for (const q of queries) {
      if (lower.includes(q.toLowerCase())) {
        scores[category as ScamCategory] += 1;
      }
    }
  }

  let best: ScamCategory = 'online_scams';
  let bestScore = 0;
  for (const [cat, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score;
      best = cat as ScamCategory;
    }
  }

  return best;
}
