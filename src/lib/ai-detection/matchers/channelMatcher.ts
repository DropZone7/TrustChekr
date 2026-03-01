import type { Channel, MatchedSignal, ScamCategory } from '../types';
import { weightToPenalty } from '../scoring';

/**
 * Channel-specific heuristics.
 * Some signals are much more suspicious in certain channels.
 */

interface ChannelBoost {
  /** Signal categories that get boosted in this channel */
  boostCategories: ScamCategory[];
  /** Multiplier for penalty (1.0 = no change, 1.5 = 50% more) */
  multiplier: number;
  /** Additional signals to check for this channel */
  extraChecks: (text: string) => MatchedSignal[];
}

const CHANNEL_CONFIG: Partial<Record<Channel, ChannelBoost>> = {
  sms: {
    boostCategories: ['CRA_IMPERSONATION', 'BANK_IMPERSONATION', 'INTERAC_PHISHING'],
    multiplier: 1.3,
    extraChecks: (text: string) => {
      const signals: MatchedSignal[] = [];
      // SMS with URLs is inherently more suspicious
      if (/https?:\/\/\S+/i.test(text)) {
        signals.push({
          ruleId: 'sms_contains_url',
          category: 'GENERIC_PHISHING',
          weight: 4,
          penalty: weightToPenalty(4),
          description: 'SMS contains a clickable URL — banks and the CRA rarely send links via text',
          matchedText: text.match(/https?:\/\/\S+/i)?.[0],
        });
      }
      return signals;
    },
  },

  call_script: {
    boostCategories: ['CRA_IMPERSONATION', 'TECH_SUPPORT'],
    multiplier: 1.2,
    extraChecks: (text: string) => {
      const signals: MatchedSignal[] = [];
      // Urgency in a call script is a strong signal
      if (/do not hang up|stay on the line|immediately|right now/i.test(text)) {
        signals.push({
          ruleId: 'call_urgency_pressure',
          category: 'GENERIC_PHISHING',
          weight: 6,
          penalty: weightToPenalty(6),
          description: 'Call script uses high-pressure language to prevent the victim from hanging up',
          matchedText: text.match(/do not hang up|stay on the line|immediately|right now/i)?.[0],
        });
      }
      return signals;
    },
  },

  cra_notice: {
    boostCategories: ['CRA_IMPERSONATION'],
    multiplier: 1.5, // anything flagged as CRA that triggers patterns is very sus
    extraChecks: () => [],
  },

  interac_notification: {
    boostCategories: ['INTERAC_PHISHING'],
    multiplier: 1.5,
    extraChecks: (text: string) => {
      const signals: MatchedSignal[] = [];
      // Check for non-interac.ca sender domains
      const emailMatch = text.match(/from[:\s]+\S+@(\S+)/i);
      if (emailMatch && !emailMatch[1].endsWith('interac.ca')) {
        signals.push({
          ruleId: 'interac_wrong_domain',
          category: 'INTERAC_PHISHING',
          weight: 9,
          penalty: weightToPenalty(9),
          description: `Interac notification from non-Interac domain: ${emailMatch[1]}`,
          matchedText: emailMatch[0],
        });
      }
      return signals;
    },
  },
};

/**
 * Apply channel-specific analysis and boosts.
 */
export function applyChannelAnalysis(
  channel: Channel,
  text: string,
  existingSignals: MatchedSignal[],
): { boostedSignals: MatchedSignal[]; extraSignals: MatchedSignal[] } {
  const config = CHANNEL_CONFIG[channel];
  if (!config) return { boostedSignals: existingSignals, extraSignals: [] };

  // Boost penalties for relevant categories
  const boostedSignals = existingSignals.map((signal) => {
    if (config.boostCategories.includes(signal.category)) {
      return {
        ...signal,
        penalty: Math.round(signal.penalty * config.multiplier),
      };
    }
    return signal;
  });

  // Run channel-specific extra checks
  const extraSignals = config.extraChecks(text);

  return { boostedSignals, extraSignals };
}
