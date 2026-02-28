/**
 * Google Gemini API Client
 *
 * Free tier: 60 requests/min on Gemini 2.0 Flash
 * Used for: AI scam analysis, content classification, text enhancement
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY ?? '';
const GEMINI_MODEL = 'gemini-2.5-flash';
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

export type GeminiRole = 'user' | 'model';

export type GeminiMessage = {
  role: GeminiRole;
  parts: { text: string }[];
};

export type GeminiResponse = {
  text: string;
  finishReason: string;
  tokenCount?: number;
};

/**
 * Send a prompt to Gemini and get a text response.
 * Returns null on error (never throws — callers degrade gracefully).
 */
export async function askGemini(
  prompt: string,
  options?: {
    systemInstruction?: string;
    temperature?: number;
    maxOutputTokens?: number;
    model?: string;
  }
): Promise<GeminiResponse | null> {
  if (!GEMINI_API_KEY) return null;

  const model = options?.model ?? GEMINI_MODEL;
  const url = `${BASE_URL}/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

  const body: any = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: options?.temperature ?? 0.3,
      maxOutputTokens: options?.maxOutputTokens ?? 1024,
    },
  };

  if (options?.systemInstruction) {
    body.systemInstruction = {
      parts: [{ text: options.systemInstruction }],
    };
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) return null;

    const data = await res.json();
    const candidate = data.candidates?.[0];
    if (!candidate) return null;

    return {
      text: candidate.content?.parts?.[0]?.text ?? '',
      finishReason: candidate.finishReason ?? 'unknown',
      tokenCount: data.usageMetadata?.totalTokenCount,
    };
  } catch {
    return null;
  }
}

/**
 * Multi-turn conversation with Gemini.
 */
export async function chatGemini(
  messages: GeminiMessage[],
  options?: {
    systemInstruction?: string;
    temperature?: number;
    maxOutputTokens?: number;
    model?: string;
  }
): Promise<GeminiResponse | null> {
  if (!GEMINI_API_KEY) return null;

  const model = options?.model ?? GEMINI_MODEL;
  const url = `${BASE_URL}/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

  const body: any = {
    contents: messages,
    generationConfig: {
      temperature: options?.temperature ?? 0.3,
      maxOutputTokens: options?.maxOutputTokens ?? 1024,
    },
  };

  if (options?.systemInstruction) {
    body.systemInstruction = {
      parts: [{ text: options.systemInstruction }],
    };
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) return null;

    const data = await res.json();
    const candidate = data.candidates?.[0];
    if (!candidate) return null;

    return {
      text: candidate.content?.parts?.[0]?.text ?? '',
      finishReason: candidate.finishReason ?? 'unknown',
      tokenCount: data.usageMetadata?.totalTokenCount,
    };
  } catch {
    return null;
  }
}

/**
 * Classify text into one of the provided categories.
 * Returns the category string or null on failure.
 */
export async function classifyWithGemini(
  text: string,
  categories: string[],
  context?: string
): Promise<string | null> {
  const prompt = `Classify the following text into exactly one of these categories: ${categories.join(', ')}.

${context ? `Context: ${context}\n` : ''}Text to classify:
"""
${text.slice(0, 3000)}
"""

Respond with ONLY the category name, nothing else.`;

  const result = await askGemini(prompt, { temperature: 0.1, maxOutputTokens: 50 });
  if (!result) return null;

  const answer = result.text.trim().toLowerCase();
  const match = categories.find((c) => answer.includes(c.toLowerCase()));
  return match ?? null;
}
