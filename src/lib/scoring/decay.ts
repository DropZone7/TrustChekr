// Time-decay freshness scoring for IoC/threat intelligence signals
// Exponential decay — recent sightings weighted higher than stale data

export type IoCIndicatorType =
  | "phishing_url"
  | "malware_url"
  | "domain"
  | "ip"
  | "wallet"
  | "email"
  | "phone"
  | "generic";

interface DecayParams {
  halfLifeDays: number;
  minFactor: number;
  hardTtlDays: number | null;
}

const DECAY_PARAMS: Record<IoCIndicatorType, DecayParams> = {
  phishing_url: { halfLifeDays: 7, minFactor: 0.05, hardTtlDays: 60 },
  malware_url: { halfLifeDays: 10, minFactor: 0.05, hardTtlDays: 90 },
  domain: { halfLifeDays: 21, minFactor: 0.1, hardTtlDays: 180 },
  ip: { halfLifeDays: 14, minFactor: 0.05, hardTtlDays: 90 },
  wallet: { halfLifeDays: 90, minFactor: 0.2, hardTtlDays: 365 },
  email: { halfLifeDays: 30, minFactor: 0.1, hardTtlDays: 180 },
  phone: { halfLifeDays: 30, minFactor: 0.1, hardTtlDays: 180 },
  generic: { halfLifeDays: 14, minFactor: 0.05, hardTtlDays: 120 },
};

/**
 * Compute freshness factor for an IoC based on when it was last seen.
 * Returns 0-1 where 1 = just seen, 0 = expired/never seen.
 * Uses exponential decay with configurable half-life per indicator type.
 */
export function computeFreshnessFactor(
  lastSeenAt: Date | string | null,
  indicatorType: IoCIndicatorType,
  now: Date = new Date()
): number {
  if (!lastSeenAt) return 0;

  const lastSeen = typeof lastSeenAt === "string" ? new Date(lastSeenAt) : lastSeenAt;
  const params = DECAY_PARAMS[indicatorType] ?? DECAY_PARAMS.generic;
  const diffMs = now.getTime() - lastSeen.getTime();

  if (diffMs <= 0) return 1;

  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  // Hard cutoff — signal is completely stale
  if (params.hardTtlDays !== null && diffDays >= params.hardTtlDays) {
    return 0;
  }

  // Exponential decay: factor = e^(-λ * t) where λ = ln(2) / halfLife
  const lambda = Math.log(2) / params.halfLifeDays;
  const factor = Math.exp(-lambda * diffDays);

  return Math.max(params.minFactor, Math.min(1, factor));
}

/**
 * Apply freshness decay to a signal weight.
 * @param weight Original signal weight (e.g. 30 for phishing hit)
 * @param lastSeenAt When the signal was last observed
 * @param indicatorType Type of IoC for decay curve selection
 * @returns Decayed weight (original * freshness factor)
 */
export function decayWeight(
  weight: number,
  lastSeenAt: Date | string | null,
  indicatorType: IoCIndicatorType
): number {
  const freshness = computeFreshnessFactor(lastSeenAt, indicatorType);
  return Math.round(weight * freshness * 100) / 100;
}

/**
 * Determine confidence level based on signal diversity and recency.
 */
export function computeConfidence(signals: {
  feedHits: number;
  recentScamReports: number;
  institutionalEvents: number;
  highIntentChecks: number;
}): "low" | "medium" | "high" {
  // High: multiple sources confirm
  if (
    signals.feedHits >= 2 ||
    signals.recentScamReports >= 3 ||
    signals.institutionalEvents > 0
  ) {
    return "high";
  }

  // Medium: some evidence
  if (
    signals.feedHits >= 1 ||
    signals.highIntentChecks >= 3
  ) {
    return "medium";
  }

  return "low";
}
