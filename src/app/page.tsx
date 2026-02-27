"use client";

import { useState } from "react";
import ScanForm from "@/components/ScanForm";
import Results from "@/components/Results";
import type { ScanResult } from "@/lib/types";
import { LatestScamAlertsWidget } from "@/components/scam-intel/LatestScamAlertsWidget";
import { ScamCostTicker } from "@/components/ScamCostTicker";
import { ScanProgress } from "@/components/ScanProgress";
import { ScanHistory, addToHistory } from "@/components/ScanHistory";
import { NewsletterForm } from "@/components/NewsletterForm";
import { ScamOfTheDay } from "@/components/ScamOfTheDay";

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

      if (data.warning) {
        setError(data.message);
        setScanning(false);
        return;
      }
      if (data.error) {
        setError(data.error);
        setScanning(false);
        return;
      }
      setResult(data);
      addToHistory(input, type, data.riskLevel);
    } catch {
      setError("Our system is having trouble right now, but your information is safe. Please try again in a few minutes.");
    }
    setScanning(false);
  };

  const handleReset = () => {
    setResult(null);
    setScanning(false);
  };

  return (
    <div className="flex flex-col gap-8">
      {!result && !scanning && (
        <>
          {/* Scrolling ticker banner */}
          <div className="overflow-hidden rounded-xl py-2.5 -mb-2" style={{ background: "var(--tc-primary)", color: "white" }}>
            <div className="ticker-track whitespace-nowrap text-sm font-medium">
              {[...Array(2)].map((_, copy) => (
                <span key={copy} className="inline-block">
                  <span className="mx-6">🚨 Canadians lost $638M to scams in 2024 (CAFC)</span>
                  <span className="mx-6">📞 The CRA will never call demanding gift cards</span>
                  <span className="mx-6">💡 When in doubt, check it out — paste it here free</span>
                  <span className="mx-6">🔒 Your bank will never ask for your password by email</span>
                  <span className="mx-6">⚠️ Romance scams cost Canadians $50.3M last year</span>
                  <span className="mx-6">🛡️ If it sounds too good to be true, it probably is</span>
                  <span className="mx-6">📱 Don't click links in texts from unknown numbers</span>
                  <span className="mx-6">🇨🇦 Report scams: antifraudcentre-centreantifraude.ca</span>
                </span>
              ))}
            </div>
          </div>

          {/* Hero */}
          {/* Scam cost ticker */}
          <ScamCostTicker />

          {/* Scam of the Day */}
          <ScamOfTheDay />

          <div className="text-center flex flex-col gap-3 pt-4">
            <h1
              className="text-3xl font-bold"
              style={{ color: "var(--tc-primary)" }}
            >
              Check if something might be a scam
            </h1>
            <p style={{ color: "var(--tc-text-muted)" }}>
              Paste a website, message, phone number, or email and we'll check
              it for you. Free, private, no sign-up needed.
            </p>
          </div>

          {/* Scan tiles + form */}
          <ScanForm onScan={handleScan} />

          {/* Recent checks */}
          <ScanHistory onRescan={handleScan} />

          {/* Advanced tools CTA */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <a href="/tools" className="p-3 rounded-xl text-center transition-all hover:shadow-sm" style={{ background: "var(--tc-surface)", border: "1px solid var(--tc-border)" }}>
              <span className="text-2xl">📱</span>
              <p className="font-semibold text-sm mt-1" style={{ color: "var(--tc-primary)" }}>Scan a Screenshot</p>
              <p className="text-xs" style={{ color: "var(--tc-text-muted)" }}>Upload a photo of a suspicious message</p>
            </a>
            <a href="/tools" className="p-3 rounded-xl text-center transition-all hover:shadow-sm" style={{ background: "var(--tc-surface)", border: "1px solid var(--tc-border)" }}>
              <span className="text-2xl">📷</span>
              <p className="font-semibold text-sm mt-1" style={{ color: "var(--tc-primary)" }}>Scan a QR Code</p>
              <p className="text-xs" style={{ color: "var(--tc-text-muted)" }}>Check if a QR code is safe to scan</p>
            </a>
            <a href="/tools" className="p-3 rounded-xl text-center transition-all hover:shadow-sm" style={{ background: "var(--tc-surface)", border: "1px solid var(--tc-border)" }}>
              <span className="text-2xl">📄</span>
              <p className="font-semibold text-sm mt-1" style={{ color: "var(--tc-primary)" }}>Check a Document</p>
              <p className="text-xs" style={{ color: "var(--tc-text-muted)" }}>Detect image manipulation or fakes</p>
            </a>
          </div>

          {/* How it works */}
          <div className="flex flex-col gap-4 pt-4">
            <h2 className="text-xl font-bold text-center" style={{ color: "var(--tc-primary)" }}>
              How it works
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { step: "1", emoji: "📋", title: "Paste it", desc: "Copy and paste a message, website, phone number, or email." },
                { step: "2", emoji: "🔍", title: "We check it", desc: "We look for known scam patterns, suspicious signs, and red flags." },
                { step: "3", emoji: "✅", title: "Get your answer", desc: "See a clear result with what to do next, in plain language." },
              ].map((item) => (
                <div key={item.step} className="text-center p-4 rounded-xl" style={{ background: "var(--tc-surface)", border: "1px solid var(--tc-border)" }}>
                  <span className="text-3xl">{item.emoji}</span>
                  <h3 className="font-semibold mt-2" style={{ color: "var(--tc-text-main)" }}>{item.title}</h3>
                  <p className="text-sm mt-1" style={{ color: "var(--tc-text-muted)" }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Trust signals */}
          <div className="flex flex-col gap-3 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center text-sm">
              {[
                { emoji: "🔒", text: "Private — we never store or sell your data" },
                { emoji: "🆓", text: "Free — no sign-up, no hidden fees" },
                { emoji: "🇨🇦", text: "Built in Canada for Canadians and Americans" },
              ].map((badge, i) => (
                <div key={i} className="p-3 rounded-xl" style={{ background: "var(--tc-primary-soft)" }}>
                  <span className="text-lg">{badge.emoji}</span>
                  <p className="mt-1 font-medium" style={{ color: "var(--tc-primary)" }}>{badge.text}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-sm" style={{ color: "var(--tc-text-muted)" }}>
              You did the right thing by checking. Scams are designed to fool anyone. 🛡️
            </p>
          </div>

          {/* Academy Promo */}
          <a
            href="/academy"
            className="block p-5 rounded-xl border-2 text-center transition-all hover:shadow-md cursor-pointer"
            style={{ borderColor: "var(--tc-primary)", background: "var(--tc-primary-soft)" }}
          >
            <p className="text-2xl mb-2">🎓</p>
            <p className="text-lg font-bold" style={{ color: "var(--tc-primary)" }}>
              Free Online Safety Academy
            </p>
            <p className="text-sm mt-1" style={{ color: "var(--tc-text-main)" }}>
              8 interactive modules to protect yourself and your family from scams.
              Designed for seniors, parents, and teens. Start learning →
            </p>
          </a>

          {/* Scam Alerts Widget */}
          <LatestScamAlertsWidget />

          {/* Newsletter CTA */}
          <div
            className="p-5 rounded-xl text-center"
            style={{ background: "var(--tc-primary)", color: "white" }}
          >
            <p className="text-2xl mb-2">📬</p>
            <p className="text-lg font-bold">Monthly Scam Alert Newsletter</p>
            <p className="text-sm mt-1 mb-4 opacity-90">
              Get the latest scam warnings, new threats, and protection tips delivered to your inbox once a month.
              No spam, no tracking — just the alerts that matter.
            </p>
            <div className="flex justify-center">
              <NewsletterForm />
            </div>
            <p className="text-xs mt-3 opacity-70">
              Unsubscribe anytime. We never share your email. <a href="/privacy" className="underline">Privacy Policy</a>
            </p>
          </div>
        </>
      )}

      {error && (
        <div className="p-5 rounded-xl border-2 text-center" style={{ borderColor: "var(--tc-warning)", background: "#fef9e7" }}>
          <p className="font-semibold mb-1" style={{ color: "var(--tc-warning)" }}>⚠️ Hold on</p>
          <p>{error}</p>
          <button
            onClick={() => { setError(null); }}
            className="mt-3 px-4 py-2 rounded-lg font-medium cursor-pointer"
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
