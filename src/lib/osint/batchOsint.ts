import { withTimeout } from './withTimeout';
import { analyzeDomain } from './domain';
import { checkUrlSafety } from './url-safety';
import { checkVirusTotal } from './virustotal';
import { checkPhishTank } from './phishtank';
import { checkUrlhaus } from './urlhaus';
import { checkSocialPresence } from './socialMedia';
import { checkTrancoRank } from './tranco';

export async function batchWebsiteOsint(url: string) {
  try {
    // Round A: all independent modules + Tranco in parallel
    const [domain, safeBrowsing, virusTotal, phishTank, urlhaus, tranco] =
      await Promise.all([
        withTimeout(analyzeDomain(url), 3000, null),
        withTimeout(checkUrlSafety(url), 3000, null),
        withTimeout(checkVirusTotal(url), 3000, null),
        withTimeout(checkPhishTank(url), 3000, null),
        withTimeout(checkUrlhaus(url), 3000, null),
        withTimeout(checkTrancoRank(url), 3000, null),
      ]);

    // Round B: social presence needs domain age from RDAP
    const domainAgeDays = (domain as any)?.domainAgeDays ?? null;
    const bareDomain = extractDomain(url);
    const socialPresence = await withTimeout(
      bareDomain ? checkSocialPresence(bareDomain, domainAgeDays) : Promise.resolve(null),
      3000,
      null
    );

    return { domain, safeBrowsing, virusTotal, phishTank, urlhaus, tranco, socialPresence };
  } catch {
    return {};
  }
}

function extractDomain(input: string): string | null {
  try {
    const normalized = input.startsWith('http') ? input : `https://${input}`;
    return new URL(normalized).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}
