import { NextResponse } from 'next/server';
import { detectAIText } from '@/lib/scanners/aiTextDetector';

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Missing text field' }, { status: 400 });
    }

    const result = detectAIText(text);
    return NextResponse.json(result, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
