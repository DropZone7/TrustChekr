// src/app/scan/[domain]/page.tsx
import type { Metadata } from "next";
import type { TrustScoreResult } from "@/lib/trustScore";
import { gradeToCssColor } from "@/lib/trustScore";

interface ReportApiResponse {
  inputType: string;
  inputValue: string;
  riskLevel: string;
  whyBullets: string[];
  nextSteps: string[];
  reportTo: string[];
  educationalTip: string;
  shareText: string;
  scannedAt: string;
  trustScore: TrustScoreResult;
  osint?: any;
}

interface PageProps {
  params: Promise<{ domain: string }>;
}

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3002");

async function getReport(domain: string): Promise<ReportApiResponse | null> {
  try {
    const res = await fetch(
      `${BASE_URL}/api/scan/report?domain=${encodeURIComponent(domain)}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    return (await res.json()) as ReportApiResponse;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { domain } = await params;
  const decoded = decodeURIComponent(domain);
  const report = await getReport(decoded);

  const riskSummary = report
    ? `Trust score: ${report.trustScore.score}/100 — ${report.trustScore.label}. ${report.whyBullets?.[0] ?? "Automated scan results."}`
    : `Automated scam and safety analysis for ${decoded}. Powered by TrustChekr.`;

  return {
    title: `Is ${decoded} a scam? | TrustChekr`,
    description: riskSummary,
    openGraph: {
      title: `Is ${decoded} a scam? | TrustChekr`,
      description: riskSummary,
      url: `${BASE_URL}/scan/${domain}`,
      siteName: "TrustChekr",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `Is ${decoded} a scam? | TrustChekr`,
      description: riskSummary,
    },
    alternates: {
      canonical: `${BASE_URL}/scan/${domain}`,
    },
  };
}

function riskBannerColor(riskLevel: string): string {
  switch (riskLevel) {
    case "very-likely-scam": return "var(--tc-danger, #A40000)";
    case "high-risk": return "var(--tc-warning, #C75000)";
    case "suspicious": return "var(--tc-caution, #B08A00)";
    default: return "var(--tc-ok, #2A6E2A)";
  }
}

function riskLevelDisplay(riskLevel: string): string {
  switch (riskLevel) {
    case "very-likely-scam": return "Very Likely a Scam";
    case "high-risk": return "High Risk";
    case "suspicious": return "Suspicious";
    default: return "Low Risk";
  }
}

function formatTimestamp(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-CA", { dateStyle: "long", timeStyle: "short" });
  } catch {
    return iso;
  }
}

function buildJsonLd(domain: string, report: ReportApiResponse): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Is ${domain} a scam? | TrustChekr`,
    description: `Automated safety analysis for ${domain}. Trust score: ${report.trustScore.score}/100.`,
    url: `${BASE_URL}/scan/${encodeURIComponent(domain)}`,
    dateModified: report.scannedAt,
    publisher: { "@type": "Organization", name: "TrustChekr", url: BASE_URL },
    mainEntity: {
      "@type": "Review",
      reviewSubject: { "@type": "WebSite", url: `https://${domain}`, name: domain },
      reviewRating: { "@type": "Rating", ratingValue: report.trustScore.score, bestRating: 100, worstRating: 0 },
      author: { "@type": "Organization", name: "TrustChekr" },
    },
  });
}

function FindingsList({ bullets }: { bullets: string[] }) {
  if (bullets.length === 0) return null;
  return (
    <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
      {bullets.map((b, i) => (
        <li key={i} style={{ fontSize: "16px", color: "var(--tc-text-main)", paddingLeft: "20px", position: "relative", lineHeight: "1.6" }}>
          <span style={{ position: "absolute", left: 0, color: "var(--tc-primary, #A40000)", fontWeight: "700" }}>—</span>
          {b}
        </li>
      ))}
    </ul>
  );
}

function NextStepsList({ steps }: { steps: string[] }) {
  if (steps.length === 0) return null;
  return (
    <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
      {steps.map((step, i) => (
        <li key={i} style={{ fontSize: "16px", color: "var(--tc-text-main)", paddingLeft: "32px", position: "relative", lineHeight: "1.6" }}>
          <span style={{ position: "absolute", left: 0, width: "22px", height: "22px", background: "var(--tc-primary, #A40000)", color: "#fff", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "700", top: "2px" }}>{i + 1}</span>
          {step}
        </li>
      ))}
    </ol>
  );
}

function SectionBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ background: "var(--tc-surface)", border: "1px solid var(--tc-border)", borderRadius: "10px", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2 style={{ fontSize: "18px", fontWeight: "700", color: "var(--tc-text-main)", margin: 0, paddingBottom: "12px", borderBottom: "1px solid var(--tc-border)" }}>{title}</h2>
      {children}
    </section>
  );
}

function ErrorState({ domain }: { domain: string }) {
  return (
    <main style={{ maxWidth: "720px", margin: "40px auto", padding: "0 16px", fontFamily: "system-ui, -apple-system, sans-serif", display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ background: "var(--tc-surface)", border: "1px solid var(--tc-border)", borderTop: "4px solid var(--tc-danger, #A40000)", borderRadius: "10px", padding: "32px", textAlign: "center" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "700", color: "var(--tc-text-main)", margin: "0 0 12px" }}>Could not scan {domain}</h1>
        <p style={{ fontSize: "16px", color: "var(--tc-text-muted)", margin: "0 0 24px" }}>We were unable to retrieve a scan report for this domain right now. Please try again in a moment.</p>
        <a href="/" style={{ display: "inline-block", padding: "12px 28px", background: "var(--tc-primary, #A40000)", color: "#fff", borderRadius: "8px", textDecoration: "none", fontSize: "16px", fontWeight: "600" }}>Check another website</a>
      </div>
    </main>
  );
}

export default async function DomainReportPage({ params }: PageProps) {
  const { domain: rawDomain } = await params;
  const domain = decodeURIComponent(rawDomain);
  const report = await getReport(domain);

  if (!report) return <ErrorState domain={domain} />;

  const bannerColor = riskBannerColor(report.riskLevel);
  const riskDisplay = riskLevelDisplay(report.riskLevel);
  const scannedAt = formatTimestamp(report.scannedAt ?? new Date().toISOString());
  const gradeColor = gradeToCssColor(report.trustScore.grade);
  const isHighRisk = report.riskLevel === "very-likely-scam" || report.riskLevel === "high-risk";

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: buildJsonLd(domain, report) }} />
      <main style={{ maxWidth: "720px", margin: "0 auto", padding: "32px 16px 48px", fontFamily: "system-ui, -apple-system, sans-serif", display: "flex", flexDirection: "column", gap: "20px" }}>

        {/* Hero banner */}
        <div style={{ background: "var(--tc-surface)", border: "1px solid var(--tc-border)", borderTop: `6px solid ${bannerColor}`, borderRadius: "12px", padding: "28px 24px", display: "flex", flexDirection: "column", gap: "16px", alignItems: "center", textAlign: "center" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "700", color: "var(--tc-text-main)", margin: 0, wordBreak: "break-all" }}>Is {domain} a scam?</h1>

          <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
            <div style={{ width: "72px", height: "72px", borderRadius: "50%", border: `4px solid ${gradeColor}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontSize: "26px", fontWeight: "700", color: gradeColor, lineHeight: 1 }}>{report.trustScore.grade}</span>
              <span style={{ fontSize: "11px", color: "var(--tc-text-muted)" }}>{report.trustScore.score}/100</span>
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: "22px", fontWeight: "700", color: bannerColor }}>{riskDisplay}</div>
              <div style={{ fontSize: "15px", color: "var(--tc-text-muted)", marginTop: "2px" }}>{report.trustScore.label} — score {report.trustScore.score} out of 100</div>
            </div>
          </div>

          {isHighRisk && (
            <div role="alert" style={{ width: "100%", background: "rgba(164,0,0,0.08)", border: "1px solid var(--tc-danger, #A40000)", borderRadius: "8px", padding: "14px 18px", fontSize: "16px", color: "var(--tc-danger, #A40000)", fontWeight: "500", lineHeight: "1.6", textAlign: "left" }}>
              Do not enter any personal information, passwords, or payment details on this site. If you have already done so, contact your bank immediately.
            </div>
          )}
        </div>

        {/* When checked */}
        <div style={{ background: "var(--tc-surface)", border: "1px solid var(--tc-border)", borderRadius: "8px", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
          <span style={{ fontSize: "15px", color: "var(--tc-text-muted)" }}>Last checked</span>
          <span style={{ fontSize: "15px", fontWeight: "600", color: "var(--tc-text-main)" }}>{scannedAt}</span>
        </div>

        {/* Key findings */}
        {(report.whyBullets?.length ?? 0) > 0 && (
          <SectionBox title="Why this score was given">
            <FindingsList bullets={report.whyBullets} />
            {report.educationalTip && (
              <div style={{ marginTop: "4px", padding: "14px 18px", background: "rgba(164,0,0,0.06)", borderLeft: "3px solid var(--tc-primary, #A40000)", borderRadius: "4px", fontSize: "15px", color: "var(--tc-text-muted)", lineHeight: "1.6" }}>
                {report.educationalTip}
              </div>
            )}
          </SectionBox>
        )}

        {/* What to do next */}
        {(report.nextSteps?.length ?? 0) > 0 && (
          <SectionBox title="What you should do">
            <NextStepsList steps={report.nextSteps} />
          </SectionBox>
        )}

        {/* Report to authorities */}
        {(report.reportTo?.length ?? 0) > 0 && (
          <SectionBox title="Where to report this website">
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
              {report.reportTo.map((r: string, i: number) => (
                <li key={i} style={{ fontSize: "16px", color: "var(--tc-text-main)", paddingLeft: "16px", position: "relative" }}>
                  <span style={{ position: "absolute", left: 0, color: "var(--tc-primary, #A40000)", fontWeight: "700" }}>—</span>
                  {r}
                </li>
              ))}
            </ul>
          </SectionBox>
        )}

        {/* Disclaimer */}
        <div style={{ padding: "16px 20px", background: "var(--tc-surface)", border: "1px solid var(--tc-border)", borderRadius: "8px", fontSize: "13px", color: "var(--tc-text-muted)", lineHeight: "1.7" }}>
          Automated analysis as of {scannedAt}. Results may change as new information becomes available. This report is provided for informational purposes only and does not constitute legal or financial advice. TrustChekr uses probabilistic signals — a low score does not guarantee the site is free from risk.
        </div>

        {/* CTA row */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
          <a href="/" style={{ display: "inline-block", padding: "14px 28px", background: "var(--tc-primary, #A40000)", color: "#fff", borderRadius: "8px", textDecoration: "none", fontSize: "16px", fontWeight: "600" }}>Check another website</a>
          <a href={`/report?domain=${encodeURIComponent(domain)}`} style={{ display: "inline-block", padding: "14px 28px", background: "transparent", color: "var(--tc-primary, #A40000)", border: "2px solid var(--tc-primary, #A40000)", borderRadius: "8px", textDecoration: "none", fontSize: "16px", fontWeight: "600" }}>Report this website</a>
        </div>
      </main>
    </>
  );
}
