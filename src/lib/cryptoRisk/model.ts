import * as fs from 'fs/promises';
import * as path from 'path';
import type { XrplWalletFeatures } from './dataset';
import type { CryptoRiskLevel } from './types';

type ModelJson = {
  version: string;
  featureNames: string[];
  normalization: { mean: number[]; std: number[] };
  weights: number[];
  bias: number;
};

let cachedModel: ModelJson | null = null;

export async function loadXrplWalletRiskModel(): Promise<ModelJson> {
  if (cachedModel) return cachedModel;

  const modelPath = path.join(process.cwd(), 'models', 'xrpl-wallet-risk-model.json');
  const raw = await fs.readFile(modelPath, 'utf-8');
  cachedModel = JSON.parse(raw) as ModelJson;
  return cachedModel;
}

function sigmoid(z: number): number {
  if (z > 500) return 1;
  if (z < -500) return 0;
  return 1 / (1 + Math.exp(-z));
}

/** Map camelCase feature name to the corresponding property on XrplWalletFeatures */
function getFeatureValue(features: XrplWalletFeatures, name: string): number {
  return Number((features as any)[name]) || 0;
}

export function scoreWalletFeatures(
  features: XrplWalletFeatures,
  model: ModelJson
): { riskScore: number; riskLevel: CryptoRiskLevel } {
  // Build feature vector in model's expected order
  const x: number[] = model.featureNames.map((name, i) => {
    const raw = getFeatureValue(features, name);
    const mean = model.normalization.mean[i];
    const std = model.normalization.std[i] || 1;
    return (raw - mean) / std;
  });

  // w·x + b
  let z = model.bias;
  for (let i = 0; i < x.length; i++) {
    z += model.weights[i] * x[i];
  }

  const riskScore = sigmoid(z);

  let riskLevel: CryptoRiskLevel;
  if (riskScore < 0.25) riskLevel = 'low';
  else if (riskScore < 0.5) riskLevel = 'medium';
  else if (riskScore < 0.75) riskLevel = 'high';
  else riskLevel = 'critical';

  return { riskScore, riskLevel };
}
