import type { AIRiskTier, MatchedSignal } from './types';

// ── Weight → Penalty Mapping ─────────────────────────────────
// Rule weights are 1-10. Penalties scale non-linearly so that
// a single critical signal (weight 10) can tank the score.

const PENALTY_MAP: Record<number, number> = {
  10: 30,   // critical: exact scam script, known phishing domain
  9:  25,   // near-critical: arrest threats + payment demands
  8:  20,   // strong: specific dollar amount + urgency + off-brand URL
  7:  15,   // strong-medium: known scam theme (CAI refund, etc.)
  6:  12,   // medium: suspicious pattern combo
  5:  10,   // medium: generic phishing indicators
  4:  8,    // medium-weak: mildly suspicious
  3:  5,    // weak: minor red flags
  2:  3,    // very weak: cosmetic issues
  1:  1,    // informational
};

/**
 * Convert a rule weight (1-10) to a score penalty (1-30).
 */
export function weightToPenalty(weight: number): number {
  const clamped = Math.max(1, Math.min(10, Math.round(weight)));
  return PENALTY_MAP[clamped] ?? 5;
}

/**
 * Sum penalties from matched signals.
 * Caps at 100 (can't go below 0 trust score).
 * Applies diminishing returns: after 3+ signals in the same
 * category, additional signals contribute 50% penalty.
 */
export function computeTotalPenalty(signals: MatchedSignal[]): number {
  const categoryCount: Record<string, number> = {};
  let total = 0;

  // Sort by penalty descending — strongest signals count first
  const sorted = [...signals].sort((a, b) => b.penalty - a.penalty);

  for (const signal of sorted) {
    const count = categoryCount[signal.category] ?? 0;
    categoryCount[signal.category] = count + 1;

    // Diminishing returns after 3 signals in same category
    const multiplier = count >= 3 ? 0.5 : 1.0;
    total += signal.penalty * multiplier;
  }

  return Math.min(100, Math.round(total));
}

/**
 * Map a post-penalty trust score to an AI risk tier.
 */
export function mapScoreToAIRiskTier(score: number): AIRiskTier {
  if (score >= 80) return 'LIKELY_SAFE';
  if (score >= 50) return 'SUSPICIOUS';
  if (score >= 25) return 'HIGH_RISK';
  return 'VERY_LIKELY_SCAM';
}
