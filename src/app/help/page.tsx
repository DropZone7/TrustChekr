import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Help & Emergency Contacts',
  description: 'Get help with TrustChekr, find emergency fraud contacts, and learn what to do if you have been scammed.',
};

export default function HelpPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="text-center pt-4">
        <h1 className="text-3xl font-bold" style={{ color: "var(--tc-primary)" }}>
          Need Help?
        </h1>
        <p className="mt-2" style={{ color: "var(--tc-text-muted)" }}>
          If you think you've been scammed or need someone to talk to, these resources can help.
        </p>
      </div>

      {/* Emergency contacts */}
      <section
        className="p-6 rounded-xl border-2"
        style={{ borderColor: "var(--tc-danger)", background: "#fdedec" }}
      >
        <h2 className="text-lg font-bold mb-3" style={{ color: "var(--tc-danger)" }}>
          If you already sent money
        </h2>
        <ul className="flex flex-col gap-3">
          <li className="flex gap-2">
            <span style={{ color: "var(--tc-primary)", fontWeight: 700 }}>1.</span>
            <div>
              <p className="font-semibold">Call your bank or credit card company right away</p>
              <p className="text-sm" style={{ color: "var(--tc-text-muted)" }}>
                Use the number on the back of your card. They may be able to stop or reverse the payment.
              </p>
            </div>
          </li>
          <li className="flex gap-2">
            <span>🇨🇦</span>
            <div>
              <p className="font-semibold">Canadian Anti-Fraud Centre (CAFC)</p>
              <p className="text-sm" style={{ color: "var(--tc-text-muted)" }}>
                1-888-495-8501 — Report fraud and get guidance
              </p>
            </div>
          </li>
          <li className="flex gap-2">
            <span>🇺🇸</span>
            <div>
              <p className="font-semibold">Federal Trade Commission (FTC)</p>
              <p className="text-sm" style={{ color: "var(--tc-text-muted)" }}>
                reportfraud.ftc.gov — File a report online
              </p>
            </div>
          </li>
          <li className="flex gap-2">
            <span style={{ color: "var(--tc-primary)", fontWeight: 700 }}>4.</span>
            <div>
              <p className="font-semibold">Your local police (non-emergency line)</p>
              <p className="text-sm" style={{ color: "var(--tc-text-muted)" }}>
                File a report, especially if you lost a large amount of money
              </p>
            </div>
          </li>
        </ul>
      </section>

      {/* Emotional support */}
      <section
        className="p-6 rounded-xl border"
        style={{ borderColor: "var(--tc-accent)", background: "#eaf2f8" }}
      >
        <h2 className="text-lg font-bold mb-3" style={{ color: "var(--tc-accent)" }}>
          Feeling overwhelmed or embarrassed?
        </h2>
        <p className="mb-3">
          Being scammed can feel terrible. You might feel angry, embarrassed, or ashamed. Those feelings are completely normal — but please know:
        </p>
        <ul className="flex flex-col gap-2">
          <li>• <strong>You are not stupid.</strong> Scammers are professionals who do this full-time.</li>
          <li>• <strong>It's not your fault.</strong> Scams are designed to exploit trust and emotions.</li>
          <li>• <strong>You're not alone.</strong> Millions of people fall victim to scams every year, including very smart people.</li>
          <li>• <strong>Talking helps.</strong> Tell a trusted friend, family member, or counselor what happened.</li>
        </ul>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="text-xl font-bold mb-4" style={{ color: "var(--tc-text-main)" }}>
          Common Questions
        </h2>
        <div className="flex flex-col gap-4">
          {[
            {
              q: "Is TrustChekr free?",
              a: "Yes. Basic scam checks are completely free and always will be.",
            },
            {
              q: "Do you store what I paste?",
              a: "No. We don't store your messages, links, or personal information. Your checks are private.",
            },
            {
              q: "Can TrustChekr guarantee something is safe?",
              a: "No. TrustChekr spots common scam patterns, but no tool can guarantee something is 100% safe. Always trust your instincts and be cautious with money and personal info.",
            },
            {
              q: "What if TrustChekr says something is safe but I still feel unsure?",
              a: "Trust your gut. If something feels wrong, it might be. Talk to someone you trust, contact your bank, or call the Anti-Fraud Centre for a second opinion.",
            },
            {
              q: "Can I use TrustChekr for someone else?",
              a: "Absolutely. Many people use TrustChekr to check something for a parent, grandparent, or friend. You can share results using the 'Save someone else' button on any result.",
            },
            {
              q: "I need to talk to a real person.",
              a: "Contact the Canadian Anti-Fraud Centre at 1-888-495-8501 (Canada) or visit reportfraud.ftc.gov (US). For emergencies, call 911.",
            },
          ].map((faq, i) => (
            <div
              key={i}
              className="p-4 rounded-xl border"
              style={{ borderColor: "var(--tc-border)", background: "var(--tc-surface)" }}
            >
              <p className="font-semibold" style={{ color: "var(--tc-text-main)" }}>{faq.q}</p>
              <p className="mt-1" style={{ color: "var(--tc-text-muted)" }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="text-center p-4" style={{ color: "var(--tc-text-muted)" }}>
        <p>TrustChekr is here to help. You did the right thing by coming here.</p>
      </div>
    </div>
  );
}
