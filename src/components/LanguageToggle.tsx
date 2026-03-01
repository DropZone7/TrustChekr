"use client";

import { useLocale } from "@/lib/i18n";

export default function LanguageToggle() {
  const { locale, setLocale } = useLocale();

  const toggle = () => {
    const next = locale === "en" ? "fr" : "en";
    setLocale(next);
    try { localStorage.setItem("tc-locale", next); } catch {}
  };

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${locale === "en" ? "French" : "English"}`}
      style={{
        background: "none",
        border: "1px solid var(--tc-border)",
        borderRadius: "4px",
        padding: "4px 10px",
        cursor: "pointer",
        fontSize: "13px",
        color: "var(--tc-text-main)",
        display: "flex",
        gap: "4px",
      }}
    >
      <span style={{ fontWeight: locale === "en" ? 700 : 400 }}>EN</span>
      <span style={{ color: "var(--tc-text-muted)" }}>|</span>
      <span style={{ fontWeight: locale === "fr" ? 700 : 400 }}>FR</span>
    </button>
  );
}
