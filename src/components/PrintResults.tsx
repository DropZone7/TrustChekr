"use client";

import type { ScanResult } from "@/lib/types";
import { riskConfig } from "@/lib/types";

export default function PrintResults({ result }: { result: ScanResult }) {
  const risk = riskConfig[result.riskLevel];

  const handlePrint = () => {
    const printContent = `
TRUSTCHEKR SCAM CHECK RESULTS
==============================

We checked: ${result.inputValue}

Risk Level: ${risk.label.toUpperCase()}

Why we think this:
${result.whyBullets.map((b) => `  • ${b}`).join("\n")}

What you should do now:
${result.nextSteps.map((s) => `  → ${s}`).join("\n")}

Where to report:
${result.reportTo.map((r) => `  📞 ${r}`).join("\n")}

Good to know:
  ${result.educationalTip}

DISCLAIMER: TrustChekr helps spot patterns, not guarantees. This is informational only — not legal or financial advice. If you are unsure, do not send money and contact your bank or local authorities.

Checked with TrustChekr — trustchekr.com
    `.trim();

    const w = window.open("", "_blank");
    if (w) {
      w.document.write(`
        <html><head><title>TrustChekr Results</title>
        <style>
          body { font-family: system-ui, sans-serif; padding: 40px; max-width: 600px; margin: 0 auto; line-height: 1.8; font-size: 16px; }
          pre { white-space: pre-wrap; word-wrap: break-word; }
        </style></head>
        <body><pre>${printContent}</pre></body></html>
      `);
      w.document.close();
      w.print();
    }
  };

  const handleEmail = () => {
    const subject = encodeURIComponent("TrustChekr Scam Check Results");
    const body = encodeURIComponent(
      `I checked something with TrustChekr and wanted to share the results:\n\n` +
      `Risk Level: ${risk.label}\n\n` +
      `What was checked: ${result.inputValue}\n\n` +
      `Key findings:\n${result.whyBullets.map((b) => `• ${b}`).join("\n")}\n\n` +
      `What to do:\n${result.nextSteps.map((s) => `→ ${s}`).join("\n")}\n\n` +
      `Check something yourself at trustchekr.com`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={handlePrint}
        className="flex-1 py-3 rounded-xl border-2 font-medium cursor-pointer flex items-center justify-center gap-2"
        style={{ borderColor: "var(--tc-border)", color: "var(--tc-text-main)", background: "var(--tc-surface)" }}
      >
        🖨️ Print these steps
      </button>
      <button
        onClick={handleEmail}
        className="flex-1 py-3 rounded-xl border-2 font-medium cursor-pointer flex items-center justify-center gap-2"
        style={{ borderColor: "var(--tc-border)", color: "var(--tc-text-main)", background: "var(--tc-surface)" }}
      >
        ✉️ Email these steps
      </button>
    </div>
  );
}
