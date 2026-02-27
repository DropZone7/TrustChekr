// URLhaus (abuse.ch) — Free malware URL database
// API: https://urlhaus-api.abuse.ch/v1/
// No auth required for lookups

export interface UrlhausResult {
  inDatabase: boolean;
  threat: string | null;
  tags: string[];
  signals: { text: string; weight: number }[];
}

export async function checkUrlhaus(url: string): Promise<UrlhausResult> {
  const signals: { text: string; weight: number }[] = [];

  try {
    const res = await fetch("https://urlhaus-api.abuse.ch/v1/url/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `url=${encodeURIComponent(url)}`,
      signal: AbortSignal.timeout(5000),
    });

    if (res.ok) {
      const data = await res.json();

      if (data.query_status === "ok" && data.id) {
        const threat = data.threat ?? null;
        const tags: string[] = data.tags ?? [];
        const status = data.url_status ?? "unknown";

        if (status === "online") {
          signals.push({
            text: `This URL is actively distributing malware according to the URLhaus threat intelligence database. The threat type is: ${threat ?? "malware distribution"}.`,
            weight: 45,
          });
        } else {
          signals.push({
            text: `This URL was previously flagged for distributing malware (currently ${status}). It may still be dangerous.`,
            weight: 25,
          });
        }

        if (tags.length > 0) {
          signals.push({
            text: `Security researchers have tagged this URL with: ${tags.join(", ")}.`,
            weight: 10,
          });
        }

        return {
          inDatabase: true,
          threat,
          tags,
          signals,
        };
      }
    }
  } catch {
    // API unavailable — fail silently
  }

  return {
    inDatabase: false,
    threat: null,
    tags: [],
    signals,
  };
}
