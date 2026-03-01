// Scam Intelligence Engine — Data Models

export interface ScamCampaign {
  id: string;
  family_name: string;
  category: ScamCampaignCategory;
  first_seen: string;
  last_seen: string;
  report_count: number;
  status: 'active' | 'declining' | 'dormant';
  regions: string[];
  variants: ScamVariant[];
  indicators: ScamIndicator[];
}

export type ScamCampaignCategory =
  | 'CRA_IRS'
  | 'BANK'
  | 'ROMANCE'
  | 'DELIVERY'
  | 'TELECOM'
  | 'TECH_SUPPORT'
  | 'INVESTMENT'
  | 'EMPLOYMENT'
  | 'GOVERNMENT'
  | 'MARKETPLACE'
  | 'GIFT_CARD'
  | 'EMERGENCY'
  | 'IDENTITY'
  | 'RENTAL'
  | 'DEEPFAKE'
  | 'OTHER';

export interface ScamVariant {
  id: string;
  campaign_id: string;
  variant_number: number;
  template_text: string;
  language_hash: string;
  phone_numbers: string[];
  urls: string[];
  email_addresses: string[];
  crypto_wallets: string[];
  payment_methods: string[];
  demand_amount_range: { min: number; max: number; currency: string };
  first_seen: string;
  report_count: number;
}

export interface ScamIndicator {
  id: string;
  campaign_id: string;
  type: 'phone' | 'email' | 'url' | 'domain' | 'crypto_wallet' | 'ip';
  value: string;
  first_seen: string;
  last_seen: string;
  report_count: number;
}

export interface CommunityReport {
  id: string;
  campaign_id: string | null;
  content: string;
  indicators_found: string[];
  region: string;
  submitted_at: string;
  status: 'pending' | 'classified' | 'new_campaign';
}

export interface AlertSubscriber {
  id: string;
  created_at: string;
  province: string;
  carrier: string | null;
  bank: string | null;
  age_range: string | null;
  email: string | null;
  frequency: 'instant' | 'daily' | 'weekly';
  active: boolean;
  last_notified: string | null;
}

export interface Alert {
  id: string;
  campaign_id: string;
  title: string;
  body: string;
  severity: 'info' | 'warning' | 'critical';
  target_provinces: string[];
  target_carriers: string[];
  target_banks: string[];
  target_age_ranges: string[];
  created_at: string;
  sent_count: number;
}

export interface FingerprintResult {
  matched: boolean;
  confidence: number;
  campaign: ScamCampaign | null;
  variant: ScamVariant | null;
  related_indicators: ScamIndicator[];
  similar_campaigns: ScamCampaign[];
}

export interface LookupResult {
  found: boolean;
  indicator: (ScamIndicator & { risk_level: string; status: string }) | null;
  campaigns: {
    name: string;
    category: string;
    role: 'primary' | 'associated';
    report_count: number;
    date_range: { from: string; to: string };
  }[];
  related_indicators: {
    type: string;
    value: string;
    relationship: 'same_campaign' | 'same_actor' | 'co_reported';
  }[];
  community_reports: {
    date: string;
    region: string;
    excerpt: string;
  }[];
}
