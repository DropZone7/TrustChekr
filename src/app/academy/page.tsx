"use client";

import Link from "next/link";
import { useAcademyProgress } from "@/hooks/useAcademyProgress";
import { slugToModuleId } from "@/lib/academy/progress";
import type { ModuleCompletionStatus } from "@/lib/academy/progress";

const MODULES = [
  { id: "phone-scams", number: 1, icon: "📞", title: "Phone & Grandparent Scams", subtitle: "How to spot fake emergency calls", audiences: ["Seniors", "Parents"] },
  { id: "bank-cra-scams", number: 2, icon: "🏦", title: "Bank & Government Impersonation", subtitle: "When 'your bank' or 'the CRA' isn't who they say they are", audiences: ["Seniors", "Parents"] },
  { id: "tech-support-scams", number: 3, icon: "💻", title: "Tech Support & Fake Virus Warnings", subtitle: "Those scary pop-ups are lying to you", audiences: ["Seniors", "Parents", "Teens"] },
  { id: "romance-scams", number: 4, icon: "💔", title: "Romance & Friendship Scams", subtitle: "When online love turns into a trap", audiences: ["Seniors", "Parents"] },
  { id: "too-good-to-be-true", number: 5, icon: "🎰", title: "Lotteries, Fake Jobs & Crypto", subtitle: "If it sounds too good to be true...", audiences: ["All"] },
  { id: "phishing", number: 6, icon: "🎣", title: "Phishing Emails, Texts & Fake Sites", subtitle: "Don't click that link", audiences: ["All"] },
  { id: "social-media", number: 7, icon: "📱", title: "Social Media Red Flags", subtitle: "Protecting yourself online", audiences: ["Teens", "Parents"] },
  { id: "what-to-do", number: 8, icon: "🆘", title: "What to Do If You're Scammed", subtitle: "Emergency steps to protect yourself", audiences: ["All"] },
];

function StatusPill({ status }: { status: ModuleCompletionStatus }) {
  const config = {
    not_started: { label: "Not started", bg: "var(--tc-surface)", color: "var(--tc-text-muted)", border: "var(--tc-border)" },
    in_progress: { label: "In progress", bg: "#fef9e7", color: "var(--tc-warning)", border: "var(--tc-warning)" },
    completed: { label: "✅ Completed", bg: "#eafaf1", color: "var(--tc-safe)", border: "var(--tc-safe)" },
  }[status];

  return (
    <span
      className="text-xs font-bold px-2 py-0.5 rounded-full border"
      style={{ background: config.bg, color: config.color, borderColor: config.border }}
    >
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
      {/* Hero */}
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--tc-primary)" }}>
          🎓 TrustChekr Online Safety Academy
        </h1>
        <p className="text-lg mb-1" style={{ color: "var(--tc-text-main)" }}>
          Free lessons to protect yourself and your family from online scams
        </p>
        <p style={{ color: "var(--tc-text-muted)" }}>
          Designed for seniors, parents, and teens. No sign-up required. Learn at your own pace.
        </p>
      </div>

      {/* Progress */}
      <div className="p-4 rounded-xl border" style={{ borderColor: completedCount > 0 ? "var(--tc-safe)" : "var(--tc-border)", background: completedCount > 0 ? "#eafaf1" : "var(--tc-surface)" }}>
        <div className="flex items-center justify-between mb-2">
          <p className="font-semibold" style={{ color: completedCount > 0 ? "var(--tc-safe)" : "var(--tc-text-main)" }}>
            {completedCount === 0
              ? "Start your first module below!"
              : completedCount === totalModules
                ? "🎉 You've completed all modules! Amazing work."
                : `${completedCount} of ${totalModules} modules completed`}
          </p>
          {(completedCount > 0 || inProgressCount > 0) && (
            <span className="text-xs" style={{ color: "var(--tc-text-muted)" }}>
              {inProgressCount > 0 && `${inProgressCount} in progress`}
            </span>
          )}
        </div>
        <div className="h-3 rounded-full overflow-hidden" style={{ background: "var(--tc-border)" }}>
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${((completedCount + inProgressCount * 0.3) / totalModules) * 100}%`,
              background: completedCount > 0 ? "var(--tc-safe)" : "var(--tc-primary)",
            }}
          />
        </div>
      </div>

      {/* Info box */}
      <div className="p-4 rounded-xl border" style={{ borderColor: "var(--tc-accent)", background: "#eaf2f8" }}>
        <p className="text-sm" style={{ color: "var(--tc-text-main)" }}>
          💡 <strong>Each module takes 5-10 minutes</strong> and includes a short video, key takeaways,
          an interactive quiz, and research links. Complete the quiz and click &quot;Mark as Completed&quot;
          to track your progress. Modules work on their own or in order.
        </p>
      </div>

      {/* Module Grid */}
      <div className="flex flex-col gap-3">
        {MODULES.map((mod) => {
          const moduleId = slugToModuleId(mod.id);
          const status: ModuleCompletionStatus = moduleId && progress
            ? (progress.modules[moduleId] ?? "not_started")
            : "not_started";

          return (
            <Link
              key={mod.id}
              href={`/academy/${mod.id}`}
              className="p-4 rounded-xl border flex items-start gap-4 transition-all cursor-pointer hover:shadow-md"
              style={{
                borderColor: status === "completed" ? "var(--tc-safe)" : status === "in_progress" ? "var(--tc-warning)" : "var(--tc-border)",
                background: "var(--tc-surface)",
              }}
            >
              <span className="text-3xl">{mod.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "var(--tc-primary-soft)", color: "var(--tc-primary)" }}>
                    Module {mod.number}
                  </span>
                  <StatusPill status={status} />
                </div>
                <h3 className="font-bold mt-1" style={{ color: "var(--tc-text-main)" }}>{mod.title}</h3>
                <p className="text-sm" style={{ color: "var(--tc-text-muted)" }}>{mod.subtitle}</p>
                <div className="flex gap-2 mt-2">
                  {mod.audiences.map((a) => (
                    <span key={a} className="text-xs px-2 py-0.5 rounded-full border" style={{ borderColor: "var(--tc-border)", color: "var(--tc-text-muted)" }}>
                      {a}
                    </span>
                  ))}
                </div>
              </div>
              <span style={{ color: "var(--tc-text-muted)" }}>→</span>
            </Link>
          );
        })}
      </div>

      {/* Partnership note */}
      <div className="p-4 rounded-xl border text-center" style={{ borderColor: "var(--tc-border)", background: "var(--tc-surface)" }}>
        <p className="text-sm" style={{ color: "var(--tc-text-muted)" }}>
          🇨🇦 The TrustChekr Online Safety Academy is a free public-service initiative.
          We&apos;re seeking partnerships with <strong>CARP</strong>, school boards, and government consumer protection agencies
          to bring this training to every Canadian who needs it.
        </p>
        <p className="text-sm mt-2" style={{ color: "var(--tc-text-muted)" }}>
          Interested in partnering? Contact us at <strong>partnerships@trustchekr.com</strong>
        </p>
      </div>
    </div>
  );
}
