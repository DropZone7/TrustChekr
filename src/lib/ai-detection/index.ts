import type {
  AIScamAnalysisInput,
  AIScamAnalysisResult,
  MatchedSignal,
  ScamCategory,
  ScamPattern,
  ScamScript,
  DomainPattern,
} from './types';
import { matchTextPatterns } from './matchers/textMatcher';
import { matchUrlPatterns } from './matchers/urlMatcher';
import { matchScriptPatterns } from './matchers/scriptMatcher';
import { applyChannelAnalysis } from './matchers/channelMatcher';
import { computeTotalPenalty, mapScoreToAIRiskTier } from './scoring';
import { getCanadianGuidance } from './canadianContext';

// ── Rule Loading ─────────────────────────────────────────────
// Rules are loaded from JSON files at build time.
// In production these could be fetched from a CMS or database.

import craRules from './rules/cra.json';
import bankRules from './rules/banks.json';
import interacRules from './rules/interac.json';
import cryptoRules from './rules/crypto.json';
import techSupportRules from './rules/tech_support.json';
import rentalRules from './rules/rental.json';
import phishingRules from './rules/phishing.json';
import domainRules from './rules/domains.json';
import scriptRules from './rules/scripts.json';

/**
 * Combine all loaded rule sets into a single array.
 */
function getAllTextPatterns(): ScamPattern[] {
  return [
    ...craRules.patterns,
    ...bankRules.patterns,
    ...interacRules.patterns,
    ...cryptoRules.patterns,
    ...techSupportRules.patterns,
    ...rentalRules.patterns,
    ...phishingRules.patterns,
  ] as ScamPattern[];
}

function getAllDomainPatterns(): DomainPattern[] {
  return domainRules.domains as DomainPattern[];
}

// ── Human-Readable Category Names ────────────────────────────

const CATEGORY_LABELS: Record<ScamCategory, string> = {
  CRA_IMPERSONATION: 'CRA Impersonation',
  BANK_IMPERSONATION: 'Bank Impersonation',
  INTERAC_PHISHING: 'Interac e-Transfer Phishing',
  PIG_BUTCHERING: 'Romance / Pig Butchering Scam',
  TECH_SUPPORT: 'Tech Support Scam',
  CRYPTO_INVESTMENT: 'Crypto Investment Fraud',
  RENTAL_SCAM: 'Rental Scam',
  GENERIC_PHISHING: 'Phishing',
};

/**
 * Main AI scam detection function.
 * Called as Round C in the scan pipeline, after OSINT (A) and pattern (B) rounds.
 *
 * @param input - Combined signals from previous rounds + raw content
 * @param currentTrustScore - The trust score computed by Rounds A+B (0-100)
 * @returns Analysis result with penalties, signals, and Canadian guidance
 */
export async function analyzeForAIScam(
  input: AIScamAnalysisInput,
  currentTrustScore: number = 100,
): Promise<AIScamAnalysisResult> {
  const allSignals: MatchedSignal[] = [];

  // ── Step 1: Text pattern matching ────────────────────────
  if (input.text) {
    const textSignals = matchTextPatterns(input.text, getAllTextPatterns());
    allSignals.push(...textSignals);
  }

  // ── Step 1b: Script flow matching ─────────────────────────
  if (input.text) {
    const scriptSignals = matchScriptPatterns(
      input.text,
      scriptRules.scripts as ScamScript[],
    );
    allSignals.push(...scriptSignals);
  }

  // ── Step 2: URL pattern matching ─────────────────────────
  if (input.url) {
    const urlSignals = matchUrlPatterns(
      input.url,
      input.osintSignals?.domainAge,
      getAllDomainPatterns(),
    );
    allSignals.push(...urlSignals);
  }

  // ── Step 3: Channel-specific analysis & boosts ───────────
  const { boostedSignals, extraSignals } = applyChannelAnalysis(
    input.channel,
    input.text ?? '',
    allSignals,
  );

  const finalSignals = [...boostedSignals, ...extraSignals];

  // ── Step 4: Compute penalty ──────────────────────────────
  const aiScorePenalty = computeTotalPenalty(finalSignals);

  // ── Step 5: Derive risk tier ─────────────────────────────
  const adjustedScore = Math.max(0, currentTrustScore - aiScorePenalty);
  const aiRiskTier = mapScoreToAIRiskTier(adjustedScore);

  // ── Step 6: Collect unique scam types ────────────────────
  const categories = [...new Set(finalSignals.map((s) => s.category))];
  const scamTypes = categories.map((c) => CATEGORY_LABELS[c] ?? c);

  // ── Step 7: Build user-facing signals ────────────────────
  const signals = finalSignals
    .sort((a, b) => b.penalty - a.penalty)
    .slice(0, 5) // top 5 for user display
    .map((s) => s.description);

  // ── Step 8: Canadian context + actions ───────────────────
  const { context, actions } = getCanadianGuidance(categories);

  return {
    aiRiskTier,
    aiScorePenalty,
    scamTypes,
    signals,
    technicalSignals: finalSignals,
    recommendedActions: actions,
    canadianContext: context,
  };
}
