"use client";

import { useState } from "react";
import ScanForm from "@/components/ScanForm";
import Results from "@/components/Results";
import type { ScanResult } from "@/lib/types";
import { ScanProgress } from "@/components/ScanProgress";
import { ScanHistory, addToHistory } from "@/components/ScanHistory";
import { NewsletterForm } from "@/components/NewsletterForm";
import ScamRadar from "@/components/ScamRadar";

export default function Home() {
  const [result, setResult] = useState<ScanResult | null>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async (type: string, input: string, botProfile?: any) => {
    setScanning(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, input, botProfile }),
      });
      const data = await res.json();

      if (data.warning) { setError(data.message); setScanning(false); return; }
      if (data.error) { setError(data.error); setScanning(false); return; }
      setResult(data);
      addToHistory(input, type, data.riskLevel);
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setScanning(false);
  };

  const handleReset = () => { setResult(null); setScanning(false); };

  return (
    <div className="flex flex-col gap-6">
      {!result && !scanning && (
        <>
          {/* Hero — scan form is THE thing */}
          <div className="text-center pt-2">
            <h1 className="text-3xl font-bold tracking-tight" style={{ color: "var(--tc-text-main)" }}>
              Think it might be a scam?
            </h1>
            <p className="mt-2 text-base" style={{ color: "var(--tc-text-muted)" }}>
              Paste it below — or just upload a screenshot. No need to click any sketchy links.
              <br />
              <span style={{ fontSize: "0.85rem" }}>Free. Private. No account needed.</span>
              <br />
              <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--tc-text-main)" }}>What would you like to check?</span>
            </p>
          </div>

          <ScanForm onScan={handleScan} />

          {/* Quiet stat — not a screaming ticker */}
          <p className="text-center text-sm" style={{ color: "var(--tc-text-muted)" }}>
            Canadians lost <strong style={{ color: "var(--tc-text-main)" }}>$638 million</strong> to
            fraud in 2024, and only 5–10% of victims report it.
            <br />
            <span style={{ fontSize: "0.78rem", opacity: 0.7 }}>
              Source: Canadian Anti-Fraud Centre 2024 Annual Report
            </span>
          </p>

          {/* Scam Radar — live threat levels */}
          <div className="text-center">
            <p className="text-sm" style={{ color: "var(--tc-text-muted)", lineHeight: 1.6 }}>
              This is our <strong style={{ color: "var(--tc-text-main)" }}>Scam Radar</strong> — it monitors
              what people across North America are reporting right now, so you can see which scams are active
              today. If something you received matches a trend below, that&apos;s a red flag. We update this
              throughout the day so you always know what to watch out for.
            </p>
          </div>
          <ScamRadar />

          {/* Quick Lookup */}
          <div className="p-4 rounded-lg" style={{ background: 'var(--tc-surface)', border: '1px solid var(--tc-border)' }}>
            <p className="font-semibold text-sm mb-2" style={{ color: 'var(--tc-text-main)' }}>
              Quick Lookup — check a phone number, email, or URL
            </p>
            <a href="/tools/lookup" className="block w-full py-3 rounded-lg text-center text-sm font-medium"
              style={{ background: 'var(--tc-primary-soft)', color: 'var(--tc-primary)', textDecoration: 'none' }}>
              Open Scam Lookup →
            </a>
          </div>

          {/* Recent checks */}
          <ScanHistory onRescan={handleScan} />

          {/* What we check — replaces generic "how it works" */}
          <div className="pt-4">
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--tc-text-main)" }}>
              What we check
            </h2>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[
                "Phishing & malware databases",
                "Known scam phone patterns",
                "Domain age & registration",
                "Crypto wallet risk signals",
                "AI-generated text detection",
                "Romance scam indicators",
                "Spam keyword analysis",
                "Brand impersonation",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2 py-1.5 px-2 rounded" style={{ background: "var(--tc-surface)" }}>
                  <span style={{ color: "var(--tc-primary)", fontWeight: 700, flexShrink: 0 }}>—</span>
                  <span style={{ color: "var(--tc-text-main)" }}>{item}</span>
                </div>
              ))}
            </div>
            <p className="text-xs mt-2" style={{ color: "var(--tc-text-muted)" }}>
              Results in seconds. <a href="/trust-score" className="underline">See how scoring works →</a>
            </p>
          </div>

          {/* Latest Alerts */}
          <div className="p-4 rounded-lg" style={{ background: 'var(--tc-surface)', border: '1px solid var(--tc-border)' }}>
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-sm" style={{ color: 'var(--tc-text-main)' }}>Latest Scam Alerts</p>
              <a href="/alerts" className="text-xs" style={{ color: 'var(--tc-primary)' }}>View all →</a>
            </div>
            <p className="text-xs" style={{ color: 'var(--tc-text-muted)' }}>
              Subscribe to get personalized alerts about scams targeting your area, carrier, and bank.
            </p>
            <a href="/alerts" className="inline-block mt-2 px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{ background: 'var(--tc-primary-soft)', color: 'var(--tc-primary)', textDecoration: 'none' }}>
              Set up alerts
            </a>
          </div>

          {/* Tools */}
          <div className="flex gap-2 pt-2">
            <a href="/tools" className="flex-1 p-3 rounded-lg text-center text-sm font-medium transition-colors tc-card" style={{ background: "var(--tc-surface)", border: "1px solid var(--tc-border)", color: "var(--tc-text-main)" }}>
              Screenshot &amp; QR Scanner
            </a>
            <a href="/chat" className="flex-1 p-3 rounded-lg text-center text-sm font-medium transition-colors tc-card" style={{ background: "var(--tc-surface)", border: "1px solid var(--tc-border)", color: "var(--tc-text-main)" }}>
              Chat with TrustChekr
            </a>
            <a href="/tools/email-headers" className="flex-1 p-3 rounded-lg text-center text-sm font-medium transition-colors tc-card" style={{ background: "var(--tc-surface)", border: "1px solid var(--tc-border)", color: "var(--tc-text-main)" }}>
              Email Header Check
            </a>
          </div>

          {/* Academy — one line, not a billboard */}
          <a href="/academy" className="block p-4 rounded-lg transition-colors tc-card" style={{ background: "var(--tc-primary)", color: "white" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Free Safety Academy</p>
                <p className="text-sm opacity-85 mt-0.5">8 modules on spotting scams. Built for seniors, parents, and teens.</p>
              </div>
              <span className="text-xl opacity-75">→</span>
            </div>
          </a>

          {/* Newsletter — compact */}
          <div className="p-4 rounded-lg" style={{ background: "var(--tc-surface)", border: "1px solid var(--tc-border)" }}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1">
                <p className="font-semibold text-sm" style={{ color: "var(--tc-text-main)" }}>Monthly scam alerts</p>
                <p className="text-xs" style={{ color: "var(--tc-text-muted)" }}>New threats + protection tips. No spam.</p>
              </div>
              <NewsletterForm />
            </div>
          </div>

          {/* Footer trust line — no emoji cards */}
          <p className="text-center text-xs pb-2" style={{ color: "var(--tc-text-muted)" }}>
            We don't store your scans. We don't sell your data. We don't require sign-up.
            <br />
            © 17734344 Canada Inc. <a href="/privacy" className="underline">Privacy Policy</a> · <a href="/about" className="underline">About</a> · <a href="/press" className="underline">Press</a>
          </p>
        </>
      )}

      {error && (
        <div className="p-4 rounded-lg text-center" style={{ border: "2px solid var(--tc-warning)", background: "var(--tc-surface)" }}>
          <p className="font-semibold mb-1" style={{ color: "var(--tc-warning)" }}>Something went wrong</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-3 px-4 py-2 rounded-lg font-medium cursor-pointer text-sm"
            style={{ background: "var(--tc-primary)", color: "white" }}
          >
            Try again
          </button>
        </div>
      )}

      {scanning && <ScanProgress />}
      {result && <Results result={result} onReset={handleReset} />}
    </div>
  );
}
