import type { ScamPattern } from './types';

type ScamPatternRow = {
  id: string;
  name: string;
  category: string;
  region: string;
  primary_targets: string[];
  short_description: string;
  how_it_works: string[];
  red_flags: string[];
  official_sources: any;
  severity: string;
  relevance_to_trustchekr: string;
  academy_modules_impacted: string[];
  last_updated: string;
  recommended_ui_messaging: string;
};

export function mapRowToScamPattern(row: ScamPatternRow): ScamPattern {
  return {
    id: row.id,
    name: row.name,
    category: row.category as ScamPattern['category'],
    region: row.region,
    primary_targets: row.primary_targets ?? [],
    short_description: row.short_description,
    how_it_works: row.how_it_works ?? [],
    red_flags: row.red_flags ?? [],
    official_sources: (row.official_sources ?? []) as ScamPattern['official_sources'],
    severity: row.severity as ScamPattern['severity'],
    relevance_to_trustchekr: row.relevance_to_trustchekr as ScamPattern['relevance_to_trustchekr'],
    academy_modules_impacted: row.academy_modules_impacted ?? [],
    last_updated: row.last_updated,
    recommended_ui_messaging: row.recommended_ui_messaging,
  };
}
