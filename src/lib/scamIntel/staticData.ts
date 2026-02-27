import type { ScamPattern } from './types';

// Static fallback seed — used if Supabase is unavailable
export const scamIntelSeed: ScamPattern[] = [
  {
    id: 'sp_grandparent_emergency_bail',
    name: 'Grandparent emergency scam – bail money',
    category: 'phone',
    region: 'canada',
    primary_targets: ['seniors', 'families'],
    short_description:
      'Scammers call seniors pretending to be a grandchild, lawyer, or police officer, claiming a relative is in trouble and needs bail money urgently.',
    how_it_works: [
      'Scammer calls, often late at night, pretending to be a grandchild, lawyer, or police officer.',
      'They claim the grandchild has been arrested or in an accident and needs bail or emergency money.',
      'They pressure the victim to send money immediately via e-transfer, cash, or gift cards, and tell them not to inform other family members.',
    ],
    red_flags: [
      'Caller asks you to keep the situation secret from other family members.',
      'Caller pressures you to send money immediately.',
      'Caller asks for payment by gift cards, crypto, or e-transfer to an unknown address.',
      'Caller refuses to let you hang up and call back on an official or known number.',
    ],
    official_sources: [
      { name: 'Canadian Anti-Fraud Centre – Grandparent scam', url: 'https://antifraudcentre-centreantifraude.ca/index-eng.htm' },
      { name: 'Ontario – Identify a scam or fraud', url: 'https://www.ontario.ca/page/identify-scam-or-fraud' },
    ],
    severity: 'high',
    relevance_to_trustchekr: 'high',
    academy_modules_impacted: ['M1_PHONE_GRANDPARENT', 'M8_WHAT_TO_DO'],
    last_updated: '2026-02-01T10:30:00Z',
    recommended_ui_messaging:
      'Scammers may call pretending to be your grandchild in trouble and ask for bail money. Always hang up and call a known number to verify before sending money.',
  },
  {
    id: 'sp_cra_arrest_threat',
    name: 'CRA arrest threat scam',
    category: 'phone',
    region: 'canada',
    primary_targets: ['seniors', 'newcomers', 'general public'],
    short_description:
      'Scammers impersonate the CRA, threatening arrest or deportation unless you pay immediately via gift cards, crypto, or wire transfer.',
    how_it_works: [
      'Automated or live call claims to be from the CRA with an urgent tax issue.',
      'They threaten arrest, licence suspension, or deportation if you don\'t pay immediately.',
      'They demand payment via iTunes/Google Play gift cards, Bitcoin, or wire transfer.',
      'They may spoof the CRA\'s real phone number on caller ID.',
    ],
    red_flags: [
      'CRA never threatens arrest by phone.',
      'CRA never demands gift cards, crypto, or wire transfers.',
      'CRA never calls with an automated message asking for personal info.',
      'Aggressive urgency — "pay now or police will come to your door."',
    ],
    official_sources: [
      { name: 'CRA – Scam prevention', url: 'https://www.canada.ca/en/revenue-agency/corporate/security/protect-yourself-against-fraud.html' },
    ],
    severity: 'critical',
    relevance_to_trustchekr: 'high',
    academy_modules_impacted: ['M2_BANK_CRA', 'M8_WHAT_TO_DO'],
    last_updated: '2026-02-15T08:00:00Z',
    recommended_ui_messaging:
      'The CRA will NEVER call threatening arrest or demanding gift cards. If you get this call, hang up. Check your CRA My Account online or call 1-800-959-8281.',
  },
  {
    id: 'sp_tech_support_popup',
    name: 'Fake virus pop-up — tech support scam',
    category: 'tech_support',
    region: 'canada',
    primary_targets: ['seniors', 'general public'],
    short_description:
      'A fake browser pop-up claims your computer is infected and urges you to call a phone number for "Microsoft" or "Apple" support.',
    how_it_works: [
      'A full-screen browser pop-up appears claiming your computer has a virus.',
      'The pop-up displays a phone number to call for "official" tech support.',
      'When you call, the scammer asks for remote access to your computer.',
      'They "find problems," then charge $200-$500 for fake repairs or steal banking credentials.',
    ],
    red_flags: [
      'Pop-up shows a phone number — real antivirus never does this.',
      'Pop-up won\'t close easily or makes alarm sounds.',
      'Caller asks for remote access to your computer.',
      'They ask for payment by gift card or wire transfer.',
    ],
    official_sources: [
      { name: 'Competition Bureau – Tech support scams', url: 'https://ised-isde.canada.ca/site/competition-bureau-canada/en' },
    ],
    severity: 'high',
    relevance_to_trustchekr: 'high',
    academy_modules_impacted: ['M3_TECH_SUPPORT', 'M8_WHAT_TO_DO'],
    last_updated: '2026-02-10T12:00:00Z',
    recommended_ui_messaging:
      'Real antivirus software never shows phone numbers in pop-ups. If you see one, close your browser with Ctrl+Alt+Delete. Never call the number.',
  },
];
