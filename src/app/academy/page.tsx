"use client";

import Link from "next/link";
import { useAcademyProgress } from "@/hooks/useAcademyProgress";
import { slugToModuleId } from "@/lib/academy/progress";
import { CertificateGenerator } from "@/components/academy/CertificateGenerator";
import type { ModuleCompletionStatus } from "@/lib/academy/progress";

const MODULES = [
  { id: "phone-scams", number: 1, title: "Phone & Grandparent Scams", subtitle: "Spot fake emergency calls and CRA threats", audiences: ["Seniors", "Parents"] },
  { id: "bank-cra-scams", number: 2, title: "Bank & Government Impersonation", subtitle: "When 'your bank' or 'the CRA' isn't who they say", audiences: ["Seniors", "Parents"] },
  { id: "tech-support-scams", number: 3, title: "Tech Support & Fake Virus Warnings", subtitle: "Those scary pop-ups are lying to you", audiences: ["Seniors", "Parents", "Teens"] },
  { id: "romance-scams", number: 4, title: "Romance & Friendship Scams", subtitle: "When online love turns into a financial trap", audiences: ["Seniors", "Parents"] },
  { id: "too-good-to-be-true", number: 5, title: "Lotteries, Fake Jobs & Crypto", subtitle: "If it sounds too good to be true...", audiences: ["All"] },
  { id: "phishing", number: 6, title: "Phishing Emails, Texts & Fake Sites", subtitle: "Don't click that link", audiences: ["All"] },
  { id: "social-media", number: 7, title: "Social Media Red Flags", subtitle: "Protecting yourself online", audiences: ["Teens", "Parents"] },
  { id: "what-to-do", number: 8, title: "What to Do If You're Scammed", subtitle: "Emergency steps to protect yourself", audiences: ["All"] },
];

function StatusPill({ status }: { status: ModuleCompletionStatus }) {
  const config = {
    not_started: { label: "Not started", bg: "var(--tc-surface)", color: "var(--tc-text-muted)", border: "var(--tc-border)" },
    in_progress: { label: "In progress", bg: "#fef9e7", color: "var(--tc-warning)", border: "var(--tc-warning)" },
    completed: { label: "Completed", bg: "#eafaf1", color: "var(--tc-safe)", border: "var(--tc-safe)" },
  }[status];

  return (
    <span className="text-xs font-semibold px-2 py-0.5 rounded-full border"
      style={{ background: config.bg, color: config.color, borderColor: config.border }}>
      {config.label}
    </span>
  );
}

export default function AcademyPage() {
  const { progress } = useAcademyProgress();

  const completedCount = progress
    ? Object.values(progress.modules).filter((s) => s === "completed").length
    : 0;
  const inProgressCount = progress
    ? Object.values(progress.modules).filter((s) => s === "in_progress").length
    : 0;
  const totalModules = MODULES.length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--tc-text-main)' }}>Safety Academy</h1>
        <p className="mt-1" style={{ color: 'var(--tc-text-muted)' }}>
          8 free modules on recognizing scams. 5–10 minutes each. Built for seniors, parents, and teens.
        </p>
      </div>

      {/* Progress bar */}
      {(completedCount > 0 || inProgressCount > 0) && (
        <div>
          <div className="flex items-center justify-between mb-1.5 text-sm">
            <span style={{ color: 'var(--tc-text-main)' }}>
              {completedCount === totalModules
                ? "All modules completed"
                : `${completedCount} of ${totalModules} completed`}
            </span>
            {inProgressCount > 0 && (
              <span style={{ color: 'var(--tc-text-muted)' }}>{inProgressCount} in progress</span>
            )}
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--tc-border)' }}>
            <div className="h-full rounded-full transition-all"
              style={{
                width: `${((completedCount + inProgressCount * 0.3) / totalModules) * 100}%`,
                background: completedCount > 0 ? 'var(--tc-safe)' : 'var(--tc-primary)',
              }} />
          </div>
        </div>
      )}

      {/* Module list */}
      <div className="flex flex-col gap-2">
        {MODULES.map((mod) => {
          const moduleId = slugToModuleId(mod.id);
          const status: ModuleCompletionStatus = moduleId && progress
            ? (progress.modules[moduleId] ?? "not_started")
            : "not_started";

          return (
            <Link key={mod.id} href={`/academy/${mod.id}`}
              className="p-4 rounded-lg border flex items-center gap-4 transition-colors"
              style={{
                borderColor: status === 'completed' ? 'var(--tc-safe)' : status === 'in_progress' ? 'var(--tc-warning)' : 'var(--tc-border)',
                background: 'var(--tc-surface)',
              }}>
              <span className="text-sm font-bold w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: status === 'completed' ? 'var(--tc-safe)' : 'var(--tc-primary)',
                  color: 'white',
                }}>
                {status === 'completed' ? '✓' : mod.number}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm truncate" style={{ color: 'var(--tc-text-main)' }}>{mod.title}</h3>
                  {status !== 'not_started' && <StatusPill status={status} />}
                </div>
                <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--tc-text-muted)' }}>{mod.subtitle}</p>
              </div>
              <span className="text-sm" style={{ color: 'var(--tc-text-muted)' }}>→</span>
            </Link>
          );
        })}
      </div>

      {/* Certificate */}
      <CertificateGenerator completedModules={completedCount} />

      {/* Partnership — one line */}
      <p className="text-xs text-center" style={{ color: 'var(--tc-text-muted)' }}>
        The Safety Academy is a free public-service initiative by 17734344 Canada Inc.
        Partnership inquiries: <a href="mailto:partnerships@trustchekr.com" style={{ color: 'var(--tc-primary)' }}>partnerships@trustchekr.com</a>
      </p>
    </div>
  );
}
