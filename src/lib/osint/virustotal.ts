// VirusTotal URL scanning - checks against 70+ security vendors
export interface VTResult {
  malicious: number;
  suspicious: number;
  harmless: number;
  undetected: number;
  signals: { text: string; weight: number }[];
}

export async function checkVirusTotal(url: string): Promise<VTResult> {
  const signals: { text: string; weight: number }[] = [];
  const apiKey = process.env.VIRUSTOTAL_API_KEY;

  if (!apiKey) {
    return { malicious: 0, suspicious: 0, harmless: 0, undetected: 0, signals: [] };
  }

  try {
    // VT uses base64-encoded URL as ID
    let cleaned = url.trim();
    if (!cleaned.startsWith("http")) cleaned = "https://" + cleaned;
    const urlId = Buffer.from(cleaned).toString("base64").replace(/=+$/, "");

    const res = await fetch(`https://www.virustotal.com/api/v3/urls/${urlId}`, {
      headers: { "x-apikey": apiKey },
      signal: AbortSignal.timeout(8000),
    });

    if (res.ok) {
      const data = await res.json();
      const stats = data.data?.attributes?.last_analysis_stats || {};
      const malicious = stats.malicious || 0;
      const suspicious = stats.suspicious || 0;
      const harmless = stats.harmless || 0;
      const undetected = stats.undetected || 0;

      if (malicious > 3) {
        signals.push({
          text: `${malicious} security vendors have flagged this website as malicious. This is a very strong indicator of danger.`,
          weight: 40,
        });
      } else if (malicious > 0) {
        signals.push({
          text: `${malicious} security vendor${malicious > 1 ? "s have" : " has"} flagged this website as potentially dangerous.`,
          weight: 20,
        });
      }

      if (suspicious > 2) {
        signals.push({
          text: `${suspicious} security vendors consider this website suspicious, even if not confirmed malicious.`,
          weight: 15,
        });
      }

      if (malicious === 0 && suspicious === 0 && harmless > 0) {
        signals.push({
          text: `${harmless} security vendors have checked this website and found no issues. This is a positive sign, but not a guarantee.`,
          weight: -10,
        });
      }

      // Check categories
      const categories = data.data?.attributes?.categories || {};
      const catValues = Object.values(categories).map((v) => String(v).toLowerCase());
      const dangerousCategories = ["phishing", "malware", "spam", "scam", "fraud", "suspicious", "gambling"];
      const matchedCats = dangerousCategories.filter((c) => catValues.some((v) => v.includes(c)));
      if (matchedCats.length > 0) {
        signals.push({
          text: `Security vendors categorize this site as: ${matchedCats.join(", ")}. This is a strong warning sign.`,
          weight: 25,
        });
      }

      return { malicious, suspicious, harmless, undetected, signals };
    } else if (res.status === 404) {
      // URL not in VT database — submit for scanning
      try {
        await fetch("https://www.virustotal.com/api/v3/urls", {
          method: "POST",
          headers: {
            "x-apikey": apiKey,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `url=${encodeURIComponent(cleaned)}`,
          signal: AbortSignal.timeout(5000),
        });
        // Don't wait for results — they take time
      } catch {
        // Submission failed, no problem
      }
    }
  } catch {
    // API unavailable
  }

  return { malicious: 0, suspicious: 0, harmless: 0, undetected: 0, signals };
}
