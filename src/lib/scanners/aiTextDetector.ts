// Heuristic AI text detector — no ML models, no Python, no cost
// Based on statistical patterns that distinguish AI vs human writing

export interface AIDetectionResult {
  ai_probability: number; // 0-1
  label: 'AI_GENERATED' | 'LIKELY_HUMAN' | 'UNCERTAIN' | 'TOO_SHORT';
  confidence: number; // 0-100
  signals: AISignal[];
  flags: string[];
}

interface AISignal {
  name: string;
  score: number; // 0-1
  description: string;
}

// Common AI transition phrases
const AI_TRANSITIONS = [
  'furthermore', 'moreover', 'additionally', 'in conclusion', 'consequently',
  'nevertheless', 'it is important to note', 'it is worth noting', 'in summary',
  'in essence', 'to summarize', 'that being said', 'having said that',
  'it\'s important to', 'it\'s worth mentioning', 'on the other hand',
  'in other words', 'as a result', 'for instance', 'in particular',
  'specifically', 'notably', 'significantly', 'essentially', 'fundamentally',
];

// AI-typical filler phrases
const AI_FILLERS = [
  'delve into', 'delve deeper', 'it\'s crucial', 'landscape',
  'comprehensive', 'multifaceted', 'robust', 'leverage',
  'cutting-edge', 'groundbreaking', 'game-changer', 'paradigm',
  'holistic', 'synergy', 'ecosystem', 'streamline',
  'empower', 'innovative', 'transformative', 'dynamic',
  'pivotal', 'nuanced', 'realm', 'tapestry',
  'navigating', 'ever-evolving', 'foster', 'harness',
];

export function detectAIText(text: string): AIDetectionResult {
  if (text.length < 50) {
    return { ai_probability: 0, label: 'TOO_SHORT', confidence: 0, signals: [], flags: ['TOO_SHORT'] };
  }

  const signals: AISignal[] = [];
  const lower = text.toLowerCase();
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 5);
  const words = text.split(/\s+/).filter((w) => w.length > 0);

  // 1. Sentence length uniformity (AI writes uniform-length sentences)
  if (sentences.length >= 3) {
    const lengths = sentences.map((s) => s.trim().split(/\s+/).length);
    const mean = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const variance = lengths.reduce((a, b) => a + (b - mean) ** 2, 0) / lengths.length;
    const cv = mean > 0 ? Math.sqrt(variance) / mean : 0;
    // Humans: CV > 0.5, AI: CV < 0.35
    const uniformityScore = cv < 0.25 ? 0.9 : cv < 0.35 ? 0.6 : cv < 0.5 ? 0.3 : 0.05;
    signals.push({ name: 'sentence_uniformity', score: uniformityScore, description: `Sentence length variation: ${cv.toFixed(2)} (AI tends toward uniformity)` });
  }

  // 2. Transition word density
  const transitionCount = AI_TRANSITIONS.filter((t) => lower.includes(t)).length;
  const transitionDensity = transitionCount / Math.max(1, sentences.length);
  const transitionScore = transitionDensity > 0.4 ? 0.85 : transitionDensity > 0.25 ? 0.6 : transitionDensity > 0.1 ? 0.3 : 0.05;
  signals.push({ name: 'transition_density', score: transitionScore, description: `${transitionCount} AI-typical transition phrases found` });

  // 3. AI filler/buzzword density
  const fillerCount = AI_FILLERS.filter((f) => lower.includes(f)).length;
  const fillerScore = fillerCount >= 5 ? 0.9 : fillerCount >= 3 ? 0.65 : fillerCount >= 1 ? 0.3 : 0.0;
  signals.push({ name: 'ai_buzzwords', score: fillerScore, description: `${fillerCount} AI-typical buzzwords detected` });

  // 4. Vocabulary diversity (Type-Token Ratio)
  const uniqueWords = new Set(words.map((w) => w.toLowerCase().replace(/[^a-z]/g, ''))).size;
  const ttr = uniqueWords / Math.max(1, words.length);
  // AI tends toward lower TTR (more repetitive vocabulary)
  const vocabScore = ttr < 0.35 ? 0.8 : ttr < 0.45 ? 0.5 : ttr < 0.55 ? 0.2 : 0.05;
  signals.push({ name: 'vocabulary_diversity', score: vocabScore, description: `Type-token ratio: ${ttr.toFixed(2)} (AI tends toward lower diversity)` });

  // 5. Paragraph structure regularity
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 20);
  if (paragraphs.length >= 3) {
    const pLengths = paragraphs.map((p) => p.length);
    const pMean = pLengths.reduce((a, b) => a + b, 0) / pLengths.length;
    const pVariance = pLengths.reduce((a, b) => a + (b - pMean) ** 2, 0) / pLengths.length;
    const pCv = pMean > 0 ? Math.sqrt(pVariance) / pMean : 0;
    const paraScore = pCv < 0.2 ? 0.8 : pCv < 0.35 ? 0.5 : 0.1;
    signals.push({ name: 'paragraph_regularity', score: paraScore, description: `Paragraph length variation: ${pCv.toFixed(2)}` });
  }

  // 6. List/bullet point detection (AI loves lists)
  const listPatterns = (text.match(/^[\s]*[-•*\d+.]\s/gm) ?? []).length;
  const listScore = listPatterns > 5 ? 0.7 : listPatterns > 2 ? 0.4 : 0.05;
  if (listPatterns > 0) {
    signals.push({ name: 'list_formatting', score: listScore, description: `${listPatterns} list items detected (AI overuses structured lists)` });
  }

  // 7. Hedging language (AI hedges a lot)
  const hedges = ['may', 'might', 'could', 'potentially', 'possibly', 'generally', 'typically', 'often', 'usually', 'tends to'];
  const hedgeCount = hedges.filter((h) => {
    const regex = new RegExp(`\\b${h}\\b`, 'gi');
    return regex.test(lower);
  }).length;
  const hedgeScore = hedgeCount >= 6 ? 0.7 : hedgeCount >= 4 ? 0.45 : hedgeCount >= 2 ? 0.15 : 0.0;
  signals.push({ name: 'hedging_language', score: hedgeScore, description: `${hedgeCount} hedging/qualifying phrases detected` });

  // Weighted average
  const weights: Record<string, number> = {
    sentence_uniformity: 0.2,
    transition_density: 0.2,
    ai_buzzwords: 0.2,
    vocabulary_diversity: 0.15,
    paragraph_regularity: 0.1,
    list_formatting: 0.05,
    hedging_language: 0.1,
  };

  let weightedSum = 0;
  let weightTotal = 0;
  for (const signal of signals) {
    const w = weights[signal.name] ?? 0.1;
    weightedSum += signal.score * w;
    weightTotal += w;
  }

  const ai_probability = weightTotal > 0 ? Math.round((weightedSum / weightTotal) * 1000) / 1000 : 0;

  const flags: string[] = [];
  if (ai_probability > 0.85) flags.push('LIKELY_AI_GENERATED');
  else if (ai_probability > 0.70) flags.push('POSSIBLE_AI_GENERATED');
  if (fillerCount >= 3) flags.push('AI_BUZZWORD_HEAVY');
  if (listPatterns > 5) flags.push('STRUCTURED_AI_FORMAT');

  const label: AIDetectionResult['label'] =
    ai_probability > 0.7 ? 'AI_GENERATED' :
    ai_probability > 0.4 ? 'UNCERTAIN' :
    'LIKELY_HUMAN';

  const confidence = Math.round(
    ai_probability > 0.5
      ? 50 + (ai_probability - 0.5) * 100
      : 50 + (0.5 - ai_probability) * 100
  );

  return { ai_probability, label, confidence, signals, flags };
}
