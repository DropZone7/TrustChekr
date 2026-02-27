import { supabaseServer } from '@/lib/supabase/server';
import type { ScamPattern } from '@/lib/scamIntel/types';
import { mapRowToScamPattern } from '@/lib/scamIntel/supabaseMapper';
import { scamIntelSeed } from '@/lib/scamIntel/staticData';
import Link from 'next/link';

type PageProps = { params: Promise<{ id: string }> };

const MODULE_MAP: Record<string, { slug: string; name: string }> = {
  M1_PHONE_GRANDPARENT: { slug: 'phone-scams', name: 'Phone & Grandparent Scams' },
  M2_BANK_CRA: { slug: 'bank-cra-scams', name: 'Bank & CRA Impersonation' },
  M3_TECH_SUPPORT: { slug: 'tech-support-scams', name: 'Tech Support & Fake Warnings' },
  M4_ROMANCE: { slug: 'romance-scams', name: 'Romance & Friendship Scams' },
  M5_TOO_GOOD: { slug: 'too-good-to-be-true', name: 'Lotteries, Fake Jobs & Crypto' },
  M6_PHISHING: { slug: 'phishing', name: 'Phishing Emails, Texts & Fake Sites' },
  M7_SOCIAL_MEDIA: { slug: 'social-media', name: 'Social Media Red Flags' },
  M8_WHAT_TO_DO: { slug: 'what-to-do', name: "What to Do If You're Scammed" },
};

async function getScamById(id: string): Promise<ScamPattern | null> {
  try {
    const { data, error } = await supabaseServer
      .from('scam_patterns')
      .select(
        'id, name, category, region, primary_targets, short_description, how_it_works, red_flags, official_sources, severity, relevance_to_trustchekr, academy_modules_impacted, last_updated, recommended_ui_messaging'
      )
      .eq('id', id)
      .eq('published', true)
      .limit(1)
      .maybeSingle();

    if (!error && data) return mapRowToScamPattern(data as any);
  } catch (e) {
    console.error('getScamById error', e);
  }
  // Fallback to static
  return scamIntelSeed.find((s) => s.id === id) ?? null;
}

export default async function ScamDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const scam = await getScamById(id);

  if (!scam) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="mb-4 text-xl font-semibold" style={{ color: 'var(--tc-primary)' }}>Scam not found</h1>
        <p className="mb-4 text-sm" style={{ color: 'var(--tc-text-muted)' }}>
          This scam alert may have been removed or is not available.
        </p>
        <Link href="/academy" className="text-sm underline" style={{ color: 'var(--tc-primary)' }}>
          ← Back to Academy
        </Link>
      </div>
    );
  }

  const severityColors: Record<string, { bg: string; text: string; border: string }> = {
    critical: { bg: '#fee2e2', text: '#991b1b', border: '#fecaca' },
    high:     { bg: '#ffedd5', text: '#9a3412', border: '#fed7aa' },
    medium:   { bg: '#fef3c7', text: '#92400e', border: '#fde68a' },
    low:      { bg: '#d1fae5', text: '#065f46', border: '#a7f3d0' },
    info:     { bg: '#e0f2fe', text: '#0369a1', border: '#bae6fd' },
  };
  const sc = severityColors[scam.severity] ?? severityColors.medium;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 flex flex-col gap-6">
      <Link href="/academy" className="text-sm underline" style={{ color: 'var(--tc-text-muted)' }}>
        ← Back to Academy
      </Link>

      {/* Header */}
      <header>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs uppercase tracking-wide" style={{ color: 'var(--tc-text-muted)' }}>
            Scam Alert · {scam.region.toUpperCase()} · {new Date(scam.last_updated).toLocaleDateString()}
          </span>
          <span
            className="inline-flex items-center rounded border px-1.5 py-0.5 text-xs font-semibold"
            style={{ background: sc.bg, color: sc.text, borderColor: sc.border }}
          >
            {scam.severity.toUpperCase()}
          </span>
        </div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--tc-primary)' }}>{scam.name}</h1>
        <p className="mt-2" style={{ color: 'var(--tc-text-muted)' }}>{scam.short_description}</p>
      </header>

      {/* Targets */}
      <section>
        <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--tc-text-main)' }}>👥 Who is targeted?</h2>
        <div className="flex gap-2 flex-wrap">
          {scam.primary_targets.map((t, i) => (
            <span key={i} className="px-3 py-1 rounded-full text-sm font-medium" style={{ background: 'var(--tc-primary-soft)', color: 'var(--tc-primary)' }}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </span>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section>
        <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--tc-text-main)' }}>⚙️ How it works</h2>
        <div className="flex flex-col gap-2">
          {scam.how_it_works.map((step, i) => (
            <div key={i} className="flex gap-3 p-3 rounded-lg border" style={{ borderColor: 'var(--tc-border)', background: 'var(--tc-surface)' }}>
              <span className="font-bold" style={{ color: 'var(--tc-primary)' }}>{i + 1}</span>
              <span>{step}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Red flags */}
      <section>
        <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--tc-text-main)' }}>🚩 Red flags</h2>
        <div className="flex flex-col gap-2">
          {scam.red_flags.map((flag, i) => (
            <div key={i} className="flex gap-3 p-3 rounded-lg border" style={{ borderColor: '#e74c3c', background: '#fdedec' }}>
              <span>⚠️</span>
              <span>{flag}</span>
            </div>
          ))}
        </div>
      </section>

      {/* What you should do */}
      <section className="p-4 rounded-xl border-2" style={{ borderColor: 'var(--tc-safe)', background: '#eafaf1' }}>
        <h2 className="font-bold mb-2" style={{ color: 'var(--tc-safe)' }}>🛡️ What you should do</h2>
        <p>{scam.recommended_ui_messaging}</p>
        {scam.academy_modules_impacted.includes('M8_WHAT_TO_DO') && (
          <p className="mt-2 text-sm">
            For step-by-step guidance, see our{' '}
            <Link href="/academy/what-to-do" className="underline" style={{ color: 'var(--tc-primary)' }}>
              &quot;What to Do If You&apos;re Scammed&quot;
            </Link>{' '}
            module.
          </p>
        )}
      </section>

      {/* Official sources */}
      {scam.official_sources.length > 0 && (
        <section>
          <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--tc-text-main)' }}>📄 Official sources</h2>
          <div className="flex flex-col gap-2">
            {scam.official_sources.map((src, i) => (
              <a
                key={i}
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg border hover:shadow-sm transition-all"
                style={{ borderColor: 'var(--tc-border)', background: 'var(--tc-surface)' }}
              >
                <span>🔗</span>
                <span className="font-medium" style={{ color: 'var(--tc-primary)' }}>{src.name}</span>
                <span className="ml-auto text-sm" style={{ color: 'var(--tc-text-muted)' }}>→</span>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Academy modules */}
      {scam.academy_modules_impacted.length > 0 && (
        <section>
          <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--tc-text-main)' }}>🎓 Learn more in the Academy</h2>
          <div className="flex flex-col gap-2">
            {scam.academy_modules_impacted.map((mod) => {
              const m = MODULE_MAP[mod];
              if (!m) return null;
              return (
                <Link
                  key={mod}
                  href={`/academy/${m.slug}`}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:shadow-sm transition-all"
                  style={{ borderColor: 'var(--tc-border)', background: 'var(--tc-surface)' }}
                >
                  <span>📚</span>
                  <span className="font-medium" style={{ color: 'var(--tc-primary)' }}>{m.name}</span>
                  <span className="ml-auto text-sm" style={{ color: 'var(--tc-text-muted)' }}>→</span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Disclaimer */}
      <p className="text-xs text-center" style={{ color: 'var(--tc-text-muted)' }}>
        This scam alert is provided as a public service by TrustChekr. It is not legal or financial advice.
        If you believe you are a victim, contact CAFC at 1-888-495-8501.
      </p>
    </div>
  );
}
