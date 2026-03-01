import type { ScamScript, MatchedSignal } from '../types';
import { weightToPenalty } from '../scoring';

/**
 * Match text against known scam script flows.
 * Checks if the text contains keywords from multiple steps in a known script.
 * If 40%+ of steps have keyword matches, we flag it as matching the script.
 */
export function matchScriptPatterns(
  text: string,
  scripts: ScamScript[],
): MatchedSignal[] {
  if (!text || text.trim().length === 0) return [];

  const normalised = text.toLowerCase();
  const signals: MatchedSignal[] = [];

  for (const script of scripts) {
    // Extract key phrases from each step (3+ word chunks)
    let stepsMatched = 0;

    for (const step of script.steps) {
      // Get meaningful keywords from the step (skip common words)
      const keywords = step
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .split(/\s+/)
        .filter((w) => w.length > 3 && !STOP_WORDS.has(w));

      // Check if 50%+ of keywords from this step appear in the text
      if (keywords.length > 0) {
        const hits = keywords.filter((kw) => normalised.includes(kw));
        if (hits.length / keywords.length >= 0.5) {
          stepsMatched++;
        }
      }
    }

    // If 40%+ of script steps match, flag it
    const matchRatio = stepsMatched / script.steps.length;
    if (matchRatio >= 0.4) {
      signals.push({
        ruleId: script.id,
        category: script.category,
        weight: script.weight,
        penalty: weightToPenalty(script.weight),
        description: `Matches known scam pattern: ${script.description}`,
        matchedText: `${stepsMatched}/${script.steps.length} steps matched`,
      });
    }
  }

  return signals;
}

const STOP_WORDS = new Set([
  'that', 'this', 'with', 'from', 'they', 'them', 'their', 'have',
  'been', 'were', 'will', 'would', 'could', 'should', 'about',
  'which', 'when', 'where', 'what', 'does', 'some', 'other',
  'into', 'also', 'than', 'then', 'very', 'just', 'more',
  'being', 'after', 'before', 'over', 'under', 'between',
]);
