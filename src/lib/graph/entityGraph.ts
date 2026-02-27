import { supabaseServer } from '@/lib/supabase/server';

export type EntityType = 'email' | 'phone' | 'url' | 'domain' | 'crypto_wallet' | 'ip' | 'username';

export interface Entity {
  id: string;
  type: EntityType;
  value: string;
  report_count: number;
  confirmed_scam: boolean;
}

export interface RiskScoreResult {
  score: number;
  risk_label: 'HIGH' | 'MEDIUM' | 'LOW';
  degree_connections: number;
  scam_neighbor_count: number;
  second_degree_scams: number;
}

export interface GraphScanResult {
  network_risk_score: number;
  network_risk_label: 'HIGH' | 'MEDIUM' | 'LOW';
  entity_scores: Record<string, RiskScoreResult>;
  entities_created: number;
  edges_created: number;
}

// Upsert an entity — returns its UUID
export async function upsertEntity(type: EntityType, value: string): Promise<string> {
  const normalized = value.toLowerCase().trim();

  // Try to find existing
  const { data: existing } = await supabaseServer
    .from('entities')
    .select('id')
    .eq('type', type)
    .eq('value', normalized)
    .maybeSingle();

  if (existing) {
    // Update last_seen
    await supabaseServer
      .from('entities')
      .update({ last_seen: new Date().toISOString() })
      .eq('id', existing.id);
    return existing.id;
  }

  // Insert new
  const { data, error } = await supabaseServer
    .from('entities')
    .insert({ type, value: normalized })
    .select('id')
    .single();

  if (error) throw new Error(`Entity upsert failed: ${error.message}`);
  return data.id;
}

// Link two entities bidirectionally
export async function linkEntities(
  sourceId: string,
  targetId: string,
  relationship: string,
  weight: number = 1.0
): Promise<void> {
  if (sourceId === targetId) return;

  // Check if edge already exists
  const { data: existing } = await supabaseServer
    .from('entity_edges')
    .select('id')
    .eq('source_id', sourceId)
    .eq('target_id', targetId)
    .eq('relationship', relationship)
    .maybeSingle();

  if (existing) return;

  await supabaseServer.from('entity_edges').insert([
    { source_id: sourceId, target_id: targetId, relationship, weight },
    { source_id: targetId, target_id: sourceId, relationship, weight },
  ]);
}

// Calculate risk score for a single entity
export async function calculateRiskScore(entityId: string): Promise<RiskScoreResult> {
  // Get 1st-degree neighbors
  const { data: edges } = await supabaseServer
    .from('entity_edges')
    .select('target_id')
    .eq('source_id', entityId);

  const neighborIds = [...new Set((edges ?? []).map((e: any) => e.target_id))];
  const degreeConnections = neighborIds.length;

  if (degreeConnections === 0) {
    const result: RiskScoreResult = { score: 0, risk_label: 'LOW', degree_connections: 0, scam_neighbor_count: 0, second_degree_scams: 0 };
    await cacheScore(entityId, result);
    return result;
  }

  // Get neighbor details
  const { data: neighbors } = await supabaseServer
    .from('entities')
    .select('id, confirmed_scam, report_count')
    .in('id', neighborIds);

  const confirmedScamNeighbors = (neighbors ?? []).filter((n: any) => n.confirmed_scam).length;
  const highReportNeighbors = (neighbors ?? []).filter((n: any) => n.report_count > 2).length;

  // 2nd degree: get neighbors of neighbors (sample up to 10)
  const sampleNeighborIds = neighborIds.slice(0, 10);
  let secondDegreeScams = 0;

  if (sampleNeighborIds.length > 0) {
    const { data: secondEdges } = await supabaseServer
      .from('entity_edges')
      .select('target_id')
      .in('source_id', sampleNeighborIds);

    const secondDegreeIds = [...new Set((secondEdges ?? []).map((e: any) => e.target_id))];

    if (secondDegreeIds.length > 0) {
      const { data: secondNeighbors } = await supabaseServer
        .from('entities')
        .select('id')
        .in('id', secondDegreeIds)
        .eq('confirmed_scam', true);

      secondDegreeScams = (secondNeighbors ?? []).length;
    }
  }

  // Score formula
  let score = 0;
  score += confirmedScamNeighbors * 0.35;
  score += highReportNeighbors * 0.15;
  score += Math.min(secondDegreeScams, 5) * 0.08;
  score += Math.log1p(degreeConnections) * 0.05;
  score = Math.min(1.0, score);

  const risk_label: 'HIGH' | 'MEDIUM' | 'LOW' = score > 0.6 ? 'HIGH' : score > 0.3 ? 'MEDIUM' : 'LOW';

  const result: RiskScoreResult = {
    score: Math.round(score * 1000) / 1000,
    risk_label,
    degree_connections: degreeConnections,
    scam_neighbor_count: confirmedScamNeighbors,
    second_degree_scams: secondDegreeScams,
  };

  await cacheScore(entityId, result);
  return result;
}

async function cacheScore(entityId: string, result: RiskScoreResult) {
  await supabaseServer.from('entity_risk_scores').upsert({
    entity_id: entityId,
    score: result.score,
    degree_connections: result.degree_connections,
    scam_neighbor_count: result.scam_neighbor_count,
    calculated_at: new Date().toISOString(),
  });
}

// Run full scan graph — called after every scan
export async function runFullScanGraph(
  scanEntities: { type: EntityType; value: string }[]
): Promise<GraphScanResult> {
  if (scanEntities.length === 0) {
    return { network_risk_score: 0, network_risk_label: 'LOW', entity_scores: {}, entities_created: 0, edges_created: 0 };
  }

  // Upsert all entities
  const entityIds: { id: string; value: string }[] = [];
  for (const ent of scanEntities) {
    try {
      const id = await upsertEntity(ent.type, ent.value);
      entityIds.push({ id, value: ent.value });
    } catch { /* skip failed upserts */ }
  }

  // Link all entities to each other (same_scan relationship)
  let edgesCreated = 0;
  for (let i = 0; i < entityIds.length; i++) {
    for (let j = i + 1; j < entityIds.length; j++) {
      try {
        await linkEntities(entityIds[i].id, entityIds[j].id, 'same_scan');
        edgesCreated++;
      } catch { /* skip */ }
    }
  }

  // Calculate risk for each entity
  const entityScores: Record<string, RiskScoreResult> = {};
  let totalScore = 0;

  for (const ent of entityIds) {
    try {
      const score = await calculateRiskScore(ent.id);
      entityScores[ent.value] = score;
      totalScore += score.score;
    } catch { /* skip */ }
  }

  const avgScore = entityIds.length > 0 ? totalScore / entityIds.length : 0;
  const networkLabel: 'HIGH' | 'MEDIUM' | 'LOW' = avgScore > 0.6 ? 'HIGH' : avgScore > 0.3 ? 'MEDIUM' : 'LOW';

  return {
    network_risk_score: Math.round(avgScore * 1000) / 1000,
    network_risk_label: networkLabel,
    entity_scores: entityScores,
    entities_created: entityIds.length,
    edges_created: edgesCreated,
  };
}
