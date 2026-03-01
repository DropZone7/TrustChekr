import type { ScamPattern, MatchedSignal } from '../types';
import { weightToPenalty } from '../scoring';

/**
 * Run all text-based scam patterns against input text.
 * Returns matched signals with penalties.
 */
export function matchTextPatterns(
  text: string,
  patterns: ScamPattern[],
): MatchedSignal[] {
  if (!text || text.trim().length === 0) return [];

  const normalised = text.toLowerCase();
  const signals: MatchedSignal[] = [];

  for (const rule of patterns) {
    let matched = false;
    let matchedText: string | undefined;

    switch (rule.type) {
      case 'exact': {
        const lower = rule.pattern.toLowerCase();
        if (normalised.includes(lower)) {
          matched = true;
          matchedText = rule.pattern;
        }
        break;
      }

      case 'regex': {
        try {
          const re = new RegExp(rule.pattern, 'i');
          const m = re.exec(text);
          if (m) {
            matched = true;
            matchedText = m[0];
          }
        } catch {
          // Invalid regex in rule — skip silently, log in production
        }
        break;
      }

      case 'fuzzy': {
        // Simple fuzzy: split pattern into words, check if 80%+ appear
        const words = rule.pattern.toLowerCase().split(/\s+/);
        const hits = words.filter((w) => normalised.includes(w));
        if (words.length > 0 && hits.length / words.length >= 0.8) {
          matched = true;
          matchedText = hits.join(' ');
        }
        break;
      }
    }

    if (matched) {
      signals.push({
        ruleId: rule.id,
        category: rule.category,
        weight: rule.weight,
        penalty: weightToPenalty(rule.weight),
        description: rule.description,
        matchedText,
      });
    }
  }

  return signals;
}
