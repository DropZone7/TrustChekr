import { NextRequest, NextResponse } from 'next/server';
import { subscribe, unsubscribe } from '@/lib/scam-intel/alerts';

const PROVINCES = ['AB','BC','MB','NB','NL','NS','NT','NU','ON','PE','QC','SK','YT'];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { province, carrier, bank, age_range, email, frequency } = body;

    if (!province || !PROVINCES.includes(province)) {
      return NextResponse.json({ error: 'Valid province is required' }, { status: 400 });
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    if (frequency && !['instant', 'daily', 'weekly'].includes(frequency)) {
      return NextResponse.json({ error: 'Invalid frequency' }, { status: 400 });
    }

    const sub = subscribe({ province, carrier, bank, age_range, email, frequency });
    return NextResponse.json({ success: true, subscriber_id: sub.id });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { subscriber_id } = body;

    if (!subscriber_id) {
      return NextResponse.json({ error: 'subscriber_id is required' }, { status: 400 });
    }

    const success = unsubscribe(subscriber_id);
    if (!success) {
      return NextResponse.json({ error: 'Subscriber not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
