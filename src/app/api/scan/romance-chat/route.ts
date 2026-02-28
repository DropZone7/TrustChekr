import { NextRequest, NextResponse } from 'next/server';
import type { RomanceConversationMessage } from '@/lib/romanceScan/types';
import { assessRomanceConversation } from '@/lib/romanceScan/service';

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

    // Cap at 200 messages
    const capped: RomanceConversationMessage[] = messages.slice(0, 200).map((m: any) => ({
      role: m.role as 'user' | 'other',
      text: m.text.trim(),
      ...(m.timestamp ? { timestamp: m.timestamp } : {}),
    }));

    const result = await assessRomanceConversation(capped);
    return NextResponse.json(result);
  } catch (err) {
    console.error('Romance chat scan error:', err);
    return NextResponse.json(
      { error: 'Something went wrong analyzing this conversation. Please try again.' },
      { status: 500 }
    );
  }
}
