import { NextRequest, NextResponse } from 'next/server';
import type { CryptoRiskResult } from '@/lib/cryptoRisk/types';

export async function POST(req: NextRequest) {
  try {
    const { address } = await req.json();

    if (!address || typeof address !== 'string' || address.trim().length === 0) {
      return NextResponse.json(
        { error: 'Please provide a wallet address to check.' },
        { status: 400 }
      );
    }

    const result: CryptoRiskResult = {
      address: address.trim(),
      riskScore: 0.5,
      riskLevel: 'medium',
      signals: [
        {
          id: 'stub_placeholder',
          label: 'Stub signal — real analysis coming soon',
          weight: 0,
          value: 'placeholder',
        },
      ],
      explanation:
        'This is a stubbed response. Wallet-level risk scoring is under development.',
      modelVersion: 'xrpl-wallet-risk-mvp-0.0.1',
    };

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: 'Invalid request.' },
      { status: 400 }
    );
  }
}
