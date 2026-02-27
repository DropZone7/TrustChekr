import { runFullScanGraph, type EntityType, type GraphScanResult } from '@/lib/graph/entityGraph';
import { detectAIText, type AIDetectionResult } from '@/lib/scanners/aiTextDetector';
import type { BotDetectionProfile } from '@/hooks/useBotDetection';

export interface UnifiedScanResult {
  // Original scan results (from existing scanner)
  scan: any;
  // New modules
  graph?: GraphScanResult;
  ai_detection?: AIDetectionResult;
  bot_detection?: {
    flagged: boolean;
    suspicion_score: number;
    flags: string[];
  };
  // Unified score
  overall_risk_score: number;
  overall_risk_label: 'HIGH' | 'MEDIUM' | 'LOW';
  scanned_at: string;
}

// Extract entities from scan results for graph linking
function extractEntities(scanResult: any, inputType: string, inputValue: string): { type: EntityType; value: string }[] {
  const entities: { type: EntityType; value: string }[] = [];

  // Always add the primary input
  const typeMap: Record<string, EntityType> = {
    website: 'url',
    email: 'email',
    phone: 'phone',
    crypto: 'crypto_wallet',
    message: 'domain', // extract domain from message URLs
  };

  const entityType = typeMap[inputType];
  if (entityType && inputValue) {
    entities.push({ type: entityType, value: inputValue });
  }

  // Extract URLs from signals
  if (scanResult?.signals) {
    for (const signal of scanResult.signals) {
      const desc = signal.description ?? '';
      // Extract domains from signal descriptions
      const urlMatch = desc.match(/https?:\/\/([^\s/]+)/);
      if (urlMatch) {
        entities.push({ type: 'domain', value: urlMatch[1] });
      }
    }
  }

  // Deduplicate
  const seen = new Set<string>();
  return entities.filter((e) => {
    const key = `${e.type}:${e.value}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function runUnifiedScan(
  scanResult: any,
  inputType: string,
  inputValue: string,
  options?: {
    botProfile?: BotDetectionProfile;
    runAIDetection?: boolean;
    textForAI?: string;
  }
): Promise<UnifiedScanResult> {
  const result: UnifiedScanResult = {
    scan: scanResult,
    overall_risk_score: 0,
    overall_risk_label: 'LOW',
    scanned_at: new Date().toISOString(),
  };

  // 1. Entity graph scoring
  try {
    const entities = extractEntities(scanResult, inputType, inputValue);
    if (entities.length > 0) {
      result.graph = await runFullScanGraph(entities);
    }
  } catch (e) {
    console.error('Graph scoring failed:', e);
  }

  // 2. AI text detection (for message/text scans)
  if (options?.runAIDetection && options?.textForAI) {
    result.ai_detection = detectAIText(options.textForAI);
  }

  // 3. Bot detection
  if (options?.botProfile) {
    const flagged = options.botProfile.suspicionScore > 70;
    result.bot_detection = {
      flagged,
      suspicion_score: options.botProfile.suspicionScore,
      flags: options.botProfile.flags,
    };
  }

  // 4. Calculate overall risk score (weighted average)
  const scores: { score: number; weight: number }[] = [];

  // Pattern scanner score (from existing scanner)
  if (scanResult?.score !== undefined) {
    // Normalize existing score to 0-1 range (existing uses 0-100ish)
    const normalized = Math.min(1, Math.max(0, scanResult.score / 100));
    scores.push({ score: normalized, weight: 0.5 });
  }

  // Graph score
  if (result.graph) {
    scores.push({ score: result.graph.network_risk_score, weight: 0.3 });
  }

  // AI detection (only for text scans)
  if (result.ai_detection && result.ai_detection.label !== 'TOO_SHORT') {
    scores.push({ score: result.ai_detection.ai_probability * 0.5, weight: 0.2 });
  }

  if (scores.length > 0) {
    const totalWeight = scores.reduce((sum, s) => sum + s.weight, 0);
    result.overall_risk_score = Math.round(
      (scores.reduce((sum, s) => sum + s.score * s.weight, 0) / totalWeight) * 1000
    ) / 1000;
  }

  result.overall_risk_label =
    result.overall_risk_score > 0.6 ? 'HIGH' :
    result.overall_risk_score > 0.3 ? 'MEDIUM' : 'LOW';

  return result;
}
