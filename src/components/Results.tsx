"use client";

import { useState } from "react";
import type { ScanResult } from "@/lib/types";
import { riskConfig } from "@/lib/types";
import PrintResults from "./PrintResults";

export default function Results({ result, onReset }: { result: ScanResult; onReset: () => void }) {
  const [showTechnical, setShowTechnical] = useState(false);
  const [copied, setCopied] = useState(false);
  const risk = riskConfig[result.riskLevel];

  const handleCopy = () => {
    navigator.clipboard.writeText(result.shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Empathy line */}
      <p className="text-center" style={{ color: "var(--tc-text-muted)" }}>
        You did the right thing by checking. Here's what we found.
      </p>

      {/* What we checked */}
      <div
        className="p-4 rounded-xl border"
        style={{ borderColor: "var(--tc-border)", background: "var(--tc-surface)" }}
      >
        <p className="text-sm font-medium" style={{ color: "var(--tc-text-muted)" }}>
          We checked this for you:
        </p>
        <p className="mt-1 font-semibold break-all" style={{ color: "var(--tc-text-main)" }}>
          {result.inputValue}
        </p>
      </div>

      {/* Risk badge */}
      <div
        className="p-5 rounded-xl border-2 text-center"
        style={{ borderColor: risk.border, background: risk.bg }}
      >
        <p className="text-2xl font-bold" style={{ color: risk.color }}>
          {risk.label}
        </p>
      </div>

      {/* Why we think this */}
      <section>
        <h2 className="text-lg font-bold mb-2" style={{ color: "var(--tc-text-main)" }}>
          Why we think this
        </h2>
        <ul className="flex flex-col gap-2">
          {result.whyBullets.map((b, i) => (
            <li key={i} className="flex gap-2">
              <span style={{ color: risk.color }}>•</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* What you should do now */}
      <section>
        <h2 className="text-lg font-bold mb-2" style={{ color: "var(--tc-text-main)" }}>
          What you should do now
        </h2>
        <ul className="flex flex-col gap-2">
          {result.nextSteps.map((s, i) => (
            <li key={i} className="flex gap-2">
              <span>👉</span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Where to report */}
      <section>
        <h2 className="text-lg font-bold mb-2" style={{ color: "var(--tc-text-main)" }}>
          Where to report
        </h2>
        <ul className="flex flex-col gap-2">
          {result.reportTo.map((r, i) => (
            <li key={i} className="flex gap-2">
              <span>📞</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Educational tip */}
      <div
        className="p-4 rounded-xl border"
        style={{ borderColor: "var(--tc-accent)", background: "#eaf2f8" }}
      >
        <p className="font-semibold mb-1" style={{ color: "var(--tc-accent)" }}>💡 Good to know</p>
        <p>{result.educationalTip}</p>
      </div>

      {/* Technical details (collapsed) */}
      <button
        onClick={() => setShowTechnical(!showTechnical)}
        className="text-sm underline self-start cursor-pointer"
        style={{ color: "var(--tc-text-muted)" }}
      >
        {showTechnical ? "Hide" : "Show"} technical details (for experts and helpers)
      </button>
      {showTechnical && (
        <div className="p-4 rounded-xl border text-sm" style={{ borderColor: "var(--tc-border)", color: "var(--tc-text-muted)" }}>
          <p>Input type: {result.inputType}</p>
          <p>Modules checked: URL analysis, domain age, reputation databases, pattern matching</p>
          <p>Signals matched: {result.whyBullets.length} indicators</p>
        </div>
      )}

      {/* Print / Email */}
      <PrintResults result={result} />

      {/* Save someone else */}
      <div className="p-4 rounded-xl border" style={{ borderColor: "var(--tc-border)", background: "var(--tc-surface)" }}>
        <p className="font-semibold mb-2" style={{ color: "var(--tc-text-main)" }}>
          🛡️ Save someone else — share this result
        </p>
        <p className="text-sm mb-3" style={{ color: "var(--tc-text-muted)" }}>
          {result.shareText}
        </p>
        <button
          onClick={handleCopy}
          className="px-4 py-2 rounded-lg border text-sm font-medium cursor-pointer"
          style={{ borderColor: "var(--tc-primary)", color: "var(--tc-primary)" }}
        >
          {copied ? "✅ Copied!" : "Copy to share"}
        </button>
      </div>

      {/* Disclaimer */}
      <p className="text-sm text-center" style={{ color: "var(--tc-text-muted)" }}>
        TrustChekr helps spot patterns, not guarantees. This is informational only — not legal or financial advice.
        If you are unsure, do not send money and consider contacting your bank or local authorities.
      </p>

      {/* Start over */}
      <button
        onClick={onReset}
        className="w-full py-4 rounded-xl text-lg font-semibold border-2 cursor-pointer transition-all"
        style={{ borderColor: "var(--tc-primary)", color: "var(--tc-primary)", background: "var(--tc-surface)" }}
      >
        Start a new check
      </button>
    </div>
  );
}
