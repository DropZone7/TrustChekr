import { NextRequest, NextResponse } from 'next/server';

// SMS webhook for Twilio — users forward suspicious texts to our number
// Twilio sends POST with From, To, Body fields

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const from = formData.get('From')?.toString() ?? '';
    const body = formData.get('Body')?.toString() ?? '';

    if (!body || body.trim().length < 3) {
      return twimlResponse('Send us a suspicious message, URL, phone number, or email and we\'ll check it for scams. 🛡️ TrustChekr');
    }

    // Detect input type
    const text = body.trim();
    let type = 'message';
    if (/^https?:\/\//i.test(text) || /^www\./i.test(text)) type = 'website';
    else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) type = 'email';
    else if (/^\+?\d[\d\s\-().]{8,}$/.test(text)) type = 'phone';
    else if (/^(1|3|bc1)[a-zA-Z0-9]{25,62}$/.test(text)) type = 'crypto';
    else if (/^0x[a-fA-F0-9]{40}$/.test(text)) type = 'crypto';
    else if (/^r[1-9A-HJ-NP-Za-km-z]{24,34}$/.test(text)) type = 'crypto';

    // Call our own scan API internally (hardcoded base to prevent SSRF via Host header)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.trustchekr.com';
    const scanRes = await fetch(`${baseUrl}/api/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, input: text }),
    });
    const data = await scanRes.json();

    if (data.error) {
      return twimlResponse(`Sorry, we couldn't check that right now. Try again or visit trustchekr.com 🛡️`);
    }

    const riskLabels: Record<string, string> = {
      'safe': '🟢 LOW RISK',
      'suspicious': '🟡 SUSPICIOUS',
      'high-risk': '🟠 HIGH RISK',
      'very-likely-scam': '🔴 VERY LIKELY SCAM',
    };

    const label = riskLabels[data.riskLevel] ?? '❓ Unknown';
    const bullets = (data.whyBullets ?? []).slice(0, 3).map((b: string) => `• ${b}`).join('\n');
    const nextStep = (data.nextSteps ?? [])[0] ?? '';

    let reply = `${label}\n\n${bullets}`;
    if (nextStep) reply += `\n\n→ ${nextStep}`;
    reply += `\n\n⚠️ Auto analysis — not advice.\n🌐 Full scan: trustchekr.com`;

    return twimlResponse(reply);
  } catch {
    return twimlResponse('Something went wrong. Visit trustchekr.com for a full scan. 🛡️');
  }
}

function twimlResponse(message: string): NextResponse {
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${escapeXml(message)}</Message>
</Response>`;

  return new NextResponse(twiml, {
    headers: { 'Content-Type': 'text/xml' },
  });
}

function escapeXml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
