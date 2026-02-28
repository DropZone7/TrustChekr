/** Shared tokenizer — must match training pipeline exactly */

const STOP_WORDS = new Set([
  'the', 'and', 'that', 'this', 'with', 'for', 'are', 'was', 'has', 'have',
  'had', 'not', 'but', 'what', 'all', 'were', 'when', 'your', 'can', 'there',
  'from', 'been', 'they', 'will', 'would', 'could', 'should', 'than', 'its',
  'also', 'into', 'just', 'about', 'which', 'their', 'them', 'then', 'some',
  'her', 'him', 'his', 'she', 'how', 'our', 'out', 'you', 'who', 'did',
]);

const MIN_TOKEN_LENGTH = 3;

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length >= MIN_TOKEN_LENGTH && !STOP_WORDS.has(t));
}
