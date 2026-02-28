export type RomanceScamType = 'romance' | 'pig_butchering' | 'investment' | 'generic_scam' | 'legit';

export type RomanceScamStage = 'spark' | 'grooming' | 'first_ask' | 'escalation' | 'revelation' | 'aftermath' | 'none';

export type RomanceRedFlag = {
  id: string;
  label: string;
  severity: number; // 1–5
  messageIndices: number[];
};

export type RomanceConversationMessage = {
  role: 'user' | 'other';
  text: string;
  timestamp?: string;
};

export type RomanceScanResult = {
  riskScore: number; // 0–1
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  scamType: RomanceScamType;
  stage: RomanceScamStage;
  redFlags: RomanceRedFlag[];
  summary: string;
  modelVersion: string;
};
