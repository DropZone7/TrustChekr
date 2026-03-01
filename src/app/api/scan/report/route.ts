// src/app/api/scan/report/route.ts
import { NextRequest, NextResponse } from "next/server";
import { runScan } from "@/lib/scanner";
import { batchWebsiteOsint } from "@/lib/osint/batchOsint";
import { calculateTrustScore, type PositiveSignalContext } from "@/lib/trustScore";

export const runtime = "nodejs";
export const maxDuration = 30;

const DOMAIN_RE = /^(?:[a-z0-9](?:[a-z0-9\-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i;

function sanitizeDomain(raw: string): string | null {
  const stripped = raw
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//i, "")
    .replace(/\/.*$/, "")
    .replace(/^www\./, "");
  return DOMAIN_RE.test(stripped) ? stripped : null;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const raw = req.nextUrl.searchParams.get("domain");
  if (!raw) {
    return NextResponse.json({ error: "Missing required query parameter: domain" }, { status: 400 });
  }

  const domain = sanitizeDomain(raw);
  if (!domain) {
    return NextResponse.json({ error: "Invalid domain. Provide a bare domain such as example.com" }, { status: 400 });
  }

  try {
    // Run pattern scan
    const patternResult = runScan("website", domain);
    const patternWeights = patternResult._signalWeights ?? [];
    const signals: { text: string; weight: number }[] = [];

    for (let i = 0; i < patternResult.whyBullets.length; i++) {
      const w = patternWeights[i];
      if (w !== undefined && w > 0) {
        signals.push({ text: patternResult.whyBullets[i], weight: w });
      }
    }

    // Run OSINT
    let osintResults: any = null;
    try {
      const osint = await batchWebsiteOsint(domain);
      osintResults = osint;
      if (osint.domain?.signals) signals.push(...osint.domain.signals);
      if (osint.safeBrowsing?.signals) signals.push(...osint.safeBrowsing.signals);
      if (osint.virusTotal?.signals) signals.push(...osint.virusTotal.signals);
      if (osint.phishTank?.signals) signals.push(...osint.phishTank.signals);
      if (osint.urlhaus?.signals) signals.push(...osint.urlhaus.signals);
      if ((osint as any).socialPresence?.signals) {
        for (const sig of (osint as any).socialPresence.signals) signals.push(sig);
      }
      if ((osint as any).tranco?.signals) {
        for (const sig of (osint as any).tranco.signals) signals.push(sig);
      }
    } catch { /* OSINT is enrichment */ }

    // Dedup
    const dedupedSignals: { text: string; weight: number }[] = [];
    for (const signal of signals) {
      const words = new Set(signal.text.toLowerCase().split(/\s+/).filter(w => w.length > 4));
      const isDupe = dedupedSignals.some((existing) => {
        const existingWords = new Set(existing.text.toLowerCase().split(/\s+/).filter(w => w.length > 4));
        const overlap = [...words].filter(w => existingWords.has(w)).length;
        const maxLen = Math.max(words.size, existingWords.size);
        return maxLen > 0 && overlap / maxLen > 0.6;
      });
      if (!isDupe) dedupedSignals.push(signal);
    }

    // Score
    const totalWeight = dedupedSignals.reduce((sum, s) => sum + s.weight, 0);
    let riskLevel: string;
    if (totalWeight <= 0) riskLevel = "safe";
    else if (totalWeight <= 30) riskLevel = "suspicious";
    else if (totalWeight <= 60) riskLevel = "high-risk";
    else riskLevel = "very-likely-scam";

    const riskSignals = dedupedSignals.filter(s => s.weight > 0).sort((a, b) => b.weight - a.weight);
    const trustSignals = dedupedSignals.filter(s => s.weight < 0);

    const displayBullets: string[] = [];
    if (riskSignals.length > 0) displayBullets.push(...riskSignals.slice(0, 5).map(s => s.text));
    if (trustSignals.length > 0) displayBullets.push(...trustSignals.map(s => s.text));
    if (riskSignals.length === 0) displayBullets.unshift("We didn't find any warning signs for this website.");

    // Trust score
    const context: PositiveSignalContext = {
      domainAgeYears: osintResults?.domain?.domainAgeDays != null ? osintResults.domain.domainAgeDays / 365 : null,
      isBrandWhitelisted: riskLevel === "safe" && riskSignals.length === 0,
      sslValid: osintResults?.safeBrowsing ? !osintResults.safeBrowsing.flagged : undefined,
      isKnownRegistrar: false,
    };
    const trustScore = calculateTrustScore(dedupedSignals, "website", context);

    const response = {
      inputType: "website",
      inputValue: domain,
      riskLevel,
      whyBullets: displayBullets.slice(0, 6),
      nextSteps: riskLevel === "safe"
        ? ["If something still feels off, trust your instincts.", "Be cautious with personal information online."]
        : patternResult.nextSteps,
      reportTo: patternResult.reportTo,
      educationalTip: patternResult.educationalTip,
      shareText: `TrustChekr scored ${domain}: ${trustScore.score}/100 (${trustScore.label})`,
      scannedAt: new Date().toISOString(),
      trustScore,
      ...(osintResults ? { osint: osintResults } : {}),
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=300",
      },
    });
  } catch (err: any) {
    console.error("[TrustChekr] Report scan failed:", err?.message);
    return NextResponse.json({ error: "Scan failed. Please try again." }, { status: 500 });
  }
}
