export type AcademyModuleId =
  | 'M1_PHONE_GRANDPARENT'
  | 'M2_BANK_GOV'
  | 'M3_TECH_SUPPORT'
  | 'M4_ROMANCE'
  | 'M5_TOO_GOOD'
  | 'M6_PHISHING'
  | 'M7_SOCIAL'
  | 'M8_WHAT_TO_DO';

export interface AcademyModuleMeta {
  id: AcademyModuleId;
  slug: string;
  title: string;
  shortDescription: string;
}

export const ACADEMY_MODULES: Record<AcademyModuleId, AcademyModuleMeta> = {
  M1_PHONE_GRANDPARENT: {
    id: 'M1_PHONE_GRANDPARENT',
    slug: 'phone-scams',
    title: 'Phone & Grandparent Scams',
    shortDescription: 'Learn how to spot emergency calls and grandparent scams before sending money.',
  },
  M2_BANK_GOV: {
    id: 'M2_BANK_GOV',
    slug: 'bank-cra-scams',
    title: 'Bank & Government Impersonation',
    shortDescription: 'Recognize fake bank and government messages so you never share sensitive info.',
  },
  M3_TECH_SUPPORT: {
    id: 'M3_TECH_SUPPORT',
    slug: 'tech-support-scams',
    title: 'Tech Support & Fake Virus Warnings',
    shortDescription: 'Ignore scary pop-ups and fake tech support calls that try to take over your device.',
  },
  M4_ROMANCE: {
    id: 'M4_ROMANCE',
    slug: 'romance-scams',
    title: 'Romance & Friendship Scams',
    shortDescription: 'See how long-con scams build trust online before asking for money.',
  },
  M5_TOO_GOOD: {
    id: 'M5_TOO_GOOD',
    slug: 'too-good-to-be-true',
    title: '"Too Good to Be True" Offers',
    shortDescription: 'Lotteries, fake jobs, and get-rich-quick investments — and how to say no.',
  },
  M6_PHISHING: {
    id: 'M6_PHISHING',
    slug: 'phishing',
    title: 'Phishing Emails, Texts & Fake Websites',
    shortDescription: 'Pause before clicking: spot suspicious links and look-alike websites.',
  },
  M7_SOCIAL: {
    id: 'M7_SOCIAL',
    slug: 'social-media',
    title: 'Social Media & Messaging Red Flags',
    shortDescription: "Impersonated friends, urgent DMs, and how to verify who you're talking to.",
  },
  M8_WHAT_TO_DO: {
    id: 'M8_WHAT_TO_DO',
    slug: 'what-to-do',
    title: "What to Do If You're Scammed",
    shortDescription: 'Immediate steps to limit damage and who to contact in Canada.',
  },
};

export function getModuleRoute(id: AcademyModuleId): string {
  const meta = ACADEMY_MODULES[id];
  return `/academy/${meta.slug}`;
}
