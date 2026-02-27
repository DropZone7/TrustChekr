import { NextResponse } from 'next/server';
import { runFullScanGraph, type EntityType } from '@/lib/graph/entityGraph';

export async function POST(req: Request) {
  try {
    const { entities } = await req.json();

    if (!entities || !Array.isArray(entities)) {
      return NextResponse.json({ error: 'Missing entities array' }, { status: 400 });
    }

    // Validate entity types
    const validTypes: EntityType[] = ['email', 'phone', 'url', 'domain', 'crypto_wallet', 'ip', 'username'];
    const validEntities = entities.filter(
      (e: any) => e.type && e.value && validTypes.includes(e.type)
    );

    const result = await runFullScanGraph(validEntities);
    return NextResponse.json(result, { status: 200 });
  } catch (e: any) {
    console.error('Graph scan error:', e);
    return NextResponse.json({ error: 'Graph scan failed' }, { status: 500 });
  }
}
