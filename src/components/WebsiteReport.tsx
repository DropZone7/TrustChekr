"use client";

import { useState } from "react";
import type { TrustScoreResult } from "@/lib/trustScore";

// ── Prop types ──────────────────────────────────────────────────────────────────

interface DomainInfo {
  registrar?: string | null;
  registeredAt?: string | null;
  expiresAt?: string | null;
  updatedAt?: string | null;
}

interface SslInfo {
  issuer?: string | null;
  validFrom?: string | null;
  validTo?: string | null;
  protocol?: string | null;
  valid?: boolean | null;
}

interface HostingInfo {
  country?: string | null;
  countryCode?: string | null;
  provider?: string | null;
  asn?: string | null;
  ipAddress?: string | null;
}

interface SecurityChecks {
  googleSafeBrowsing?: { flagged: boolean; threatType?: string | null } | null;
  virusTotal?: { flagged: boolean; detections?: number | null; total?: number | null } | null;
  phishTank?: { flagged: boolean } | null;
  urlHaus?: { flagged: boolean; threat?: string | null } | null;
}

interface DnsInfo {
  nameservers?: string[] | null;
  mxRecords?: string[] | null;
}

export interface WebsiteReportOsint {
  domain?: DomainInfo | null;
  ssl?: SslInfo | null;
  hosting?: HostingInfo | null;
  security?: SecurityChecks | null;
  dns?: DnsInfo | null;
  tranco?: { rank: number | null; isPopular: boolean } | null;
}

interface WebsiteReportProps {
  domain: string;
  osint: WebsiteReportOsint;
  trustScore: Pick<TrustScoreResult, "score" | "grade" | "label">;
}

// ── Helpers ─────────────────────────────────────────────────────────────────────

function formatDate(iso?: string | null): string {
  if (!iso) return "Not available";
  try {
    return new Date(iso).toLocaleDateString("en-CA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "Invalid date";
  }
}

function domainAgeLabel(registeredAt?: string | null): string {
  if (!registeredAt) return "Unknown";
  const ms = Date.now() - new Date(registeredAt).getTime();
  if (isNaN(ms) || ms < 0) return "Unknown";
  const days = Math.floor(ms / 86_400_000);
  const years = Math.floor(days / 365);
  const rem = days % 365;
  const months = Math.floor(rem / 30);
  if (years > 0) return `${years} year${years !== 1 ? "s" : ""}, ${months} month${months !== 1 ? "s" : ""}`;
  if (months > 0) return `${months} month${months !== 1 ? "s" : ""}`;
  return `${days} day${days !== 1 ? "s" : ""}`;
}

function daysUntilExpiry(expiresAt?: string | null): number | null {
  if (!expiresAt) return null;
  const ms = new Date(expiresAt).getTime() - Date.now();
  if (isNaN(ms)) return null;
  return Math.floor(ms / 86_400_000);
}

function scoreColor(score: number): string {
  if (score >= 81) return "var(--tc-ok, #2A6E2A)";
  if (score >= 61) return "var(--tc-ok-muted, #4A8A3A)";
  if (score >= 41) return "var(--tc-caution, #B08A00)";
  if (score >= 21) return "var(--tc-warning, #C75000)";
  return "var(--tc-danger, #A40000)";
}

function gradeColor(grade: string): string {
  switch (grade) {
    case "A": return "var(--tc-ok, #2A6E2A)";
    case "B": return "var(--tc-ok-muted, #4A8A3A)";
    case "C": return "var(--tc-caution, #B08A00)";
    case "D": return "var(--tc-warning, #C75000)";
    default: return "var(--tc-danger, #A40000)";
  }
}

// ── SVG Circular Gauge ──────────────────────────────────────────────────────────

function TrustGauge({ score, grade, label }: { score: number; grade: string; label: string }) {
  const radius = 54;
  const cx = 70;
  const cy = 70;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  const arcFraction = 270 / 360;
  const arcLength = circumference * arcFraction;
  const fillLength = (score / 100) * arcLength;
  const gapLength = circumference - arcLength;
  const rotation = 135;
  const color = scoreColor(score);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
      <svg width="140" height="140" viewBox="0 0 140 140" role="img"
        aria-label={`Trust score: ${score} out of 100. Grade: ${grade}. ${label}.`}>
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke="var(--tc-border)"
          strokeWidth={strokeWidth} strokeDasharray={`${arcLength} ${gapLength}`}
          strokeDashoffset={0} strokeLinecap="round"
          style={{ transform: `rotate(${rotation}deg)`, transformOrigin: `${cx}px ${cy}px` }} />
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke={color}
          strokeWidth={strokeWidth} strokeDasharray={`${fillLength} ${circumference - fillLength}`}
          strokeDashoffset={0} strokeLinecap="round"
          style={{ transform: `rotate(${rotation}deg)`, transformOrigin: `${cx}px ${cy}px`, transition: "stroke-dasharray 0.8s ease" }} />
        <text x={cx} y={cy - 6} textAnchor="middle" dominantBaseline="middle"
          fontSize="30" fontWeight="700" fill={color}>{grade}</text>
        <text x={cx} y={cy + 18} textAnchor="middle" dominantBaseline="middle"
          fontSize="13" fill="var(--tc-text-muted)">{score} / 100</text>
      </svg>
      <span style={{ fontSize: "18px", fontWeight: "600", color: gradeColor(grade) }}>{label}</span>
    </div>
  );
}

// ── Expandable Section Card ─────────────────────────────────────────────────────

function SectionCard({ title, defaultOpen = false, children, flagged }: {
  title: string; defaultOpen?: boolean; children: React.ReactNode; flagged?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div style={{
      background: "var(--tc-surface)",
      border: `1px solid ${flagged ? "var(--tc-danger, #A40000)" : "var(--tc-border)"}`,
      borderLeft: flagged ? "4px solid var(--tc-danger, #A40000)" : "4px solid var(--tc-border)",
      borderRadius: "10px", overflow: "hidden",
    }}>
      <button onClick={() => setOpen((prev) => !prev)} aria-expanded={open}
        style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "16px 20px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", gap: "12px" }}>
        <span style={{ fontSize: "17px", fontWeight: "600", color: "var(--tc-text-main)" }}>
          {title}
          {flagged && (
            <span style={{ marginLeft: "10px", fontSize: "13px", fontWeight: "500",
              color: "var(--tc-danger, #A40000)", background: "rgba(164,0,0,0.1)",
              padding: "2px 8px", borderRadius: "4px" }}>Issue Found</span>
          )}
        </span>
        <span style={{ fontSize: "20px", color: "var(--tc-text-muted)",
          transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease", flexShrink: 0 }}
          aria-hidden="true">&#8964;</span>
      </button>
      {open && (
        <div style={{ padding: "0 20px 20px 20px", borderTop: "1px solid var(--tc-border)" }}>
          {children}
        </div>
      )}
    </div>
  );
}

// ── Info Row ────────────────────────────────────────────────────────────────────

function InfoRow({ label, value, hint, warn }: {
  label: string; value: React.ReactNode; hint?: string; warn?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2px", padding: "12px 0", borderBottom: "1px solid var(--tc-border)" }}>
      <span style={{ fontSize: "13px", color: "var(--tc-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
        {hint && <span style={{ marginLeft: "6px", fontStyle: "italic", textTransform: "none", letterSpacing: "normal", fontSize: "12px" }}> — {hint}</span>}
      </span>
      <span style={{ fontSize: "16px", color: warn ? "var(--tc-danger, #A40000)" : "var(--tc-text-main)", fontWeight: warn ? "600" : "400" }}>
        {value}
      </span>
    </div>
  );
}

// ── Status Pill ─────────────────────────────────────────────────────────────────

function StatusPill({ ok, okText, badText }: { ok: boolean; okText: string; badText: string }) {
  return (
    <span style={{
      display: "inline-block", padding: "3px 12px", borderRadius: "20px", fontSize: "14px", fontWeight: "600",
      background: ok ? "rgba(42,110,42,0.12)" : "rgba(164,0,0,0.12)",
      color: ok ? "var(--tc-ok, #2A6E2A)" : "var(--tc-danger, #A40000)",
      border: `1px solid ${ok ? "var(--tc-ok, #2A6E2A)" : "var(--tc-danger, #A40000)"}`,
    }}>
      {ok ? okText : badText}
    </span>
  );
}

// ── Sections ────────────────────────────────────────────────────────────────────

function DomainSection({ info }: { info?: DomainInfo | null }) {
  const expiry = daysUntilExpiry(info?.expiresAt);
  const expiryWarn = expiry != null && expiry < 60;
  const ageLabel = domainAgeLabel(info?.registeredAt);
  const registeredMs = info?.registeredAt ? Date.now() - new Date(info.registeredAt).getTime() : null;
  const youngDomain = registeredMs != null && registeredMs < 90 * 86_400_000;

  return (
    <SectionCard title="Domain Information" defaultOpen flagged={youngDomain}>
      <InfoRow label="Registered On" hint="the date this website's address was first created" value={formatDate(info?.registeredAt)} warn={youngDomain} />
      <InfoRow label="Domain Age" hint="how long this website has existed" value={<>{ageLabel}{youngDomain && <span style={{ marginLeft: "10px", fontSize: "14px", color: "var(--tc-danger, #A40000)" }}> — Very new domains are a common scam warning sign</span>}</>} warn={youngDomain} />
      <InfoRow label="Expiry Date" hint="when the website's address registration runs out" value={expiry != null ? `${formatDate(info?.expiresAt)} (${expiry} days remaining)` : formatDate(info?.expiresAt)} warn={expiryWarn} />
      <InfoRow label="Last Updated" value={formatDate(info?.updatedAt)} />
      <InfoRow label="Registrar" hint="the company that manages this domain name registration" value={info?.registrar ?? "Not available"} />
    </SectionCard>
  );
}

function SslSection({ ssl }: { ssl?: SslInfo | null }) {
  const isInvalid = ssl?.valid === false;
  const expirySoon = ssl?.validTo ? (daysUntilExpiry(ssl.validTo) ?? Infinity) < 14 : false;

  return (
    <SectionCard title="SSL Security Certificate" flagged={isInvalid || expirySoon}>
      <div style={{ padding: "12px 0 4px" }}>
        <p style={{ fontSize: "15px", color: "var(--tc-text-muted)", margin: "0 0 12px" }}>
          An SSL certificate encrypts the connection between your browser and the website, protecting your data. Scam sites often have missing, expired, or fake certificates.
        </p>
      </div>
      <InfoRow label="Certificate Status" value={ssl?.valid == null ? "Unknown" : <StatusPill ok={ssl.valid} okText="Valid" badText="Invalid or Missing" />} warn={isInvalid} />
      <InfoRow label="Issued By" hint="the organization that verified and issued this certificate" value={ssl?.issuer ?? "Not available"} />
      <InfoRow label="Protocol Version" hint="the encryption standard used — TLS 1.3 is the most secure" value={ssl?.protocol ?? "Not available"} warn={ssl?.protocol != null && !ssl.protocol.includes("1.3") && !ssl.protocol.includes("1.2")} />
      <InfoRow label="Valid From" value={formatDate(ssl?.validFrom)} />
      <InfoRow label="Valid Until" value={expirySoon ? `${formatDate(ssl?.validTo)} — expires very soon` : formatDate(ssl?.validTo)} warn={expirySoon} />
    </SectionCard>
  );
}

function HostingSection({ hosting }: { hosting?: HostingInfo | null }) {
  return (
    <SectionCard title="Hosting and Location">
      <div style={{ padding: "12px 0 4px" }}>
        <p style={{ fontSize: "15px", color: "var(--tc-text-muted)", margin: "0 0 12px" }}>
          This shows where the website's servers are physically located and who runs them. Servers in high-risk countries or anonymous providers can be a warning sign.
        </p>
      </div>
      <InfoRow label="Server Country" hint="where the computers running this website are located" value={hosting?.country && hosting?.countryCode ? `${hosting.country} (${hosting.countryCode})` : (hosting?.country ?? hosting?.countryCode ?? "Not available")} />
      <InfoRow label="Hosting Provider" hint="the company that provides the server space for this website" value={hosting?.provider ?? "Not available"} />
      <InfoRow label="ASN" hint="Autonomous System Number — a technical ID for the network block" value={hosting?.asn ?? "Not available"} />
      <InfoRow label="IP Address" hint="the unique numeric address of the server" value={hosting?.ipAddress ?? "Not available"} />
    </SectionCard>
  );
}

function SecuritySection({ security }: { security?: SecurityChecks | null }) {
  const anyFlagged = security?.googleSafeBrowsing?.flagged === true || security?.virusTotal?.flagged === true || security?.phishTank?.flagged === true || security?.urlHaus?.flagged === true;
  const vtRatio = security?.virusTotal?.detections != null && security.virusTotal.total
    ? `${security.virusTotal.detections} / ${security.virusTotal.total} scanners flagged`
    : security?.virusTotal?.flagged != null ? (security.virusTotal.flagged ? "Flagged" : "No issues found") : "Not checked";

  return (
    <SectionCard title="Security Database Checks" defaultOpen flagged={anyFlagged}>
      <div style={{ padding: "12px 0 4px" }}>
        <p style={{ fontSize: "15px", color: "var(--tc-text-muted)", margin: "0 0 12px" }}>
          This website was checked against four public databases that track known scam, malware, and phishing sites worldwide.
        </p>
      </div>

      {/* Google Safe Browsing */}
      <div style={{ padding: "12px 0", borderBottom: "1px solid var(--tc-border)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
          <div>
            <div style={{ fontSize: "16px", fontWeight: "500", color: "var(--tc-text-main)" }}>Google Safe Browsing</div>
            <div style={{ fontSize: "13px", color: "var(--tc-text-muted)", marginTop: "2px" }}>Google's global list of dangerous websites</div>
          </div>
          {security?.googleSafeBrowsing != null ? (
            <StatusPill ok={!security.googleSafeBrowsing.flagged} okText="No Issues" badText={`Flagged${security.googleSafeBrowsing.threatType ? `: ${security.googleSafeBrowsing.threatType}` : ""}`} />
          ) : (
            <span style={{ fontSize: "14px", color: "var(--tc-text-muted)" }}>Not checked</span>
          )}
        </div>
      </div>

      {/* VirusTotal */}
      <div style={{ padding: "12px 0", borderBottom: "1px solid var(--tc-border)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
          <div>
            <div style={{ fontSize: "16px", fontWeight: "500", color: "var(--tc-text-main)" }}>VirusTotal</div>
            <div style={{ fontSize: "13px", color: "var(--tc-text-muted)", marginTop: "2px" }}>Scanned by 70+ antivirus and security engines</div>
          </div>
          <span style={{ fontSize: "14px", fontWeight: "600", color: security?.virusTotal?.flagged ? "var(--tc-danger, #A40000)" : "var(--tc-ok, #2A6E2A)" }}>{vtRatio}</span>
        </div>
      </div>

      {/* PhishTank */}
      <div style={{ padding: "12px 0", borderBottom: "1px solid var(--tc-border)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
          <div>
            <div style={{ fontSize: "16px", fontWeight: "500", color: "var(--tc-text-main)" }}>PhishTank</div>
            <div style={{ fontSize: "13px", color: "var(--tc-text-muted)", marginTop: "2px" }}>Community-verified phishing site database</div>
          </div>
          {security?.phishTank != null ? (
            <StatusPill ok={!security.phishTank.flagged} okText="Not Listed" badText="Listed as Phishing" />
          ) : (
            <span style={{ fontSize: "14px", color: "var(--tc-text-muted)" }}>Not checked</span>
          )}
        </div>
      </div>

      {/* URLhaus */}
      <div style={{ padding: "12px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
          <div>
            <div style={{ fontSize: "16px", fontWeight: "500", color: "var(--tc-text-main)" }}>URLhaus</div>
            <div style={{ fontSize: "13px", color: "var(--tc-text-muted)", marginTop: "2px" }}>Tracks URLs used to distribute malware</div>
          </div>
          {security?.urlHaus != null ? (
            <StatusPill ok={!security.urlHaus.flagged} okText="Not Listed" badText={`Listed${security.urlHaus.threat ? `: ${security.urlHaus.threat}` : " as Malware"}`} />
          ) : (
            <span style={{ fontSize: "14px", color: "var(--tc-text-muted)" }}>Not checked</span>
          )}
        </div>
      </div>
    </SectionCard>
  );
}

function TrancoSection({ tranco }: { tranco?: { rank: number | null; isPopular: boolean } | null }) {
  if (tranco === undefined) return null;

  if (tranco === null) {
    return (
      <SectionCard title="Website Popularity">
        <p style={{ fontSize: "15px", color: "var(--tc-text-muted)", padding: "12px 0" }}>
          Could not retrieve popularity data for this website. This may be a temporary issue.
        </p>
      </SectionCard>
    );
  }

  if (tranco.rank === null) {
    return (
      <SectionCard title="Website Popularity">
        <p style={{ fontSize: "15px", color: "var(--tc-text-muted)", padding: "12px 0" }}>
          This website is not in the top 1 million most visited sites globally.
          This does not necessarily mean it is suspicious — many legitimate small businesses are not ranked.
        </p>
      </SectionCard>
    );
  }

  const rank = tranco.rank;
  const tierLabel = rank <= 10_000 ? "Top 10,000" : rank <= 100_000 ? "Top 100,000" : "Top 1,000,000";
  const tierColor = rank <= 10_000 ? "var(--tc-ok, #2A6E2A)" : rank <= 100_000 ? "var(--tc-caution, #B08A00)" : "var(--tc-text-muted)";
  const barPercent = Math.max(2, Math.min(100, (1 - Math.log10(rank) / Math.log10(1_000_000)) * 100));

  return (
    <SectionCard title="Website Popularity">
      <InfoRow label="Global Rank" value={`#${rank.toLocaleString("en-CA")}`} hint="position among the world's most visited websites" />
      <InfoRow label="Tier" value={<span style={{ color: tierColor, fontWeight: 600 }}>{tierLabel}</span>} />
      <div style={{ padding: "12px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--tc-text-muted)", marginBottom: "6px" }}>
          <span>Most popular</span>
          <span>Least popular</span>
        </div>
        <div style={{ width: "100%", height: "8px", borderRadius: "4px", background: "var(--tc-border)" }}>
          <div style={{ width: `${barPercent}%`, height: "8px", borderRadius: "4px", background: tierColor, transition: "width 0.3s ease" }} />
        </div>
      </div>
      {tranco.isPopular && (
        <div style={{ display: "inline-block", padding: "4px 12px", borderRadius: "9999px", fontSize: "13px", fontWeight: 600,
          background: "rgba(42,110,42,0.12)", color: "var(--tc-ok, #2A6E2A)", border: "1px solid var(--tc-ok, #2A6E2A)" }}>
          Well-known website
        </div>
      )}
    </SectionCard>
  );
}

function DnsSection({ dns }: { dns?: DnsInfo | null }) {
  const hasData = (dns?.nameservers?.length ?? 0) > 0 || (dns?.mxRecords?.length ?? 0) > 0;

  return (
    <SectionCard title="DNS Records">
      <div style={{ padding: "12px 0 4px" }}>
        <p style={{ fontSize: "15px", color: "var(--tc-text-muted)", margin: "0 0 12px" }}>
          DNS records control how the internet finds this website and handles its email. Generic or privacy-shielded nameservers are common on disposable scam sites.
        </p>
      </div>
      {!hasData ? (
        <p style={{ fontSize: "15px", color: "var(--tc-text-muted)", padding: "8px 0" }}>No DNS data available for this domain.</p>
      ) : (
        <>
          {(dns?.nameservers?.length ?? 0) > 0 && (
            <InfoRow label="Nameservers" hint="the servers that direct traffic to this website" value={
              <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                {dns!.nameservers!.map((ns) => (
                  <li key={ns} style={{ fontSize: "15px", color: "var(--tc-text-main)", padding: "2px 0" }}>— {ns}</li>
                ))}
              </ul>
            } />
          )}
          {(dns?.mxRecords?.length ?? 0) > 0 && (
            <InfoRow label="Mail Servers (MX)" hint="the servers that handle email for this domain" value={
              <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                {dns!.mxRecords!.map((mx) => (
                  <li key={mx} style={{ fontSize: "15px", color: "var(--tc-text-main)", padding: "2px 0" }}>— {mx}</li>
                ))}
              </ul>
            } />
          )}
        </>
      )}
    </SectionCard>
  );
}

// ── Root Component ──────────────────────────────────────────────────────────────

export default function WebsiteReport({ domain, osint, trustScore }: WebsiteReportProps) {
  const scannedAt = new Date().toLocaleString("en-CA", { dateStyle: "medium", timeStyle: "short" });

  return (
    <article style={{ maxWidth: "720px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "16px", fontFamily: "system-ui, -apple-system, sans-serif" }}
      aria-label={`Security report for ${domain}`}>

      {/* Report Header */}
      <div style={{
        background: "var(--tc-surface)", border: "1px solid var(--tc-border)",
        borderTop: "4px solid var(--tc-primary, #A40000)", borderRadius: "10px",
        padding: "24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", textAlign: "center",
      }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "var(--tc-text-main)", margin: "0 0 4px", wordBreak: "break-all" }}>{domain}</h1>
          <p style={{ fontSize: "14px", color: "var(--tc-text-muted)", margin: 0 }}>Security report generated on {scannedAt}</p>
        </div>
        <TrustGauge score={trustScore.score} grade={trustScore.grade} label={trustScore.label} />
        <p style={{ fontSize: "13px", color: "var(--tc-text-muted)", maxWidth: "480px", margin: 0, lineHeight: "1.6" }}>
          This score reflects the probability of risk based on available signals at the time of this scan. It is not a guarantee of safety or danger. Always use your own judgment before sharing personal information online.
        </p>
      </div>

      {/* OSINT Sections */}
      <DomainSection info={osint?.domain} />
      <SslSection ssl={osint?.ssl} />
      <HostingSection hosting={osint?.hosting} />
      <SecuritySection security={osint?.security} />
      <TrancoSection tranco={osint?.tranco} />
      <DnsSection dns={osint?.dns} />

      {/* Footer Disclaimer */}
      <div style={{
        padding: "16px 20px", background: "var(--tc-surface)", border: "1px solid var(--tc-border)",
        borderRadius: "10px", fontSize: "13px", color: "var(--tc-text-muted)", lineHeight: "1.7", textAlign: "center",
      }}>
        TrustChekr provides this report for informational purposes only. Scores and signals are probabilistic and may not reflect real-time changes.
        Report scam websites to the <strong>Canadian Anti-Fraud Centre</strong> at <strong>antifraudcentre-centreantifraude.ca</strong> or call <strong>1-888-495-8501</strong>.
      </div>
    </article>
  );
}
