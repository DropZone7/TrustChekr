import * as fs from 'fs/promises';
import * as path from 'path';
import type { RomanceConversationMessage } from './types';
import type { RomanceDatasetLabel } from './schema';
import { tokenize } from './tokenizer';

type ModelJson = {
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
};

let cached: ModelJson | null = null;

export async function loadRomanceScamModel(): Promise<ModelJson> {
  if (cached) return cached;
  const modelPath = path.join(process.cwd(), 'models', 'romance-scam-model.json');
  const raw = await fs.readFile(modelPath, 'utf-8');
  cached = JSON.parse(raw) as ModelJson;
  return cached;
}

function featurize(tokens: string[], vocabIndex: Map<string, number>, vocabSize: number): number[] {
  const vec = new Array(vocabSize).fill(0);
  for (const t of tokens) {
    const idx = vocabIndex.get(t);
    if (idx !== undefined) vec[idx] += 1;
  }
  const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0)) || 1;
  for (let i = 0; i < vec.length; i++) vec[i] /= norm;
  return vec;
}

/** Softmax over raw logits */
function softmax(logits: number[]): number[] {
  const max = Math.max(...logits);
  const exps = logits.map((z) => Math.exp(z - max));
  const sum = exps.reduce((s, v) => s + v, 0);
  return exps.map((e) => e / sum);
}

export async function scoreConversation(
  messages: RomanceConversationMessage[]
): Promise<{ label: RomanceDatasetLabel; scores: Record<RomanceDatasetLabel, number> }> {
  const model = await loadRomanceScamModel();

  const text = messages.map((m) => m.text).join(' ');
  const tokens = tokenize(text);

  const vocabIndex = new Map<string, number>();
  model.vocabulary.forEach((t, i) => vocabIndex.set(t, i));

  const x = featurize(tokens, vocabIndex, model.vocabulary.length);

  // Compute logits for each label
  const logits = model.labels.map((_, c) => {
    let z = model.biases[c];
    for (let f = 0; f < x.length; f++) z += model.weights[c][f] * x[f];
    return z;
  });

  const probs = softmax(logits);

  const scores = {} as Record<RomanceDatasetLabel, number>;
  let bestIdx = 0;
  for (let i = 0; i < model.labels.length; i++) {
    scores[model.labels[i]] = probs[i];
    if (probs[i] > probs[bestIdx]) bestIdx = i;
  }

  return { label: model.labels[bestIdx], scores };
}
