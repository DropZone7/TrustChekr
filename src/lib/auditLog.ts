import { supabaseServer } from '@/lib/supabase/server';

export function logAudit(action: string, details: Record<string, any>, ipHash?: string): void {
  Promise.resolve(
    supabaseServer
      .from('audit_log')
      .insert({ action, details, ip_hash: ipHash })
  ).catch(() => {});
}

export function hashIp(ip: string): string {
  // Simple non-crypto hash for IP anonymization (deterministic, not reversible enough for privacy)
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16).padStart(8, '0').slice(0, 16);
}
