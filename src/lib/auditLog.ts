import { supabaseServer } from '@/lib/supabase/server';

export function logAudit(action: string, details: Record<string, any>, ipHash?: string): void {
  Promise.resolve(
    supabaseServer
      .from('audit_log')
      .insert({ action, details, ip_hash: ipHash })
  ).catch(() => {});
}

export function hashIp(ip: string): string {
  // SHA-256 with static salt for PIPEDA-compliant IP anonymization
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(`tc_salt_2026:${ip}`).digest('hex').slice(0, 16);
}
