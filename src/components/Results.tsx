"use client";

import { useState } from "react";
import type { ScanResult } from "@/lib/types";
import { riskConfig } from "@/lib/types";
import PrintResults from "./PrintResults";
import { OsintDetails } from "./OsintDetails";
import { AffiliateRecommendations } from "./AffiliateRecommendations";
import { ShareResult } from "./ShareResult";
import { FeedbackWidget } from "./FeedbackWidget";

export default function Results({ result, onReset }: { result: ScanResult; onReset: () => void }) {
  const [showTechnical, setShowTechnical] = useState(false);
  const risk = riskConfig[result.riskLevel];

  return (
    <div className="flex flex-col gap-5">
      {/* Risk badge — the answer */}
      <div className="p-4 rounded-lg text-center" style={{ borderLeft: `4px solid ${risk.border}`, background: risk.bg }}>
        <p className="text-xl font-bold" style={{ color: risk.color }}>{risk.label}</p>
        <p className="text-sm mt-1 break-all" style={{ color: "var(--tc-text-muted)" }}>{result.inputValue}</p>
      </div>

      {/* What we found */}
      <section>
        <h2 className="text-base font-semibold mb-2" style={{ color: "var(--tc-text-main)" }}>What we found</h2>
        <ul className="flex flex-col gap-1.5 text-sm">
          {result.whyBullets.map((b, i) => (
            <li key={i} className="flex gap-2">
              <span style={{ color: risk.color, fontWeight: 700, flexShrink: 0 }}>—</span>
              <span style={{ color: "var(--tc-text-main)" }}>{b}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* What to do */}
      <section>
        <h2 className="text-base font-semibold mb-2" style={{ color: "var(--tc-text-main)" }}>What to do</h2>
        <ul className="flex flex-col gap-1.5 text-sm">
          {result.nextSteps.map((s, i) => (
            <li key={i} className="flex gap-2" style={{ color: "var(--tc-text-main)" }}>
              <span style={{ color: "var(--tc-primary)", fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Report to */}
      <section>
        <h2 className="text-base font-semibold mb-2" style={{ color: "var(--tc-text-main)" }}>Where to report</h2>
        <ul className="flex flex-col gap-1 text-sm" style={{ color: "var(--tc-text-main)" }}>
          {result.reportTo.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </section>

      {/* Tip */}
      {result.educationalTip && (
        <div className="p-3 rounded-lg text-sm" style={{ background: "var(--tc-surface)", borderLeft: "3px solid var(--tc-primary)", color: "var(--tc-text-main)" }}>
          {result.educationalTip}
        </div>
      )}

      {/* Technical details */}
      <button
        onClick={() => setShowTechnical(!showTechnical)}
        className="text-xs underline self-start cursor-pointer"
        style={{ color: "var(--tc-text-muted)" }}
      >
        {showTechnical ? "Hide" : "Show"} technical details
      </button>
      {showTechnical && (
        <div className="text-xs p-3 rounded-lg" style={{ background: "var(--tc-surface)", border: "1px solid var(--tc-border)", color: "var(--tc-text-muted)" }}>
          <p>Input type: {result.inputType}</p>
          <p>Signals: {result.whyBullets.length} indicators</p>
          {(result as any).ai_detection && <p>AI probability: {Math.round((result as any).ai_detection.ai_probability * 100)}%</p>}
          {(result as any).graph && <p>Network risk: {(result as any).graph.network_risk_label}</p>}
          {(result as any).overall_risk_score !== undefined && <p>Overall score: {(result as any).overall_risk_score}</p>}
        </div>
      )}

      {/* OSINT details */}
      <OsintDetails result={result} />

      {/* Actions row */}
      <div className="flex gap-2 flex-wrap">
        <PrintResults result={result} />
        <ShareResult result={result} riskLabel={risk.label} riskColor={risk.color} />
      </div>

      {/* Feedback */}
      <FeedbackWidget scanType={result.inputType} riskLevel={result.riskLevel} />

      {/* Affiliate */}
      <AffiliateRecommendations riskLevel={result.riskLevel} scanType={result.inputType} />

      {/* Disclaimer — Moffatt-compliant */}
      <div className="text-xs p-3 rounded-lg" style={{ background: "var(--tc-surface)", border: "1px solid var(--tc-border)", color: "var(--tc-text-muted)" }}>
        <p className="font-semibold mb-1">Automated analysis only — {new Date().toLocaleDateString("en-CA")}</p>
        <p>
          This is not a guarantee of safety. No tool can detect all scams. Always verify through independent channels.
          TrustChekr provides information to support your decision-making, not legal or financial advice.
        </p>
      </div>

      {/* Start over */}
      <button
        onClick={onReset}
        className="w-full py-3 rounded-lg font-semibold border cursor-pointer transition-all text-sm"
        style={{ borderColor: "var(--tc-primary)", color: "var(--tc-primary)", background: "var(--tc-surface)" }}
      >
        Check something else
      </button>
    </div>
  );
}
