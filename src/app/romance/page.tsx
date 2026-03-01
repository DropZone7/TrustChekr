"use client";

import { useState } from "react";
import RomanceIntake from "@/components/RomanceIntake";
import Results from "@/components/Results";
import type { ScanResult } from "@/lib/types";

export default function RomancePage() {
  const [result, setResult] = useState<ScanResult | null>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleComplete = async (data: { platform: string; timeline: string; movedOffApp: string; videoCall: string; moneyAsked: string; moneySent: string; moneyAmount: string; messages: string }) => {
    setScanning(true);
    setError(null);

    try {
      const res = await fetch("/api/scan/romance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.error) {
        setError(result.error);
      } else {
        setResult(result);
      }
    } catch {
      setError("Our system is having trouble right now, but your information is safe. Please try again in a few minutes.");
    }
    setScanning(false);
  };

  const handleReset = () => {
    setResult(null);
    setScanning(false);
    setError(null);
  };

  return (
    <div className="flex flex-col gap-8">
      {!result && !scanning && !error && (
        <>
          <div className="text-center pt-4">
            <h1 className="text-3xl font-bold" style={{ color: "var(--tc-primary)" }}>
              💌 Check an Online Relationship
            </h1>
            <p className="mt-2" style={{ color: "var(--tc-text-muted)" }}>
              Worried someone you met online might not be who they say they are?
              Answer a few simple questions and we'll help you spot the warning signs.
            </p>
            <p className="mt-1 text-sm" style={{ color: "var(--tc-text-muted)" }}>
              This is completely private. We don't store your answers.
            </p>
          </div>

          <RomanceIntake onComplete={handleComplete} />
        </>
      )}

      {scanning && (
        <div className="text-center flex flex-col items-center gap-4 py-16">
          <div
            className="w-12 h-12 border-4 rounded-full animate-spin"
            style={{ borderColor: "var(--tc-primary-soft)", borderTopColor: "var(--tc-primary)" }}
          />
          <h2 className="text-xl font-semibold" style={{ color: "var(--tc-primary)" }}>
            Looking at the patterns…
          </h2>
          <p style={{ color: "var(--tc-text-muted)" }}>
            We're comparing what you shared against known romance scam patterns. This only takes a moment.
          </p>
        </div>
      )}

      {error && (
        <div className="p-5 rounded-xl border-2 text-center" style={{ borderColor: "var(--tc-warning)", background: "var(--tc-surface)" }}>
          <p className="font-semibold mb-1" style={{ color: "var(--tc-warning)" }}>⚠️ Something went wrong</p>
          <p>{error}</p>
          <button
            onClick={handleReset}
            className="mt-3 px-4 py-2 rounded-lg font-medium cursor-pointer"
            style={{ background: "var(--tc-primary)", color: "white" }}
          >
            Try again
          </button>
        </div>
      )}

      {result && <Results result={result} onReset={handleReset} />}
    </div>
  );
}
