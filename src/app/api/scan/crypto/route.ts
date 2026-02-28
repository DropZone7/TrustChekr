import { NextRequest, NextResponse } from 'next/server';
import { assessWalletRisk, WalletNotFoundError } from '@/lib/cryptoRisk/service';

export async function POST(req: NextRequest) {
  try {
    const { address } = await req.json();

    if (!address || typeof address !== 'string' || address.trim().length === 0) {
      return NextResponse.json(
        { error: 'Please provide a wallet address to check.' },
        { status: 400 }
      );
    }

    const result = await assessWalletRisk(address.trim());
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof WalletNotFoundError) {
      return NextResponse.json(
        {
          error: 'We don\'t have analysis data for this wallet yet. Try scanning it on the main page first.',
          address: (err as any).message?.match(/for (.+)/)?.[1] ?? '',
        },
        { status: 404 }
      );
    }

    console.error('Crypto scan error:', err);
    return NextResponse.json(
      { error: 'Something went wrong analyzing this wallet. Please try again.' },
      { status: 500 }
    );
  }
}
