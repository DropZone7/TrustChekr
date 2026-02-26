// Domain/URL OSINT - WHOIS age check + DNS lookup + Google Safe Browsing
export interface DomainResult {
  age: number | null; // days since creation
  registrar: string | null;
  dnssec: boolean | null;
  redirects: boolean;
  finalUrl: string | null;
  safeBrowsing: "safe" | "unsafe" | "unknown";
  signals: { text: string; weight: number }[];
}

export async function analyzeDomain(url: string): Promise<DomainResult> {
  const signals: { text: string; weight: number }[] = [];
  let domain: string;

  try {
    // Extract domain from URL
    let cleaned = url.trim();
    if (!cleaned.startsWith("http")) cleaned = "https://" + cleaned;
    domain = new URL(cleaned).hostname.replace(/^www\./, "");
  } catch {
    return {
      age: null, registrar: null, dnssec: null, redirects: false,
      finalUrl: null, safeBrowsing: "unknown", signals: [
        { text: "The website address doesn't appear to be valid.", weight: 15 }
      ],
    };
  }

  // RDAP lookup (free, no API key, replaces WHOIS)
  try {
    const rdapRes = await fetch(`https://rdap.org/domain/${domain}`, {
      signal: AbortSignal.timeout(5000),
    });
    if (rdapRes.ok) {
      const data = await rdapRes.json();

      // Extract registration date
      const events = data.events || [];
      const regEvent = events.find((e: { eventAction: string }) => e.eventAction === "registration");
      if (regEvent?.eventDate) {
        const regDate = new Date(regEvent.eventDate);
        const ageDays = Math.floor((Date.now() - regDate.getTime()) / (1000 * 60 * 60 * 24));

        if (ageDays < 30) {
          signals.push({
            text: `This website was created only ${ageDays} day${ageDays === 1 ? "" : "s"} ago. Brand new websites are very commonly used in scams.`,
            weight: 30,
          });
        } else if (ageDays < 90) {
          signals.push({
            text: `This website is less than 3 months old, which is relatively new. Many scam sites are created recently.`,
            weight: 15,
          });
        } else if (ageDays > 365 * 3) {
          signals.push({
            text: `This website has been registered for over ${Math.floor(ageDays / 365)} years, which is a positive sign.`,
            weight: -10,
          });
        }
      }

      // Extract registrar
      const entities = data.entities || [];
      const registrar = entities.find((e: { roles?: string[] }) => e.roles?.includes("registrar"));
      const registrarName = registrar?.vcardArray?.[1]?.find((v: string[]) => v[0] === "fn")?.[3] || null;

      return {
        age: regEvent?.eventDate ? Math.floor((Date.now() - new Date(regEvent.eventDate).getTime()) / (1000 * 60 * 60 * 24)) : null,
        registrar: registrarName,
        dnssec: data.secureDNS?.delegationSigned || null,
        redirects: false,
        finalUrl: null,
        safeBrowsing: "unknown",
        signals,
      };
    }
  } catch {
    // RDAP failed, continue with other checks
  }

  return {
    age: null, registrar: null, dnssec: null, redirects: false,
    finalUrl: null, safeBrowsing: "unknown", signals,
  };
}
