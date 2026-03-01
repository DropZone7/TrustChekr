import { NextRequest, NextResponse } from 'next/server';
import { getAlertFeed, generateAlertsFromCampaigns } from '@/lib/scam-intel/alerts';

// GET /api/alerts — public alert feed
export async function GET() {
  try {
    let alerts = getAlertFeed(20);

    // Auto-seed alerts if empty
    if (alerts.length === 0) {
      generateAlertsFromCampaigns();
      alerts = getAlertFeed(20);
    }

    return NextResponse.json({ alerts });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/alerts/trigger — admin trigger
export async function POST(req: NextRequest) {
  try {
    const authKey = req.headers.get('x-api-key') || '';
    const expectedKey = process.env.TRENDS_UPDATE_KEY || '';

    if (!expectedKey || authKey !== expectedKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const alerts = generateAlertsFromCampaigns();
    return NextResponse.json({ generated: alerts.length, alerts });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
