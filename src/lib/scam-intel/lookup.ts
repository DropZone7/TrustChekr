// Reverse Scam Lookup Engine

import type { LookupResult, ScamIndicator } from './types';
import { getAllCampaigns, findIndicatorByValue, getReportsByCampaign } from '@/lib/db/json-store';

// ── Auto-detect input type ──────────────────────────────────────
export type IndicatorType = 'phone' | 'email' | 'url' | 'domain' | 'wallet' | 'unknown';

export function detectInputType(query: string): IndicatorType {
  const trimmed = query.trim();

  // Email
  if (/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(trimmed)) return 'email';

  // URL
  if (/^https?:\/\//i.test(trimmed)) return 'url';

  // Crypto wallets
  if (/^(1|3|bc1)[a-zA-HJ-NP-Z0-9]{25,62}$/.test(trimmed)) return 'wallet';
  if (/^0x[a-fA-F0-9]{40}$/.test(trimmed)) return 'wallet';
  if (/^r[a-zA-Z0-9]{24,34}$/.test(trimmed)) return 'wallet';

  // Phone (flexible)
  if (/^\+?[0-9\-\(\)\s]{7,15}$/.test(trimmed)) return 'phone';

  // Domain (has TLD but no protocol)
  if (/^[a-zA-Z0-9][a-zA-Z0-9\-]*\.[a-zA-Z]{2,}/.test(trimmed) && !trimmed.includes(' ')) return 'domain';

  return 'unknown';
}

function normalizeQuery(query: string, type: IndicatorType): string {
  const trimmed = query.trim().toLowerCase();
  if (type === 'phone') return trimmed.replace(/[\s\-().]/g, '');
  if (type === 'url') return trimmed.replace(/[.,;:!?)]+$/, '');
  return trimmed;
}

function riskLevel(reportCount: number, lastSeen: string): string {
  const daysSince = (Date.now() - new Date(lastSeen).getTime()) / 86400000;
  if (reportCount > 500 && daysSince < 7) return 'critical';
  if (reportCount > 100 && daysSince < 30) return 'high';
  if (reportCount > 20) return 'medium';
  return 'low';
}

export function lookup(query: string, typeHint?: string): LookupResult {
  const detectedType = typeHint && typeHint !== 'auto' ? typeHint as IndicatorType : detectInputType(query);
  const normalizedQuery = normalizeQuery(query, detectedType);
  const campaigns = getAllCampaigns();

  // Search across all indicators
  let foundIndicator: ScamIndicator | null = null;
  let foundCampaignId: string | null = null;

  for (const campaign of campaigns) {
    for (const ind of campaign.indicators) {
      const normalizedValue = normalizeQuery(ind.value, ind.type as IndicatorType);
      if (normalizedValue === normalizedQuery || ind.value.toLowerCase().includes(normalizedQuery)) {
        foundIndicator = ind;
        foundCampaignId = campaign.id;
        break;
      }
    }
    if (foundIndicator) break;
  }

  if (!foundIndicator || !foundCampaignId) {
    return {
      found: false,
      indicator: null,
      campaigns: [],
      related_indicators: [],
      community_reports: [],
    };
  }

  // Find all campaigns this indicator (or related indicators) belong to
  const primaryCampaign = campaigns.find((c) => c.id === foundCampaignId)!;
  const relatedCampaigns = campaigns
    .filter((c) => c.category === primaryCampaign.category && c.id !== primaryCampaign.id)
    .slice(0, 5);

  const campaignResults = [
    {
      name: primaryCampaign.family_name,
      category: primaryCampaign.category,
      role: 'primary' as const,
      report_count: primaryCampaign.report_count,
      date_range: { from: primaryCampaign.first_seen, to: primaryCampaign.last_seen },
    },
    ...relatedCampaigns.map((c) => ({
      name: c.family_name,
      category: c.category,
      role: 'associated' as const,
      report_count: c.report_count,
      date_range: { from: c.first_seen, to: c.last_seen },
    })),
  ];

  // Related indicators from same campaign
  const relatedIndicators = primaryCampaign.indicators
    .filter((i) => i.id !== foundIndicator!.id)
    .map((i) => ({
      type: i.type,
      value: i.value,
      relationship: 'same_campaign' as const,
    }));

  // Community reports
  const reports = getReportsByCampaign(foundCampaignId);
  const communityReports = reports.slice(0, 10).map((r) => ({
    date: r.submitted_at,
    region: r.region,
    excerpt: r.content.slice(0, 100) + (r.content.length > 100 ? '...' : ''),
  }));

  return {
    found: true,
    indicator: {
      ...foundIndicator,
      risk_level: riskLevel(foundIndicator.report_count, foundIndicator.last_seen),
      status: primaryCampaign.status === 'active' ? 'active' : 'inactive',
    },
    campaigns: campaignResults,
    related_indicators: relatedIndicators,
    community_reports: communityReports,
  };
}
