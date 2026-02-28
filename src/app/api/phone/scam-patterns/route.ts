import { NextRequest, NextResponse } from 'next/server';
import { getPatternsByRegion } from '@/lib/phone/scamPatterns';

export async function GET(req: NextRequest) {
  const region = new URL(req.url).searchParams.get('region') ?? undefined;
  const patterns = getPatternsByRegion(region);

  // Serialize without RegExp (convert to string prefixes)
  const serialized = patterns.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    riskLevel: p.riskLevel,
    tactics: p.tactics,
    targetDemographic: p.targetDemographic,
    reportedLosses: p.reportedLosses,
    region: p.region,
  }));

  return NextResponse.json({
    region: region?.toUpperCase() ?? 'all',
    count: serialized.length,
    patterns: serialized,
  });
}
