import { withTimeout } from './withTimeout';
import { analyzeDomain } from './domain';
import { checkUrlSafety } from './url-safety';
import { checkVirusTotal } from './virustotal';
import { checkPhishTank } from './phishtank';
import { checkUrlhaus } from './urlhaus';

export async function batchWebsiteOsint(url: string) {
  try {
    const [domain, safeBrowsing, virusTotal, phishTank, urlhaus] =
      await Promise.all([
        withTimeout(analyzeDomain(url), 4000, null),
        withTimeout(checkUrlSafety(url), 4000, null),
        withTimeout(checkVirusTotal(url), 4000, null),
        withTimeout(checkPhishTank(url), 4000, null),
        withTimeout(checkUrlhaus(url), 4000, null),
      ]);
    return { domain, safeBrowsing, virusTotal, phishTank, urlhaus };
  } catch {
    return {};
  }
}
