/**
 * Test runner: loads CSV datasets, runs text matcher against all rules,
 * compares detected vs expected categories, outputs accuracy metrics.
 * Run with: npx tsx test-data/etl/run_detection_test.ts
 */
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { matchTextPatterns } from '../../src/lib/ai-detection/matchers/textMatcher';
import { computeTotalPenalty, mapScoreToAIRiskTier } from '../../src/lib/ai-detection/scoring';
import type { ScamPattern } from '../../src/lib/ai-detection/types';

// Load all rule files
const RULES_DIR = join(__dirname, '../../src/lib/ai-detection/rules');
const ruleFiles = ['cra.json', 'banks.json', 'interac.json', 'crypto.json', 'tech_support.json', 'rental.json'];

const allPatterns: ScamPattern[] = [];
for (const file of ruleFiles) {
  const data = JSON.parse(readFileSync(join(RULES_DIR, file), 'utf-8'));
  allPatterns.push(...(data.patterns || []));
}
console.log(`Loaded ${allPatterns.length} patterns from ${ruleFiles.length} rule files`);

// CSV parser using line-by-line approach to handle large files
function parseCSV(text: string, maxRows = 50000): Record<string, string>[] {
  const results: Record<string, string>[] = [];
  let pos = 0;
  const len = text.length;
  
  function parseField(): string {
    if (pos >= len) return '';
    if (text[pos] === '"') {
      pos++; // skip opening quote
      let field = '';
      while (pos < len) {
        if (text[pos] === '"') {
          if (pos + 1 < len && text[pos + 1] === '"') { field += '"'; pos += 2; }
          else { pos++; break; }
        } else { field += text[pos]; pos++; }
      }
      return field;
    }
    let field = '';
    while (pos < len && text[pos] !== ',' && text[pos] !== '\n' && text[pos] !== '\r') {
      field += text[pos]; pos++;
    }
    return field;
  }
  
  function parseRow(): string[] {
    const fields: string[] = [];
    fields.push(parseField());
    while (pos < len && text[pos] === ',') { pos++; fields.push(parseField()); }
    if (pos < len && text[pos] === '\r') pos++;
    if (pos < len && text[pos] === '\n') pos++;
    return fields;
  }
  
  const headers = parseRow().map(h => h.trim());
  while (pos < len && results.length < maxRows) {
    if (text[pos] === '\n' || text[pos] === '\r') { pos++; continue; }
    const vals = parseRow();
    if (vals.length < 2) continue;
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => { obj[h] = (vals[i] || '').trim(); });
    results.push(obj);
  }
  return results;
}

// Category normalization
const CATEGORY_NORMALIZE: Record<string, string> = {
  'CRA_IMPERSONATION': 'cra_impersonation',
  'BANK_IMPERSONATION': 'bank_impersonation',
  'INTERAC_PHISHING': 'interac_phishing',
  'PIG_BUTCHERING': 'pig_butchering',
  'CRYPTO_INVESTMENT': 'crypto_investment',
  'TECH_SUPPORT': 'tech_support',
  'RENTAL_SCAM': 'rental_scam',
};

function normalizeCategory(cat: string): string {
  return CATEGORY_NORMALIZE[cat] || cat.toLowerCase();
}

// Load datasets
const DATA_DIR = join(__dirname, '..');
const csvFiles = ['schema1_canadian_synthetic.csv', 'schema1_scam_texts.csv'];
const allRows: Record<string, string>[] = [];

for (const file of csvFiles) {
  try {
    const content = readFileSync(join(DATA_DIR, file), 'utf-8');
    const rows = parseCSV(content);
    console.log(`Loaded ${rows.length} rows from ${file}`);
    allRows.push(...rows);
  } catch (e) {
    console.log(`Skipping ${file}: ${(e as Error).message}`);
  }
}

console.log(`Total test cases: ${allRows.length}\n`);

// Run detection on each row
interface TestResult {
  id: string;
  expectedCategory: string;
  detectedCategories: string[];
  signalCount: number;
  totalPenalty: number;
  riskTier: string;
  correct: boolean;
}

const results: TestResult[] = [];
const categoryStats: Record<string, { tp: number; fp: number; fn: number; total: number }> = {};

const ALL_CATEGORIES = [
  'cra_impersonation', 'bank_impersonation', 'interac_phishing',
  'pig_butchering', 'crypto_investment', 'tech_support', 'rental_scam',
  'generic_phishing', 'legitimate'
];

for (const cat of ALL_CATEGORIES) {
  categoryStats[cat] = { tp: 0, fp: 0, fn: 0, total: 0 };
}

for (const row of allRows) {
  const text = row.text || '';
  const expectedCat = (row.category || '').toLowerCase();
  
  const signals = matchTextPatterns(text, allPatterns);
  const penalty = computeTotalPenalty(signals);
  const riskTier = mapScoreToAIRiskTier(100 - penalty);
  
  // Get detected categories from signals
  const detectedCats = [...new Set(signals.map(s => normalizeCategory(s.category)))];
  
  // Determine if detection is correct
  let correct = false;
  if (expectedCat === 'legitimate') {
    // True negative: no signals detected
    correct = signals.length === 0 || riskTier === 'LIKELY_SAFE';
  } else {
    // True positive: expected category appears in detected categories
    correct = detectedCats.includes(expectedCat);
  }

  results.push({
    id: row.id || '',
    expectedCategory: expectedCat,
    detectedCategories: detectedCats,
    signalCount: signals.length,
    totalPenalty: penalty,
    riskTier,
    correct,
  });

  // Update stats
  if (!categoryStats[expectedCat]) {
    categoryStats[expectedCat] = { tp: 0, fp: 0, fn: 0, total: 0 };
  }
  categoryStats[expectedCat].total++;

  if (expectedCat === 'legitimate') {
    if (signals.length === 0 || riskTier === 'LIKELY_SAFE') {
      categoryStats[expectedCat].tp++;
    } else {
      categoryStats[expectedCat].fn++; // false positive (flagged legit as scam)
      for (const dc of detectedCats) {
        if (!categoryStats[dc]) categoryStats[dc] = { tp: 0, fp: 0, fn: 0, total: 0 };
        categoryStats[dc].fp++;
      }
    }
  } else {
    if (detectedCats.includes(expectedCat)) {
      categoryStats[expectedCat].tp++;
    } else {
      categoryStats[expectedCat].fn++;
      for (const dc of detectedCats) {
        if (!categoryStats[dc]) categoryStats[dc] = { tp: 0, fp: 0, fn: 0, total: 0 };
        if (dc !== expectedCat) categoryStats[dc].fp++;
      }
    }
  }
}

// Calculate overall metrics
const totalCorrect = results.filter(r => r.correct).length;
const overallAccuracy = (totalCorrect / results.length * 100).toFixed(1);

const scamRows = results.filter(r => r.expectedCategory !== 'legitimate');
const legitRows = results.filter(r => r.expectedCategory === 'legitimate');
const truePositives = scamRows.filter(r => r.correct).length;
const falseNegatives = scamRows.filter(r => !r.correct).length;
const trueNegatives = legitRows.filter(r => r.correct).length;
const falsePositives = legitRows.filter(r => !r.correct).length;

const fpRate = legitRows.length > 0 ? (falsePositives / legitRows.length * 100).toFixed(1) : 'N/A';
const fnRate = scamRows.length > 0 ? (falseNegatives / scamRows.length * 100).toFixed(1) : 'N/A';
const precision = (truePositives + falsePositives) > 0 
  ? (truePositives / (truePositives + falsePositives) * 100).toFixed(1) : 'N/A';
const recall = (truePositives + falseNegatives) > 0
  ? (truePositives / (truePositives + falseNegatives) * 100).toFixed(1) : 'N/A';

// Build report
let report = `# TrustChekr Detection Engine — Test Results\n\n`;
report += `**Date:** ${new Date().toISOString().split('T')[0]}\n`;
report += `**Total test cases:** ${results.length}\n`;
report += `**Patterns loaded:** ${allPatterns.length}\n\n`;
report += `## Overall Metrics\n\n`;
report += `| Metric | Value |\n|---|---|\n`;
report += `| Overall Accuracy | ${overallAccuracy}% |\n`;
report += `| Precision | ${precision}% |\n`;
report += `| Recall (Sensitivity) | ${recall}% |\n`;
report += `| False Positive Rate | ${fpRate}% |\n`;
report += `| False Negative Rate | ${fnRate}% |\n`;
report += `| True Positives | ${truePositives} |\n`;
report += `| True Negatives | ${trueNegatives} |\n`;
report += `| False Positives | ${falsePositives} |\n`;
report += `| False Negatives | ${falseNegatives} |\n\n`;

report += `## Per-Category Accuracy\n\n`;
report += `| Category | Total | TP | FP | FN | Accuracy |\n|---|---|---|---|---|---|\n`;
for (const cat of ALL_CATEGORIES) {
  const s = categoryStats[cat];
  if (!s || s.total === 0) continue;
  const acc = (s.tp / s.total * 100).toFixed(1);
  report += `| ${cat} | ${s.total} | ${s.tp} | ${s.fp} | ${s.fn} | ${acc}% |\n`;
}

report += `\n## Risk Tier Distribution\n\n`;
const tierCounts: Record<string, number> = {};
for (const r of results) {
  tierCounts[r.riskTier] = (tierCounts[r.riskTier] || 0) + 1;
}
report += `| Risk Tier | Count |\n|---|---|\n`;
for (const [tier, count] of Object.entries(tierCounts).sort()) {
  report += `| ${tier} | ${count} |\n`;
}

// Sample misclassifications
const misses = results.filter(r => !r.correct).slice(0, 20);
if (misses.length > 0) {
  report += `\n## Sample Misclassifications (up to 20)\n\n`;
  report += `| ID | Expected | Detected | Penalty | Risk Tier |\n|---|---|---|---|---|\n`;
  for (const m of misses) {
    report += `| ${m.id} | ${m.expectedCategory} | ${m.detectedCategories.join(', ') || 'none'} | ${m.totalPenalty} | ${m.riskTier} |\n`;
  }
}

const outputPath = join(DATA_DIR, 'detection-results.md');
writeFileSync(outputPath, report);
console.log(report);
console.log(`\nResults saved to ${outputPath}`);
