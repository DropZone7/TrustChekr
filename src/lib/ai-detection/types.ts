// ── AI Scam Detection Types ──────────────────────────────────

export type Channel =
  | 'email'
  | 'sms'
  | 'website'
  | 'call_script'
  | 'social'
  | 'interac_notification'
  | 'cra_notice'
  | 'other';

export type AIRiskTier =
  | 'LIKELY_SAFE'
  | 'SUSPICIOUS'
  | 'HIGH_RISK'
  | 'VERY_LIKELY_SCAM';

// ── Rule Definition (loaded from JSON) ───────────────────────

export interface ScamPattern {
  id: string;
  pattern: string;
  type: 'regex' | 'exact' | 'fuzzy';
  weight: number;        // 1-10
  category: ScamCategory;
  description: string;
}

export type ScamCategory =
  // Canada-specific
  | 'CRA_IMPERSONATION'
  | 'INTERAC_PHISHING'
  // US-specific
  | 'IRS_IMPERSONATION'
  // Mexico-specific (future)
  | 'SAT_IMPERSONATION'
  // Shared across countries
  | 'BANK_IMPERSONATION'
  | 'PIG_BUTCHERING'
  | 'TECH_SUPPORT'
  | 'CRYPTO_INVESTMENT'
  | 'RENTAL_SCAM'
  | 'GENERIC_PHISHING';

export type Country = 'CA' | 'US' | 'MX' | 'ALL';

// ── Domain Rule ──────────────────────────────────────────────

export interface DomainPattern {
  id: string;
  pattern: string;        // regex for domain structure
  type: 'regex' | 'exact';
  weight: number;
  category: ScamCategory;
  description: string;
  /** If set, this is the legitimate domain being impersonated */
  legitimateDomain?: string;
}

// ── Script Template (known scam flows) ───────────────────────

export interface ScamScript {
  id: string;
  category: ScamCategory;
  weight: number;
  description: string;
  steps: string[];
}

// ── Pipeline Input (from Round A+B results) ──────────────────

export interface AIScamAnalysisInput {
  url?: string | null;
  text?: string | null;
  channel: Channel;
  /** Existing signals from Round A (OSINT) */
  osintSignals?: {
    domainAge?: number | null;      // days since registration
    rdapData?: Record<string, unknown>;
    virusTotalScore?: number | null;
    safeBrowsingFlags?: string[];
    phishTankMatch?: boolean;
    urlhausMatch?: boolean;
    trancoRank?: number | null;
    knowledgeGraphEntity?: string | null;
  };
  /** Existing signals from Round B (pattern matchers) */
  patternSignals?: {
    phoneDetected?: boolean;
    emailDetected?: boolean;
    cryptoDetected?: boolean;
    romanceDetected?: boolean;
    urgencyScore?: number;
  };
}

// ── Pipeline Output ──────────────────────────────────────────

export interface MatchedSignal {
  ruleId: string;
  category: ScamCategory;
  weight: number;
  penalty: number;         // computed from weight
  description: string;
  matchedText?: string;    // the substring that matched
}

export interface AIScamAnalysisResult {
  aiRiskTier: AIRiskTier;
  aiScorePenalty: number;  // total penalty to subtract from trustScore
  scamTypes: string[];     // human-readable category names
  signals: string[];       // user-facing bullets (non-technical)
  technicalSignals: MatchedSignal[];  // full detail for logging/training
  recommendedActions: string[];       // plain-English next steps
  canadianContext: string[];          // CRA/Interac/bank guidance
}
