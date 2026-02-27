export type CryptoRiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type CryptoRiskSignal = {
  id: string;
  label: string;
  weight: number; // -1 to 1
  value: number | string;
};

export type CryptoRiskResult = {
  address: string;
  riskScore: number; // 0–1
  riskLevel: CryptoRiskLevel;
  signals: CryptoRiskSignal[];
  explanation: string;
  modelVersion: string;
};
