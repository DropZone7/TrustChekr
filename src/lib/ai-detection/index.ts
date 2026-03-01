import type {
  AIScamAnalysisInput,
  AIScamAnalysisResult,
  MatchedSignal,
  ScamCategory,
  ScamPattern,
  ScamScript,
  DomainPattern,
  Country,
} from './types';
import { matchTextPatterns } from './matchers/textMatcher';
import { matchUrlPatterns } from './matchers/urlMatcher';
import { matchScriptPatterns } from './matchers/scriptMatcher';
import { applyChannelAnalysis } from './matchers/channelMatcher';
import { computeTotalPenalty, mapScoreToAIRiskTier } from './scoring';
import { getCountryGuidance } from './canadianContext';

// ── Rule Loading ─────────────────────────────────────────────
// Rules are loaded from JSON files at build time.
// In production these could be fetched from a CMS or database.

// ── Canada-specific rules ────────────────────────────────────
import craRules from './rules/ca/cra.json';
import caBankRules from './rules/ca/banks.json';
import interacRules from './rules/ca/interac.json';
import caDomainRules from './rules/ca/domains.json';
import caScriptRules from './rules/ca/scripts.json';
import caRentalRules from './rules/ca/rental.json';

// ── US-specific rules ────────────────────────────────────────
import irsRules from './rules/us/irs.json';
import usBankRules from './rules/us/banks.json';
import usDomainRules from './rules/us/domains.json';
import usScriptRules from './rules/us/scripts.json';

// ── Mexico-specific rules ────────────────────────────────────
import satRules from './rules/mx/sat.json';
import mxDomainRules from './rules/mx/domains.json';
import mxScriptRules from './rules/mx/scripts.json';

// ── Shared rules (all countries) ─────────────────────────────
import cryptoRules from './rules/shared/crypto.json';
import techSupportRules from './rules/shared/tech_support.json';
import phishingRules from './rules/shared/phishing.json';
import jobScamRules from './rules/shared/job_scam.json';
import deliveryScamRules from './rules/shared/delivery_scam.json';
import tollRoadRules from './rules/shared/toll_road.json';

/**
 * Get text patterns for a specific country (includes shared rules).
 */
function getTextPatterns(country: Country = 'ALL'): ScamPattern[] {
  // Shared rules always included
  const shared = [
    ...cryptoRules.patterns,
    ...techSupportRules.patterns,
    ...phishingRules.patterns,
    ...jobScamRules.patterns,
    ...deliveryScamRules.patterns,
    ...tollRoadRules.patterns,
  ] as ScamPattern[];

  const ca = [
    ...craRules.patterns,
    ...caBankRules.patterns,
    ...interacRules.patterns,
    ...caRentalRules.patterns,
  ] as ScamPattern[];

  const us = [
    ...irsRules.patterns,
    ...usBankRules.patterns,
  ] as ScamPattern[];

  switch (country) {
    case 'CA': return [...shared, ...ca];
    case 'US': return [...shared, ...us];
    case 'MX': return [...shared, ...satRules.patterns as ScamPattern[]];
    case 'ALL':
    default: return [...shared, ...ca, ...us, ...satRules.patterns as ScamPattern[]];
  }
}

/**
 * Get domain patterns for a specific country (includes shared).
 */
function getDomainPatterns(country: Country = 'ALL'): DomainPattern[] {
  const ca = caDomainRules.domains as DomainPattern[];
  const us = usDomainRules.domains as DomainPattern[];

  switch (country) {
    case 'CA': return ca;
    case 'US': return us;
    case 'MX': return mxDomainRules.domains as DomainPattern[];
    case 'ALL':
    default: return [...ca, ...us, ...mxDomainRules.domains as DomainPattern[]];
  }
}

/**
 * Get script templates for a specific country.
 */
function getScriptTemplates(country: Country = 'ALL'): ScamScript[] {
  const ca = caScriptRules.scripts as ScamScript[];
  const us = usScriptRules.scripts as ScamScript[];
  const mx = mxScriptRules.scripts as ScamScript[];

  switch (country) {
    case 'CA': return ca;
    case 'US': return us;
    case 'MX': return mx;
    case 'ALL':
    default: return [...ca, ...us, ...mx];
  }
}

// ── Human-Readable Category Names ────────────────────────────

const CATEGORY_LABELS: Record<ScamCategory, string> = {
  // Canada
  CRA_IMPERSONATION: 'CRA Impersonation',
  INTERAC_PHISHING: 'Interac e-Transfer Phishing',
  // US
  IRS_IMPERSONATION: 'IRS / SSA Impersonation',
  // Mexico (future)
  SAT_IMPERSONATION: 'SAT Impersonation',
  // Shared
  BANK_IMPERSONATION: 'Bank Impersonation',
  PIG_BUTCHERING: 'Romance / Pig Butchering Scam',
  TECH_SUPPORT: 'Tech Support Scam',
  CRYPTO_INVESTMENT: 'Crypto Investment Fraud',
  RENTAL_SCAM: 'Rental Scam',
  JOB_SCAM: 'Job / Task Scam',
  DELIVERY_SCAM: 'Delivery / Parcel Scam',
  TOLL_ROAD_SCAM: 'Toll Road Scam',
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
  country: Country = 'ALL',
): Promise<AIScamAnalysisResult> {
  const allSignals: MatchedSignal[] = [];

  // ── Step 1: Text pattern matching ────────────────────────
  if (input.text) {
    const textSignals = matchTextPatterns(input.text, getTextPatterns(country));
    allSignals.push(...textSignals);
  }

  // ── Step 1b: Script flow matching ─────────────────────────
  if (input.text) {
    const scriptSignals = matchScriptPatterns(
      input.text,
      getScriptTemplates(country),
    );
    allSignals.push(...scriptSignals);
  }

  // ── Step 2: URL pattern matching ─────────────────────────
  if (input.url) {
    const urlSignals = matchUrlPatterns(
      input.url,
      input.osintSignals?.domainAge,
      getDomainPatterns(country),
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

  // ── Step 8: Country-specific context + actions ────────────
  const { context, actions } = getCountryGuidance(categories, country);

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
