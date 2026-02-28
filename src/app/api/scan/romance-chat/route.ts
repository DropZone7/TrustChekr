import { NextRequest, NextResponse } from 'next/server';
import type { RomanceConversationMessage, RomanceScanResult } from '@/lib/romanceScan/types';

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Please provide a non-empty array of messages to analyze.' },
        { status: 400 }
      );
    }

    // Validate message shape
    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      if (
        !msg ||
        typeof msg !== 'object' ||
        (msg.role !== 'user' && msg.role !== 'other') ||
        typeof msg.text !== 'string' ||
        msg.text.trim().length === 0
      ) {
        return NextResponse.json(
          { error: `Message at index ${i} must have a "role" ("user" or "other") and non-empty "text".` },
          { status: 400 }
        );
      }
    }

    // Cap at 200 messages for now
    const capped: RomanceConversationMessage[] = messages.slice(0, 200);

    // Stub response — real analysis engine coming soon
    const result: RomanceScanResult = {
      riskScore: 0.6,
      riskLevel: 'medium',
      scamType: 'romance',
      stage: 'grooming',
      redFlags: [
        {
          id: 'love_bombing',
          label: 'Excessive flattery and rapid emotional escalation',
          severity: 3,
          messageIndices: [0],
        },
        {
          id: 'wrong_number_intro',
          label: 'Conversation started with a "wrong number" or unsolicited contact',
          severity: 2,
          messageIndices: [0],
        },
      ],
      summary:
        'This conversation shows multiple romance-style grooming patterns, but no explicit money request yet.',
      modelVersion: 'romance-scam-mvp-0.0.1',
    };

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: 'Invalid request.' },
      { status: 400 }
    );
  }
}
