/**
 * XRPL Wallet Risk Model — Logistic Regression Training Pipeline
 *
 * Loads labeled wallet features from Postgres, trains a logistic regression
 * classifier (scam=1, benign=0), evaluates on a held-out test set, and
 * exports the model as JSON for runtime use.
 *
 * Usage:
 *   DATABASE_URL=postgres://... npm run train:xrpl-wallet-risk
 */

import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import { XRPL_WALLET_FEATURE_COLUMNS } from '../src/lib/cryptoRisk/dataset';

// ── Types ────────────────────────────────────────────────────

type FeatureRow = {
  label: 'scam' | 'benign';
  features: number[];
};

type NormParams = {
  mean: number;
  std: number;
};

type TrainedModel = {
  version: string;
  featureNames: string[];
  normalization: { mean: number[]; std: number[] };
  weights: number[];
  bias: number;
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1: number;
    rocAuc: number;
  };
  trainedAt: string;
  trainSize: number;
  testSize: number;
};

// ── Config ───────────────────────────────────────────────────

const DATABASE_URL = process.env.DATABASE_URL ?? '';
const MODEL_VERSION = 'xrpl-wallet-risk-mvp-0.1.0';
const LEARNING_RATE = 0.01;
const MAX_ITERATIONS = 5000;
const CONVERGENCE_THRESHOLD = 1e-6;
const TRAIN_SPLIT = 0.8;
const RANDOM_SEED = 42;
const MODEL_DIR = path.resolve(__dirname, '../models');
const MODEL_PATH = path.join(MODEL_DIR, 'xrpl-wallet-risk-model.json');

// ── Seeded Random ────────────────────────────────────────────

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

// ── Data Loading ─────────────────────────────────────────────

async function loadData(pool: Pool): Promise<FeatureRow[]> {
  const cols = XRPL_WALLET_FEATURE_COLUMNS.map((c) => {
    // camelCase → snake_case
    return c.replace(/[A-Z]/g, (m) => '_' + m.toLowerCase());
  }).join(', ');

  const query = `SELECT label, ${cols} FROM xrpl_wallet_features WHERE label IN ('scam', 'benign')`;
  const { rows } = await pool.query(query);

  return rows.map((row: any) => ({
    label: row.label as 'scam' | 'benign',
    features: XRPL_WALLET_FEATURE_COLUMNS.map((col) => {
      const snakeCol = col.replace(/[A-Z]/g, (m) => '_' + m.toLowerCase());
      return Number(row[snakeCol]) || 0;
    }),
  }));
}

// ── Train/Test Split ─────────────────────────────────────────

function splitData(data: FeatureRow[], ratio: number, rand: () => number) {
  const shuffled = [...data];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const splitIdx = Math.floor(shuffled.length * ratio);
  return {
    train: shuffled.slice(0, splitIdx),
    test: shuffled.slice(splitIdx),
  };
}

// ── Preprocessing ────────────────────────────────────────────

function computeNormParams(data: FeatureRow[]): NormParams[] {
  const n = data.length;
  const numFeatures = XRPL_WALLET_FEATURE_COLUMNS.length;
  const params: NormParams[] = [];

  for (let f = 0; f < numFeatures; f++) {
    const values = data.map((d) => d.features[f]);
    const mean = values.reduce((s, v) => s + v, 0) / n;
    const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / n;
    const std = Math.sqrt(variance) || 1; // avoid division by zero
    params.push({ mean, std });
  }

  return params;
}

function normalize(features: number[], params: NormParams[]): number[] {
  return features.map((v, i) => (v - params[i].mean) / params[i].std);
}

// ── Logistic Regression ──────────────────────────────────────

function sigmoid(z: number): number {
  if (z > 500) return 1;
  if (z < -500) return 0;
  return 1 / (1 + Math.exp(-z));
}

function predict(features: number[], weights: number[], bias: number): number {
  let z = bias;
  for (let i = 0; i < features.length; i++) {
    z += features[i] * weights[i];
  }
  return sigmoid(z);
}

function trainLogisticRegression(
  trainData: FeatureRow[],
  normParams: NormParams[]
): { weights: number[]; bias: number; iterations: number } {
  const numFeatures = XRPL_WALLET_FEATURE_COLUMNS.length;
  const weights = new Array(numFeatures).fill(0);
  let bias = 0;
  const n = trainData.length;

  // Precompute normalized features and labels
  const X = trainData.map((d) => normalize(d.features, normParams));
  const y = trainData.map((d) => (d.label === 'scam' ? 1 : 0));

  let prevLoss = Infinity;

  for (let iter = 0; iter < MAX_ITERATIONS; iter++) {
    // Compute gradients
    const gradW = new Array(numFeatures).fill(0);
    let gradB = 0;
    let loss = 0;

    for (let i = 0; i < n; i++) {
      const p = predict(X[i], weights, bias);
      const error = p - y[i];

      for (let f = 0; f < numFeatures; f++) {
        gradW[f] += error * X[i][f];
      }
      gradB += error;

      // Binary cross-entropy loss
      const clipped = Math.max(1e-15, Math.min(1 - 1e-15, p));
      loss += -(y[i] * Math.log(clipped) + (1 - y[i]) * Math.log(1 - clipped));
    }

    loss /= n;

    // Update weights
    for (let f = 0; f < numFeatures; f++) {
      weights[f] -= (LEARNING_RATE * gradW[f]) / n;
    }
    bias -= (LEARNING_RATE * gradB) / n;

    // Convergence check
    if (Math.abs(prevLoss - loss) < CONVERGENCE_THRESHOLD) {
      console.log(`  Converged at iteration ${iter + 1} (loss: ${loss.toFixed(6)})`);
      return { weights, bias, iterations: iter + 1 };
    }

    if ((iter + 1) % 500 === 0) {
      console.log(`  Iteration ${iter + 1}: loss = ${loss.toFixed(6)}`);
    }

    prevLoss = loss;
  }

  console.log(`  Reached max iterations (${MAX_ITERATIONS}), loss: ${prevLoss.toFixed(6)}`);
  return { weights, bias, iterations: MAX_ITERATIONS };
}

// ── Evaluation ───────────────────────────────────────────────

function evaluate(
  testData: FeatureRow[],
  weights: number[],
  bias: number,
  normParams: NormParams[]
): { accuracy: number; precision: number; recall: number; f1: number; rocAuc: number } {
  let tp = 0, fp = 0, tn = 0, fn = 0;

  const predictions: { prob: number; actual: number }[] = [];

  for (const row of testData) {
    const normed = normalize(row.features, normParams);
    const prob = predict(normed, weights, bias);
    const predicted = prob >= 0.5 ? 1 : 0;
    const actual = row.label === 'scam' ? 1 : 0;

    predictions.push({ prob, actual });

    if (predicted === 1 && actual === 1) tp++;
    else if (predicted === 1 && actual === 0) fp++;
    else if (predicted === 0 && actual === 0) tn++;
    else fn++;
  }

  const accuracy = testData.length > 0 ? (tp + tn) / testData.length : 0;
  const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
  const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
  const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;

  // Approximate ROC-AUC via trapezoidal rule
  const rocAuc = computeRocAuc(predictions);

  return { accuracy, precision, recall, f1, rocAuc };
}

function computeRocAuc(predictions: { prob: number; actual: number }[]): number {
  if (predictions.length === 0) return 0;

  // Sort by probability descending
  const sorted = [...predictions].sort((a, b) => b.prob - a.prob);
  const totalPositive = sorted.filter((p) => p.actual === 1).length;
  const totalNegative = sorted.length - totalPositive;

  if (totalPositive === 0 || totalNegative === 0) return 0.5;

  let tpRate = 0;
  let fpRate = 0;
  let prevTpRate = 0;
  let prevFpRate = 0;
  let auc = 0;
  let tp = 0;
  let fp = 0;

  for (const { actual } of sorted) {
    if (actual === 1) tp++;
    else fp++;

    tpRate = tp / totalPositive;
    fpRate = fp / totalNegative;

    // Trapezoidal area
    auc += (fpRate - prevFpRate) * (tpRate + prevTpRate) / 2;

    prevTpRate = tpRate;
    prevFpRate = fpRate;
  }

  return auc;
}

// ── Model Export ─────────────────────────────────────────────

function exportModel(
  weights: number[],
  bias: number,
  normParams: NormParams[],
  metrics: TrainedModel['metrics'],
  trainSize: number,
  testSize: number
): void {
  const model: TrainedModel = {
    version: MODEL_VERSION,
    featureNames: [...XRPL_WALLET_FEATURE_COLUMNS],
    normalization: {
      mean: normParams.map((p) => p.mean),
      std: normParams.map((p) => p.std),
    },
    weights,
    bias,
    metrics,
    trainedAt: new Date().toISOString(),
    trainSize,
    testSize,
  };

  if (!fs.existsSync(MODEL_DIR)) {
    fs.mkdirSync(MODEL_DIR, { recursive: true });
  }

  fs.writeFileSync(MODEL_PATH, JSON.stringify(model, null, 2));
  console.log(`\nModel exported to ${MODEL_PATH}`);
}

// ── Main ─────────────────────────────────────────────────────

async function main() {
  console.log('=== XRPL Wallet Risk Model Training ===\n');

  if (!DATABASE_URL) {
    console.error('DATABASE_URL env var required');
    process.exit(1);
  }

  const pool = new Pool({ connectionString: DATABASE_URL });

  try {
    // Load data
    console.log('Loading labeled wallet features...');
    const data = await loadData(pool);
    console.log(`  Total rows: ${data.length}`);

    const scamCount = data.filter((d) => d.label === 'scam').length;
    const benignCount = data.filter((d) => d.label === 'benign').length;
    console.log(`  Scam: ${scamCount}, Benign: ${benignCount}`);

    if (data.length < 10) {
      console.warn('\n⚠️  Very few training samples. Model will be unreliable.');
      console.warn('   Add more labeled wallets to xrpl_wallet_features and re-run.');
    }

    if (scamCount === 0 || benignCount === 0) {
      console.error('\n❌ Need both scam and benign labels to train. Aborting.');
      process.exit(1);
    }

    // Split
    const rand = seededRandom(RANDOM_SEED);
    const { train, test } = splitData(data, TRAIN_SPLIT, rand);
    console.log(`  Train: ${train.length}, Test: ${test.length}\n`);

    // Normalize
    console.log('Computing normalization parameters...');
    const normParams = computeNormParams(train);

    // Train
    console.log('Training logistic regression...');
    const { weights, bias, iterations } = trainLogisticRegression(train, normParams);
    console.log(`  Training complete (${iterations} iterations)`);

    // Feature importance
    console.log('\nFeature weights (sorted by |weight|):');
    const featureWeights = XRPL_WALLET_FEATURE_COLUMNS.map((name, i) => ({
      name,
      weight: weights[i],
    })).sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight));

    for (const fw of featureWeights) {
      const bar = fw.weight >= 0 ? '+' : '-';
      console.log(`  ${bar} ${fw.name}: ${fw.weight.toFixed(4)}`);
    }

    // Evaluate
    console.log('\nEvaluating on test set...');
    const metrics = evaluate(test, weights, bias, normParams);
    console.log(`  Accuracy:  ${(metrics.accuracy * 100).toFixed(1)}%`);
    console.log(`  Precision: ${(metrics.precision * 100).toFixed(1)}%`);
    console.log(`  Recall:    ${(metrics.recall * 100).toFixed(1)}%`);
    console.log(`  F1 Score:  ${(metrics.f1 * 100).toFixed(1)}%`);
    console.log(`  ROC-AUC:   ${metrics.rocAuc.toFixed(3)}`);

    // Export
    exportModel(weights, bias, normParams, metrics, train.length, test.length);

    console.log('\n=== Done ===');
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
