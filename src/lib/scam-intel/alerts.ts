// Scam Alert Network Engine

import type { Alert, AlertSubscriber, ScamCampaign } from './types';
import {
  addAlert,
  addSubscriber,
  removeSubscriber,
  getAlerts,
  getMatchingSubscribers,
  getAllCampaigns,
} from '@/lib/db/json-store';

function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

// ── Subscriber Management ───────────────────────────────────────
export function subscribe(params: {
  province: string;
  carrier?: string;
  bank?: string;
  age_range?: string;
  email?: string;
  frequency?: 'instant' | 'daily' | 'weekly';
}): AlertSubscriber {
  const sub: AlertSubscriber = {
    id: uid(),
    created_at: new Date().toISOString(),
    province: params.province,
    carrier: params.carrier || null,
    bank: params.bank || null,
    age_range: params.age_range || null,
    email: params.email || null,
    frequency: params.frequency || 'daily',
    active: true,
    last_notified: null,
  };
  addSubscriber(sub);
  return sub;
}

export function unsubscribe(id: string): boolean {
  return removeSubscriber(id);
}

// ── Alert Generation ────────────────────────────────────────────
export function generateAlert(params: {
  campaign_id: string;
  title: string;
  body: string;
  severity: 'info' | 'warning' | 'critical';
  target_provinces?: string[];
  target_carriers?: string[];
  target_banks?: string[];
  target_age_ranges?: string[];
}): Alert {
  const alert: Alert = {
    id: uid(),
    campaign_id: params.campaign_id,
    title: params.title,
    body: params.body,
    severity: params.severity,
    target_provinces: params.target_provinces || [],
    target_carriers: params.target_carriers || [],
    target_banks: params.target_banks || [],
    target_age_ranges: params.target_age_ranges || [],
    created_at: new Date().toISOString(),
    sent_count: 0,
  };
  addAlert(alert);

  // Find matching subscribers
  const subscribers = getMatchingSubscribers(alert);
  alert.sent_count = subscribers.length;

  return alert;
}

// ── Auto-generate alerts from campaign data ─────────────────────
export function generateAlertsFromCampaigns(): Alert[] {
  const campaigns = getAllCampaigns();
  const generated: Alert[] = [];

  for (const campaign of campaigns) {
    if (campaign.status === 'active' && campaign.report_count > 100) {
      const alert = generateAlert({
        campaign_id: campaign.id,
        title: `${campaign.family_name} — Active in ${campaign.regions.join(', ')}`,
        body: `The ${campaign.family_name} is currently active with ${campaign.report_count.toLocaleString()} reports. Watch out for suspicious messages matching this scam pattern.`,
        severity: campaign.report_count > 3000 ? 'critical' : campaign.report_count > 1000 ? 'warning' : 'info',
        target_provinces: campaign.regions,
      });
      generated.push(alert);
    }
  }

  return generated;
}

// ── Get Public Alert Feed ───────────────────────────────────────
export function getAlertFeed(limit = 20): Alert[] {
  return getAlerts(limit);
}
