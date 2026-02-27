export type AffiliateProduct = {
  name: string;
  description: string;
  cta: string;
  url: string;
  emoji: string;
  relevantRiskLevels: string[];
  relevantScamTypes: string[];
};

const AFFILIATE_PRODUCTS: AffiliateProduct[] = [
  {
    name: 'NordVPN',
    description: 'Encrypt your connection and hide your IP from scammers tracking you online.',
    cta: 'Get 70% Off NordVPN',
    url: 'https://nordvpn.com/trustchekr', // placeholder — replace with real affiliate link
    emoji: '🔐',
    relevantRiskLevels: ['suspicious', 'high-risk', 'very-likely-scam'],
    relevantScamTypes: ['website', 'message', 'other'],
  },
  {
    name: 'Norton Identity Protection',
    description: 'Monitor your personal info on the dark web. Get alerts if your data is compromised.',
    cta: 'Try Norton Free for 14 Days',
    url: 'https://norton.com/trustchekr', // placeholder
    emoji: '🛡️',
    relevantRiskLevels: ['high-risk', 'very-likely-scam'],
    relevantScamTypes: ['email', 'other', 'message'],
  },
  {
    name: 'Aura Identity Theft Protection',
    description: 'All-in-one protection: credit monitoring, identity theft insurance, and VPN.',
    cta: 'Start Your Free Trial',
    url: 'https://aura.com/trustchekr', // placeholder
    emoji: '✨',
    relevantRiskLevels: ['suspicious', 'high-risk', 'very-likely-scam'],
    relevantScamTypes: ['romance', 'email', 'other'],
  },
];

export function getRecommendations(riskLevel: string, scanType: string): AffiliateProduct[] {
  if (riskLevel === 'safe') return [];
  const matches = AFFILIATE_PRODUCTS.filter(
    (p) => p.relevantRiskLevels.includes(riskLevel) && p.relevantScamTypes.includes(scanType)
  );
  return matches.slice(0, 2);
}
