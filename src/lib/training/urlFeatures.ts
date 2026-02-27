/**
 * URL Feature Analyzer — trained from 58,645 labeled URLs
 * Source: GregaVrbancic/Phishing-Dataset (UCI)
 * Benchmarks embedded from statistical analysis of phishing vs legitimate URLs
 */

// Embedded benchmarks (averaged from 30,647 phishing + 27,998 legit URLs)
const avgPhishing: Record<string, number> = {
  qty_dot_url: 2.482, qty_hyphen_url: 0.637, length_url: 64.928,
  domain_length: 18.649, domain_in_ip: 0.006, qty_dot_domain: 1.618,
  qty_hyphen_domain: 0.183, tls_ssl_certificate: 0.482,
};

const avgLegit: Record<string, number> = {
  qty_dot_url: 2.068, qty_hyphen_url: 0.26, length_url: 23.101,
  domain_length: 17.442, domain_in_ip: 0.001, qty_dot_domain: 1.998,
  qty_hyphen_domain: 0.079, tls_ssl_certificate: 0.523,
};

export function analyzeUrlFeatures(url: string): {
  riskScore: number;
  signals: { feature: string; value: number; phishingAvg: number; legitAvg: number; suspicious: boolean }[];
} {
  const signals: { feature: string; value: number; phishingAvg: number; legitAvg: number; suspicious: boolean }[] = [];

  const dotCount = (url.match(/\./g) || []).length;
  const hyphenCount = (url.match(/-/g) || []).length;
  const urlLength = url.length;

  let domain = '';
  try { domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname; }
  catch { domain = url.split('/')[0]; }

  const domainLength = domain.length;
  const domainDots = (domain.match(/\./g) || []).length;
  const domainHyphens = (domain.match(/-/g) || []).length;
  const isIp = /^\d+\.\d+\.\d+\.\d+$/.test(domain);
  const hasHttps = url.startsWith('https://');

  const features = [
    { name: 'URL length', value: urlLength, phishing: avgPhishing.length_url, legit: avgLegit.length_url },
    { name: 'Dots in URL', value: dotCount, phishing: avgPhishing.qty_dot_url, legit: avgLegit.qty_dot_url },
    { name: 'Hyphens in URL', value: hyphenCount, phishing: avgPhishing.qty_hyphen_url, legit: avgLegit.qty_hyphen_url },
    { name: 'Domain length', value: domainLength, phishing: avgPhishing.domain_length, legit: avgLegit.domain_length },
    { name: 'Dots in domain', value: domainDots, phishing: avgPhishing.qty_dot_domain, legit: avgLegit.qty_dot_domain },
    { name: 'Hyphens in domain', value: domainHyphens, phishing: avgPhishing.qty_hyphen_domain, legit: avgLegit.qty_hyphen_domain },
    { name: 'IP as domain', value: isIp ? 1 : 0, phishing: avgPhishing.domain_in_ip, legit: avgLegit.domain_in_ip },
    { name: 'TLS/SSL', value: hasHttps ? 1 : 0, phishing: avgPhishing.tls_ssl_certificate, legit: avgLegit.tls_ssl_certificate },
  ];

  let riskScore = 0;
  for (const f of features) {
    const distToPhishing = Math.abs(f.value - f.phishing);
    const distToLegit = Math.abs(f.value - f.legit);
    const suspicious = distToPhishing < distToLegit;
    if (suspicious) riskScore += 12.5;
    signals.push({ feature: f.name, value: f.value, phishingAvg: f.phishing, legitAvg: f.legit, suspicious });
  }

  return { riskScore: Math.round(riskScore), signals };
}
