import { NextRequest, NextResponse } from "next/server";
import { runScan } from "@/lib/scanner";
import { analyzeDomain, analyzeEmail, analyzePhone, analyzeCrypto, checkUrlSafety, checkVirusTotal } from "@/lib/osint";
import type { RiskLevel } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const { type, input } = await req.json();

    if (!type || !input || typeof input !== "string" || input.trim().length === 0) {
      return NextResponse.json(
        { error: "Please provide something to check." },
        { status: 400 }
      );
    }

    // Redact obvious sensitive data
    const sensitivePatterns = [
      /\b\d{3}[-.]?\d{2}[-.]?\d{4}\b/g,
      /\b\d{9}\b/g,
      /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g,
    ];

    const cleaned = input.trim();
    for (const pattern of sensitivePatterns) {
      if (pattern.test(cleaned)) {
        return NextResponse.json({
          warning: true,
          message:
            "It looks like you may have included sensitive information like a card number or government ID. Please remove that before checking — we don't need it and don't want to see it. Your safety comes first.",
        });
      }
    }

    // ── Collect ALL signals with weights ──────────────────────
    // Every signal is either a risk indicator (positive weight)
    // or a trust indicator (negative weight).
    // Final score = sum of all weights. If ≤ 0, it's safe.
    const signals: { text: string; weight: number }[] = [];

    // 1. Run pattern-based analysis (returns signals with real weights)
    const patternResult = runScan(type, cleaned);
    const patternWeights = patternResult._signalWeights ?? [];
    for (let i = 0; i < patternResult.whyBullets.length; i++) {
      const w = patternWeights[i];
      // Only include pattern bullets that have actual risk weight (> 0)
      if (w !== undefined && w > 0) {
        signals.push({ text: patternResult.whyBullets[i], weight: w });
      }
    }

    // 2. Run OSINT based on input type
    if (type === "website") {
      const [domainResult, safetyResult, vtResult] = await Promise.all([
        analyzeDomain(cleaned),
        checkUrlSafety(cleaned),
        checkVirusTotal(cleaned),
      ]);
      signals.push(...domainResult.signals, ...safetyResult.signals, ...vtResult.signals);
    }

    if (type === "other") {
      const lower = cleaned.toLowerCase();
      if (lower.includes("@")) {
        const emailResult = await analyzeEmail(cleaned);
        signals.push(...emailResult.signals);
      } else if (/^(r[A-Za-z0-9]{24,34}|0x[a-fA-F0-9]{40}|(1|3|bc1)[A-Za-z0-9]{25,62}|T[A-Za-z0-9]{33})$/.test(cleaned)) {
        const cryptoResult = await analyzeCrypto(cleaned);
        signals.push(...cryptoResult.signals);
      } else {
        const phoneResult = await analyzePhone(cleaned);
        signals.push(...phoneResult.signals);
      }
    }

    if (type === "message") {
      const urlPattern = /https?:\/\/\S+|www\.\S+/gi;
      const urls = cleaned.match(urlPattern) || [];
      for (const url of urls.slice(0, 3)) {
        const [domainResult, safetyResult, vtResult] = await Promise.all([
          analyzeDomain(url),
          checkUrlSafety(url),
          checkVirusTotal(url),
        ]);
        signals.push(...domainResult.signals, ...safetyResult.signals, ...vtResult.signals);
      }

      const emailPattern = /[^\s@]+@[^\s@]+\.[^\s@]+/g;
      const emails = cleaned.match(emailPattern) || [];
      for (const email of emails.slice(0, 2)) {
        const emailResult = await analyzeEmail(email);
        signals.push(...emailResult.signals);
      }
    }

    // ── Deduplicate by similarity ────────────────────────────
    const dedupedSignals: { text: string; weight: number }[] = [];
    for (const signal of signals) {
      const words = new Set(signal.text.toLowerCase().split(/\s+/).filter(w => w.length > 4));
      const isDupe = dedupedSignals.some((existing) => {
        const existingWords = new Set(existing.text.toLowerCase().split(/\s+/).filter(w => w.length > 4));
        const overlap = [...words].filter(w => existingWords.has(w)).length;
        const maxLen = Math.max(words.size, existingWords.size);
        return maxLen > 0 && overlap / maxLen > 0.6;
      });
      if (!isDupe) {
        dedupedSignals.push(signal);
      }
    }

    // ── Score: simple sum of all weights ─────────────────────
    // Positive = risk. Negative = trust. Zero or below = safe.
    const totalWeight = dedupedSignals.reduce((sum, s) => sum + s.weight, 0);

    let riskLevel: RiskLevel;
    if (totalWeight <= 0) riskLevel = "safe";
    else if (totalWeight <= 30) riskLevel = "suspicious";
    else if (totalWeight <= 60) riskLevel = "high-risk";
    else riskLevel = "very-likely-scam";

    // ── Build display bullets ────────────────────────────────
    // Sort by absolute weight (strongest signals first)
    const riskSignals = dedupedSignals.filter(s => s.weight > 0).sort((a, b) => b.weight - a.weight);
    const trustSignals = dedupedSignals.filter(s => s.weight < 0);

    const displayBullets: string[] = [];

    if (riskSignals.length > 0) {
      // Show risk signals
      displayBullets.push(...riskSignals.slice(0, 5).map(s => s.text));
    }

    if (trustSignals.length > 0) {
      // Show trust signals
      displayBullets.push(...trustSignals.map(s => s.text));
    }

    if (riskSignals.length === 0) {
      // No risk signals found — this is clean
      displayBullets.unshift("We didn't find any warning signs in what you shared.");
    }

    // ── Use pattern result for next steps / educational tip ──
    const riskLabels: Record<RiskLevel, string> = {
      safe: "Likely Safe",
      suspicious: "Suspicious",
      "high-risk": "High-Risk",
      "very-likely-scam": "Very Likely Scam",
    };

    // Rebuild share text
    const topSignal = riskSignals[0]?.text || "No warning signs found.";
    const shareText = `TrustChekr flagged this as ${riskLabels[riskLevel]}. ${topSignal}`;

    return NextResponse.json({
      inputType: patternResult.inputType,
      inputValue: patternResult.inputValue,
      riskLevel,
      whyBullets: displayBullets.slice(0, 6),
      nextSteps: riskLevel === "safe"
        ? [
            "If something still feels off, trust your instincts.",
            "Be cautious with personal information and money online.",
            "When in doubt, ask a trusted friend or family member for a second opinion.",
          ]
        : patternResult.nextSteps,
      reportTo: patternResult.reportTo,
      educationalTip: patternResult.educationalTip,
      shareText,
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "Our system is having trouble right now, but your information is safe. Please try again in a few minutes.",
      },
      { status: 500 }
    );
  }
}
