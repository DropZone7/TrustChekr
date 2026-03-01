import type { Metadata } from "next";
import { BackButton } from '@/components/BackButton';

export const metadata: Metadata = {
  title: "Privacy Policy & Terms — TrustChekr",
  description: "How TrustChekr handles your data. PIPEDA and CCPA compliant. We never sell your information.",
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-col gap-6">
      <BackButton />
      <h1 className="text-2xl font-bold" style={{ color: "var(--tc-primary)" }}>
        Privacy Policy & Terms of Use
      </h1>
      <p className="text-sm" style={{ color: "var(--tc-text-muted)" }}>
        Last updated: February 27, 2026
      </p>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-bold" style={{ color: "var(--tc-text-main)" }}>Our Promise</h2>
        <p>TrustChekr is a free Canadian scam detection tool. We are built on a simple principle: <strong>your privacy comes first</strong>. We do not require accounts, we do not sell your data, and we do not track you across the internet.</p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-bold" style={{ color: "var(--tc-text-main)" }}>Information We Process</h2>
        <p><strong>When you scan something:</strong> URLs, phone numbers, emails, messages, and wallet addresses you submit are processed in real-time to generate a risk assessment. This data is sent to third-party security databases (listed below) for analysis and is <strong>not stored long-term</strong> by TrustChekr.</p>
        <p><strong>When you report a scam:</strong> The scam details you provide (type, channel, description, scammer contact info) are stored to improve our detection capabilities and warn other users. Your email is stored only if you provide it and consent to contact.</p>
        <p><strong>Technical data:</strong> We collect basic technical information (IP address, browser type) for security, rate limiting, and abuse prevention. IP addresses are not linked to scan queries and are retained for no more than 30 days.</p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-bold" style={{ color: "var(--tc-text-main)" }}>Third-Party Security Services</h2>
        <p>To assess risk, we may send the content you submit to these security databases:</p>
        <ul className="flex flex-col gap-1 ml-4">
          <li>• Google Safe Browsing (malware and phishing detection)</li>
          <li>• VirusTotal (multi-vendor security scanning)</li>
          <li>• PhishTank (community phishing database)</li>
          <li>• URLhaus / abuse.ch (malware URL database)</li>
          <li>• RDAP / WHOIS (domain registration data)</li>
          <li>• XRPL public ledger (cryptocurrency transaction data)</li>
          <li>• Blockchain explorers (public blockchain data)</li>
        </ul>
        <p className="text-sm" style={{ color: "var(--tc-text-muted)" }}>These services receive only the specific item you submitted (e.g., a URL or email address), not your personal information.</p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-bold" style={{ color: "var(--tc-text-main)" }}>What We Do NOT Do</h2>
        <ul className="flex flex-col gap-1 ml-4">
          <li>• ❌ We do not sell or share your personal information</li>
          <li>• ❌ We do not require user accounts or registration</li>
          <li>• ❌ We do not use advertising trackers or third-party ad networks</li>
          <li>• ❌ We do not store your scan queries long-term</li>
          <li>• ❌ We do not profile you or build user dossiers</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-bold" style={{ color: "var(--tc-text-main)" }}>Cookies</h2>
        <p>TrustChekr uses only essential cookies for security and functionality (e.g., accessibility preferences like text size and high contrast mode). We do not use analytics cookies or third-party tracking cookies.</p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-bold" style={{ color: "var(--tc-text-main)" }}>Data Retention</h2>
        <ul className="flex flex-col gap-1 ml-4">
          <li>• <strong>Scan queries:</strong> Not stored beyond the duration of the request</li>
          <li>• <strong>Scam reports:</strong> Stored until no longer needed for fraud analysis, with option to request deletion</li>
          <li>• <strong>Technical logs:</strong> Retained up to 30 days for security purposes</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-bold" style={{ color: "var(--tc-text-main)" }}>Your Rights (PIPEDA & CCPA)</h2>
        <p><strong>Canadian residents (PIPEDA):</strong> You have the right to access, correct, or delete any personal information we hold about you. Contact us to make a request.</p>
        <p><strong>California residents (CCPA):</strong> We do not sell personal information. You have the right to know what data we collect, request deletion, and opt out of any future sale (which we do not engage in).</p>
        <p><strong>All users:</strong> You may request deletion of any scam report you submitted by contacting us with details of your submission.</p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-bold" style={{ color: "var(--tc-text-main)" }}>Disclaimer & Limitation of Liability</h2>
        <div className="p-4 rounded-xl border" style={{ borderColor: "var(--tc-border)", background: "var(--tc-surface)" }}>
          <p className="mb-2"><strong>TrustChekr provides automated risk assessments for informational purposes only.</strong></p>
          <p className="mb-2">Our tool does not guarantee the detection of all scams. New scam domains, phone numbers, and tactics are created daily. No automated system can catch everything.</p>
          <p className="mb-2"><strong>This is not legal, financial, or professional advice.</strong> Always verify high-value transactions through independent channels — type official website addresses directly into your browser, or call using numbers from official company materials.</p>
          <p className="mb-2">To the maximum extent permitted by applicable law, TrustChekr's total liability for any claim arising from use of the service shall not exceed CAD $100 or the amount you paid for the service in the twelve months preceding the claim, whichever is greater.</p>
          <p>TrustChekr shall not be liable for indirect, consequential, or incidental damages, including lost profits, lost revenue, or loss of funds resulting from scam, fraud, or security events.</p>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-bold" style={{ color: "var(--tc-text-main)" }}>User Responsibilities</h2>
        <ul className="flex flex-col gap-1 ml-4">
          <li>• Do not submit other people's personal information (SIN, passwords, full card numbers) through our scanner</li>
          <li>• Do not use TrustChekr to harass, dox, or stalk individuals</li>
          <li>• Do not rely solely on TrustChekr for financial decisions of any significance</li>
          <li>• Report scams truthfully and in good faith</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-bold" style={{ color: "var(--tc-text-main)" }}>Affiliate Disclosure</h2>
        <p>TrustChekr may recommend security products and services. Some of these recommendations contain affiliate links. If you click and purchase through our links, we may receive a commission at no additional cost to you. These partnerships help us continue providing free fraud prevention tools. We only recommend products we believe genuinely help protect users.</p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-bold" style={{ color: "var(--tc-text-main)" }}>Contact</h2>
        <p>For privacy inquiries, data deletion requests, or questions about this policy:</p>
        <p><strong>Email:</strong> privacy@trustchekr.com</p>
        <p><strong>Website:</strong> trustchekr.com</p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-bold" style={{ color: "var(--tc-text-main)" }}>Changes to This Policy</h2>
        <p>We may update this policy from time to time. Material changes will be posted on this page with an updated date. Continued use of TrustChekr after changes constitutes acceptance of the updated policy.</p>
      </section>

      <p className="text-sm text-center mt-4" style={{ color: "var(--tc-text-muted)" }}>
        TrustChekr is made in Canada 🇨🇦
      </p>
    </div>
  );
}
