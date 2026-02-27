export type ScamSeverity = 'info' | 'low' | 'medium' | 'high' | 'critical';

export type ScamCategory =
  | 'phone'
  | 'email'
  | 'sms'
  | 'social'
  | 'tech_support'
  | 'banking'
  | 'romance'
  | 'investment'
  | 'in_person'
  | 'other';

export interface ScamOfficialSource {
  name: string;
  url: string;
}

export interface ScamPattern {
  id: string;
  name: string;
  category: ScamCategory;
  region: string;
  primary_targets: string[];
  short_description: string;
  how_it_works: string[];
  red_flags: string[];
  official_sources: ScamOfficialSource[];
  severity: ScamSeverity;
  relevance_to_trustchekr: 'low' | 'medium' | 'high';
  academy_modules_impacted: string[];
  last_updated: string;
  recommended_ui_messaging: string;
}
