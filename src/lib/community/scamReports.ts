import { supabaseServer } from '@/lib/supabase/server';
import { upsertEntity, type EntityType } from '@/lib/graph/entityGraph';

export interface ScamReportInput {
  scam_type: string;
  message: string;
  entities: { type: EntityType; value: string }[];
  province?: string;
  reporter_ip_hash?: string;
}

export async function submitScamReport(input: ScamReportInput) {
  // Upsert entities and collect UUIDs
  const entityIds: string[] = [];
  for (const ent of input.entities) {
    try {
      const id = await upsertEntity(ent.type, ent.value);
      entityIds.push(id);
    } catch { /* skip */ }
  }

  // Increment report counts
  if (entityIds.length > 0) {
    await supabaseServer.rpc('increment_report_counts', { eids: entityIds });
  }

  // Insert report
  const { data, error } = await supabaseServer
    .from('user_reports')
    .insert({
      scam_type: input.scam_type,
      message: input.message,
      province: input.province,
      entity_ids: entityIds,
      verified: false,
      upvotes: 0,
    })
    .select('id')
    .single();

  if (error) throw new Error(`Report submission failed: ${error.message}`);
  return data;
}

export async function getRecentReports(limit: number = 20) {
  const { data, error } = await supabaseServer
    .from('user_reports')
    .select('id, scam_type, message, province, upvotes, created_at, verified')
    .eq('verified', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) return [];
  return data ?? [];
}

export async function searchReports(query: string) {
  const { data, error } = await supabaseServer
    .from('user_reports')
    .select('id, scam_type, message, province, upvotes, created_at')
    .eq('verified', true)
    .textSearch('message_tsv', query, { type: 'websearch' })
    .limit(20);

  if (error) return [];
  return data ?? [];
}

export async function upvoteReport(reportId: string) {
  // Fetch current upvotes, increment manually
  const { data } = await supabaseServer
    .from('user_reports')
    .select('upvotes')
    .eq('id', reportId)
    .single();

  const current = data?.upvotes ?? 0;
  await supabaseServer
    .from('user_reports')
    .update({ upvotes: current + 1 })
    .eq('id', reportId);
}

// Rate limiting: check reports from same IP in last 24h
export async function checkRateLimit(ipHash: string): Promise<boolean> {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  // We don't store IP hash in user_reports currently, so this is a future enhancement
  // For now, always allow (client-side throttling via localStorage)
  return true;
}
