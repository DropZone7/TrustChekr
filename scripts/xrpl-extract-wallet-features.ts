/**
 * XRPL Wallet Feature Extraction Script
 *
 * Reads labeled wallet addresses from data/xrpl_wallet_labels.json,
 * fetches transaction history from XRPL, computes features, and
 * upserts into the xrpl_wallet_features Postgres table.
 *
 * Usage:
 *   XRPL_URL=wss://s1.ripple.com:51234 DATABASE_URL=postgres://... npx ts-node scripts/xrpl-extract-wallet-features.ts
 *
 * For testnet: XRPL_URL=wss://s.altnet.rippletest.net:51233
 */

import { Client as XrplClient } from 'xrpl';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import type { XrplWalletFeatures } from '../src/lib/cryptoRisk/dataset';

// ── Types ────────────────────────────────────────────────────

type WalletLabel = {
  address: string;
  label: 'scam' | 'benign' | 'exchange' | 'unknown';
  source: string;
  labelConfidence: number;
};

type ParsedTx = {
  hash: string;
  date: number; // unix seconds
  isInbound: boolean;
  counterparty: string;
  amountXrp: number;
};

// ── Config ───────────────────────────────────────────────────

const XRPL_URL = process.env.XRPL_URL ?? 'wss://s1.ripple.com:51234';
const DATABASE_URL = process.env.DATABASE_URL ?? '';
const LABELS_PATH = path.resolve(__dirname, '../data/xrpl_wallet_labels.json');
const MAX_TX = 1000;
const RETRY_ATTEMPTS = 3;
const RETRY_BASE_MS = 2000;

// ── XRPL Fetch ───────────────────────────────────────────────

async function fetchTransactions(
  client: XrplClient,
  address: string
): Promise<ParsedTx[]> {
  const txs: ParsedTx[] = [];
  let marker: unknown = undefined;
  let fetched = 0;

  while (fetched < MAX_TX) {
    const request: any = {
      command: 'account_tx',
      account: address,
      limit: Math.min(200, MAX_TX - fetched),
      ledger_index_min: -1,
      ledger_index_max: -1,
      forward: false,
    };
    if (marker) request.marker = marker;

    const response = await withRetry(() => client.request(request));
    const transactions: any[] = (response.result as any).transactions ?? [];

    if (transactions.length === 0) break;

    for (const entry of transactions) {
      const tx = entry.tx_json ?? (entry as any).tx;
      if (!tx || tx.TransactionType !== 'Payment') continue;

      const dest = tx.Destination as string | undefined;
      const src = tx.Account as string | undefined;
      if (!dest || !src) continue;

      // Only XRP payments (not IOUs)
      const amount = tx.Amount;
      if (typeof amount !== 'string') continue;

      const amountXrp = parseInt(amount, 10) / 1_000_000;
      const isInbound = dest === address;
      const counterparty = isInbound ? src : dest;
      const date = ((tx as any).date ?? 0) + 946684800; // ripple epoch → unix

      txs.push({ hash: tx.hash ?? '', date, isInbound, counterparty, amountXrp });
      fetched++;
    }

    marker = (response.result as any).marker;
    if (!marker) break;
  }

  return txs;
}

// ── Feature Computation ──────────────────────────────────────

function computeFeatures(
  address: string,
  txs: ParsedTx[],
  label: WalletLabel
): XrplWalletFeatures {
  const now = Math.floor(Date.now() / 1000);

  if (txs.length === 0) {
    return {
      address,
      label: label.label,
      txCountTotal: 0,
      txCountInbound: 0,
      txCountOutbound: 0,
      uniqueCounterparties: 0,
      lifetimeDays: 0,
      avgTxAmount: 0,
      medianTxAmount: 0,
      maxTxAmount: 0,
      minTxAmount: 0,
      avgTxPerDayActive: 0,
      maxTxInOneDay: 0,
      daysSinceFirstTx: 0,
      daysSinceLastTx: 0,
      fractionTinyAmounts: 0,
      fractionFirstTimeInbound: 0,
      fractionToKnownExchanges: 0,
      source: label.source,
      labelConfidence: label.labelConfidence,
    };
  }

  const inbound = txs.filter((t) => t.isInbound);
  const outbound = txs.filter((t) => !t.isInbound);
  const counterparties = new Set(txs.map((t) => t.counterparty));
  const amounts = txs.map((t) => t.amountXrp).sort((a, b) => a - b);
  const dates = txs.map((t) => t.date).sort((a, b) => a - b);

  const firstTx = dates[0];
  const lastTx = dates[dates.length - 1];
  const lifetimeSeconds = lastTx - firstTx;
  const lifetimeDays = Math.max(1, Math.floor(lifetimeSeconds / 86400));

  // Active days
  const activeDays = new Set(txs.map((t) => Math.floor(t.date / 86400)));
  const avgTxPerDayActive = activeDays.size > 0 ? txs.length / activeDays.size : 0;

  // Max tx in one day
  const dayCounts: Record<number, number> = {};
  for (const t of txs) {
    const day = Math.floor(t.date / 86400);
    dayCounts[day] = (dayCounts[day] ?? 0) + 1;
  }
  const maxTxInOneDay = Math.max(...Object.values(dayCounts));

  // Fraction tiny amounts (< 1 XRP)
  const tinyCount = amounts.filter((a) => a < 1).length;

  // Fraction first-time inbound senders
  const inboundSenders: string[] = [];
  const seenSenders = new Set<string>();
  let firstTimeSenders = 0;
  for (const t of inbound) {
    if (!seenSenders.has(t.counterparty)) {
      firstTimeSenders++;
      seenSenders.add(t.counterparty);
    }
    inboundSenders.push(t.counterparty);
  }
  const fractionFirstTimeInbound =
    inbound.length > 0 ? firstTimeSenders / inbound.length : 0;

  // TODO: fraction_to_known_exchanges — needs exchange address list
  const fractionToKnownExchanges = 0;

  return {
    address,
    label: label.label,
    txCountTotal: txs.length,
    txCountInbound: inbound.length,
    txCountOutbound: outbound.length,
    uniqueCounterparties: counterparties.size,
    lifetimeDays,
    avgTxAmount: amounts.reduce((s, a) => s + a, 0) / amounts.length,
    medianTxAmount: median(amounts),
    maxTxAmount: amounts[amounts.length - 1],
    minTxAmount: amounts[0],
    avgTxPerDayActive,
    maxTxInOneDay,
    daysSinceFirstTx: Math.floor((now - firstTx) / 86400),
    daysSinceLastTx: Math.floor((now - lastTx) / 86400),
    fractionTinyAmounts: tinyCount / txs.length,
    fractionFirstTimeInbound,
    fractionToKnownExchanges,
    source: label.source,
    labelConfidence: label.labelConfidence,
  };
}

function median(sorted: number[]): number {
  if (sorted.length === 0) return 0;
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

// ── DB Upsert ────────────────────────────────────────────────

async function upsertFeatures(pool: Pool, f: XrplWalletFeatures): Promise<void> {
  const sql = `
    INSERT INTO xrpl_wallet_features (
      address, label,
      tx_count_total, tx_count_inbound, tx_count_outbound, unique_counterparties,
      lifetime_days, avg_tx_amount, median_tx_amount, max_tx_amount, min_tx_amount,
      avg_tx_per_day_active, max_tx_in_one_day,
      days_since_first_tx, days_since_last_tx,
      fraction_tiny_amounts, fraction_first_time_inbound, fraction_to_known_exchanges,
      source, label_confidence
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)
    ON CONFLICT (address) DO UPDATE SET
      label = EXCLUDED.label,
      tx_count_total = EXCLUDED.tx_count_total,
      tx_count_inbound = EXCLUDED.tx_count_inbound,
      tx_count_outbound = EXCLUDED.tx_count_outbound,
      unique_counterparties = EXCLUDED.unique_counterparties,
      lifetime_days = EXCLUDED.lifetime_days,
      avg_tx_amount = EXCLUDED.avg_tx_amount,
      median_tx_amount = EXCLUDED.median_tx_amount,
      max_tx_amount = EXCLUDED.max_tx_amount,
      min_tx_amount = EXCLUDED.min_tx_amount,
      avg_tx_per_day_active = EXCLUDED.avg_tx_per_day_active,
      max_tx_in_one_day = EXCLUDED.max_tx_in_one_day,
      days_since_first_tx = EXCLUDED.days_since_first_tx,
      days_since_last_tx = EXCLUDED.days_since_last_tx,
      fraction_tiny_amounts = EXCLUDED.fraction_tiny_amounts,
      fraction_first_time_inbound = EXCLUDED.fraction_first_time_inbound,
      fraction_to_known_exchanges = EXCLUDED.fraction_to_known_exchanges,
      source = EXCLUDED.source,
      label_confidence = EXCLUDED.label_confidence,
      created_at = now()
  `;

  await pool.query(sql, [
    f.address, f.label,
    f.txCountTotal, f.txCountInbound, f.txCountOutbound, f.uniqueCounterparties,
    f.lifetimeDays, f.avgTxAmount, f.medianTxAmount, f.maxTxAmount, f.minTxAmount,
    f.avgTxPerDayActive, f.maxTxInOneDay,
    f.daysSinceFirstTx, f.daysSinceLastTx,
    f.fractionTinyAmounts, f.fractionFirstTimeInbound, f.fractionToKnownExchanges,
    f.source, f.labelConfidence,
  ]);
}

// ── Retry Helper ─────────────────────────────────────────────

async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  for (let attempt = 1; attempt <= RETRY_ATTEMPTS; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      if (attempt === RETRY_ATTEMPTS) throw err;
      const delay = RETRY_BASE_MS * Math.pow(2, attempt - 1);
      console.warn(`  Retry ${attempt}/${RETRY_ATTEMPTS} after ${delay}ms: ${err.message}`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw new Error('Unreachable');
}

// ── Main ─────────────────────────────────────────────────────

async function main() {
  console.log('=== XRPL Wallet Feature Extraction ===');
  console.log(`XRPL: ${XRPL_URL}`);

  if (!DATABASE_URL) {
    console.error('DATABASE_URL env var required');
    process.exit(1);
  }

  if (!fs.existsSync(LABELS_PATH)) {
    console.error(`Labels file not found: ${LABELS_PATH}`);
    console.log('Create data/xrpl_wallet_labels.json with [{ address, label, source, labelConfidence }]');
    process.exit(1);
  }

  const labels: WalletLabel[] = JSON.parse(fs.readFileSync(LABELS_PATH, 'utf-8'));
  console.log(`Loaded ${labels.length} labeled wallets`);

  const pool = new Pool({ connectionString: DATABASE_URL });
  const xrpl = new XrplClient(XRPL_URL);

  try {
    await xrpl.connect();
    console.log('Connected to XRPL');

    let success = 0;
    let failed = 0;

    for (let i = 0; i < labels.length; i++) {
      const label = labels[i];
      const progress = `[${i + 1}/${labels.length}]`;

      try {
        console.log(`${progress} Fetching ${label.address} (${label.label})...`);
        const txs = await fetchTransactions(xrpl, label.address);
        console.log(`  → ${txs.length} payment transactions`);

        const features = computeFeatures(label.address, txs, label);
        await upsertFeatures(pool, features);
        console.log(`  → Upserted (score: ${features.avgTxAmount.toFixed(2)} avg XRP)`);
        success++;
      } catch (err: any) {
        console.error(`${progress} FAILED ${label.address}: ${err.message}`);
        failed++;
      }

      // Rate limit courtesy: 500ms between addresses
      if (i < labels.length - 1) {
        await new Promise((r) => setTimeout(r, 500));
      }
    }

    console.log(`\n=== Done: ${success} success, ${failed} failed ===`);
  } finally {
    await xrpl.disconnect();
    await pool.end();
  }
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
