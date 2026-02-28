import type {
  RomanceConversationMessage,
  RomanceRedFlag,
  RomanceScanResult,
  RomanceScamType,
  RomanceScamStage,
} from './types';
import type { RomanceDatasetLabel } from './schema';
import { scoreConversation, loadRomanceScamModel } from './model';

// ── Label → ScamType mapping ─────────────────────────────────

function labelToScamType(label: RomanceDatasetLabel): RomanceScamType {
  switch (label) {
    case 'romance_scam': return 'romance';
    case 'pig_butchering_scam': return 'pig_butchering';
    case 'generic_scam': return 'generic_scam';
    case 'legit': return 'legit';
    default: return 'generic_scam';
  }
}

// ── Stage Inference ──────────────────────────────────────────

const STAGE_KEYWORDS: { stage: RomanceScamStage; patterns: string[] }[] = [
  { stage: 'escalation', patterns: ['send more', 'need more money', 'bigger investment', 'double down', 'increase your deposit'] },
  { stage: 'first_ask', patterns: ['send money', 'wire the money', 'western union', 'gift card', 'invest just', 'small amount', 'need help with money', 'lend me', 'bitcoin', 'crypto'] },
  { stage: 'grooming', patterns: ['i love you', 'soulmate', 'never felt this way', 'falling for you', 'you are special', 'meant to be', 'destiny', 'my heart', 'only one for me'] },
  { stage: 'spark', patterns: ['wrong number', 'saw your profile', 'nice to meet', 'where are you from', 'what do you do'] },
  { stage: 'revelation', patterns: ['scam', 'fraud', 'reported you', 'police', 'i know what you are'] },
];

function inferStage(messages: RomanceConversationMessage[], label: RomanceDatasetLabel): RomanceScamStage {
  if (label === 'legit') return 'none';

  const allText = messages.map((m) => m.text.toLowerCase()).join(' ');

  for (const { stage, patterns } of STAGE_KEYWORDS) {
    if (patterns.some((p) => allText.includes(p))) return stage;
  }

  return 'none';
}

// ── Red Flag Detection ───────────────────────────────────────

type FlagPattern = {
  id: string;
  label: string;
  severity: number;
  keywords: string[];
  roleFilter?: 'other' | 'user';
};

const FLAG_PATTERNS: FlagPattern[] = [
  { id: 'love_bombing', label: 'Excessive declarations of love very early in the conversation', severity: 4, keywords: ['i love you', 'falling for you', 'soulmate', 'never felt this way', 'you are my everything', 'meant to be together'], roleFilter: 'other' },
  { id: 'fast_commitment', label: 'Pushing for exclusive commitment or daily contact very quickly', severity: 4, keywords: ['talk every day', 'only one for me', 'marry you', 'move in together', 'be with you forever'], roleFilter: 'other' },
  { id: 'cant_meet', label: 'Repeated excuses to avoid video calls or in-person meetings', severity: 3, keywords: ['camera is broken', 'bad connection', 'oil rig', 'deployed overseas', 'working abroad', 'can\'t video call'], roleFilter: 'other' },
  { id: 'move_off_platform', label: 'Trying to move conversation off the original platform', severity: 3, keywords: ['whatsapp', 'telegram', 'signal', 'let\'s talk on', 'move to', 'text me at', 'here\'s my number'], roleFilter: 'other' },
  { id: 'money_request', label: 'Direct request for money, wire transfer, or gift cards', severity: 5, keywords: ['send money', 'wire transfer', 'western union', 'moneygram', 'gift card', 'itunes card', 'lend me', 'help me pay', 'need money'], roleFilter: 'other' },
  { id: 'crypto_push', label: 'Pushing cryptocurrency investment or trading platform', severity: 5, keywords: ['crypto', 'bitcoin', 'trading platform', 'investment opportunity', 'guaranteed returns', 'my uncle showed me', 'put in a small amount'], roleFilter: 'other' },
  { id: 'sob_story', label: 'Emotional crisis designed to elicit sympathy and money', severity: 5, keywords: ['hospital', 'accident', 'emergency', 'surgery', 'stranded', 'lost my wallet', 'customs fee', 'child is sick'], roleFilter: 'other' },
  { id: 'isolation_attempt', label: 'Discouraging contact with friends or family about the relationship', severity: 4, keywords: ['don\'t tell anyone', 'keep this between us', 'they won\'t understand', 'your friends are jealous', 'just trust me'], roleFilter: 'other' },
  { id: 'too_good_returns', label: 'Promising impossibly high or guaranteed financial returns', severity: 5, keywords: ['guaranteed profit', 'guaranteed returns', 'risk-free', 'double your money', '100% return', 'can\'t lose'], roleFilter: 'other' },
  { id: 'wrong_number_intro', label: 'Conversation started with a "wrong number" or cold outreach', severity: 2, keywords: ['wrong number', 'who is this', 'sorry wrong person'], roleFilter: 'other' },
];

function detectRedFlags(messages: RomanceConversationMessage[]): RomanceRedFlag[] {
  const flags: RomanceRedFlag[] = [];

  for (const pattern of FLAG_PATTERNS) {
    const indices: number[] = [];

    for (let i = 0; i < messages.length; i++) {
      if (pattern.roleFilter && messages[i].role !== pattern.roleFilter) continue;
      const lower = messages[i].text.toLowerCase();
      if (pattern.keywords.some((kw) => lower.includes(kw))) {
        indices.push(i);
      }
    }

    if (indices.length > 0) {
      flags.push({
        id: pattern.id,
        label: pattern.label,
        severity: pattern.severity,
        messageIndices: indices,
      });
    }
  }

  return flags.sort((a, b) => b.severity - a.severity);
}

// ── Summary Builder ──────────────────────────────────────────

const SCAM_TYPE_LABELS: Record<RomanceScamType, string> = {
  romance: 'romance scam',
  pig_butchering: 'pig-butchering investment scam',
  investment: 'investment scam',
  generic_scam: 'scam',
  legit: 'legitimate conversation',
};

const STAGE_LABELS: Record<RomanceScamStage, string> = {
  spark: 'initial contact phase',
  grooming: 'grooming and trust-building phase',
  first_ask: 'first money or investment request phase',
  escalation: 'escalation and pressure phase',
  revelation: 'revelation or confrontation phase',
  aftermath: 'aftermath phase',
  none: '',
};

function buildSummary(
  scamType: RomanceScamType,
  stage: RomanceScamStage,
  riskLevel: string,
  flags: RomanceRedFlag[]
): string {
  if (scamType === 'legit') {
    return 'This conversation does not show significant scam indicators. It appears to be a legitimate exchange.';
  }

  const parts: string[] = [];
  parts.push(`This conversation shows patterns consistent with a ${SCAM_TYPE_LABELS[scamType]}.`);

  if (stage !== 'none') {
    parts.push(`It appears to be in the ${STAGE_LABELS[stage]}.`);
  }

  if (flags.length > 0) {
    const topFlags = flags.slice(0, 3).map((f) => f.label.toLowerCase());
    parts.push(`Key warning signs include: ${topFlags.join('; ')}.`);
  }

  return parts.join(' ');
}

// ── Main Assessment ──────────────────────────────────────────

export async function assessRomanceConversation(
  messages: RomanceConversationMessage[]
): Promise<RomanceScanResult> {
  const { label, scores } = await scoreConversation(messages);
  const model = await loadRomanceScamModel();

  const scamType = labelToScamType(label);
  const stage = inferStage(messages, label);

  // Risk score = sum of non-legit probabilities
  const riskScore = Math.min(1, 1 - (scores.legit ?? 0));

  let riskLevel: 'low' | 'medium' | 'high' | 'critical';
  if (riskScore < 0.25) riskLevel = 'low';
  else if (riskScore < 0.5) riskLevel = 'medium';
  else if (riskScore < 0.75) riskLevel = 'high';
  else riskLevel = 'critical';

  const redFlags = detectRedFlags(messages);
  const summary = buildSummary(scamType, stage, riskLevel, redFlags);

  return {
    riskScore,
    riskLevel,
    scamType,
    stage,
    redFlags,
    summary,
    modelVersion: model.version,
  };
}
