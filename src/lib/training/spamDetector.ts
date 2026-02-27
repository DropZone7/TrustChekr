/**
 * Spam Keyword Detector — trained from 5,572 labeled SMS messages
 * Source: UCI SMS Spam Collection Dataset
 * Keywords extracted from 747 confirmed spam messages (>5% frequency)
 */

// Embedded top spam keywords with their frequency counts
const SPAM_KEYWORDS: Record<string, number> = {
  call: 347, your: 263, free: 216, have: 135, from: 128, mobile: 123,
  text: 120, stop: 115, claim: 113, with: 109, reply: 101, prize: 92,
  this: 87, only: 79, just: 78, send: 72, been: 66, urgent: 62,
  cash: 58, offer: 57, guaranteed: 55, tone: 53, customer: 51,
  service: 50, please: 48, contact: 46, number: 45, account: 43,
  awarded: 41, latest: 40, winner: 39, national: 38, congrats: 37,
};

const maxCount = Math.max(...Object.values(SPAM_KEYWORDS));
const NORMALIZED: Record<string, number> = {};
for (const [word, count] of Object.entries(SPAM_KEYWORDS)) {
  NORMALIZED[word] = count / maxCount;
}

export function scoreSpamLikelihood(text: string): {
  score: number;
  matchedKeywords: string[];
  isLikelySpam: boolean;
} {
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/);
  const matchedKeywords: string[] = [];
  let totalWeight = 0;

  for (const word of words) {
    if (NORMALIZED[word]) {
      totalWeight += NORMALIZED[word];
      if (!matchedKeywords.includes(word)) matchedKeywords.push(word);
    }
  }

  const keywordDensity = matchedKeywords.length / Math.max(words.length, 1);
  const score = Math.min(100, Math.round(
    (totalWeight * 15) + (keywordDensity * 200) + (matchedKeywords.length * 5)
  ));

  return { score, matchedKeywords, isLikelySpam: score >= 40 };
}
