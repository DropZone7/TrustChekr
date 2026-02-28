import type { RomanceConversationMessage, RomanceRedFlag, RomanceScamStage } from './types';

// ── Labels ───────────────────────────────────────────────────

export type RomanceDatasetLabel =
  | 'romance_scam'
  | 'pig_butchering_scam'
  | 'generic_scam'
  | 'legit';

export type RomanceDatasetStage = RomanceScamStage;

// ── Labeled Conversation ─────────────────────────────────────

export interface LabeledConversation {
  id: string;
  messages: RomanceConversationMessage[];
  label: RomanceDatasetLabel;
  stage: RomanceDatasetStage;
  redFlags: RomanceRedFlag[];
  source: string;
}

// ── Default Red Flags by Label ───────────────────────────────

export function getDefaultRedFlagsForLabel(label: RomanceDatasetLabel): RomanceRedFlag[] {
  switch (label) {
    case 'romance_scam':
      return [
        {
          id: 'love_bombing',
          label: 'Excessive flattery and declarations of love very early',
          severity: 4,
          messageIndices: [],
        },
        {
          id: 'fast_commitment',
          label: 'Pushing for exclusive relationship or marriage within days',
          severity: 4,
          messageIndices: [],
        },
        {
          id: 'cant_video_call',
          label: 'Repeated excuses to avoid video calls or in-person meetings',
          severity: 3,
          messageIndices: [],
        },
        {
          id: 'sob_story',
          label: 'Emotional crisis story designed to elicit sympathy and money',
          severity: 5,
          messageIndices: [],
        },
        {
          id: 'isolation_attempt',
          label: 'Discouraging contact with friends or family about the relationship',
          severity: 4,
          messageIndices: [],
        },
      ];

    case 'pig_butchering_scam':
      return [
        {
          id: 'wrong_number_intro',
          label: 'Conversation initiated via "wrong number" or unsolicited contact',
          severity: 3,
          messageIndices: [],
        },
        {
          id: 'crypto_investment_push',
          label: 'Steering conversation toward crypto or investment opportunities',
          severity: 5,
          messageIndices: [],
        },
        {
          id: 'guaranteed_returns',
          label: 'Claiming guaranteed or impossibly high investment returns',
          severity: 5,
          messageIndices: [],
        },
        {
          id: 'fake_platform',
          label: 'Directing to an unknown or unregistered trading platform',
          severity: 5,
          messageIndices: [],
        },
        {
          id: 'small_wins_first',
          label: 'Allowing small initial withdrawals to build trust before larger deposits',
          severity: 4,
          messageIndices: [],
        },
        {
          id: 'urgency_pressure',
          label: 'Creating artificial urgency around a limited-time investment window',
          severity: 4,
          messageIndices: [],
        },
      ];

    case 'generic_scam':
      return [
        {
          id: 'unsolicited_contact',
          label: 'Unsolicited contact from an unknown person',
          severity: 2,
          messageIndices: [],
        },
        {
          id: 'money_request',
          label: 'Direct request for money, gift cards, or wire transfer',
          severity: 5,
          messageIndices: [],
        },
        {
          id: 'urgency_threat',
          label: 'Creating urgency through threats or time pressure',
          severity: 4,
          messageIndices: [],
        },
        {
          id: 'personal_info_request',
          label: 'Asking for sensitive personal information (SIN, banking, passwords)',
          severity: 5,
          messageIndices: [],
        },
      ];

    case 'legit':
      return [];

    default:
      return [];
  }
}
