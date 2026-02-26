export type RiskLevel = "safe" | "suspicious" | "high-risk" | "very-likely-scam";

export interface ScanResult {
  inputType: string;
  inputValue: string;
  riskLevel: RiskLevel;
  whyBullets: string[];
  nextSteps: string[];
  reportTo: string[];
  educationalTip: string;
  shareText: string;
}

export const riskConfig: Record<
  RiskLevel,
  { label: string; color: string; bg: string; border: string }
> = {
  safe: {
    label: "Likely Safe",
    color: "var(--tc-safe)",
    bg: "#eafaf1",
    border: "var(--tc-safe)",
  },
  suspicious: {
    label: "Suspicious",
    color: "var(--tc-warning)",
    bg: "#fef9e7",
    border: "var(--tc-warning)",
  },
  "high-risk": {
    label: "High-Risk",
    color: "var(--tc-danger)",
    bg: "#fdedec",
    border: "var(--tc-danger)",
  },
  "very-likely-scam": {
    label: "Very Likely Scam",
    color: "var(--tc-danger-deep)",
    bg: "#f9ebea",
    border: "var(--tc-danger-deep)",
  },
};
