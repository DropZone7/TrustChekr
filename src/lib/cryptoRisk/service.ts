import { supabaseServer } from '@/lib/supabase/server';
import { loadXrplWalletRiskModel, scoreWalletFeatures } from './model';
import { XRPL_WALLET_FEATURE_COLUMNS } from './dataset';
import type { XrplWalletFeatures } from './dataset';
import type { CryptoRiskResult, CryptoRiskSignal } from './types';

export class WalletNotFoundError extends Error {
  constructor(address: string) {
    super(`Wallet features not found for ${address}`);
    this.name = 'WalletNotFoundError';
  }
}

/** Fetch pre-computed features from Postgres via Supabase */
async function lookupFeatures(address: string): Promise<XrplWalletFeatures | null> {
  const { data, error } = await supabaseServer
    .from('xrpl_wallet_features')
    .select('*')
    .eq('address', address)
    .single();

  if (error || !data) return null;

  // Map snake_case DB columns → camelCase interface
  const row = data as any;
  return {
    address: row.address,
    label: row.label,
    txCountTotal: Number(row.tx_count_total),
    txCountInbound: Number(row.tx_count_inbound),
    txCountOutbound: Number(row.tx_count_outbound),
    uniqueCounterparties: Number(row.unique_counterparties),
    lifetimeDays: Number(row.lifetime_days),
    avgTxAmount: Number(row.avg_tx_amount),
    medianTxAmount: Number(row.median_tx_amount),
    maxTxAmount: Number(row.max_tx_amount),
    minTxAmount: Number(row.min_tx_amount),
    avgTxPerDayActive: Number(row.avg_tx_per_day_active),
    maxTxInOneDay: Number(row.max_tx_in_one_day),
    daysSinceFirstTx: Number(row.days_since_first_tx),
    daysSinceLastTx: Number(row.days_since_last_tx),
    fractionTinyAmounts: Number(row.fraction_tiny_amounts),
    fractionFirstTimeInbound: Number(row.fraction_first_time_inbound),
    fractionToKnownExchanges: Number(row.fraction_to_known_exchanges),
    source: row.source,
    labelConfidence: Number(row.label_confidence),
  };
}

/** Derive human-readable risk signals from wallet features */
function deriveSignals(features: XrplWalletFeatures, riskScore: number): CryptoRiskSignal[] {
  const signals: CryptoRiskSignal[] = [];

  if (features.fractionTinyAmounts > 0.5) {
    signals.push({
      id: 'many_tiny_transactions',
      label: 'High fraction of very small transactions (< 1 XRP)',
      weight: 0.7,
      value: features.fractionTinyAmounts,
    });
  }

  if (features.daysSinceFirstTx < 30 && features.txCountTotal > 100) {
    signals.push({
      id: 'new_and_very_active',
      label: 'New wallet with unusually high transaction volume',
      weight: 0.8,
      value: `${features.txCountTotal} txs in ${features.daysSinceFirstTx} days`,
    });
  }

  if (features.fractionFirstTimeInbound > 0.8) {
    signals.push({
      id: 'many_first_time_inbound',
      label: 'Most inbound transactions come from first-time senders',
      weight: 0.6,
      value: features.fractionFirstTimeInbound,
    });
  }

  if (features.uniqueCounterparties > 50 && features.lifetimeDays < 60) {
    signals.push({
      id: 'high_counterparty_churn',
      label: 'Many unique counterparties in a short lifetime',
      weight: 0.5,
      value: `${features.uniqueCounterparties} counterparties in ${features.lifetimeDays} days`,
    });
  }

  if (features.maxTxInOneDay > 50) {
    signals.push({
      id: 'burst_activity',
      label: 'Extreme burst of activity in a single day',
      weight: 0.6,
      value: features.maxTxInOneDay,
    });
  }

  if (features.daysSinceLastTx > 180 && features.txCountTotal > 10) {
    signals.push({
      id: 'dormant_after_activity',
      label: 'Wallet went dormant after significant activity',
      weight: 0.4,
      value: `${features.daysSinceLastTx} days since last transaction`,
    });
  }

  // If no signals triggered, add a neutral one
  if (signals.length === 0) {
    signals.push({
      id: 'no_anomalies_detected',
      label: 'No obvious risk patterns detected in transaction history',
      weight: -0.3,
      value: riskScore,
    });
  }

  return signals;
}

/** Build a plain-English explanation from signals */
function buildExplanation(
  signals: CryptoRiskSignal[],
  riskLevel: string,
  features: XrplWalletFeatures
): string {
  const parts: string[] = [];

  parts.push(
    `This wallet has ${features.txCountTotal} transactions over ${features.lifetimeDays} days with ${features.uniqueCounterparties} unique counterparties.`
  );

  const riskSignals = signals.filter((s) => s.weight > 0);
  if (riskSignals.length > 0) {
    const descriptions = riskSignals.slice(0, 3).map((s) => s.label.toLowerCase());
    parts.push(`Risk indicators include: ${descriptions.join('; ')}.`);
  } else {
    parts.push('No significant risk indicators were found.');
  }

  return parts.join(' ');
}

/** Main entry point: assess wallet risk */
export async function assessWalletRisk(address: string): Promise<CryptoRiskResult> {
  const features = await lookupFeatures(address);

  if (!features) {
    // TODO: Trigger on-demand feature extraction instead of returning 404
    throw new WalletNotFoundError(address);
  }

  const model = await loadXrplWalletRiskModel();
  const { riskScore, riskLevel } = scoreWalletFeatures(features, model);
  const signals = deriveSignals(features, riskScore);
  const explanation = buildExplanation(signals, riskLevel, features);

  return {
    address,
    riskScore,
    riskLevel,
    signals,
    explanation,
    modelVersion: model.version,
  };
}
