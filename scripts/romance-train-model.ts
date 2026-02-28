/**
 * Romance Scam Conversation Classifier — Training Pipeline
 *
 * Loads LabeledConversation[], builds bag-of-words features,
 * trains multiclass logistic regression (one-vs-rest),
 * evaluates, and exports model JSON.
 *
 * Usage:
 *   npm run train:romance
 */

import * as fs from 'fs';
import * as path from 'path';
import type { LabeledConversation, RomanceDatasetLabel } from '../src/lib/romanceScan/schema';

// ── Config ───────────────────────────────────────────────────

const DATASET_PATH = path.resolve(__dirname, '../data/romance_conversations_dataset.json');
const MODEL_PATH = path.resolve(__dirname, '../models/romance-scam-model.json');
const MODEL_VERSION = 'romance-scam-mvp-0.1.0';

const VOCAB_SIZE = 5000;
const MIN_TOKEN_LENGTH = 3;
const LEARNING_RATE = 0.1;
const MAX_ITERATIONS = 3000;
const CONVERGENCE_THRESHOLD = 1e-6;
const TRAIN_SPLIT = 0.8;
const RANDOM_SEED = 42;

const LABELS: RomanceDatasetLabel[] = ['romance_scam', 'pig_butchering_scam', 'generic_scam', 'legit'];

// ── Tokenization ─────────────────────────────────────────────

const STOP_WORDS = new Set([
  'the', 'and', 'that', 'this', 'with', 'for', 'are', 'was', 'has', 'have',
  'had', 'not', 'but', 'what', 'all', 'were', 'when', 'your', 'can', 'there',
  'from', 'been', 'they', 'will', 'would', 'could', 'should', 'than', 'its',
  'also', 'into', 'just', 'about', 'which', 'their', 'them', 'then', 'some',
  'her', 'him', 'his', 'she', 'how', 'our', 'out', 'you', 'who', 'did',
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length >= MIN_TOKEN_LENGTH && !STOP_WORDS.has(t));
}

function conversationToText(conv: LabeledConversation): string {
  return conv.messages.map((m) => m.text).join(' ');
}

// ── Vocabulary ───────────────────────────────────────────────

function buildVocabulary(docs: string[][], maxSize: number): string[] {
  const df: Map<string, number> = new Map();

  for (const tokens of docs) {
    const unique = new Set(tokens);
    for (const t of unique) {
      df.set(t, (df.get(t) ?? 0) + 1);
    }
  }

  // Sort by document frequency descending, take top N
  return Array.from(df.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxSize)
    .map(([token]) => token);
}

// ── Featurization ────────────────────────────────────────────

function featurize(tokens: string[], vocabIndex: Map<string, number>): number[] {
  const vec = new Array(vocabIndex.size).fill(0);
  for (const t of tokens) {
    const idx = vocabIndex.get(t);
    if (idx !== undefined) vec[idx] += 1;
  }
  // L2 normalize
  const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0)) || 1;
  for (let i = 0; i < vec.length; i++) vec[i] /= norm;
  return vec;
}

// ── Seeded Random ────────────────────────────────────────────

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function shuffle<T>(arr: T[], rand: () => number): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// ── Logistic Regression (One-vs-Rest) ────────────────────────

function sigmoid(z: number): number {
  if (z > 500) return 1;
  if (z < -500) return 0;
  return 1 / (1 + Math.exp(-z));
}

function trainBinaryClassifier(
  X: number[][],
  y: number[], // 0 or 1
  numFeatures: number
): { weights: number[]; bias: number } {
  const weights = new Array(numFeatures).fill(0);
  let bias = 0;
  const n = X.length;
  let prevLoss = Infinity;

  for (let iter = 0; iter < MAX_ITERATIONS; iter++) {
    const gradW = new Array(numFeatures).fill(0);
    let gradB = 0;
    let loss = 0;

    for (let i = 0; i < n; i++) {
      let z = bias;
      for (let f = 0; f < numFeatures; f++) z += weights[f] * X[i][f];
      const p = sigmoid(z);
      const error = p - y[i];

      for (let f = 0; f < numFeatures; f++) gradW[f] += error * X[i][f];
      gradB += error;

      const clipped = Math.max(1e-15, Math.min(1 - 1e-15, p));
      loss += -(y[i] * Math.log(clipped) + (1 - y[i]) * Math.log(1 - clipped));
    }

    loss /= n;
    for (let f = 0; f < numFeatures; f++) weights[f] -= (LEARNING_RATE * gradW[f]) / n;
    bias -= (LEARNING_RATE * gradB) / n;

    if (Math.abs(prevLoss - loss) < CONVERGENCE_THRESHOLD) break;
    prevLoss = loss;
  }

  return { weights, bias };
}

function trainOneVsRest(
  X: number[][],
  labels: number[], // label index per sample
  numLabels: number,
  numFeatures: number
): { weights: number[][]; biases: number[] } {
  const allWeights: number[][] = [];
  const allBiases: number[] = [];

  for (let c = 0; c < numLabels; c++) {
    const binaryY = labels.map((l) => (l === c ? 1 : 0));
    console.log(`  Training classifier for "${LABELS[c]}" (${binaryY.filter((v) => v === 1).length} positive)...`);
    const { weights, bias } = trainBinaryClassifier(X, binaryY, numFeatures);
    allWeights.push(weights);
    allBiases.push(bias);
  }

  return { weights: allWeights, biases: allBiases };
}

function predictOneVsRest(
  x: number[],
  weights: number[][],
  biases: number[]
): number {
  let bestIdx = 0;
  let bestScore = -Infinity;

  for (let c = 0; c < weights.length; c++) {
    let z = biases[c];
    for (let f = 0; f < x.length; f++) z += weights[c][f] * x[f];
    if (z > bestScore) {
      bestScore = z;
      bestIdx = c;
    }
  }

  return bestIdx;
}

// ── Evaluation ───────────────────────────────────────────────

type Metrics = {
  perLabel: { label: string; precision: number; recall: number; f1: number; support: number }[];
  macroPrecision: number;
  macroRecall: number;
  macroF1: number;
  accuracy: number;
  confusionMatrix: number[][];
};

function evaluate(
  X: number[][],
  trueLabels: number[],
  weights: number[][],
  biases: number[]
): Metrics {
  const numLabels = LABELS.length;
  const confusion: number[][] = Array.from({ length: numLabels }, () => new Array(numLabels).fill(0));

  for (let i = 0; i < X.length; i++) {
    const pred = predictOneVsRest(X[i], weights, biases);
    confusion[trueLabels[i]][pred] += 1;
  }

  let correct = 0;
  for (let i = 0; i < numLabels; i++) correct += confusion[i][i];
  const accuracy = X.length > 0 ? correct / X.length : 0;

  const perLabel = LABELS.map((label, c) => {
    const tp = confusion[c][c];
    const fp = confusion.reduce((s, row, r) => s + (r !== c ? row[c] : 0), 0);
    const fn = confusion[c].reduce((s, v, j) => s + (j !== c ? v : 0), 0);
    const support = confusion[c].reduce((s, v) => s + v, 0);

    const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
    const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
    const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;

    return { label, precision, recall, f1, support };
  });

  const activeLabels = perLabel.filter((p) => p.support > 0);
  const macroPrecision = activeLabels.length > 0 ? activeLabels.reduce((s, p) => s + p.precision, 0) / activeLabels.length : 0;
  const macroRecall = activeLabels.length > 0 ? activeLabels.reduce((s, p) => s + p.recall, 0) / activeLabels.length : 0;
  const macroF1 = activeLabels.length > 0 ? activeLabels.reduce((s, p) => s + p.f1, 0) / activeLabels.length : 0;

  return { perLabel, macroPrecision, macroRecall, macroF1, accuracy, confusionMatrix: confusion };
}

function printConfusionMatrix(confusion: number[][]) {
  const pad = (s: string, n: number) => s.padStart(n);
  const colW = 20;

  console.log('\n  Confusion Matrix (rows=actual, cols=predicted):');
  console.log('  ' + pad('', colW) + LABELS.map((l) => pad(l.slice(0, 18), colW)).join(''));
  for (let r = 0; r < LABELS.length; r++) {
    const row = LABELS[r].slice(0, 18).padEnd(colW);
    const vals = confusion[r].map((v) => pad(String(v), colW)).join('');
    console.log('  ' + row + vals);
  }
}

// ── Model Export ─────────────────────────────────────────────

type ExportedModel = {
  version: string;
  labels: RomanceDatasetLabel[];
  vocabulary: string[];
  weights: number[][];
  biases: number[];
  tokenizationConfig: {
    lowercase: boolean;
    minTokenLength: number;
    stopWordsRemoved: boolean;
    normalization: string;
  };
  metrics: {
    accuracy: number;
    macroPrecision: number;
    macroRecall: number;
    macroF1: number;
  };
  trainedAt: string;
  datasetSize: number;
};

function exportModel(
  vocabulary: string[],
  weights: number[][],
  biases: number[],
  metrics: Metrics,
  datasetSize: number
) {
  const model: ExportedModel = {
    version: MODEL_VERSION,
    labels: [...LABELS],
    vocabulary,
    weights,
    biases,
    tokenizationConfig: {
      lowercase: true,
      minTokenLength: MIN_TOKEN_LENGTH,
      stopWordsRemoved: true,
      normalization: 'l2',
    },
    metrics: {
      accuracy: metrics.accuracy,
      macroPrecision: metrics.macroPrecision,
      macroRecall: metrics.macroRecall,
      macroF1: metrics.macroF1,
    },
    trainedAt: new Date().toISOString(),
    datasetSize,
  };

  const dir = path.dirname(MODEL_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(MODEL_PATH, JSON.stringify(model, null, 2));
  console.log(`\nModel exported to ${MODEL_PATH}`);
}

// ── Main ─────────────────────────────────────────────────────

function main() {
  console.log('=== Romance Scam Classifier Training ===\n');

  if (!fs.existsSync(DATASET_PATH)) {
    console.error(`Dataset not found: ${DATASET_PATH}`);
    console.log('Run: npm run build:romance-dataset');
    process.exit(1);
  }

  // Load
  const raw: LabeledConversation[] = JSON.parse(fs.readFileSync(DATASET_PATH, 'utf-8'));
  // Filter to known labels only
  const data = raw.filter((c) => LABELS.includes(c.label));
  console.log(`Loaded ${data.length} conversations (${raw.length - data.length} skipped with unknown labels)`);

  for (const l of LABELS) {
    console.log(`  ${l}: ${data.filter((c) => c.label === l).length}`);
  }

  if (data.length < 4) {
    console.error('\n❌ Need at least a few samples per label. Add more data and re-run.');
    process.exit(1);
  }

  // Tokenize
  console.log('\nTokenizing...');
  const tokenized = data.map((c) => tokenize(conversationToText(c)));
  const totalTokens = tokenized.reduce((s, t) => s + t.length, 0);
  console.log(`  Total tokens: ${totalTokens}`);

  // Vocabulary
  console.log('Building vocabulary...');
  const vocab = buildVocabulary(tokenized, VOCAB_SIZE);
  console.log(`  Vocabulary size: ${vocab.length}`);

  const vocabIndex = new Map<string, number>();
  vocab.forEach((t, i) => vocabIndex.set(t, i));

  // Featurize
  console.log('Featurizing...');
  const X = tokenized.map((tokens) => featurize(tokens, vocabIndex));
  const labelIndices = data.map((c) => LABELS.indexOf(c.label));

  // Split
  const rand = seededRandom(RANDOM_SEED);
  const indices = shuffle(Array.from({ length: data.length }, (_, i) => i), rand);
  const splitIdx = Math.floor(indices.length * TRAIN_SPLIT);

  const trainIdx = indices.slice(0, splitIdx);
  const testIdx = indices.slice(splitIdx);

  const trainX = trainIdx.map((i) => X[i]);
  const trainY = trainIdx.map((i) => labelIndices[i]);
  const testX = testIdx.map((i) => X[i]);
  const testY = testIdx.map((i) => labelIndices[i]);

  console.log(`\nTrain: ${trainX.length}, Test: ${testX.length}`);

  // Train
  console.log('\nTraining one-vs-rest logistic regression...');
  const { weights, biases } = trainOneVsRest(trainX, trainY, LABELS.length, vocab.length);

  // Evaluate
  console.log('\n--- Test Set Evaluation ---');
  const metrics = evaluate(testX, testY, weights, biases);

  console.log(`\n  Accuracy:         ${(metrics.accuracy * 100).toFixed(1)}%`);
  console.log(`  Macro Precision:  ${(metrics.macroPrecision * 100).toFixed(1)}%`);
  console.log(`  Macro Recall:     ${(metrics.macroRecall * 100).toFixed(1)}%`);
  console.log(`  Macro F1:         ${(metrics.macroF1 * 100).toFixed(1)}%`);

  console.log('\n  Per-label:');
  for (const p of metrics.perLabel) {
    console.log(`    ${p.label.padEnd(25)} P=${(p.precision * 100).toFixed(1)}%  R=${(p.recall * 100).toFixed(1)}%  F1=${(p.f1 * 100).toFixed(1)}%  (n=${p.support})`);
  }

  printConfusionMatrix(metrics.confusionMatrix);

  // Export
  exportModel(vocab, weights, biases, metrics, data.length);

  console.log('\n=== Done ===');
}

main();
