"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const MODULES = [
  { id: "phone-scams", number: 1, icon: "📞", title: "Phone & Grandparent Scams", subtitle: "How to spot fake emergency calls", audiences: ["Seniors", "Parents"], ready: true },
  { id: "bank-cra-scams", number: 2, icon: "🏦", title: "Bank & CRA Impersonation", subtitle: "When 'your bank' isn't really your bank", audiences: ["Seniors", "Parents"], ready: true },
  { id: "tech-support-scams", number: 3, icon: "💻", title: "Tech Support & Fake Warnings", subtitle: "Those scary pop-ups are lying to you", audiences: ["Seniors", "Parents", "Teens"], ready: true },
  { id: "romance-scams", number: 4, icon: "💔", title: "Romance & Friendship Scams", subtitle: "When online love turns into a trap", audiences: ["Seniors", "Parents"], ready: false },
  { id: "too-good-to-be-true", number: 5, icon: "🎰", title: "Lotteries, Fake Jobs & Crypto", subtitle: "If it sounds too good to be true...", audiences: ["All"], ready: false },
  { id: "phishing", number: 6, icon: "🎣", title: "Phishing Emails, Texts & Fake Sites", subtitle: "Don't click that link", audiences: ["All"], ready: false },
  { id: "social-media", number: 7, icon: "📱", title: "Social Media Red Flags", subtitle: "Protecting yourself online", audiences: ["Teens", "Parents"], ready: false },
  { id: "what-to-do", number: 8, icon: "🆘", title: "What to Do If You're Scammed", subtitle: "Emergency steps to protect yourself", audiences: ["All"], ready: true },
];

export default function AcademyPage() {
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("tc-academy-progress");
      if (stored) setCompleted(JSON.parse(stored).modulesViewed ?? []);
    } catch { /* */ }
  }, []);

  const completedCount = completed.length;

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
      {completedCount > 0 && (
        <div className="p-4 rounded-xl border" style={{ borderColor: "var(--tc-safe)", background: "#eafaf1" }}>
          <p className="font-semibold" style={{ color: "var(--tc-safe)" }}>
            ✅ You've completed {completedCount} of {MODULES.length} modules
          </p>
          <div className="mt-2 h-3 rounded-full overflow-hidden" style={{ background: "var(--tc-border)" }}>
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${(completedCount / MODULES.length) * 100}%`, background: "var(--tc-safe)" }}
            />
          </div>
        </div>
      )}

      {/* Info box */}
      <div className="p-4 rounded-xl border" style={{ borderColor: "var(--tc-accent)", background: "#eaf2f8" }}>
        <p className="text-sm" style={{ color: "var(--tc-text-main)" }}>
          💡 <strong>Each module takes 5-10 minutes</strong> and includes a short video, key takeaways,
          an interactive quiz, and a printable checklist you can keep by your computer or phone.
          Modules work on their own or in order.
        </p>
      </div>

      {/* Module Grid */}
      <div className="flex flex-col gap-3">
        {MODULES.map((mod) => {
          const isCompleted = completed.includes(mod.id);
          return (
            <Link
              key={mod.id}
              href={mod.ready ? `/academy/${mod.id}` : "#"}
              className={`p-4 rounded-xl border flex items-start gap-4 transition-all ${mod.ready ? "cursor-pointer hover:shadow-md" : "opacity-60 cursor-not-allowed"}`}
              style={{ borderColor: isCompleted ? "var(--tc-safe)" : "var(--tc-border)", background: "var(--tc-surface)" }}
              onClick={(e) => { if (!mod.ready) e.preventDefault(); }}
            >
              <span className="text-3xl">{mod.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "var(--tc-primary-soft)", color: "var(--tc-primary)" }}>
                    Module {mod.number}
                  </span>
                  {isCompleted && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "#eafaf1", color: "var(--tc-safe)" }}>
                      ✅ Completed
                    </span>
                  )}
                  {!mod.ready && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "#fef9e7", color: "var(--tc-warning)" }}>
                      Coming Soon
                    </span>
                  )}
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
              {mod.ready && <span style={{ color: "var(--tc-text-muted)" }}>→</span>}
            </Link>
          );
        })}
      </div>

      {/* Partnership note */}
      <div className="p-4 rounded-xl border text-center" style={{ borderColor: "var(--tc-border)", background: "var(--tc-surface)" }}>
        <p className="text-sm" style={{ color: "var(--tc-text-muted)" }}>
          🇨🇦 The TrustChekr Online Safety Academy is a free public-service initiative.
          We're seeking partnerships with <strong>CARP</strong>, school boards, and government consumer protection agencies
          to bring this training to every Canadian who needs it.
        </p>
        <p className="text-sm mt-2" style={{ color: "var(--tc-text-muted)" }}>
          Interested in partnering? Contact us at <strong>partnerships@trustchekr.com</strong>
        </p>
      </div>
    </div>
  );
}
