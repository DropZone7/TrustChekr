/**
 * Gemini-powered scam analysis — enhances pattern-based results with AI reasoning.
 * Always optional — degrades gracefully if Gemini is unavailable or slow.
 */

import { askGemini } from './gemini';

export type AIScamAnalysis = {
  aiSummary: string;
  aiConfidence: number;
  aiScamType: string | null;
  aiTactics: string[];
  available: boolean;
};

const SYSTEM_INSTRUCTION = `You are a scam detection expert working for TrustChekr, a Canadian consumer protection tool. 
Analyze the provided content and assess whether it appears to be a scam.
Be direct, use plain language suitable for seniors. Never say something is "safe" — use "Low Risk" instead.
Focus on specific red flags and tactics. Be concise.`;

/**
 * Analyze suspicious content with Gemini AI.
 * Returns enhanced analysis or a fallback if unavailable.
 */
export async function analyzeWithAI(
  inputType: string,
  content: string,
  patternRiskLevel: string
): Promise<AIScamAnalysis> {
  const fallback: AIScamAnalysis = {
    aiSummary: '',
    aiConfidence: 0,
    aiScamType: null,
    aiTactics: [],
    available: false,
  };

  if (!content || content.length < 10) return fallback;

  const prompt = `Analyze this ${inputType} for scam indicators. Our pattern engine rated it "${patternRiskLevel}".

Content:
"""
${content.slice(0, 2000)}
"""

Respond in this exact JSON format (no markdown, no code fences):
{
  "summary": "1-2 sentence plain-English assessment for a non-technical person",
  "confidence": 0.0 to 1.0,
  "scamType": "phishing|romance|investment|impersonation|tech_support|advance_fee|none",
  "tactics": ["list", "of", "specific", "tactics", "observed"]
}`;

  const result = await askGemini(prompt, {
    systemInstruction: SYSTEM_INSTRUCTION,
    temperature: 0.2,
    maxOutputTokens: 512,
  });

  if (!result) return fallback;

  try {
    // Strip any markdown fences if Gemini adds them
    const cleaned = result.text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return {
      aiSummary: typeof parsed.summary === 'string' ? parsed.summary : '',
      aiConfidence: typeof parsed.confidence === 'number' ? Math.min(1, Math.max(0, parsed.confidence)) : 0,
      aiScamType: typeof parsed.scamType === 'string' && parsed.scamType !== 'none' ? parsed.scamType : null,
      aiTactics: Array.isArray(parsed.tactics) ? parsed.tactics.filter((t: any) => typeof t === 'string').slice(0, 5) : [],
      available: true,
    };
  } catch {
    return fallback;
  }
}
