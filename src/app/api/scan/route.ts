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
      /\b\d{3}[-.]?\d{2}[-.]?\d{4}\b/g, // SSN
      /\b\d{9}\b/g, // SIN
      /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, // Credit card
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

    // Start with pattern-based analysis
    const patternResult = runScan(type, cleaned);

    // Layer on real OSINT based on input type
    const osintSignals: { text: string; weight: number }[] = [];

    if (type === "website") {
      // Run domain OSINT + URL safety + VirusTotal in parallel
      const [domainResult, safetyResult, vtResult] = await Promise.all([
        analyzeDomain(cleaned),
        checkUrlSafety(cleaned),
        checkVirusTotal(cleaned),
      ]);
      osintSignals.push(...domainResult.signals, ...safetyResult.signals, ...vtResult.signals);
    }

    if (type === "other") {
      const lower = cleaned.toLowerCase();

      // Detect what type of "other" input this is
      if (lower.includes("@")) {
        // Email
        const emailResult = await analyzeEmail(cleaned);
        osintSignals.push(...emailResult.signals);
      } else if (/^(r[A-Za-z0-9]{24,34}|0x[a-fA-F0-9]{40}|(1|3|bc1)[A-Za-z0-9]{25,62}|T[A-Za-z0-9]{33})$/.test(cleaned)) {
        // Crypto address
        const cryptoResult = await analyzeCrypto(cleaned);
        osintSignals.push(...cryptoResult.signals);
      } else {
        // Phone number (default for "other")
        const phoneResult = await analyzePhone(cleaned);
        osintSignals.push(...phoneResult.signals);
      }
    }

    if (type === "message") {
      // Check any URLs embedded in messages
      const urlPattern = /https?:\/\/\S+|www\.\S+/gi;
      const urls = cleaned.match(urlPattern) || [];
      for (const url of urls.slice(0, 3)) {
        const [domainResult, safetyResult, vtResult] = await Promise.all([
          analyzeDomain(url),
          checkUrlSafety(url),
          checkVirusTotal(url),
        ]);
        osintSignals.push(...domainResult.signals, ...safetyResult.signals, ...vtResult.signals);
      }

      // Check any email addresses in messages
      const emailPattern = /[^\s@]+@[^\s@]+\.[^\s@]+/g;
      const emails = cleaned.match(emailPattern) || [];
      for (const email of emails.slice(0, 2)) {
        const emailResult = await analyzeEmail(email);
        osintSignals.push(...emailResult.signals);
      }
    }

    // Merge pattern signals with OSINT signals (deduplicate by similarity)
    // Preserve original pattern weights by re-running the scanner for weights
    const patternWeights = patternResult._signalWeights || patternResult.whyBullets.map(() => 20);
    const patternSignals = patternResult.whyBullets.map((text, i) => ({ text, weight: patternWeights[i] || 20 }));
    const allSignals = [...patternSignals, ...osintSignals];
    const dedupedSignals: { text: string; weight: number }[] = [];
    for (const signal of allSignals) {
      // Check for near-duplicates (if 60%+ of words overlap, skip)
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

    // Recalculate risk with OSINT data
    // Only count positive weights (negative weights are "good signs")
    const positiveSignals = dedupedSignals.filter((s) => s.weight > 0);
    const negativeSignals = dedupedSignals.filter((s) => s.weight < 0);
    const totalWeight = positiveSignals.reduce((sum, s) => sum + s.weight, 0) + negativeSignals.reduce((sum, s) => sum + s.weight, 0);
    let riskLevel: RiskLevel;
    if (totalWeight <= 10) riskLevel = "safe";
    else if (totalWeight <= 45) riskLevel = "suspicious";
    else if (totalWeight <= 75) riskLevel = "high-risk";
    else riskLevel = "very-likely-scam";

    // Build enhanced result
    const riskLabels: Record<RiskLevel, string> = {
      safe: "Likely Safe",
      suspicious: "Suspicious",
      "high-risk": "High-Risk",
      "very-likely-scam": "Very Likely Scam",
    };

    return NextResponse.json({
      ...patternResult,
      riskLevel,
      whyBullets: dedupedSignals
        .sort((a, b) => b.weight - a.weight)
        .slice(0, 6)
        .map((s) => s.text),
      shareText: `TrustChekr flagged this as ${riskLabels[riskLevel]}. ${dedupedSignals[0]?.text || ""}`,
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
