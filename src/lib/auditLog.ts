import { supabaseServer } from '@/lib/supabase/server';
import crypto from 'crypto';

export function logAudit(action: string, details: Record<string, any>, ipHash?: string): void {
  Promise.resolve(
    supabaseServer
      .from('audit_log')
      .insert({ action, details, ip_hash: ipHash })
  ).catch(() => {});
}

export function hashIp(ip: string): string {
  return crypto.createHash('sha256').update(ip).digest('hex').slice(0, 16);
}
