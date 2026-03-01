// src/lib/osint/socialMedia.ts

export interface SocialPlatform {
  name: string;
  found: boolean;
  url?: string;
}

export interface SocialPresenceResult {
  hasPresence: boolean;
  platforms: SocialPlatform[];
  signals: { text: string; weight: number }[];
  checkedAt: string;
}

interface PlatformDef {
  name: string;
  patterns: RegExp[];
}

const PLATFORM_DEFS: PlatformDef[] = [
  {
    name: "Facebook",
    patterns: [
      /https?:\/\/(?:www\.)?facebook\.com\/(?!sharer|share|dialog|tr\b)[a-z0-9._%-]+\/?/i,
    ],
  },
  {
    name: "X (Twitter)",
    patterns: [
      /https?:\/\/(?:www\.)?(?:twitter|x)\.com\/(?!intent\/|share\b|home\b)[a-z0-9_]+\/?/i,
    ],
  },
  {
    name: "Instagram",
    patterns: [/https?:\/\/(?:www\.)?instagram\.com\/[a-z0-9._]+\/?/i],
  },
  {
    name: "LinkedIn",
    patterns: [
      /https?:\/\/(?:www\.)?linkedin\.com\/(?:company|in|school)\/[a-z0-9_%-]+\/?/i,
    ],
  },
  {
    name: "YouTube",
    patterns: [
      /https?:\/\/(?:www\.)?youtube\.com\/(?:channel\/|user\/|@)[a-z0-9_%-]+\/?/i,
    ],
  },
  {
    name: "TikTok",
    patterns: [/https?:\/\/(?:www\.)?tiktok\.com\/@[a-z0-9._]+\/?/i],
  },
];

function extractAnchorHrefs(html: string): string[] {
  const hrefs: string[] = [];
  const anchorRe = /<a\s[^>]*href=["']([^"'#\s][^"']*?)["'][^>]*>/gi;
  let m: RegExpExecArray | null;
  while ((m = anchorRe.exec(html)) !== null) {
    hrefs.push(m[1]);
  }
  return hrefs;
}

function extractMetaValue(html: string, attrName: string, attrValue: string): string[] {
  const results: string[] = [];
  const tagRe = new RegExp(
    `<(?:meta|link)\\s[^>]*${attrName}=["']${attrValue}["'][^>]*>`,
    "gi"
  );
  const contentRe = /(?:content|href)=["']([^"']+)["']/i;
  let m: RegExpExecArray | null;
  while ((m = tagRe.exec(html)) !== null) {
    const inner = contentRe.exec(m[0]);
    if (inner?.[1]) results.push(inner[1]);
  }
  return results;
}

function extractAllMetaByProperty(html: string, property: string): string[] {
  return extractMetaValue(html, "property", property).concat(
    extractMetaValue(html, "name", property)
  );
}

function matchPlatforms(candidates: string[]): Map<string, string> {
  const found = new Map<string, string>();
  for (const url of candidates) {
    for (const def of PLATFORM_DEFS) {
      if (found.has(def.name)) continue;
      for (const pattern of def.patterns) {
        const match = pattern.exec(url);
        if (match) {
          found.set(def.name, match[0]);
          break;
        }
      }
    }
  }
  return found;
}

function parseHtmlForSocialLinks(html: string): Map<string, string> {
  const candidates: string[] = [];

  candidates.push(...extractAnchorHrefs(html));
  candidates.push(...extractAllMetaByProperty(html, "og:see_also"));
  candidates.push(...extractAllMetaByProperty(html, "article:author"));
  candidates.push(...extractMetaValue(html, "rel", "me"));

  const twitterHandles = [
    ...extractAllMetaByProperty(html, "twitter:site"),
    ...extractAllMetaByProperty(html, "twitter:creator"),
  ];
  for (const handle of twitterHandles) {
    const clean = handle.replace(/^@/, "").trim();
    if (clean.length > 0) {
      candidates.push(`https://x.com/${clean}`);
    }
  }

  return matchPlatforms(candidates);
}

export async function checkSocialPresence(
  domain: string,
  domainAgeDays?: number | null
): Promise<SocialPresenceResult | null> {
  const signals: { text: string; weight: number }[] = [];

  let html: string;
  try {
    const res = await fetch(`https://${domain}`, {
      signal: AbortSignal.timeout(2000),
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; TrustChekr/1.0; +https://trustchekr.com)",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "en-CA,en;q=0.9",
      },
      redirect: "follow",
    });

    if (!res.ok) return null;

    const reader = res.body?.getReader();
    const maxBytes = 512 * 1024;
    const chunks: Uint8Array[] = [];
    let totalBytes = 0;

    if (!reader) return null;

    while (true) {
      const { done, value } = await reader.read();
      if (done || !value) break;
      chunks.push(value);
      totalBytes += value.byteLength;
      if (totalBytes >= maxBytes) {
        await reader.cancel();
        break;
      }
    }

    html = new TextDecoder("utf-8", { fatal: false }).decode(
      chunks.reduce((acc, chunk) => {
        const merged = new Uint8Array(acc.length + chunk.length);
        merged.set(acc, 0);
        merged.set(chunk, acc.length);
        return merged;
      }, new Uint8Array(0))
    );
  } catch {
    return null;
  }

  const foundMap = parseHtmlForSocialLinks(html);

  const platforms: SocialPlatform[] = PLATFORM_DEFS.map((def) => {
    const url = foundMap.get(def.name);
    return { name: def.name, found: url != null, url };
  });

  const foundCount = platforms.filter((p) => p.found).length;
  const hasLinkedIn = foundMap.has("LinkedIn");
  const hasPresence = foundCount > 0;
  const isNewDomain = domainAgeDays != null && domainAgeDays < 365;

  if (foundCount >= 3) {
    signals.push({
      text: `Website has active social media presence on ${foundCount} platform${foundCount !== 1 ? "s" : ""}`,
      weight: -10,
    });
  } else if (foundCount === 0 && isNewDomain) {
    signals.push({
      text: "New website with no social media presence detected",
      weight: 10,
    });
  }

  if (hasLinkedIn) {
    signals.push({
      text: "LinkedIn business page found — consistent with a legitimate organization",
      weight: -5,
    });
  }

  if (!hasPresence && !isNewDomain) {
    signals.push({
      text: "No social media links found on the website homepage",
      weight: 0,
    });
  }

  return {
    hasPresence,
    platforms,
    signals,
    checkedAt: new Date().toISOString(),
  };
}
