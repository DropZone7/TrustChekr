// URL Safety - Google Safe Browsing API + redirect following
export interface UrlSafetyResult {
  isSafe: boolean | null;
  threats: string[];
  finalUrl: string | null;
  redirectCount: number;
  signals: { text: string; weight: number }[];
}

export async function checkUrlSafety(url: string): Promise<UrlSafetyResult> {
  const signals: { text: string; weight: number }[] = [];
  let cleaned = url.trim();
  if (!cleaned.startsWith("http")) cleaned = "https://" + cleaned;

  // Google Safe Browsing API (free - 10,000 requests/day)
  if (process.env.GOOGLE_SAFE_BROWSING_KEY) {
    try {
      const gsbRes = await fetch(
        `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${process.env.GOOGLE_SAFE_BROWSING_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            client: { clientId: "trustchekr", clientVersion: "1.0" },
            threatInfo: {
              threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
              platformTypes: ["ANY_PLATFORM"],
              threatEntryTypes: ["URL"],
              threatEntries: [{ url: cleaned }],
            },
          }),
          signal: AbortSignal.timeout(5000),
        }
      );

      if (gsbRes.ok) {
        const data = await gsbRes.json();
        if (data.matches && data.matches.length > 0) {
          const threatTypes = data.matches.map((m: { threatType: string }) => m.threatType);

          if (threatTypes.includes("SOCIAL_ENGINEERING")) {
            signals.push({
              text: "Google's security systems have flagged this website as a phishing or social engineering site designed to trick people into giving up personal information.",
              weight: 40,
            });
          }
          if (threatTypes.includes("MALWARE")) {
            signals.push({
              text: "This website has been flagged for distributing malware (harmful software) that could damage your computer or steal your information.",
              weight: 40,
            });
          }
          if (threatTypes.includes("UNWANTED_SOFTWARE")) {
            signals.push({
              text: "This website has been flagged for distributing unwanted software that may change your browser settings or display ads.",
              weight: 20,
            });
          }

          return {
            isSafe: false,
            threats: threatTypes,
            finalUrl: null,
            redirectCount: 0,
            signals,
          };
        }
      }
    } catch {
      // API unavailable
    }
  }

  // Check if URL redirects (common in phishing)
  try {
    const headRes = await fetch(cleaned, {
      method: "HEAD",
      redirect: "manual",
      signal: AbortSignal.timeout(5000),
    });

    if (headRes.status >= 300 && headRes.status < 400) {
      const location = headRes.headers.get("location");
      if (location) {
        signals.push({
          text: `This link redirects to a different website (${location}). Scammers use redirects to disguise where a link actually takes you.`,
          weight: 15,
        });
      }
    }
  } catch {
    signals.push({
      text: "We couldn't reach this website. It may be down, blocked, or the address may be wrong.",
      weight: 5,
    });
  }

  return {
    isSafe: signals.length === 0 ? true : null,
    threats: [],
    finalUrl: null,
    redirectCount: 0,
    signals,
  };
}
