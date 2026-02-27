import type { AcademyModuleId } from './modules';

const STORAGE_KEY = 'trustchekr_academy_progress_v1';

export type ModuleCompletionStatus = 'not_started' | 'in_progress' | 'completed';
export type ProgressMap = Record<AcademyModuleId, ModuleCompletionStatus>;

export interface AcademyProgress {
  modules: ProgressMap;
  lastUpdated: string;
}

export function getDefaultProgress(): AcademyProgress {
  return {
    modules: {
      M1_PHONE_GRANDPARENT: 'not_started',
      M2_BANK_GOV: 'not_started',
      M3_TECH_SUPPORT: 'not_started',
      M4_ROMANCE: 'not_started',
      M5_TOO_GOOD: 'not_started',
      M6_PHISHING: 'not_started',
      M7_SOCIAL: 'not_started',
      M8_WHAT_TO_DO: 'not_started',
    },
    lastUpdated: new Date().toISOString(),
  };
}

// Mapping from route slugs to module IDs
const SLUG_TO_MODULE_ID: Record<string, AcademyModuleId> = {
  'phone-scams': 'M1_PHONE_GRANDPARENT',
  'bank-cra-scams': 'M2_BANK_GOV',
  'tech-support-scams': 'M3_TECH_SUPPORT',
  'romance-scams': 'M4_ROMANCE',
  'too-good-to-be-true': 'M5_TOO_GOOD',
  'phishing': 'M6_PHISHING',
  'social-media': 'M7_SOCIAL',
  'what-to-do': 'M8_WHAT_TO_DO',
};

export function slugToModuleId(slug: string): AcademyModuleId | null {
  return SLUG_TO_MODULE_ID[slug] ?? null;
}

export function loadProgress(): AcademyProgress {
  if (typeof window === 'undefined') return getDefaultProgress();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Migrate from old format if it exists
      return migrateOldProgress();
    }
    const parsed = JSON.parse(raw) as AcademyProgress;
    if (!parsed || typeof parsed !== 'object' || !parsed.modules) {
      return getDefaultProgress();
    }
    // Merge with defaults in case new modules were added
    const defaults = getDefaultProgress();
    return {
      modules: { ...defaults.modules, ...parsed.modules },
      lastUpdated: parsed.lastUpdated ?? defaults.lastUpdated,
    };
  } catch {
    return getDefaultProgress();
  }
}

function migrateOldProgress(): AcademyProgress {
  try {
    const old = window.localStorage.getItem('tc-academy-progress');
    if (!old) return getDefaultProgress();
    const parsed = JSON.parse(old);
    const progress = getDefaultProgress();
    if (parsed.modulesViewed && Array.isArray(parsed.modulesViewed)) {
      for (const slug of parsed.modulesViewed) {
        const moduleId = SLUG_TO_MODULE_ID[slug];
        if (moduleId) {
          progress.modules[moduleId] = 'in_progress';
        }
      }
    }
    saveProgress(progress);
    // Clean up old key
    window.localStorage.removeItem('tc-academy-progress');
    return progress;
  } catch {
    return getDefaultProgress();
  }
}

export function saveProgress(progress: AcademyProgress) {
  if (typeof window === 'undefined') return;
  try {
    const toSave: AcademyProgress = {
      ...progress,
      lastUpdated: new Date().toISOString(),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch { /* */ }
}
