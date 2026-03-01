import type { DomainPattern, MatchedSignal, ScamCategory } from '../types';
import { weightToPenalty } from '../scoring';

/**
 * Known legitimate domains for brand-impersonation detection.
 */
const LEGITIMATE_DOMAINS: Record<string, { brand: string; category: ScamCategory }> = {
  'canada.ca':        { brand: 'CRA / Government of Canada', category: 'CRA_IMPERSONATION' },
  'cra-arc.gc.ca':    { brand: 'CRA', category: 'CRA_IMPERSONATION' },
  'rbc.com':          { brand: 'RBC', category: 'BANK_IMPERSONATION' },
  'td.com':           { brand: 'TD', category: 'BANK_IMPERSONATION' },
  'scotiabank.com':   { brand: 'Scotiabank', category: 'BANK_IMPERSONATION' },
  'bmo.com':          { brand: 'BMO', category: 'BANK_IMPERSONATION' },
  'cibc.com':         { brand: 'CIBC', category: 'BANK_IMPERSONATION' },
  'interac.ca':       { brand: 'Interac', category: 'INTERAC_PHISHING' },
  'coinbase.com':     { brand: 'Coinbase', category: 'CRYPTO_INVESTMENT' },
  'newton.co':        { brand: 'Newton', category: 'CRYPTO_INVESTMENT' },
  'shakepay.com':     { brand: 'Shakepay', category: 'CRYPTO_INVESTMENT' },
  'wealthsimple.com': { brand: 'Wealthsimple', category: 'CRYPTO_INVESTMENT' },
  // US
  'irs.gov':          { brand: 'IRS', category: 'IRS_IMPERSONATION' },
  'ssa.gov':          { brand: 'Social Security', category: 'IRS_IMPERSONATION' },
  'chase.com':        { brand: 'Chase', category: 'BANK_IMPERSONATION' },
  'bankofamerica.com': { brand: 'Bank of America', category: 'BANK_IMPERSONATION' },
  'wellsfargo.com':   { brand: 'Wells Fargo', category: 'BANK_IMPERSONATION' },
  'citi.com':         { brand: 'Citibank', category: 'BANK_IMPERSONATION' },
  'capitalone.com':   { brand: 'Capital One', category: 'BANK_IMPERSONATION' },
  'usbank.com':       { brand: 'US Bank', category: 'BANK_IMPERSONATION' },
  'zellepay.com':     { brand: 'Zelle', category: 'BANK_IMPERSONATION' },
  'venmo.com':        { brand: 'Venmo', category: 'BANK_IMPERSONATION' },
  // Mexico
  'sat.gob.mx':       { brand: 'SAT', category: 'SAT_IMPERSONATION' },
  'condusef.gob.mx':  { brand: 'CONDUSEF', category: 'BANK_IMPERSONATION' },
  'bbva.mx':          { brand: 'BBVA México', category: 'BANK_IMPERSONATION' },
  'banorte.com':      { brand: 'Banorte', category: 'BANK_IMPERSONATION' },
  'santander.com.mx': { brand: 'Santander México', category: 'BANK_IMPERSONATION' },
};

/**
 * Extract the registrable domain from a URL.
 */
function extractDomain(url: string): string | null {
  try {
    const u = new URL(url.startsWith('http') ? url : `https://${url}`);
    return u.hostname.toLowerCase();
  } catch {
    return null;
  }
}

/**
 * Check if a domain is impersonating a known brand.
 * E.g., "td-banksecure.com" contains "td" + "bank" but isn't td.com.
 */
function checkBrandImpersonation(domain: string): MatchedSignal | null {
  for (const [legit, info] of Object.entries(LEGITIMATE_DOMAINS)) {
    // Skip if it IS the legitimate domain
    if (domain === legit || domain.endsWith(`.${legit}`)) continue;

    // Check if the domain contains brand keywords
    const brandParts = legit.replace(/\.(com|ca|gc\.ca|co)$/, '').split(/[-._]/);
    const domainLower = domain.toLowerCase();

    for (const part of brandParts) {
      if (part.length >= 2 && domainLower.includes(part)) {
        return {
          ruleId: `brand_impersonation_${legit}`,
          category: info.category,
          weight: 9,
          penalty: weightToPenalty(9),
          description: `Domain "${domain}" may be impersonating ${info.brand} (legitimate: ${legit})`,
          matchedText: domain,
        };
      }
    }
  }
  return null;
}

/**
 * Check domain age — very new domains with brand keywords are suspicious.
 */
function checkDomainAge(
  domain: string,
  ageDays: number | null | undefined,
): MatchedSignal | null {
  if (ageDays == null || ageDays > 30) return null;

  return {
    ruleId: 'new_domain',
    category: 'GENERIC_PHISHING',
    weight: ageDays < 7 ? 8 : 6,
    penalty: weightToPenalty(ageDays < 7 ? 8 : 6),
    description: `Domain "${domain}" is only ${ageDays} days old — most legitimate sites are months or years old`,
    matchedText: domain,
  };
}

/**
 * Run URL-based detection: domain patterns, brand impersonation, age.
 */
export function matchUrlPatterns(
  url: string,
  domainAge?: number | null,
  domainPatterns?: DomainPattern[],
): MatchedSignal[] {
  const domain = extractDomain(url);
  if (!domain) return [];

  const signals: MatchedSignal[] = [];

  // 1. Brand impersonation check
  const brandHit = checkBrandImpersonation(domain);
  if (brandHit) signals.push(brandHit);

  // 2. Domain age check
  const ageHit = checkDomainAge(domain, domainAge);
  if (ageHit) signals.push(ageHit);

  // 3. Custom domain patterns from rules JSON
  if (domainPatterns) {
    for (const rule of domainPatterns) {
      try {
        const re = new RegExp(rule.pattern, 'i');
        if (re.test(domain)) {
          signals.push({
            ruleId: rule.id,
            category: rule.category,
            weight: rule.weight,
            penalty: weightToPenalty(rule.weight),
            description: rule.description,
            matchedText: domain,
          });
        }
      } catch {
        // Invalid pattern — skip
      }
    }
  }

  return signals;
}
