'use client';

import { useRef, useCallback } from 'react';

export interface BotDetectionProfile {
  typingSpeed: number; // chars per second
  copyPasteDetected: boolean;
  mouseEntropyScore: number; // 0-100
  timeOnPageMs: number;
  suspicionScore: number; // 0-100
  flags: string[];
}

interface KeyEvent { timestamp: number; }
interface MouseEvent { x: number; y: number; timestamp: number; }

export function useBotDetection() {
  const keyEvents = useRef<KeyEvent[]>([]);
  const mouseEvents = useRef<MouseEvent[]>([]);
  const pageLoadTime = useRef(Date.now());
  const sampleCounter = useRef(0);

  const onKeyDown = useCallback(() => {
    keyEvents.current.push({ timestamp: Date.now() });
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    // Sample 1 in 5 events to avoid bloat
    sampleCounter.current++;
    if (sampleCounter.current % 5 !== 0) return;
    mouseEvents.current.push({ x: e.clientX, y: e.clientY, timestamp: Date.now() });
  }, []);

  const getProfile = useCallback((): BotDetectionProfile => {
    const flags: string[] = [];
    const timeOnPageMs = Date.now() - pageLoadTime.current;

    // Typing speed
    const keys = keyEvents.current;
    let typingSpeed = 0;
    let copyPasteDetected = false;

    if (keys.length >= 2) {
      const duration = (keys[keys.length - 1].timestamp - keys[0].timestamp) / 1000;
      typingSpeed = duration > 0 ? keys.length / duration : 0;

      // Burst detection: check for rapid bursts (>25 chars/sec in any 1-sec window)
      for (let i = 0; i < keys.length - 10; i++) {
        const windowDuration = (keys[Math.min(i + 10, keys.length - 1)].timestamp - keys[i].timestamp) / 1000;
        if (windowDuration > 0 && 10 / windowDuration > 25) {
          copyPasteDetected = true;
          break;
        }
      }
    }

    if (copyPasteDetected) flags.push('COPY_PASTE_INPUT');
    if (typingSpeed > 15) flags.push('SUPERHUMAN_TYPING');

    // Mouse entropy
    const moves = mouseEvents.current;
    let mouseEntropyScore = 0;

    if (moves.length < 3) {
      flags.push('NO_MOUSE_ACTIVITY');
      mouseEntropyScore = 0;
    } else {
      // Calculate variance of deltas (real humans have high variance, bots are linear)
      const deltas: number[] = [];
      for (let i = 1; i < moves.length; i++) {
        const dx = moves[i].x - moves[i - 1].x;
        const dy = moves[i].y - moves[i - 1].y;
        deltas.push(Math.sqrt(dx * dx + dy * dy));
      }
      const mean = deltas.reduce((a, b) => a + b, 0) / deltas.length;
      const variance = deltas.reduce((a, b) => a + (b - mean) ** 2, 0) / deltas.length;
      const cv = mean > 0 ? Math.sqrt(variance) / mean : 0;

      // High CV = human (varied movements), low CV = bot (uniform)
      mouseEntropyScore = Math.min(100, Math.round(cv * 80));

      if (cv < 0.15) flags.push('BOT_MOUSE_PATTERN');
    }

    // Suspicion score
    let suspicionScore = 0;
    if (copyPasteDetected) suspicionScore += 25;
    if (typingSpeed > 15) suspicionScore += 20;
    if (moves.length < 3) suspicionScore += 20;
    if (mouseEntropyScore < 15 && moves.length >= 3) suspicionScore += 15;
    if (timeOnPageMs < 2000) suspicionScore += 20; // Submitted in under 2 seconds
    suspicionScore = Math.min(100, suspicionScore);

    return {
      typingSpeed: Math.round(typingSpeed * 10) / 10,
      copyPasteDetected,
      mouseEntropyScore,
      timeOnPageMs,
      suspicionScore,
      flags,
    };
  }, []);

  return { onKeyDown, onMouseMove, getProfile };
}
