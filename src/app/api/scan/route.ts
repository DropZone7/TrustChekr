import { NextRequest, NextResponse } from "next/server";
import { runScan } from "@/lib/scanner";
import { analyzeEmail, analyzePhone, analyzeCrypto, analyzeXrplWallet } from "@/lib/osint";
import { batchWebsiteOsint } from "@/lib/osint/batchOsint";
import { checkUsername } from "@/lib/osint/username";
import type { RiskLevel } from "@/lib/types";
import { runUnifiedScan } from "@/lib/scanners/unifiedScan";
import { logAudit, hashIp } from "@/lib/auditLog";
import { isDomainBlocked } from "@/lib/training/domainBlocklist";
import { scoreSpamLikelihood } from "@/lib/training/spamDetector";
import { analyzeUrlFeatures } from "@/lib/training/urlFeatures";
import { scorePhishingEmail } from "@/lib/training/phishingEmailDetector";
import { analyzeWithAI } from "@/lib/google/scamAnalysis";
import { matchScamPattern } from "@/lib/phone/scamPatterns";

export async function POST(req: NextRequest) {
  try {
    const { type, input, botProfile } = await req.json();

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

    // 1b. Training data signals (49K+ domain blocklist, spam keywords, URL features)
    let trainingData: any = {};

    if (type === "website") {
      // Domain blocklist check (49,762 known bad domains)
      try {
        const urlObj = new URL(cleaned.startsWith('http') ? cleaned : `https://${cleaned}`);
        const blockCheck = isDomainBlocked(urlObj.hostname);
        if (blockCheck.blocked) {
          signals.push({ text: `Domain "${blockCheck.matchedDomain}" is in a known phishing/malware blocklist (49K+ domains)`, weight: 50 });
        }
        // URL feature analysis (trained on 58K+ labeled URLs)
        const urlFeatures = analyzeUrlFeatures(cleaned);
        trainingData.urlFeatures = urlFeatures;
        if (urlFeatures.riskScore >= 50) {
          signals.push({ text: `URL structure matches phishing patterns (${urlFeatures.riskScore}% match based on 58K trained URLs)`, weight: Math.round(urlFeatures.riskScore * 0.3) });
        }
      } catch { /* invalid URL, pattern scanner already caught it */ }
    }

    if (type === "message") {
      // Spam keyword analysis (trained on 5,572 labeled messages)
      const spamScore = scoreSpamLikelihood(cleaned);
      trainingData.spamAnalysis = spamScore;
      if (spamScore.isLikelySpam) {
        signals.push({ text: `Message contains ${spamScore.matchedKeywords.length} spam-associated keywords (trained on 5,572 messages)`, weight: Math.round(spamScore.score * 0.2) });
      }

      // Phishing email detection (trained on 5,100 labeled emails)
      const phishScore = scorePhishingEmail(cleaned);
      trainingData.phishingEmail = phishScore;
      if (phishScore.score >= 30) {
        const topMatches = [...phishScore.matchedPhrases, ...phishScore.matchedKeywords].slice(0, 3).join(', ');
        signals.push({ text: `Phishing indicators detected: ${topMatches} (${phishScore.score}% match based on 5,100 trained emails)`, weight: Math.round(phishScore.score * 0.3) });
      }

      // Check URLs in message against domain blocklist
      const msgUrls = cleaned.match(/https?:\/\/\S+|www\.\S+/gi) || [];
      for (const u of msgUrls.slice(0, 3)) {
        try {
          const urlObj = new URL(u.startsWith('http') ? u : `https://${u}`);
          const blockCheck = isDomainBlocked(urlObj.hostname);
          if (blockCheck.blocked) {
            signals.push({ text: `Contains link to known phishing/malware domain "${blockCheck.matchedDomain}"`, weight: 50 });
          }
        } catch { /* skip invalid URLs */ }
      }
    }

    // 2. Run OSINT based on input type
    let osintResults: any = null;
    let usernameResult: any = null;

    if (type === "website") {
      const osint = await batchWebsiteOsint(cleaned);
      osintResults = osint;
      if (osint.domain?.signals) signals.push(...osint.domain.signals);
      if (osint.safeBrowsing?.signals) signals.push(...osint.safeBrowsing.signals);
      if (osint.virusTotal?.signals) signals.push(...osint.virusTotal.signals);
      if (osint.phishTank?.signals) signals.push(...osint.phishTank.signals);
      if (osint.urlhaus?.signals) signals.push(...osint.urlhaus.signals);
    }

    if (type === "other") {
      const lower = cleaned.toLowerCase();
      if (lower.includes("@")) {
        const emailResult = await analyzeEmail(cleaned);
        signals.push(...emailResult.signals);
      } else if (/^(r[A-Za-z0-9]{24,34}|0x[a-fA-F0-9]{40}|(1|3|bc1)[A-Za-z0-9]{25,62}|T[A-Za-z0-9]{33})$/.test(cleaned)) {
        const cryptoResult = await analyzeCrypto(cleaned);
        signals.push(...cryptoResult.signals);
        if (/^r[A-Za-z0-9]{24,34}$/.test(cleaned)) {
          const xrplResult = await analyzeXrplWallet(cleaned);
          signals.push(...xrplResult.signals);
        }
      } else if (/^[a-zA-Z0-9_]{3,30}$/.test(cleaned) && !cleaned.includes('.')) {
        // Looks like a username
        usernameResult = await checkUsername(cleaned);
        if (usernameResult.riskSignals?.length) {
          usernameResult.riskSignals.forEach((s: string) => signals.push({ text: s, weight: 15 }));
        }
      } else {
        const phoneResult = await analyzePhone(cleaned);
        signals.push(...phoneResult.signals);
        // Enrich with scam pattern database (22 known CA+US patterns)
        const scamMatches = matchScamPattern(cleaned);
        for (const pattern of scamMatches.slice(0, 3)) {
          signals.push({ text: `Matches known scam pattern: ${pattern.name} — ${pattern.description.slice(0, 80)}`, weight: pattern.riskLevel === 'high' ? 25 : 10 });
        }
      }
    }

    if (type === "message") {
      const urlPattern = /https?:\/\/\S+|www\.\S+/gi;
      const urls = cleaned.match(urlPattern) || [];
      for (const url of urls.slice(0, 3)) {
        const osint = await batchWebsiteOsint(url);
        if (osint.domain?.signals) signals.push(...osint.domain.signals);
        if (osint.safeBrowsing?.signals) signals.push(...osint.safeBrowsing.signals);
        if (osint.virusTotal?.signals) signals.push(...osint.virusTotal.signals);
        if (osint.phishTank?.signals) signals.push(...osint.phishTank.signals);
        if (osint.urlhaus?.signals) signals.push(...osint.urlhaus.signals);
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
      safe: "Low Risk",
      suspicious: "Suspicious",
      "high-risk": "High-Risk",
      "very-likely-scam": "Very Likely Scam",
    };

    // Rebuild share text
    const topSignal = riskSignals[0]?.text || "No warning signs found.";
    const shareText = `TrustChekr flagged this as ${riskLabels[riskLevel]}. ${topSignal}`;

    // Run unified scan pipeline (graph + AI detection) — non-blocking
    let unified: any = null;
    try {
      unified = await runUnifiedScan(
        { score: riskSignals.reduce((sum: number, s: any) => sum + (s.weight ?? 0), 0), signals: riskSignals, riskLevel },
        patternResult.inputType,
        patternResult.inputValue,
        {
          runAIDetection: patternResult.inputType === "message",
          textForAI: patternResult.inputType === "message" ? input : undefined,
          botProfile: botProfile ?? undefined,
        }
      );
    } catch { /* unified scan is optional — don't break existing results */ }

    // Gemini AI analysis (non-blocking, optional enhancement)
    let aiAnalysis: any = null;
    try {
      aiAnalysis = await analyzeWithAI(patternResult.inputType, cleaned, riskLabels[riskLevel]);
    } catch { /* AI is optional — never break existing results */ }

    // Audit log (fire-and-forget)
    try {
      const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
      logAudit('scan', { type: patternResult.inputType, riskLevel, overall_risk_label: unified?.overall_risk_label }, hashIp(clientIp));
    } catch { /* never break scan for audit */ }

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
      // OSINT detail data for frontend panels
      ...(osintResults ? { osint: osintResults } : {}),
      // Training data analysis
      ...(Object.keys(trainingData).length > 0 ? { training: trainingData } : {}),
      ...(usernameResult ? { username_lookup: usernameResult } : {}),
      // Enhanced intelligence (new modules)
      ...(unified ? {
        graph: unified.graph,
        ai_detection: unified.ai_detection,
        overall_risk_score: unified.overall_risk_score,
        overall_risk_label: unified.overall_risk_label,
      } : {}),
      ...(aiAnalysis?.available ? { ai_analysis: aiAnalysis } : {}),
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
