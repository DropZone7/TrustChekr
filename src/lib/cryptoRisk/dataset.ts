export interface XrplWalletFeatures {
  address: string;
  label: 'scam' | 'benign' | 'exchange' | 'unknown';

  txCountTotal: number;
  txCountInbound: number;
  txCountOutbound: number;
  uniqueCounterparties: number;

  lifetimeDays: number;
  avgTxAmount: number;
  medianTxAmount: number;
  maxTxAmount: number;
  minTxAmount: number;

  avgTxPerDayActive: number;
  maxTxInOneDay: number;

  daysSinceFirstTx: number;
  daysSinceLastTx: number;

  fractionTinyAmounts: number;
  fractionFirstTimeInbound: number;
  fractionToKnownExchanges: number;

  source: string;
  labelConfidence: number;
  createdAt?: string;
}

/** Feature column names for model training (excludes address, label, and meta fields). */
export const XRPL_WALLET_FEATURE_COLUMNS = [
  'txCountTotal',
  'txCountInbound',
  'txCountOutbound',
  'uniqueCounterparties',
  'lifetimeDays',
  'avgTxAmount',
  'medianTxAmount',
  'maxTxAmount',
  'minTxAmount',
  'avgTxPerDayActive',
  'maxTxInOneDay',
  'daysSinceFirstTx',
  'daysSinceLastTx',
  'fractionTinyAmounts',
  'fractionFirstTimeInbound',
  'fractionToKnownExchanges',
] as const satisfies readonly (keyof XrplWalletFeatures)[];
