// Email OSINT - format validation + provider analysis + breach check
export interface EmailResult {
  valid: boolean;
  provider: string | null;
  isFreeProvider: boolean;
  isDisposable: boolean;
  breachCount: number | null;
  signals: { text: string; weight: number }[];
}

const FREE_PROVIDERS = [
  "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "aol.com",
  "mail.com", "protonmail.com", "proton.me", "icloud.com", "yandex.com",
  "zoho.com", "gmx.com", "mail.ru", "live.com",
];

const DISPOSABLE_PROVIDERS = [
  "tempmail.com", "guerrillamail.com", "mailinator.com", "throwaway.email",
  "temp-mail.org", "10minutemail.com", "trashmail.com", "sharklasers.com",
  "guerrillamailblock.com", "grr.la", "yopmail.com", "tempail.com",
  "mohmal.com", "burnermail.io", "dispostable.com",
];

export async function analyzeEmail(email: string): Promise<EmailResult> {
  const signals: { text: string; weight: number }[] = [];
  const lower = email.toLowerCase().trim();

  // Basic format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(lower)) {
    return {
      valid: false, provider: null, isFreeProvider: false,
      isDisposable: false, breachCount: null,
      signals: [{ text: "This doesn't appear to be a valid email address.", weight: 10 }],
    };
  }

  const domain = lower.split("@")[1];
  const isFree = FREE_PROVIDERS.includes(domain);
  const isDisposable = DISPOSABLE_PROVIDERS.some((d) => domain.includes(d));

  if (isDisposable) {
    signals.push({
      text: "This email uses a disposable/temporary email service. These are commonly used by scammers to avoid being traced.",
      weight: 25,
    });
  } else if (isFree) {
    signals.push({
      text: `This email uses a free provider (${domain}). Real companies and government agencies almost always use their own email domain.`,
      weight: 10,
    });
  }

  // Brand impersonation in email domain
  const brands = ["paypal", "amazon", "apple", "microsoft", "netflix", "chase", "td", "rbc", "cibc", "scotiabank", "bmo", "wells", "bank"];
  for (const brand of brands) {
    if (domain.includes(brand) && !domain.startsWith(brand + ".")) {
      signals.push({
        text: `The email domain contains "${brand}" but is not the official ${brand} email domain. This is a common impersonation trick.`,
        weight: 25,
      });
      break;
    }
  }

  // HIBP breach check (free API, no key needed for basic check)
  let breachCount: number | null = null;
  try {
    const hibpRes = await fetch(
      `https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(lower)}?truncateResponse=true`,
      {
        headers: { "User-Agent": "TrustChekr-ScamCheck", "hibp-api-key": process.env.HIBP_API_KEY || "" },
        signal: AbortSignal.timeout(5000),
      }
    );
    if (hibpRes.ok) {
      const breaches = await hibpRes.json();
      breachCount = breaches.length;
      if (breachCount && breachCount > 0) {
        signals.push({
          text: `This email address has appeared in ${breachCount} known data breach${breachCount > 1 ? "es" : ""}. This means the information associated with it may have been exposed.`,
          weight: 10,
        });
      }
    }
  } catch {
    // HIBP unavailable, continue
  }

  return {
    valid: true,
    provider: domain,
    isFreeProvider: isFree,
    isDisposable: isDisposable,
    breachCount,
    signals,
  };
}
