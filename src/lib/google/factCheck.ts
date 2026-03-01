/**
 * Google Fact Check Tools API
 * Searches for fact-checks related to a claim or entity.
 * Free tier: 10K queries/day
 */

const API_KEY = process.env.GEMINI_API_KEY;

interface FactCheckResult {
  claimReviewed: string;
  textualRating: string;
  publisher: string;
  url: string;
}

export async function searchFactChecks(query: string): Promise<FactCheckResult[]> {
  if (!API_KEY) return [];

  try {
    const params = new URLSearchParams({
      query,
      key: API_KEY,
      languageCode: 'en',
    });

    const res = await fetch(
      `https://factchecktools.googleapis.com/v1alpha1/claims:search?${params}`,
      { signal: AbortSignal.timeout(3000) }
    );

    if (!res.ok) return [];
    const data = await res.json();

    const claims = data.claims || [];
    return claims.slice(0, 3).map((c: any) => {
      const review = c.claimReview?.[0] || {};
      return {
        claimReviewed: c.text || '',
        textualRating: review.textualRating || '',
        publisher: review.publisher?.name || '',
        url: review.url || '',
      };
    });
  } catch {
    return [];
  }
}
