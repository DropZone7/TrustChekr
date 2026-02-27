/**
 * Domain Blocklist — powered by Bloom filter
 * 49,762 known phishing + malware domains in ~116KB
 * Sources: curbengh/phishing-filter, curbengh/urlhaus-filter
 */

import { isDomainInBloom, BLOOM_DOMAIN_COUNT } from './bloomFilter';

/**
 * Check if a domain (or any of its parent domains) is in the blocklist
 */
export function isDomainBlocked(domain: string): { blocked: boolean; matchedDomain: string | null } {
  const clean = domain.toLowerCase().replace(/^www\./, '');
  
  if (isDomainInBloom(clean)) {
    return { blocked: true, matchedDomain: clean };
  }
  
  // Check parent domains
  const parts = clean.split('.');
  for (let i = 1; i < parts.length - 1; i++) {
    const parent = parts.slice(i).join('.');
    if (isDomainInBloom(parent)) {
      return { blocked: true, matchedDomain: parent };
    }
  }
  
  return { blocked: false, matchedDomain: null };
}

export const BLOCKLIST_SIZE = BLOOM_DOMAIN_COUNT;
