import { supabaseServer } from '@/lib/supabase/server';
import type { ScamPattern } from '@/lib/scamIntel/types';
import { mapRowToScamPattern } from '@/lib/scamIntel/supabaseMapper';
import { ACADEMY_MODULES, type AcademyModuleId } from '@/lib/academy/modules';
import Link from 'next/link';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

const ADMIN_TOKEN = process.env.TC_ADMIN_TOKEN;

type UserReportRow = {
  id: string;
  created_at: string;
  source_page: string;
  source_ref: string;
  reporter_email: string | null;
  report_type: string;
  message: string;
};

async function getScamPatterns(): Promise<ScamPattern[]> {
  const { data, error } = await supabaseServer
    .from('scam_patterns')
    .select(
      'id, name, category, region, primary_targets, short_description, how_it_works, red_flags, official_sources, severity, relevance_to_trustchekr, academy_modules_impacted, last_updated, recommended_ui_messaging'
    )
    .order('last_updated', { ascending: false });

  if (error || !data) {
    console.error('getScamPatterns error', error);
    return [];
  }
  return (data as any[]).map(mapRowToScamPattern);
}

async function getRecentReports(limit = 30): Promise<UserReportRow[]> {
  const { data, error } = await supabaseServer
    .from('user_reports')
    .select('id, created_at, source_page, source_ref, reporter_email, report_type, message')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error || !data) {
    console.error('getRecentReports error', error);
    return [];
  }
  return data as UserReportRow[];
}

const severityColors: Record<string, { bg: string; text: string; border: string }> = {
  critical: { bg: '#fee2e2', text: '#991b1b', border: '#fecaca' },
  high:     { bg: '#ffedd5', text: '#9a3412', border: '#fed7aa' },
  medium:   { bg: '#fef3c7', text: '#92400e', border: '#fde68a' },
  low:      { bg: '#d1fae5', text: '#065f46', border: '#a7f3d0' },
  info:     { bg: '#e0f2fe', text: '#0369a1', border: '#bae6fd' },
};

export default async function ScamIntelAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Auth gate: requires ?k=<secret> to access
  const params = await searchParams;
  const providedToken = params.k;
  if (!ADMIN_TOKEN || providedToken !== ADMIN_TOKEN) {
    redirect('/');
  }

  const [scams, reports] = await Promise.all([
    getScamPatterns(),
    getRecentReports(),
  ]);

  const scamReports = reports.filter((r) => r.report_type === 'suspected_scam');
  const feedbackReports = reports.filter((r) => r.report_type === 'feedback');

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8">
      {/* Header */}
      <header>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--tc-primary)' }}>
            🛡️ Scam Intel Dashboard
          </h1>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: '#fef3c7', color: '#92400e' }}>
            INTERNAL
          </span>
        </div>
        <p className="text-sm" style={{ color: 'var(--tc-text-muted)' }}>
          Scam patterns, user reports, and intel at a glance.
        </p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Scam Patterns', value: scams.length, icon: '🎯' },
          { label: 'Critical/High', value: scams.filter((s) => s.severity === 'critical' || s.severity === 'high').length, icon: '🔴' },
          { label: 'Scam Reports', value: scamReports.length, icon: '📝' },
          { label: 'Feedback', value: feedbackReports.length, icon: '💬' },
        ].map((stat, i) => (
          <div key={i} className="p-4 rounded-xl border text-center" style={{ borderColor: 'var(--tc-border)', background: 'var(--tc-surface)' }}>
            <p className="text-2xl">{stat.icon}</p>
            <p className="text-2xl font-bold" style={{ color: 'var(--tc-primary)' }}>{stat.value}</p>
            <p className="text-xs" style={{ color: 'var(--tc-text-muted)' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Scam Patterns Table */}
      <section>
        <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--tc-text-main)' }}>
          🎯 Scam Patterns ({scams.length})
        </h2>
        {scams.length === 0 ? (
          <p className="text-sm p-4 rounded-xl border" style={{ borderColor: 'var(--tc-border)', color: 'var(--tc-text-muted)' }}>
            No scam patterns in database yet. Add them via Supabase SQL Editor.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {scams.map((scam) => {
              const sc = severityColors[scam.severity] ?? severityColors.medium;
              return (
                <div
                  key={scam.id}
                  className="p-4 rounded-xl border flex flex-col md:flex-row md:items-center gap-3"
                  style={{ borderColor: 'var(--tc-border)', background: 'var(--tc-surface)' }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Link
                        href={`/safety/scams/${scam.id}`}
                        className="font-semibold underline"
                        style={{ color: 'var(--tc-primary)' }}
                      >
                        {scam.name}
                      </Link>
                      <span
                        className="inline-flex items-center rounded border px-1.5 py-0.5 text-xs font-semibold"
                        style={{ background: sc.bg, color: sc.text, borderColor: sc.border }}
                      >
                        {scam.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm" style={{ color: 'var(--tc-text-muted)' }}>
                      {scam.short_description}
                    </p>
                  </div>

                  <div className="flex flex-col gap-1 text-xs md:text-right" style={{ color: 'var(--tc-text-muted)' }}>
                    <span>{scam.category.toUpperCase()} · {scam.region.toUpperCase()}</span>
                    <span>Updated: {new Date(scam.last_updated).toLocaleDateString()}</span>
                    <span>Targets: {scam.primary_targets.join(', ')}</span>
                    <div className="flex gap-1 flex-wrap md:justify-end">
                      {scam.academy_modules_impacted.map((mod) => {
                        const meta = ACADEMY_MODULES[mod as AcademyModuleId];
                        return meta ? (
                          <span key={mod} className="px-1.5 py-0.5 rounded text-xs" style={{ background: 'var(--tc-primary-soft)', color: 'var(--tc-primary)' }}>
                            {meta.title}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* User Reports */}
      <section>
        <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--tc-text-main)' }}>
          📝 Recent User Reports ({reports.length})
        </h2>
        {reports.length === 0 ? (
          <p className="text-sm p-4 rounded-xl border" style={{ borderColor: 'var(--tc-border)', color: 'var(--tc-text-muted)' }}>
            No user reports yet. Reports submitted via the site will appear here.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {reports.map((report) => (
              <div
                key={report.id}
                className="p-4 rounded-xl border"
                style={{ borderColor: 'var(--tc-border)', background: 'var(--tc-surface)' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="inline-flex items-center rounded px-1.5 py-0.5 text-xs font-semibold"
                    style={{
                      background: report.report_type === 'suspected_scam' ? '#fee2e2' : '#e0f2fe',
                      color: report.report_type === 'suspected_scam' ? '#991b1b' : '#0369a1',
                    }}
                  >
                    {report.report_type === 'suspected_scam' ? '🚨 SCAM REPORT' : '💬 FEEDBACK'}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--tc-text-muted)' }}>
                    {new Date(report.created_at).toLocaleString()}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--tc-text-muted)' }}>
                    from: {report.source_page}/{report.source_ref}
                  </span>
                </div>
                <p className="text-sm" style={{ color: 'var(--tc-text-main)' }}>
                  {report.message}
                </p>
                {report.reporter_email && (
                  <p className="text-xs mt-1" style={{ color: 'var(--tc-text-muted)' }}>
                    Contact: {report.reporter_email}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--tc-text-main)' }}>⚡ Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-xl border text-center hover:shadow-sm transition-all"
            style={{ borderColor: 'var(--tc-border)', background: 'var(--tc-surface)' }}
          >
            <p className="text-2xl mb-1">🗄️</p>
            <p className="font-medium" style={{ color: 'var(--tc-primary)' }}>Supabase Dashboard</p>
            <p className="text-xs" style={{ color: 'var(--tc-text-muted)' }}>Add/edit scam patterns directly</p>
          </a>
          <Link
            href="/academy"
            className="p-4 rounded-xl border text-center hover:shadow-sm transition-all"
            style={{ borderColor: 'var(--tc-border)', background: 'var(--tc-surface)' }}
          >
            <p className="text-2xl mb-1">🎓</p>
            <p className="font-medium" style={{ color: 'var(--tc-primary)' }}>Academy</p>
            <p className="text-xs" style={{ color: 'var(--tc-text-muted)' }}>View live modules</p>
          </Link>
          <a
            href="https://github.com/DropZone7/TrustChekr"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-xl border text-center hover:shadow-sm transition-all"
            style={{ borderColor: 'var(--tc-border)', background: 'var(--tc-surface)' }}
          >
            <p className="text-2xl mb-1">📦</p>
            <p className="font-medium" style={{ color: 'var(--tc-primary)' }}>GitHub Repo</p>
            <p className="text-xs" style={{ color: 'var(--tc-text-muted)' }}>View code and deployments</p>
          </a>
        </div>
      </section>

      <p className="text-xs text-center" style={{ color: 'var(--tc-text-muted)' }}>
        🔒 Authenticated session. Do not share this URL.
      </p>
    </div>
  );
}
