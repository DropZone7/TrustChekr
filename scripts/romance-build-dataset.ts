/**
 * Romance Conversation Dataset Builder
 *
 * Loads raw conversation JSON files from data/romance_raw/,
 * normalizes into LabeledConversation[], and writes a unified
 * dataset to data/romance_conversations_dataset.json.
 *
 * Usage:
 *   npm run build:romance-dataset
 *   ROMANCE_RAW_DIR=data/romance_raw npx ts-node scripts/romance-build-dataset.ts
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import type { RomanceConversationMessage, RomanceRedFlag, RomanceScamStage } from '../src/lib/romanceScan/types';
import type { RomanceDatasetLabel, LabeledConversation } from '../src/lib/romanceScan/schema';
import { getDefaultRedFlagsForLabel } from '../src/lib/romanceScan/schema';

// ── Config ───────────────────────────────────────────────────

const RAW_DIR = process.env.ROMANCE_RAW_DIR
  ?? process.argv[2]
  ?? path.resolve(__dirname, '../data/romance_raw');

const OUTPUT_PATH = path.resolve(__dirname, '../data/romance_conversations_dataset.json');

const VALID_LABELS: RomanceDatasetLabel[] = ['romance_scam', 'pig_butchering_scam', 'generic_scam', 'legit'];
const VALID_STAGES: RomanceScamStage[] = ['spark', 'grooming', 'first_ask', 'escalation', 'revelation', 'aftermath', 'none'];

// ── Raw Types ────────────────────────────────────────────────

type RawMessage = {
  role: string;
  text: string;
  timestamp?: string;
};

type RawConversation = {
  id: string;
  messages: RawMessage[];
  meta?: {
    label?: string;
    stage?: string;
    source?: string;
    [key: string]: unknown;
  };
};

// ── Keyword-Based Flag Detection ─────────────────────────────

type KeywordFlag = {
  id: string;
  label: string;
  severity: number;
  keywords: string[];
};

const KEYWORD_FLAGS: KeywordFlag[] = [
  {
    id: 'crypto_mention',
    label: 'References to cryptocurrency or crypto trading',
    severity: 3,
    keywords: ['crypto', 'bitcoin', 'btc', 'ethereum', 'eth', 'usdt', 'tether', 'binance', 'coinbase', 'blockchain'],
  },
  {
    id: 'wire_transfer_request',
    label: 'Request to wire money or use untraceable payment methods',
    severity: 5,
    keywords: ['wire the money', 'western union', 'moneygram', 'wire transfer', 'money order'],
  },
  {
    id: 'gift_card_request',
    label: 'Request to purchase gift cards as payment',
    severity: 5,
    keywords: ['gift card', 'itunes card', 'google play card', 'steam card', 'amazon card'],
  },
  {
    id: 'investment_platform',
    label: 'Directing to an investment or trading platform',
    severity: 4,
    keywords: ['trading platform', 'investment platform', 'my uncle showed me', 'guaranteed returns', 'guaranteed profit'],
  },
  {
    id: 'personal_info_fishing',
    label: 'Requesting sensitive personal information',
    severity: 4,
    keywords: ['social insurance', 'sin number', 'bank account', 'routing number', 'credit card number', 'password'],
  },
  {
    id: 'emergency_money',
    label: 'Urgent request for money due to an emergency',
    severity: 5,
    keywords: ['emergency', 'hospital bill', 'stuck at the airport', 'need money urgently', 'stranded'],
  },
];

function detectKeywordFlags(messages: RomanceConversationMessage[]): RomanceRedFlag[] {
  const flags: RomanceRedFlag[] = [];

  for (const kf of KEYWORD_FLAGS) {
    const matchedIndices: number[] = [];

    for (let i = 0; i < messages.length; i++) {
      const lower = messages[i].text.toLowerCase();
      if (kf.keywords.some((kw) => lower.includes(kw))) {
        matchedIndices.push(i);
      }
    }

    if (matchedIndices.length > 0) {
      flags.push({
        id: kf.id,
        label: kf.label,
        severity: kf.severity,
        messageIndices: matchedIndices,
      });
    }
  }

  return flags;
}

// ── Normalization ────────────────────────────────────────────

function normalizeMessages(raw: RawMessage[]): RomanceConversationMessage[] {
  return raw
    .filter((m) => m && typeof m.text === 'string' && m.text.trim().length > 0)
    .map((m) => ({
      role: m.role === 'user' ? 'user' as const : 'other' as const,
      text: m.text.trim(),
      ...(m.timestamp ? { timestamp: m.timestamp } : {}),
    }));
}

function resolveLabel(meta?: RawConversation['meta']): RomanceDatasetLabel {
  if (meta?.label && VALID_LABELS.includes(meta.label as RomanceDatasetLabel)) {
    return meta.label as RomanceDatasetLabel;
  }
  return 'generic_scam';
}

function resolveStage(meta?: RawConversation['meta']): RomanceScamStage {
  if (meta?.stage && VALID_STAGES.includes(meta.stage as RomanceScamStage)) {
    return meta.stage as RomanceScamStage;
  }
  return 'none';
}

function buildLabeledConversation(raw: RawConversation): LabeledConversation {
  const messages = normalizeMessages(raw.messages);
  const label = resolveLabel(raw.meta);
  const stage = resolveStage(raw.meta);
  const source = raw.meta?.source as string ?? 'raw_import';

  // Merge default flags for label + keyword-detected flags
  const defaultFlags = getDefaultRedFlagsForLabel(label);
  const keywordFlags = detectKeywordFlags(messages);

  // Deduplicate by id (keyword flags override defaults if same id)
  const flagMap = new Map<string, RomanceRedFlag>();
  for (const f of defaultFlags) flagMap.set(f.id, f);
  for (const f of keywordFlags) flagMap.set(f.id, f);
  const redFlags = Array.from(flagMap.values());

  return {
    id: raw.id,
    messages,
    label,
    stage,
    redFlags,
    source,
  };
}

// ── File Loading ─────────────────────────────────────────────

async function loadRawFiles(dir: string): Promise<RawConversation[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const all: RawConversation[] = [];

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.json')) continue;

    const filePath = path.join(dir, entry.name);
    const content = await fs.readFile(filePath, 'utf-8');

    try {
      const parsed = JSON.parse(content);
      const conversations: RawConversation[] = Array.isArray(parsed) ? parsed : [parsed];

      for (const conv of conversations) {
        if (!conv.id || !Array.isArray(conv.messages)) {
          console.warn(`  Skipping invalid entry in ${entry.name}: missing id or messages`);
          continue;
        }
        all.push(conv);
      }

      console.log(`  Loaded ${conversations.length} conversations from ${entry.name}`);
    } catch (err: any) {
      console.warn(`  Failed to parse ${entry.name}: ${err.message}`);
    }
  }

  return all;
}

// ── Main ─────────────────────────────────────────────────────

async function main() {
  console.log('=== Romance Conversation Dataset Builder ===\n');
  console.log(`Input:  ${RAW_DIR}`);
  console.log(`Output: ${OUTPUT_PATH}\n`);

  // Ensure input dir exists
  try {
    await fs.access(RAW_DIR);
  } catch {
    console.log(`Creating input directory: ${RAW_DIR}`);
    await fs.mkdir(RAW_DIR, { recursive: true });
    console.log('No raw files found. Add JSON files to data/romance_raw/ and re-run.');
    return;
  }

  // Load
  console.log('Loading raw conversations...');
  const rawConversations = await loadRawFiles(RAW_DIR);
  console.log(`\nTotal raw conversations loaded: ${rawConversations.length}\n`);

  if (rawConversations.length === 0) {
    console.log('No conversations to process. Add JSON files to data/romance_raw/');
    return;
  }

  // Normalize
  console.log('Building labeled dataset...');
  const dataset: LabeledConversation[] = rawConversations.map(buildLabeledConversation);

  // Stats
  const counts: Record<string, number> = {};
  for (const conv of dataset) {
    counts[conv.label] = (counts[conv.label] ?? 0) + 1;
  }

  console.log('\nLabel distribution:');
  for (const [label, count] of Object.entries(counts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${label}: ${count}`);
  }

  const totalFlags = dataset.reduce((s, c) => s + c.redFlags.length, 0);
  console.log(`\nTotal red flags assigned: ${totalFlags}`);

  // Write
  const outputDir = path.dirname(OUTPUT_PATH);
  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(OUTPUT_PATH, JSON.stringify(dataset, null, 2));
  console.log(`\nDataset written to ${OUTPUT_PATH} (${dataset.length} conversations)`);

  console.log('\n=== Done ===');
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
