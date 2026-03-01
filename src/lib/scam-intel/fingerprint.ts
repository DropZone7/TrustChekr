// Scam Fingerprinting Engine
// Text normalization, fuzzy hashing, indicator extraction, campaign matching

import type { ScamCampaign, ScamVariant, ScamIndicator, FingerprintResult } from './types';
import { getAllCampaigns, findIndicatorByValue } from '@/lib/db/json-store';

// ── Text Normalization ──────────────────────────────────────────────
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/https?:\/\/\S+/gi, ' __URL__ ')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// ── N-gram generation ───────────────────────────────────────────────
function getNgrams(text: string, n: number): Set<string> {
  const words = text.split(' ').filter(Boolean);
  const grams = new Set<string>();
  for (let i = 0; i <= words.length - n; i++) {
    grams.add(words.slice(i, i + n).join(' '));
  }
  return grams;
}

// ── Jaccard Similarity ─────────────────────────────────────────────
function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 0;
  let intersection = 0;
  for (const item of a) {
    if (b.has(item)) intersection++;
  }
  const union = a.size + b.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

// ── Simhash (64-bit via two 32-bit halves) ──────────────────────────
function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return h >>> 0;
}

export function simhash(text: string): string {
  const tokens = text.split(' ').filter(Boolean);
  const bits = 32;
  const v = new Array(bits).fill(0);
  for (const token of tokens) {
    const h = hashString(token);
    for (let i = 0; i < bits; i++) {
      v[i] += (h >> i) & 1 ? 1 : -1;
    }
  }
  let hash = 0;
  for (let i = 0; i < bits; i++) {
    if (v[i] > 0) hash |= 1 << i;
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

// ── Indicator Extraction ────────────────────────────────────────────
export interface ExtractedIndicators {
  phones: string[];
  emails: string[];
  urls: string[];
  crypto_wallets: string[];
}

export function extractIndicators(text: string): ExtractedIndicators {
  const phones = Array.from(new Set(
    (text.match(/(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g) || [])
      .map((p) => p.replace(/[\s\-().]/g, ''))
  ));

  const emails = Array.from(new Set(
    (text.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g) || [])
      .map((e) => e.toLowerCase())
  ));

  const urls = Array.from(new Set(
    (text.match(/https?:\/\/[^\s<>"{}|\\^`\[\]]+/gi) || [])
      .map((u) => u.toLowerCase().replace(/[.,;:!?)]+$/, ''))
  ));

  const btc = text.match(/\b(1|3|bc1)[a-zA-HJ-NP-Z0-9]{25,62}\b/g) || [];
  const eth = text.match(/\b0x[a-fA-F0-9]{40}\b/g) || [];
  const crypto_wallets = Array.from(new Set([...btc, ...eth]));

  return { phones, emails, urls, crypto_wallets };
}

// ── Campaign Matching ───────────────────────────────────────────────
export function fingerprint(content: string, type: string = 'text'): FingerprintResult {
  const campaigns = getAllCampaigns();

  // 1. Check for exact indicator matches first (fast path)
  if (type !== 'text') {
    const match = findIndicatorByValue(content);
    if (match) {
      const relatedIndicators = match.campaign.indicators.filter((i) => i.id !== match.indicator.id);
      return {
        matched: true,
        confidence: 0.95,
        campaign: match.campaign,
        variant: match.campaign.variants[0] || null,
        related_indicators: relatedIndicators,
        similar_campaigns: findSimilarCampaigns(match.campaign, campaigns, 3),
      };
    }
  }

  // 2. Extract indicators from text content
  const extracted = extractIndicators(content);
  const allExtracted = [...extracted.phones, ...extracted.emails, ...extracted.urls, ...extracted.crypto_wallets];

  for (const val of allExtracted) {
    const match = findIndicatorByValue(val);
    if (match) {
      const relatedIndicators = match.campaign.indicators.filter((i) => i.value !== val);
      return {
        matched: true,
        confidence: 0.95,
        campaign: match.campaign,
        variant: findBestVariant(match.campaign, content),
        related_indicators: relatedIndicators,
        similar_campaigns: findSimilarCampaigns(match.campaign, campaigns, 3),
      };
    }
  }

  // 3. Fuzzy text matching against all variant templates
  const normalized = normalizeText(content);
  const inputNgrams = getNgrams(normalized, 2);

  let bestMatch: { campaign: ScamCampaign; variant: ScamVariant; similarity: number } | null = null;

  for (const campaign of campaigns) {
    for (const variant of campaign.variants) {
      const variantNormalized = normalizeText(variant.template_text);
      const variantNgrams = getNgrams(variantNormalized, 2);
      const sim = jaccardSimilarity(inputNgrams, variantNgrams);

      if (sim >= 0.7 && (!bestMatch || sim > bestMatch.similarity)) {
        bestMatch = { campaign, variant, similarity: sim };
      }
    }
  }

  if (bestMatch) {
    const confidence = bestMatch.similarity >= 0.9 ? 0.85 : 0.65;
    return {
      matched: true,
      confidence,
      campaign: bestMatch.campaign,
      variant: bestMatch.variant,
      related_indicators: bestMatch.campaign.indicators,
      similar_campaigns: findSimilarCampaigns(bestMatch.campaign, campaigns, 3),
    };
  }

  // 4. No match — check for category-level similarity (weaker signal)
  return {
    matched: false,
    confidence: 0,
    campaign: null,
    variant: null,
    related_indicators: [],
    similar_campaigns: [],
  };
}

function findBestVariant(campaign: ScamCampaign, content: string): ScamVariant | null {
  if (campaign.variants.length === 0) return null;
  const normalized = normalizeText(content);
  const inputNgrams = getNgrams(normalized, 2);
  let best: ScamVariant | null = null;
  let bestSim = -1;

  for (const variant of campaign.variants) {
    const vNorm = normalizeText(variant.template_text);
    const vNgrams = getNgrams(vNorm, 2);
    const sim = jaccardSimilarity(inputNgrams, vNgrams);
    if (sim > bestSim) {
      bestSim = sim;
      best = variant;
    }
  }
  return best;
}

function findSimilarCampaigns(target: ScamCampaign, all: ScamCampaign[], limit: number): ScamCampaign[] {
  return all
    .filter((c) => c.id !== target.id && c.category === target.category)
    .sort((a, b) => b.report_count - a.report_count)
    .slice(0, limit);
}
