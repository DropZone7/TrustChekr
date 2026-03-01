// src/lib/rateLimit.ts

interface RateLimitEntry {
  timestamps: number[];
}

const ipScanMap = new Map<string, RateLimitEntry>();
const domainScanMap = new Map<string, number>();

const SCAN_PER_IP_PER_MINUTE = 10;
const SCAN_PER_IP_PER_HOUR = 100;
const DOMAIN_COOLDOWN_MS = 5 * 60 * 1000;

function pruneOld(timestamps: number[], windowMs: number): number[] {
  const cutoff = Date.now() - windowMs;
  return timestamps.filter((t) => t > cutoff);
}

export function checkIpRateLimit(ip: string): { allowed: boolean; reason?: string } {
  const now = Date.now();
  const entry = ipScanMap.get(ip) ?? { timestamps: [] };
  const recent = pruneOld(entry.timestamps, 60 * 60 * 1000);
  const lastMinute = recent.filter((t) => now - t < 60_000).length;

  if (lastMinute >= SCAN_PER_IP_PER_MINUTE) {
    return { allowed: false, reason: "Too many scans. Please wait a moment before scanning again." };
  }
  if (recent.length >= SCAN_PER_IP_PER_HOUR) {
    return { allowed: false, reason: "Hourly scan limit reached. Please try again later." };
  }

  ipScanMap.set(ip, { timestamps: [...recent, now] });
  return { allowed: true };
}

export function checkDomainCooldown(domain: string): { allowed: boolean; cachedResult?: true } {
  const last = domainScanMap.get(domain);
  if (last && Date.now() - last < DOMAIN_COOLDOWN_MS) {
    return { allowed: false, cachedResult: true };
  }
  domainScanMap.set(domain, Date.now());
  return { allowed: true };
}

export function checkApiKeyLimit(requestsToday: number, plan: string): boolean {
  const limit = plan === "pro" ? 10_000 : 100;
  return requestsToday < limit;
}
