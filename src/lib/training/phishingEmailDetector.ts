/**
 * Phishing Email Detector — trained on 5,100 labeled emails (2,036 phishing, 3,064 safe)
 * Source: zefang-liu/phishing-email-dataset (HuggingFace, Feb 2026)
 *
 * Uses keyword frequency ratios to score email/message content.
 * Each keyword has a weight based on how much more it appears in phishing vs safe emails.
 */

type PhishingKeyword = { weight: number; ratio: number };

// Keywords that appear 3x+ more in phishing emails than safe ones
// Weight = log2(ratio) normalized, so higher ratio = higher weight
const PHISHING_KEYWORDS: Record<string, PhishingKeyword> = {
  // Extreme signals (>20x ratio)
  mortgage: { weight: 6.9, ratio: 117 },
  cialis: { weight: 6.8, ratio: 111 },
  uncertainties: { weight: 6.4, ratio: 85 },
  viagra: { weight: 6.2, ratio: 75 },
  pills: { weight: 6.0, ratio: 63 },
  mailings: { weight: 5.8, ratio: 57.5 },
  lottery: { weight: 5.0, ratio: 32.7 },
  prescription: { weight: 5.0, ratio: 32 },

  // Strong signals (10-20x ratio)
  statements: { weight: 3.5, ratio: 11.2 },
  advertisement: { weight: 3.4, ratio: 10.4 },
  investing: { weight: 3.3, ratio: 9.7 },
  guaranteed: { weight: 3.3, ratio: 9.6 },

  // Medium signals (5-10x ratio)
  remove: { weight: 3.1, ratio: 8.7 },
  orders: { weight: 2.7, ratio: 6.4 },
  bulk: { weight: 2.6, ratio: 6.0 },
  shipping: { weight: 2.5, ratio: 5.7 },
  subscribers: { weight: 2.5, ratio: 5.6 },
  sites: { weight: 2.4, ratio: 5.1 },
  bonus: { weight: 2.3, ratio: 4.9 },
  dollars: { weight: 2.3, ratio: 4.8 },
  save: { weight: 2.2, ratio: 4.6 },
  lose: { weight: 2.2, ratio: 4.6 },
  invest: { weight: 2.2, ratio: 4.5 },
  money: { weight: 2.1, ratio: 4.4 },
  advertising: { weight: 2.1, ratio: 4.2 },
  links: { weight: 2.0, ratio: 4.0 },
  thousands: { weight: 2.0, ratio: 4.0 },

  // Moderate signals (3-5x ratio)
  hundreds: { weight: 1.9, ratio: 3.8 },
  addresses: { weight: 1.8, ratio: 3.6 },
  receiving: { weight: 1.8, ratio: 3.5 },
  insurance: { weight: 1.8, ratio: 3.4 },
  absolutely: { weight: 1.8, ratio: 3.4 },

  // Scam-specific additions (from domain knowledge, not in original dataset)
  // These target Canadian scam patterns
  interac: { weight: 5.0, ratio: 50 },
  etransfer: { weight: 5.0, ratio: 50 },
  'e-transfer': { weight: 5.0, ratio: 50 },
  'canada revenue': { weight: 4.5, ratio: 40 },
  'tax refund': { weight: 4.5, ratio: 40 },
  'arrest warrant': { weight: 6.0, ratio: 60 },
  'suspended account': { weight: 4.0, ratio: 30 },
  'verify your identity': { weight: 4.0, ratio: 30 },
  'click immediately': { weight: 4.5, ratio: 40 },
  'act now': { weight: 3.5, ratio: 15 },
  'limited time': { weight: 3.0, ratio: 10 },
  'congratulations': { weight: 3.0, ratio: 10 },
  'you have been selected': { weight: 4.0, ratio: 30 },
  'unclaimed funds': { weight: 5.0, ratio: 50 },
  'inheritance': { weight: 4.5, ratio: 40 },
  'nigerian prince': { weight: 6.5, ratio: 100 },
  'beneficiary': { weight: 4.0, ratio: 30 },
  'western union': { weight: 5.0, ratio: 50 },
  'moneygram': { weight: 5.0, ratio: 50 },
  'gift card': { weight: 4.5, ratio: 40 },
  'bitcoin payment': { weight: 4.5, ratio: 40 },
  'crypto wallet': { weight: 4.0, ratio: 30 },
};

// Multi-word phishing phrases (checked as substring)
const PHISHING_PHRASES: { phrase: string; weight: number }[] = [
  { phrase: 'verify your account', weight: 4.0 },
  { phrase: 'confirm your identity', weight: 4.0 },
  { phrase: 'unusual activity', weight: 3.5 },
  { phrase: 'suspicious activity', weight: 3.5 },
  { phrase: 'account will be suspended', weight: 4.5 },
  { phrase: 'account will be closed', weight: 4.5 },
  { phrase: 'click the link below', weight: 3.5 },
  { phrase: 'click here to verify', weight: 4.0 },
  { phrase: 'update your payment', weight: 3.5 },
  { phrase: 'failed delivery', weight: 3.0 },
  { phrase: 'package could not be delivered', weight: 3.5 },
  { phrase: 'you have won', weight: 4.0 },
  { phrase: 'claim your prize', weight: 4.5 },
  { phrase: 'dear valued customer', weight: 3.0 },
  { phrase: 'dear account holder', weight: 3.5 },
  { phrase: 'from the desk of', weight: 3.0 },
  { phrase: 'act within 24 hours', weight: 4.0 },
  { phrase: 'respond immediately', weight: 3.5 },
  { phrase: 'failure to comply', weight: 4.0 },
  { phrase: 'legal action will be taken', weight: 4.5 },
  { phrase: 'your account has been compromised', weight: 4.0 },
  { phrase: 'reset your password', weight: 2.5 },
  { phrase: 'amazon order', weight: 2.0 },
  { phrase: 'apple id', weight: 2.5 },
  { phrase: 'paypal transaction', weight: 2.5 },
];

export type PhishingEmailScore = {
  score: number; // 0–100
  matchedKeywords: string[];
  matchedPhrases: string[];
  topSignal: string | null;
};

/**
 * Score text content for phishing indicators.
 * Returns 0–100 score, matched keywords, and matched phrases.
 */
export function scorePhishingEmail(text: string): PhishingEmailScore {
  const lower = text.toLowerCase();
  const words = lower.split(/\s+/);

  let totalWeight = 0;
  const matchedKeywords: string[] = [];
  const matchedPhrases: string[] = [];

  // Check single keywords
  const wordSet = new Set(words);
  for (const [keyword, { weight }] of Object.entries(PHISHING_KEYWORDS)) {
    if (keyword.includes(' ')) {
      // Multi-word keyword — check as substring
      if (lower.includes(keyword)) {
        totalWeight += weight;
        matchedKeywords.push(keyword);
      }
    } else {
      if (wordSet.has(keyword)) {
        totalWeight += weight;
        matchedKeywords.push(keyword);
      }
    }
  }

  // Check phrases
  for (const { phrase, weight } of PHISHING_PHRASES) {
    if (lower.includes(phrase)) {
      totalWeight += weight;
      matchedPhrases.push(phrase);
    }
  }

  // Normalize to 0–100 (sigmoid-like curve, saturates around weight 30)
  const score = Math.min(100, Math.round((100 * totalWeight) / (totalWeight + 15)));

  const topSignal =
    matchedPhrases[0] ??
    matchedKeywords[0] ??
    null;

  return { score, matchedKeywords, matchedPhrases, topSignal };
}
