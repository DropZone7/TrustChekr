/**
 * Google Knowledge Graph Search API
 * Verifies if an entity (company, person, organization) is real and notable.
 * Free tier: 100K queries/day
 */

const API_KEY = process.env.GEMINI_API_KEY; // Same key works for all Google APIs

interface KGEntity {
  name: string;
  type: string[];
  description?: string;
  url?: string;
  detailedDescription?: string;
  score: number; // relevance score from Google
}

export interface EntityVerification {
  found: boolean;
  entity?: KGEntity;
  isRealCompany: boolean;
  officialUrl?: string;
  mismatchSignals: string[];
}

export async function verifyEntity(query: string): Promise<EntityVerification | null> {
  if (!API_KEY) return null;

  try {
    const params = new URLSearchParams({
      query,
      key: API_KEY,
      limit: '3',
      indent: 'false',
    });

    const res = await fetch(
      `https://kgsearch.googleapis.com/v1/entities:search?${params}`,
      { signal: AbortSignal.timeout(3000) }
    );

    if (!res.ok) return null;
    const data = await res.json();

    const elements = data.itemListElement || [];
    if (elements.length === 0) {
      return { found: false, isRealCompany: false, mismatchSignals: [] };
    }

    const top = elements[0].result;
    const score = elements[0].resultScore || 0;

    const entity: KGEntity = {
      name: top.name || query,
      type: top['@type'] || [],
      description: top.description,
      url: top.url,
      detailedDescription: top.detailedDescription?.articleBody,
      score,
    };

    const isOrg = entity.type.some((t: string) =>
      ['Organization', 'Corporation', 'Company', 'LocalBusiness'].includes(t)
    );

    return {
      found: true,
      entity,
      isRealCompany: isOrg && score > 100,
      officialUrl: entity.url,
      mismatchSignals: [],
    };
  } catch {
    return null;
  }
}

/**
 * Checks if a message claiming to be from a company has mismatch signals.
 * E.g., message says "from Randstad" but contacts via WhatsApp instead of randstad.com
 */
export async function verifyMessageClaims(
  messageText: string
): Promise<{ signals: string[]; weight: number } | null> {
  if (!API_KEY) return null;

  const lower = messageText.toLowerCase();

  // Extract potential company names — look for patterns like "from [Company]", "at [Company]", "[Company] is hiring"
  const companyPatterns = [
    /(?:from|at|with|representing|this is .* (?:from|at))\s+([A-Z][a-zA-Z&\s]{2,30}?)(?:\s*[—–\-,.]|\s+one\b|\s+is\b|\s+we\b)/g,
    /([A-Z][a-zA-Z]{3,20})\s+(?:is hiring|is looking|is recruiting|is onboarding)/gi,
  ];

  const candidates: string[] = [];
  for (const pattern of companyPatterns) {
    let match;
    while ((match = pattern.exec(messageText)) !== null) {
      const name = match[1].trim();
      if (name.length >= 3 && name.length <= 30) candidates.push(name);
    }
  }

  if (candidates.length === 0) return null;

  // Verify the first candidate
  const companyName = candidates[0];
  const verification = await verifyEntity(companyName);

  if (!verification) return null;

  const signals: string[] = [];
  let weight = 0;

  if (verification.found && verification.isRealCompany && verification.officialUrl) {
    // It's a real company — now check if the message is actually from them
    const officialDomain = new URL(verification.officialUrl).hostname.replace('www.', '');

    // Red flag: real company but contact is via WhatsApp/Telegram instead of official channels
    const hasWhatsapp = /whatsapp|telegram|signal/i.test(lower);
    const hasOfficialEmail = lower.includes(officialDomain);

    if (hasWhatsapp && !hasOfficialEmail) {
      signals.push(
        `"${verification.entity?.name}" is a real company (${officialDomain}), but this message asks you to reply via WhatsApp instead of their official channels. Legitimate companies recruit through their own website and corporate email.`
      );
      weight += 25;
    }

    // Red flag: real company but message has scam patterns
    const scamPatterns = /no experience|same.day pay|earn \$|\$\d+.*\/day|own schedule.*\$|place ads/i;
    if (scamPatterns.test(lower)) {
      signals.push(
        `This message claims to be from ${verification.entity?.name}, but the job description doesn't match how ${verification.entity?.name} actually recruits. Someone may be impersonating them.`
      );
      weight += 20;
    }
  } else if (!verification.found) {
    // Company not found in Knowledge Graph — could be fake
    // Only flag if other scam signals present too
    const hasScamSignals = /no experience|earn \$|same.day|whatsapp|telegram/i.test(lower);
    if (hasScamSignals) {
      signals.push(
        `We couldn't verify "${companyName}" as a recognized company. Combined with other red flags in this message, be very cautious.`
      );
      weight += 15;
    }
  }

  return signals.length > 0 ? { signals, weight } : null;
}
