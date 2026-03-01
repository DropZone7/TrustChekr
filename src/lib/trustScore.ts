// src/lib/trustScore.ts

export type TrustScoreResult = {
  score: number;
  grade: "A" | "B" | "C" | "D" | "F";
  label: string;
  positiveFactors: string[];
  negativeFactors: string[];
};

export type TrustScoreInput = {
  text: string;
  weight: number;
};

export type PositiveSignalContext = {
  domainAgeYears?: number | null;
  isBrandWhitelisted?: boolean;
  sslValid?: boolean;
  isKnownRegistrar?: boolean;
};

type Grade = "A" | "B" | "C" | "D" | "F";

const GRADE_THRESHOLDS: { min: number; grade: Grade; label: string }[] = [
  { min: 81, grade: "A", label: "Trusted" },
  { min: 61, grade: "B", label: "Low Risk" },
  { min: 41, grade: "C", label: "Use Caution" },
  { min: 21, grade: "D", label: "Suspicious" },
  { min: 0, grade: "F", label: "Dangerous" },
];

function scoreToGrade(score: number): { grade: Grade; label: string } {
  for (const tier of GRADE_THRESHOLDS) {
    if (score >= tier.min) {
      return { grade: tier.grade, label: tier.label };
    }
  }
  return { grade: "F", label: "Dangerous" };
}

const POSITIVE_BONUS_DOMAIN_AGE = 10;
const POSITIVE_BONUS_BRAND = 15;
const POSITIVE_BONUS_SSL = 5;
const POSITIVE_BONUS_REGISTRAR = 5;
const POSITIVE_BONUS_MAX = 35;

export function calculateTrustScore(
  signals: TrustScoreInput[],
  inputType: string,
  context?: PositiveSignalContext
): TrustScoreResult {
  const negativeFactors: string[] = [];
  const positiveFactors: string[] = [];

  let penalty = 0;
  for (const signal of signals) {
    if (signal.weight > 0) {
      penalty += signal.weight;
      negativeFactors.push(signal.text);
    }
  }

  const afterPenalty = Math.max(0, 100 - penalty);

  let bonus = 0;

  if (
    (inputType === "url" || inputType === "website" || inputType === "email") &&
    context?.domainAgeYears != null &&
    context.domainAgeYears > 5
  ) {
    bonus += POSITIVE_BONUS_DOMAIN_AGE;
    positiveFactors.push(
      `Domain has been registered for over ${Math.floor(context.domainAgeYears)} years`
    );
  }

  if (context?.isBrandWhitelisted === true) {
    bonus += POSITIVE_BONUS_BRAND;
    positiveFactors.push("Domain matches a verified brand whitelist");
  }

  if (context?.sslValid === true) {
    bonus += POSITIVE_BONUS_SSL;
    positiveFactors.push("Valid SSL/TLS certificate detected");
  }

  if (context?.isKnownRegistrar === true) {
    bonus += POSITIVE_BONUS_REGISTRAR;
    positiveFactors.push("Registered through a known, reputable domain registrar");
  }

  const cappedBonus = Math.min(bonus, POSITIVE_BONUS_MAX);
  const score = Math.min(100, afterPenalty + cappedBonus);
  const { grade, label } = scoreToGrade(score);

  return {
    score,
    grade,
    label,
    positiveFactors,
    negativeFactors,
  };
}

export function gradeToCssColor(grade: Grade): string {
  switch (grade) {
    case "A": return "var(--tc-ok, #2A6E2A)";
    case "B": return "var(--tc-ok-muted, #4A8A3A)";
    case "C": return "var(--tc-caution, #B08A00)";
    case "D": return "var(--tc-warning, #C75000)";
    case "F": return "var(--tc-danger, #A40000)";
  }
}
