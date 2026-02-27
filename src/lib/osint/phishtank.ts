// PhishTank — Free phishing URL database
// API: https://checkurl.phishtank.com/checkurl/
// No key required for basic lookups, but key improves rate limits

export interface PhishTankResult {
  inDatabase: boolean;
  verified: boolean;
  signals: { text: string; weight: number }[];
}

export async function checkPhishTank(url: string): Promise<PhishTankResult> {
  const signals: { text: string; weight: number }[] = [];

  try {
    const params = new URLSearchParams({
      url: url,
      format: "json",
    });
    // Add API key if available
    if (process.env.PHISHTANK_API_KEY) {
      params.append("app_key", process.env.PHISHTANK_API_KEY);
    }

    const res = await fetch("https://checkurl.phishtank.com/checkurl/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
      signal: AbortSignal.timeout(5000),
    });

    if (res.ok) {
      const data = await res.json();
      const results = data.results;

      if (results?.in_database) {
        if (results.verified) {
          signals.push({
            text: "This URL is in the PhishTank database as a verified phishing site. It is designed to steal your personal information.",
            weight: 45,
          });
        } else {
          signals.push({
            text: "This URL has been reported as a suspected phishing site in the PhishTank community database.",
            weight: 30,
          });
        }

        return {
          inDatabase: true,
          verified: !!results.verified,
          signals,
        };
      }
    }
  } catch {
    // API unavailable — fail silently
  }

  return {
    inDatabase: false,
    verified: false,
    signals,
  };
}
