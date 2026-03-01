// JSON-based store for MVP — swappable with Supabase/Postgres later
// Runs in-memory with seed data (no file I/O needed for Vercel deployment)

import type {
  ScamCampaign,
  ScamIndicator,
  CommunityReport,
  AlertSubscriber,
  Alert,
} from '@/lib/scam-intel/types';

interface Store {
  campaigns: ScamCampaign[];
  reports: CommunityReport[];
  subscribers: AlertSubscriber[];
  alerts: Alert[];
}

let store: Store | null = null;

function getStore(): Store {
  if (!store) {
    // Lazy-load seed data
    const { seedCampaigns } = require('@/lib/scam-intel/seed-campaigns');
    store = {
      campaigns: seedCampaigns,
      reports: [],
      subscribers: [],
      alerts: [],
    };
  }
  return store;
}

// Campaigns
export function getAllCampaigns(): ScamCampaign[] {
  return getStore().campaigns;
}

export function getCampaignById(id: string): ScamCampaign | undefined {
  return getStore().campaigns.find((c) => c.id === id);
}

export function getAllIndicators(): ScamIndicator[] {
  return getStore().campaigns.flatMap((c) => c.indicators);
}

export function findIndicatorByValue(value: string): { indicator: ScamIndicator; campaign: ScamCampaign } | null {
  const normalized = value.toLowerCase().trim();
  for (const campaign of getStore().campaigns) {
    for (const ind of campaign.indicators) {
      if (ind.value.toLowerCase().trim() === normalized) {
        return { indicator: ind, campaign };
      }
    }
  }
  return null;
}

export function findIndicatorsByType(type: ScamIndicator['type']): { indicator: ScamIndicator; campaign: ScamCampaign }[] {
  const results: { indicator: ScamIndicator; campaign: ScamCampaign }[] = [];
  for (const campaign of getStore().campaigns) {
    for (const ind of campaign.indicators) {
      if (ind.type === type) {
        results.push({ indicator: ind, campaign });
      }
    }
  }
  return results;
}

// Community Reports
export function addReport(report: CommunityReport): void {
  getStore().reports.push(report);
}

export function getReportsByCampaign(campaignId: string): CommunityReport[] {
  return getStore().reports.filter((r) => r.campaign_id === campaignId);
}

export function getAllReports(): CommunityReport[] {
  return getStore().reports;
}

// Subscribers
export function addSubscriber(sub: AlertSubscriber): void {
  getStore().subscribers.push(sub);
}

export function removeSubscriber(id: string): boolean {
  const s = getStore();
  const idx = s.subscribers.findIndex((sub) => sub.id === id);
  if (idx === -1) return false;
  s.subscribers.splice(idx, 1);
  return true;
}

export function getSubscribers(): AlertSubscriber[] {
  return getStore().subscribers;
}

export function getMatchingSubscribers(alert: Alert): AlertSubscriber[] {
  return getStore().subscribers.filter((sub) => {
    if (!sub.active) return false;
    if (alert.target_provinces.length > 0 && !alert.target_provinces.includes(sub.province)) return false;
    if (alert.target_carriers.length > 0 && sub.carrier && !alert.target_carriers.includes(sub.carrier)) return false;
    if (alert.target_banks.length > 0 && sub.bank && !alert.target_banks.includes(sub.bank)) return false;
    if (alert.target_age_ranges.length > 0 && sub.age_range && !alert.target_age_ranges.includes(sub.age_range)) return false;
    return true;
  });
}

// Alerts
export function addAlert(alert: Alert): void {
  getStore().alerts.push(alert);
}

export function getAlerts(limit = 20): Alert[] {
  return [...getStore().alerts].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, limit);
}

export function getAlertsByProvince(province: string): Alert[] {
  return getStore().alerts.filter((a) => a.target_provinces.length === 0 || a.target_provinces.includes(province));
}
