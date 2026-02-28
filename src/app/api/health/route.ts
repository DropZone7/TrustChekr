import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    services: {
      scanner: 'operational',
      osint: 'operational',
      training: 'operational',
    },
  });
}
