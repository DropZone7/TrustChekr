"use client";

import { useState } from "react";

const SCAM_TYPES = [
  { value: "cra_tax", label: "CRA / Tax Scam" },
  { value: "banking", label: "Banking / Financial" },
  { value: "romance", label: "Romance Scam" },
  { value: "crypto_investment", label: "Crypto / Investment" },
  { value: "tech_support", label: "Tech Support Scam" },
  { value: "delivery", label: "Delivery / Shipping" },
  { value: "job_offer", label: "Fake Job Offer" },
  { value: "marketplace", label: "Marketplace / Buy & Sell" },
  { value: "other", label: "Other" },
];

const CHANNELS = [
  { value: "phone", label: "Phone Call" },
  { value: "sms", label: "Text / SMS" },
  { value: "email", label: "Email" },
  { value: "website", label: "Website" },
  { value: "social", label: "Social Media" },
  { value: "in_person", label: "In Person" },
  { value: "other", label: "Other" },
];

export default function ReportPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    scamType: "",
    channel: "",
    description: "",
    phoneNumbers: "",
    emails: "",
    urls: "",
    walletAddresses: "",
    amountLost: "",
    dateOccurred: "",
    reporterEmail: "",
    consentToContact: false,
    reportedToCAFC: false,
    province: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just show confirmation — backend storage comes later
    setSubmitted(true);
  };

  const update = (field: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  if (submitted) {
    return (
      <div className="flex flex-col gap-6">
        <div className="text-center py-8">
          <p className="text-4xl mb-4">✅</p>
          <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--tc-primary)" }}>
            Thank You for Reporting
          </h1>
          <p className="text-lg mb-6" style={{ color: "var(--tc-text-muted)" }}>
            Your report helps protect other Canadians from this scam.
          </p>
        </div>

        <div className="p-5 rounded-xl border" style={{ borderColor: "var(--tc-accent)", background: "var(--tc-surface)" }}>
          <p className="font-semibold mb-2" style={{ color: "var(--tc-accent)" }}>📋 We also recommend reporting to:</p>
          <ul className="flex flex-col gap-2 text-sm">
            <li>• <strong>Canadian Anti-Fraud Centre (CAFC):</strong> 1-888-495-8501 or antifraudcentre-centreantifraude.ca</li>
            <li>• <strong>Your bank</strong> — call the number on the back of your card</li>
            <li>• <strong>Local police</strong> — non-emergency line</li>
            {form.amountLost && Number(form.amountLost) > 0 && (
              <li>• <strong>Your credit bureau</strong> — Equifax (1-800-465-7166) or TransUnion (1-800-663-9980) to place a fraud alert</li>
            )}
          </ul>
        </div>

        <div className="p-4 rounded-xl border" style={{ borderColor: "var(--tc-border)", background: "var(--tc-surface)" }}>
          <p className="text-sm" style={{ color: "var(--tc-text-muted)" }}>
            <strong>What happens next:</strong> Your report contributes to our scam detection database, helping us identify
            new patterns and protect future users. We do not share your personal contact information with anyone.
          </p>
        </div>

        <button
          onClick={() => { setSubmitted(false); setForm({ scamType: "", channel: "", description: "", phoneNumbers: "", emails: "", urls: "", walletAddresses: "", amountLost: "", dateOccurred: "", reporterEmail: "", consentToContact: false, reportedToCAFC: false, province: "" }); }}
          className="w-full py-4 rounded-xl text-lg font-semibold border-2 cursor-pointer"
          style={{ borderColor: "var(--tc-primary)", color: "var(--tc-primary)", background: "var(--tc-surface)" }}
        >
          Submit Another Report
        </button>

        <a
          href="/"
          className="w-full py-4 rounded-xl text-lg font-semibold text-center block"
          style={{ background: "var(--tc-primary)", color: "white" }}
        >
          Back to Scam Checker
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--tc-primary)" }}>
          Report a Scam
        </h1>
        <p style={{ color: "var(--tc-text-muted)" }}>
          Help protect other Canadians by reporting scams you've encountered.
          Your report is anonymous unless you choose to share your email.
        </p>
      </div>

      <div className="p-4 rounded-xl border" style={{ borderColor: "var(--tc-safe)", background: "var(--tc-surface)" }}>
        <p className="text-sm" style={{ color: "var(--tc-text-main)" }}>
          <strong>Your privacy is protected.</strong> We never share your personal information.
          Reports are used only to improve scam detection and warn others. You don't need an account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Scam Type */}
        <fieldset>
          <label className="block font-semibold mb-2" style={{ color: "var(--tc-text-main)" }}>
            What type of scam was this? <span style={{ color: "var(--tc-danger)" }}>*</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {SCAM_TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => update("scamType", t.value)}
                className="p-3 rounded-lg border text-sm font-medium cursor-pointer transition-all"
                style={{
                  borderColor: form.scamType === t.value ? "var(--tc-primary)" : "var(--tc-border)",
                  background: form.scamType === t.value ? "var(--tc-primary-soft)" : "var(--tc-surface)",
                  color: form.scamType === t.value ? "var(--tc-primary)" : "var(--tc-text-main)",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Channel */}
        <fieldset>
          <label className="block font-semibold mb-2" style={{ color: "var(--tc-text-main)" }}>
            How did the scammer contact you? <span style={{ color: "var(--tc-danger)" }}>*</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {CHANNELS.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => update("channel", c.value)}
                className="p-3 rounded-lg border text-sm font-medium cursor-pointer transition-all"
                style={{
                  borderColor: form.channel === c.value ? "var(--tc-primary)" : "var(--tc-border)",
                  background: form.channel === c.value ? "var(--tc-primary-soft)" : "var(--tc-surface)",
                  color: form.channel === c.value ? "var(--tc-primary)" : "var(--tc-text-main)",
                }}
              >
                {c.label}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Description */}
        <fieldset>
          <label className="block font-semibold mb-2" style={{ color: "var(--tc-text-main)" }}>
            What happened? <span style={{ color: "var(--tc-danger)" }}>*</span>
          </label>
          <p className="text-sm mb-2" style={{ color: "var(--tc-text-muted)" }}>
            Describe the scam in your own words. Include what they said, what they asked for, and anything that seemed suspicious.
            Don't include your own personal information like SIN or full card numbers.
          </p>
          <textarea
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            rows={5}
            className="w-full p-3 rounded-lg border text-base"
            style={{ borderColor: "var(--tc-border)", background: "var(--tc-surface)", color: "var(--tc-text-main)" }}
            placeholder="Example: I got a text saying my CRA account was locked and I needed to click a link to verify my identity..."
            required
          />
        </fieldset>

        {/* Scammer Contact Info */}
        <fieldset>
          <label className="block font-semibold mb-2" style={{ color: "var(--tc-text-main)" }}>
            Scammer's contact details (any you have)
          </label>
          <p className="text-sm mb-3" style={{ color: "var(--tc-text-muted)" }}>
            These help us track and flag the scam for others. All fields are optional.
          </p>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              value={form.phoneNumbers}
              onChange={(e) => update("phoneNumbers", e.target.value)}
              className="w-full p-3 rounded-lg border text-base"
              style={{ borderColor: "var(--tc-border)", background: "var(--tc-surface)", color: "var(--tc-text-main)" }}
              placeholder="Phone number(s) they used"
            />
            <input
              type="text"
              value={form.emails}
              onChange={(e) => update("emails", e.target.value)}
              className="w-full p-3 rounded-lg border text-base"
              style={{ borderColor: "var(--tc-border)", background: "var(--tc-surface)", color: "var(--tc-text-main)" }}
              placeholder="Email address(es) they used"
            />
            <input
              type="text"
              value={form.urls}
              onChange={(e) => update("urls", e.target.value)}
              className="w-full p-3 rounded-lg border text-base"
              style={{ borderColor: "var(--tc-border)", background: "var(--tc-surface)", color: "var(--tc-text-main)" }}
              placeholder="Website URL(s) they sent you to"
            />
            <input
              type="text"
              value={form.walletAddresses}
              onChange={(e) => update("walletAddresses", e.target.value)}
              className="w-full p-3 rounded-lg border text-base"
              style={{ borderColor: "var(--tc-border)", background: "var(--tc-surface)", color: "var(--tc-text-main)" }}
              placeholder="Crypto wallet address(es) they gave you"
            />
          </div>
        </fieldset>

        {/* Financial Impact */}
        <div className="grid grid-cols-2 gap-4">
          <fieldset>
            <label className="block font-semibold mb-2" style={{ color: "var(--tc-text-main)" }}>
              Amount lost (CAD)
            </label>
            <input
              type="number"
              value={form.amountLost}
              onChange={(e) => update("amountLost", e.target.value)}
              className="w-full p-3 rounded-lg border text-base"
              style={{ borderColor: "var(--tc-border)", background: "var(--tc-surface)", color: "var(--tc-text-main)" }}
              placeholder="0"
              min="0"
            />
          </fieldset>
          <fieldset>
            <label className="block font-semibold mb-2" style={{ color: "var(--tc-text-main)" }}>
              When did it happen?
            </label>
            <input
              type="date"
              value={form.dateOccurred}
              onChange={(e) => update("dateOccurred", e.target.value)}
              className="w-full p-3 rounded-lg border text-base"
              style={{ borderColor: "var(--tc-border)", background: "var(--tc-surface)", color: "var(--tc-text-main)" }}
            />
          </fieldset>
        </div>

        {/* Province */}
        <fieldset>
          <label className="block font-semibold mb-2" style={{ color: "var(--tc-text-main)" }}>
            Your province (helps us track regional patterns)
          </label>
          <select
            value={form.province}
            onChange={(e) => update("province", e.target.value)}
            className="w-full p-3 rounded-lg border text-base"
            style={{ borderColor: "var(--tc-border)", background: "var(--tc-surface)", color: "var(--tc-text-main)" }}
          >
            <option value="">Prefer not to say</option>
            <option value="AB">Alberta</option>
            <option value="BC">British Columbia</option>
            <option value="MB">Manitoba</option>
            <option value="NB">New Brunswick</option>
            <option value="NL">Newfoundland & Labrador</option>
            <option value="NS">Nova Scotia</option>
            <option value="NT">Northwest Territories</option>
            <option value="NU">Nunavut</option>
            <option value="ON">Ontario</option>
            <option value="PE">Prince Edward Island</option>
            <option value="QC">Quebec</option>
            <option value="SK">Saskatchewan</option>
            <option value="YT">Yukon</option>
          </select>
        </fieldset>

        {/* CAFC */}
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.reportedToCAFC}
            onChange={(e) => update("reportedToCAFC", e.target.checked)}
            className="mt-1"
          />
          <span style={{ color: "var(--tc-text-main)" }}>
            I have also reported this to the Canadian Anti-Fraud Centre (CAFC)
          </span>
        </label>

        {/* Optional Contact */}
        <fieldset>
          <label className="block font-semibold mb-2" style={{ color: "var(--tc-text-main)" }}>
            Your email (optional — only if you want updates)
          </label>
          <input
            type="email"
            value={form.reporterEmail}
            onChange={(e) => update("reporterEmail", e.target.value)}
            className="w-full p-3 rounded-lg border text-base"
            style={{ borderColor: "var(--tc-border)", background: "var(--tc-surface)", color: "var(--tc-text-main)" }}
            placeholder="your@email.com (optional)"
          />
          {form.reporterEmail && (
            <label className="flex items-start gap-3 cursor-pointer mt-2">
              <input
                type="checkbox"
                checked={form.consentToContact}
                onChange={(e) => update("consentToContact", e.target.checked)}
                className="mt-1"
              />
              <span className="text-sm" style={{ color: "var(--tc-text-muted)" }}>
                I consent to being contacted about this report. My email will not be shared with anyone else.
              </span>
            </label>
          )}
        </fieldset>

        <button
          type="submit"
          disabled={!form.scamType || !form.channel || !form.description}
          className="w-full py-4 rounded-xl text-lg font-semibold cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: "var(--tc-primary)", color: "white" }}
        >
          Submit Report
        </button>

        <p className="text-xs text-center" style={{ color: "var(--tc-text-muted)" }}>
          By submitting, you confirm this report is truthful to the best of your knowledge.
          TrustChekr stores reports to improve scam detection. We never share your personal contact information.
          <a href="/privacy" className="underline ml-1">Privacy Policy</a>
        </p>
      </form>
    </div>
  );
}
