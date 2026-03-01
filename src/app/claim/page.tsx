"use client";

import { useState } from "react";

export default function ClaimPage() {
  const [form, setForm] = useState({ domain: "", name: "", email: "", role: "owner", evidence: "", method: "meta_tag" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Something went wrong.");
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <main style={{ maxWidth: "640px", margin: "40px auto", padding: "0 16px", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ background: "var(--tc-surface)", border: "1px solid var(--tc-border)", borderRadius: "12px", padding: "40px 28px", textAlign: "center" }}>
          <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "var(--tc-ok, #2A6E2A)", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <h1 style={{ fontSize: "22px", fontWeight: 700, color: "var(--tc-text-main)", margin: "0 0 8px" }}>Claim Submitted</h1>
          <p style={{ fontSize: "16px", color: "var(--tc-text-muted)", margin: "0 0 24px" }}>
            We will review your claim within 5 business days and email you at <strong>{form.email}</strong>.
          </p>
          <button onClick={() => { setStatus("idle"); setForm({ domain: "", name: "", email: "", role: "owner", evidence: "", method: "meta_tag" }); }}
            style={{ padding: "12px 24px", background: "var(--tc-primary, #A40000)", color: "#fff", border: "none", borderRadius: "8px", fontSize: "16px", fontWeight: 600, cursor: "pointer" }}>
            Submit another claim
          </button>
        </div>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: "640px", margin: "40px auto", padding: "0 16px 48px", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--tc-text-main)", margin: "0 0 8px" }}>Claim Your Website</h1>
      <p style={{ fontSize: "16px", color: "var(--tc-text-muted)", margin: "0 0 8px" }}>
        If your website received a low trust score, you can submit evidence to request a review.
        This is free — we believe website owners should not have to pay to defend their reputation.
      </p>
      <div style={{ display: "inline-block", padding: "4px 12px", borderRadius: "9999px", fontSize: "13px", fontWeight: 600,
        background: "rgba(42,110,42,0.12)", color: "var(--tc-ok, #2A6E2A)", border: "1px solid var(--tc-ok, #2A6E2A)", marginBottom: "24px" }}>
        100% free — no payment required
      </div>

      {status === "error" && (
        <div role="alert" style={{ padding: "12px 16px", background: "rgba(164,0,0,0.08)", border: "1px solid var(--tc-danger, #A40000)", borderRadius: "8px", color: "var(--tc-danger, #A40000)", fontSize: "14px", marginBottom: "16px" }}>
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ background: "var(--tc-surface)", border: "1px solid var(--tc-border)", borderRadius: "12px", padding: "28px", display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label htmlFor="domain" style={{ fontSize: "14px", fontWeight: 600, color: "var(--tc-text-main)" }}>Domain</label>
          <input id="domain" type="text" required value={form.domain} onChange={e => update("domain", e.target.value)}
            placeholder="example.com" style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--tc-border)", fontSize: "16px", background: "var(--tc-surface)", color: "var(--tc-text-main)" }} />
          <span style={{ fontSize: "12px", color: "var(--tc-text-muted)" }}>Do not include https:// or www.</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label htmlFor="name" style={{ fontSize: "14px", fontWeight: 600, color: "var(--tc-text-main)" }}>Your name</label>
          <input id="name" type="text" required value={form.name} onChange={e => update("name", e.target.value)}
            style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--tc-border)", fontSize: "16px", background: "var(--tc-surface)", color: "var(--tc-text-main)" }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label htmlFor="email" style={{ fontSize: "14px", fontWeight: 600, color: "var(--tc-text-main)" }}>Your email</label>
          <input id="email" type="email" required value={form.email} onChange={e => update("email", e.target.value)}
            style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--tc-border)", fontSize: "16px", background: "var(--tc-surface)", color: "var(--tc-text-main)" }} />
          <span style={{ fontSize: "12px", color: "var(--tc-text-muted)" }}>We will contact you about the review.</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label htmlFor="role" style={{ fontSize: "14px", fontWeight: 600, color: "var(--tc-text-main)" }}>Your role</label>
          <select id="role" value={form.role} onChange={e => update("role", e.target.value)}
            style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--tc-border)", fontSize: "16px", background: "var(--tc-surface)", color: "var(--tc-text-main)" }}>
            <option value="owner">Owner</option>
            <option value="developer">Developer</option>
            <option value="marketing">Marketing</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label htmlFor="evidence" style={{ fontSize: "14px", fontWeight: 600, color: "var(--tc-text-main)" }}>Evidence</label>
          <textarea id="evidence" required maxLength={2000} rows={5} value={form.evidence} onChange={e => update("evidence", e.target.value)}
            placeholder="Explain why the score is incorrect. Include links to your business registration, social media, or other proof."
            style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--tc-border)", fontSize: "16px", background: "var(--tc-surface)", color: "var(--tc-text-main)", resize: "vertical" }} />
          <span style={{ fontSize: "12px", color: form.evidence.length > 1900 ? "var(--tc-danger, #A40000)" : "var(--tc-text-muted)", textAlign: "right" }}>{form.evidence.length} / 2,000</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "14px", fontWeight: 600, color: "var(--tc-text-main)" }}>Verification method</label>
          {([ ["meta_tag", "I can add a meta tag to my site"], ["dns_txt", "I can add a DNS TXT record"], ["other_proof", "I will provide other proof"] ] as const).map(([val, text]) => (
            <label key={val} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", borderRadius: "8px",
              border: form.method === val ? "2px solid var(--tc-primary, #A40000)" : "1px solid var(--tc-border)",
              cursor: "pointer", fontSize: "15px", color: "var(--tc-text-main)" }}>
              <input type="radio" name="method" value={val} checked={form.method === val} onChange={e => update("method", e.target.value)} />
              {text}
            </label>
          ))}
        </div>

        <div style={{ padding: "12px 16px", borderLeft: "3px solid var(--tc-border)", fontSize: "13px", color: "var(--tc-text-muted)", background: "var(--tc-surface)" }}>
          Submitting a claim does not guarantee a score change. All claims are reviewed manually.
        </div>

        <button type="submit" disabled={status === "submitting"}
          style={{ padding: "14px", background: "var(--tc-primary, #A40000)", color: "#fff", border: "none", borderRadius: "8px", fontSize: "16px", fontWeight: 600, cursor: status === "submitting" ? "wait" : "pointer", opacity: status === "submitting" ? 0.7 : 1 }}>
          {status === "submitting" ? "Submitting..." : "Submit Claim for Review"}
        </button>
      </form>
    </main>
  );
}
