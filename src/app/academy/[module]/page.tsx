"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

// ── Module Data ──────────────────────────────────────────────
const modules: Record<string, ModuleData> = {
  "phone-scams": {
    number: 1,
    icon: "📞",
    title: "Phone & Grandparent Scams",
    objectives: [
      "Recognize the \"emergency call\" pattern used in grandparent scams",
      "Know that real emergencies never require gift cards or wire transfers",
      "Learn the one-step verification: hang up and call the person directly",
    ],
    videoId: "uq3KBkHFMBY", // CAFC fraud prevention - replace with best match
    videoTitle: "Protect Yourself From Fraud",
    videoSource: "Canadian Anti-Fraud Centre",
    keyPoints: [
      "Scammers call pretending to be a grandchild, police officer, or lawyer",
      "They create panic with fake emergencies (accident, arrest, hospital)",
      "They demand immediate payment by gift card, wire transfer, or crypto",
      "Real family members can wait for you to verify — scammers can't",
      "The CRA, police, and courts will NEVER call demanding gift cards",
      "Always hang up and call your family member at their REAL number",
      "Set up a family code word that only your real family knows",
    ],
    quiz: [
      {
        id: "q1",
        scenario: "📞 Phone call: \"Grandma, it's me, I was in an accident and need $2,000 in iTunes gift cards to get out of jail.\"",
        options: [
          { text: "This is a scam", correct: true, feedback: "Correct! Police don't accept gift cards as bail. Always hang up and call your grandchild's real number." },
          { text: "This might be real", correct: false, feedback: "This is a scam. No police force or court accepts gift cards as payment. Hang up and call your grandchild at their real number to verify." },
        ],
      },
      {
        id: "q2",
        scenario: "📞 Phone call: \"This is Constable Smith from your local police. Your grandson has been arrested. Please remain calm. We need you to post bail via wire transfer.\"",
        options: [
          { text: "This is a scam", correct: true, feedback: "Correct! Real police will never ask for bail payment over the phone or by wire transfer. Call your local station directly." },
          { text: "This could be legitimate", correct: false, feedback: "This is a scam. Police will never call demanding bail payment by wire transfer. If concerned, hang up and call your local police station's main number." },
        ],
      },
      {
        id: "q3",
        scenario: "📱 Text message: \"Hi Mom, I dropped my phone in water. This is my new number. Can you text me back?\"",
        options: [
          { text: "Definitely a scam", correct: false, feedback: "While this IS a very common scam opening, it could also be real. The safest response: call your child's original number to verify before responding to the new one." },
          { text: "Suspicious — verify first", correct: true, feedback: "Smart thinking! This is a very common scam tactic, but it could be real. Always call your child's original number to verify before responding." },
        ],
      },
      {
        id: "q4",
        scenario: "📞 Phone call from your bank's number on caller ID, asking you to verify a suspicious charge on your account.",
        options: [
          { text: "Safe to proceed", correct: false, feedback: "Be careful! Caller ID can be faked — this is called \"spoofing.\" Hang up and call your bank using the number on the back of your card." },
          { text: "Suspicious — hang up and call back", correct: true, feedback: "Excellent! Caller ID can be faked. The safest thing is to hang up, find your bank's real number (on your card or statement), and call them yourself." },
        ],
      },
      {
        id: "q5",
        scenario: "📞 Your grandchild calls from their known number asking if you can pick them up from a friend's house.",
        options: [
          { text: "This is normal", correct: true, feedback: "Correct! This is a normal family call. Key differences: they called from their real number, they're not asking for money, and there's no panic or urgency." },
          { text: "Could be a scam", correct: false, feedback: "This is actually fine! They called from their known number, aren't asking for money, and there's no artificial urgency. Trust your family's real phone numbers." },
        ],
      },
    ],
    grokipediaQueries: [
      { label: "What is a grandparent scam?", query: "grandparent scam Canada" },
      { label: "How does caller ID spoofing work?", query: "caller ID spoofing how it works" },
      { label: "How to report phone scams in Canada", query: "CAFC phone scam reporting Canada" },
    ],
    nextModule: { id: "bank-cra-scams", title: "Bank & CRA Impersonation" },
    prevModule: null,
  },
  "bank-cra-scams": {
    number: 2,
    icon: "🏦",
    title: "Bank & CRA Impersonation",
    objectives: [
      "Understand that the CRA never threatens arrest by phone or text",
      "Know how to verify a real bank communication from a fake one",
      "Learn the \"hang up and call back\" verification method",
    ],
    videoId: "uq3KBkHFMBY",
    videoTitle: "CRA Scam Awareness",
    videoSource: "Government of Canada",
    keyPoints: [
      "The CRA will NEVER call threatening arrest, demanding gift cards, or asking for crypto",
      "Banks will NEVER ask for your password, PIN, or one-time code by phone/text/email",
      "If a bank texts you, don't click the link — open your banking app directly",
      "Caller ID and email addresses can be faked to look like real bank/CRA numbers",
      "When in doubt: hang up, find the real number (on your card/statement), call back yourself",
      "CRA communicates primarily through My Account (online) and regular mail",
    ],
    quiz: [
      {
        id: "q1",
        scenario: "📧 Email from \"CRA\" saying you owe $3,400 and linking to a \"secure payment portal\"",
        options: [
          { text: "This is a scam", correct: true, feedback: "Correct! The CRA does not send payment demands by email with links. Log into your CRA My Account directly to check your status." },
          { text: "Could be real", correct: false, feedback: "This is a scam. The CRA does not demand payment through email links. Always check your CRA My Account by typing the URL yourself." },
        ],
      },
      {
        id: "q2",
        scenario: "📬 Letter in your mailbox from CRA with your SIN partially masked, asking you to file your return",
        options: [
          { text: "Likely legitimate", correct: true, feedback: "Correct! The CRA does send physical mail. A partially masked SIN is a good sign — scammers usually don't have your real SIN." },
          { text: "Probably a scam", correct: false, feedback: "This is likely real! The CRA does send official letters by mail. The partially masked SIN shows they have your real info. You can verify at canada.ca/cra." },
        ],
      },
      {
        id: "q3",
        scenario: "📱 Text: \"TD Alert: Unusual activity on your account. Click here to verify: td-secure-login.com\"",
        options: [
          { text: "This is a scam", correct: true, feedback: "Correct! The real TD website is td.com, not td-secure-login.com. Never click links in texts — open your banking app or type td.com directly." },
          { text: "This looks official", correct: false, feedback: "This is a scam! The real TD domain is td.com. \"td-secure-login.com\" is a fake lookalike. Always open your banking app directly instead of clicking text links." },
        ],
      },
      {
        id: "q4",
        scenario: "🖥️ You log into your CRA My Account and see a message about a reassessment",
        options: [
          { text: "This is normal", correct: true, feedback: "Correct! Messages inside your actual CRA My Account are legitimate. You accessed it yourself through the real website." },
          { text: "This could be fake", correct: false, feedback: "This is legitimate! If you logged into CRA My Account yourself (not through an emailed link), messages there are real." },
        ],
      },
      {
        id: "q5",
        scenario: "📞 Phone call: \"This is the fraud department at RBC. We need your debit card PIN to block a suspicious transaction\"",
        options: [
          { text: "This is a scam", correct: true, feedback: "Correct! Your bank will NEVER ask for your PIN — not over the phone, not by text, not by email. Ever." },
          { text: "This could be my bank", correct: false, feedback: "This is a scam! No legitimate bank employee will ever ask for your PIN. Hang up and call the number on the back of your card." },
        ],
      },
    ],
    grokipediaQueries: [
      { label: "How do CRA scams work?", query: "CRA scam Canada 2026" },
      { label: "How to verify CRA communication", query: "how to verify CRA communication legitimate" },
      { label: "Bank phishing in Canada", query: "bank phishing scam Canada" },
    ],
    nextModule: { id: "tech-support-scams", title: "Tech Support & Fake Warnings" },
    prevModule: { id: "phone-scams", title: "Phone & Grandparent Scams" },
  },
  "tech-support-scams": {
    number: 3,
    icon: "💻",
    title: "Tech Support & Fake Warnings",
    objectives: [
      "Recognize fake virus pop-ups and \"your computer is infected\" warnings",
      "Know that Microsoft, Apple, and Google will never call you about viruses",
      "Learn how to safely close a scary pop-up without clicking anything in it",
    ],
    videoId: "uq3KBkHFMBY",
    videoTitle: "Tech Support Scam Awareness",
    videoSource: "Competition Bureau of Canada",
    keyPoints: [
      "Pop-ups saying \"YOUR COMPUTER IS INFECTED\" with a phone number are ALWAYS fake",
      "Microsoft, Apple, and Google will never call you about a virus",
      "Never call a phone number shown in a pop-up warning",
      "If a pop-up won't close: press Ctrl+Alt+Delete (Windows) or Cmd+Q (Mac)",
      "If you gave someone remote access, disconnect from internet immediately",
      "Real antivirus software doesn't display phone numbers in pop-ups",
    ],
    quiz: [
      {
        id: "q1",
        scenario: "🖥️ Full-screen browser alert: \"WINDOWS DEFENDER ALERT! Your PC is infected. Call 1-888-555-0123 immediately!\"",
        options: [
          { text: "This is a scam", correct: true, feedback: "Correct! Real Windows Defender never shows phone numbers. Close the browser with Ctrl+Alt+Delete → End Task." },
          { text: "I should call the number", correct: false, feedback: "This is a scam! Real antivirus software never displays phone numbers in pop-ups. Force-close your browser instead." },
        ],
      },
      {
        id: "q2",
        scenario: "🔔 Your antivirus app (that you installed) shows a notification about an update available",
        options: [
          { text: "This is normal", correct: true, feedback: "Correct! Software you intentionally installed sending update notifications is normal behavior." },
          { text: "This might be a scam", correct: false, feedback: "This is normal! If it's software you installed yourself, update notifications are expected. The key: you recognize the software." },
        ],
      },
      {
        id: "q3",
        scenario: "📞 Someone calls saying \"We're from Microsoft and detected a virus on your computer\"",
        options: [
          { text: "This is a scam", correct: true, feedback: "Correct! Microsoft does not monitor individual computers and will never make unsolicited calls about viruses. Hang up." },
          { text: "Microsoft might do this", correct: false, feedback: "This is a scam! Microsoft has stated they never make unsolicited calls about computer problems. Hang up immediately." },
        ],
      },
      {
        id: "q4",
        scenario: "🌐 A website asks if you want to allow notifications",
        options: [
          { text: "Always a scam", correct: false, feedback: "Not always a scam, but be cautious! Allowing notifications from unknown sites can lead to spam pop-ups. Click 'Block' unless you trust the site." },
          { text: "Suspicious — usually click Block", correct: true, feedback: "Good instinct! While not always a scam, saying 'Block' is almost always the right choice unless you specifically want notifications from that site." },
        ],
      },
      {
        id: "q5",
        scenario: "📧 Email from \"Apple Support\" with a link to \"verify your iCloud account or it will be deleted\"",
        options: [
          { text: "This is a scam", correct: true, feedback: "Correct! Apple will never threaten to delete your account by email. If concerned, go to appleid.apple.com directly." },
          { text: "Apple might send this", correct: false, feedback: "This is a scam! Apple does not threaten account deletion via email. Visit appleid.apple.com directly to check your account status." },
        ],
      },
    ],
    grokipediaQueries: [
      { label: "What are tech support scams?", query: "tech support scam how it works" },
      { label: "How to close fake virus popup", query: "how to close fake virus popup safely" },
      { label: "Remote access scam recovery steps", query: "what to do after remote access scam" },
    ],
    nextModule: { id: "romance-scams", title: "Romance & Friendship Scams" },
    prevModule: { id: "bank-cra-scams", title: "Bank & CRA Impersonation" },
  },
  "what-to-do": {
    number: 8,
    icon: "🆘",
    title: "What to Do If You've Been Scammed",
    objectives: [
      "Know the exact steps to take immediately after being scammed",
      "Understand how to report to CAFC, police, and your bank",
      "Learn about credit monitoring and fraud alerts",
    ],
    videoId: "uq3KBkHFMBY",
    videoTitle: "I've Been Scammed — What Now?",
    videoSource: "Canadian Anti-Fraud Centre",
    keyPoints: [
      "STOP all contact with the scammer immediately",
      "Call your bank or card issuer — they may be able to reverse charges",
      "Change passwords on any affected accounts (email, banking, social media)",
      "Report to CAFC: call 1-888-495-8501 or visit antifraudcentre-centreantifraude.ca",
      "File a police report — even if they can't recover funds, it's on record",
      "Place fraud alerts: Equifax (1-800-465-7166) and TransUnion (1-800-663-9980)",
      "Don't be ashamed — scammers are professionals and anyone can be targeted",
    ],
    quiz: [
      {
        id: "q1",
        scenario: "😰 You just realized you sent $500 in gift cards to a scammer pretending to be your grandchild. What should you do FIRST?",
        options: [
          { text: "Call the gift card company", correct: true, feedback: "Yes! Contact the gift card company immediately — they may be able to freeze the cards if the scammer hasn't used them yet. Then report to CAFC and police." },
          { text: "Wait and see if they call back", correct: false, feedback: "Don't wait! Call the gift card company right away — if the cards haven't been redeemed yet, they might be able to freeze them. Every minute counts." },
        ],
      },
      {
        id: "q2",
        scenario: "😰 You gave a \"tech support\" caller remote access to your computer and they asked for your banking login. What steps do you take?",
        options: [
          { text: "Disconnect internet, change passwords, call bank, scan for malware", correct: true, feedback: "Perfect order! Disconnect from the internet first (unplug or turn off WiFi), then use a different device to change your banking password, call your bank, and run a malware scan." },
          { text: "Just change your banking password", correct: false, feedback: "Changing your password is important but not enough. You need to: 1) Disconnect from internet, 2) Change ALL passwords from a different device, 3) Call your bank, 4) Run a full malware scan." },
        ],
      },
      {
        id: "q3",
        scenario: "😰 You clicked a link in a phishing text and entered your credit card number on a fake site. What now?",
        options: [
          { text: "Call your credit card company to report fraud and request a new card", correct: true, feedback: "Exactly right! Your card company can cancel the card and reverse fraudulent charges. Also change your online passwords and report to CAFC." },
          { text: "Monitor your statements and see if anything suspicious appears", correct: false, feedback: "Don't wait for fraud to appear — call your card company NOW to cancel the compromised card and get a new one. The scammer has your full card number." },
        ],
      },
      {
        id: "q4",
        scenario: "A friend is embarrassed about being scammed and doesn't want to report it. What should you tell them?",
        options: [
          { text: "Reporting helps protect others — and anyone can be targeted", correct: true, feedback: "Exactly! Reporting to CAFC helps them track scam patterns and warn others. Remind your friend that scammers are professionals — there's no shame in being targeted." },
          { text: "It's their choice — respect their privacy", correct: false, feedback: "While it is their choice, gently encourage reporting. Every unreported scam lets the scammer continue targeting others. CAFC reports are confidential." },
        ],
      },
      {
        id: "q5",
        scenario: "After being scammed, which of these should you do?",
        options: [
          { text: "Place fraud alerts with Equifax AND TransUnion", correct: true, feedback: "Yes! Contact both credit bureaus: Equifax (1-800-465-7166) and TransUnion (1-800-663-9980). A fraud alert makes it harder for scammers to open accounts in your name." },
          { text: "Only contact one credit bureau — they share information", correct: false, feedback: "Contact BOTH bureaus to be safe. While they may share some data, placing alerts with both ensures complete coverage. Equifax: 1-800-465-7166, TransUnion: 1-800-663-9980." },
        ],
      },
    ],
    grokipediaQueries: [
      { label: "What to do after being scammed", query: "what to do after scam Canada steps" },
      { label: "How to report fraud to CAFC", query: "CAFC fraud report process Canada" },
      { label: "How to place a credit freeze in Canada", query: "credit freeze fraud alert Canada Equifax TransUnion" },
    ],
    nextModule: null,
    prevModule: { id: "social-media", title: "Social Media Red Flags" },
  },
};

// ── Types ────────────────────────────────────────────────────
interface QuizOption { text: string; correct: boolean; feedback: string; }
interface QuizItem { id: string; scenario: string; options: QuizOption[]; }
interface GrokQuery { label: string; query: string; }
interface ModuleLink { id: string; title: string; }
interface ModuleData {
  number: number; icon: string; title: string; objectives: string[];
  videoId: string; videoTitle: string; videoSource: string;
  keyPoints: string[]; quiz: QuizItem[];
  grokipediaQueries: GrokQuery[];
  nextModule: ModuleLink | null; prevModule: ModuleLink | null;
}

// ── Quiz Component ───────────────────────────────────────────
function SpotTheScam({ items }: { items: QuizItem[] }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const item = items[current];

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (item.options[idx].correct) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (current + 1 >= items.length) {
      setFinished(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
    }
  };

  if (finished) {
    return (
      <div className="p-5 rounded-xl border text-center" style={{ borderColor: "var(--tc-safe)", background: "#eafaf1" }}>
        <p className="text-3xl mb-2">🎉</p>
        <p className="text-xl font-bold" style={{ color: "var(--tc-safe)" }}>
          You got {score} out of {items.length} correct!
        </p>
        <p className="mt-2" style={{ color: "var(--tc-text-muted)" }}>
          {score === items.length ? "Perfect score! You're scam-savvy." : score >= 3 ? "Great job! You're getting better at spotting scams." : "Keep learning — every bit of awareness helps protect you."}
        </p>
        <button
          onClick={() => { setCurrent(0); setSelected(null); setScore(0); setFinished(false); }}
          className="mt-4 px-6 py-2 rounded-lg border font-medium cursor-pointer"
          style={{ borderColor: "var(--tc-primary)", color: "var(--tc-primary)" }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium" style={{ color: "var(--tc-text-muted)" }}>
          Question {current + 1} of {items.length}
        </span>
        <span className="text-sm font-medium" style={{ color: "var(--tc-safe)" }}>
          Score: {score}/{current}
        </span>
      </div>

      <div className="p-4 rounded-xl border" style={{ borderColor: "var(--tc-border)", background: "var(--tc-surface)" }}>
        <p className="font-semibold text-lg" style={{ color: "var(--tc-text-main)" }}>{item.scenario}</p>
      </div>

      <div className="flex flex-col gap-2">
        {item.options.map((opt, idx) => {
          let borderColor = "var(--tc-border)";
          let bg = "var(--tc-surface)";
          if (selected !== null) {
            if (opt.correct) { borderColor = "var(--tc-safe)"; bg = "#eafaf1"; }
            else if (idx === selected && !opt.correct) { borderColor = "var(--tc-danger)"; bg = "#fdedec"; }
          }
          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className="p-4 rounded-xl border text-left font-medium cursor-pointer transition-all"
              style={{ borderColor, background: bg, color: "var(--tc-text-main)" }}
            >
              {opt.text}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <div className="p-4 rounded-xl border" style={{ borderColor: item.options[selected].correct ? "var(--tc-safe)" : "var(--tc-warning)", background: item.options[selected].correct ? "#eafaf1" : "#fef9e7" }}>
          <p className="font-semibold mb-1">{item.options[selected].correct ? "✅ Correct!" : "⚠️ Not quite"}</p>
          <p>{item.options[selected].feedback}</p>
        </div>
      )}

      {selected !== null && (
        <button
          onClick={handleNext}
          className="w-full py-3 rounded-xl font-semibold cursor-pointer"
          style={{ background: "var(--tc-primary)", color: "white" }}
        >
          {current + 1 >= items.length ? "See Results" : "Next Question →"}
        </button>
      )}
    </div>
  );
}

// ── Module Page ──────────────────────────────────────────────
export default function ModulePage() {
  const params = useParams();
  const moduleId = params.module as string;
  const mod = modules[moduleId];

  useEffect(() => {
    if (mod) {
      try {
        const stored = localStorage.getItem("tc-academy-progress");
        const progress = stored ? JSON.parse(stored) : { modulesViewed: [] };
        if (!progress.modulesViewed.includes(moduleId)) {
          progress.modulesViewed.push(moduleId);
          localStorage.setItem("tc-academy-progress", JSON.stringify(progress));
        }
      } catch { /* */ }
    }
  }, [mod, moduleId]);

  if (!mod) {
    return (
      <div className="text-center py-12">
        <p className="text-4xl mb-4">🚧</p>
        <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--tc-primary)" }}>Coming Soon</h1>
        <p style={{ color: "var(--tc-text-muted)" }}>This module is still being built. Check back soon!</p>
        <Link href="/academy" className="mt-4 inline-block underline" style={{ color: "var(--tc-primary)" }}>
          ← Back to Academy
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <Link href="/academy" className="text-sm underline" style={{ color: "var(--tc-text-muted)" }}>
        ← Back to Academy
      </Link>

      <div>
        <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "var(--tc-primary-soft)", color: "var(--tc-primary)" }}>
          Module {mod.number}
        </span>
        <h1 className="text-2xl font-bold mt-2" style={{ color: "var(--tc-primary)" }}>
          {mod.icon} {mod.title}
        </h1>
      </div>

      {/* Objectives */}
      <div className="p-4 rounded-xl border" style={{ borderColor: "var(--tc-accent)", background: "#eaf2f8" }}>
        <p className="font-semibold mb-2" style={{ color: "var(--tc-accent)" }}>📚 What you'll learn</p>
        <ul className="flex flex-col gap-1">
          {mod.objectives.map((obj, i) => (
            <li key={i} className="flex gap-2 text-sm">
              <span>✓</span><span>{obj}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Video */}
      <section>
        <h2 className="text-lg font-bold mb-3" style={{ color: "var(--tc-text-main)" }}>🎬 Watch: {mod.videoTitle}</h2>
        <div className="rounded-xl overflow-hidden border" style={{ borderColor: "var(--tc-border)", aspectRatio: "16/9" }}>
          <iframe
            src={`https://www.youtube.com/embed/${mod.videoId}`}
            title={mod.videoTitle}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
        <p className="text-xs mt-1" style={{ color: "var(--tc-text-muted)" }}>
          Source: {mod.videoSource}
        </p>
      </section>

      {/* Key Points */}
      <section>
        <h2 className="text-lg font-bold mb-3" style={{ color: "var(--tc-text-main)" }}>📌 Key Takeaways</h2>
        <div className="flex flex-col gap-2">
          {mod.keyPoints.map((point, i) => (
            <div key={i} className="flex gap-3 p-3 rounded-lg border" style={{ borderColor: "var(--tc-border)", background: "var(--tc-surface)" }}>
              <span className="font-bold" style={{ color: "var(--tc-primary)" }}>{i + 1}</span>
              <span>{point}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Quiz */}
      <section>
        <h2 className="text-lg font-bold mb-3" style={{ color: "var(--tc-text-main)" }}>🧩 Spot the Scam</h2>
        <p className="text-sm mb-4" style={{ color: "var(--tc-text-muted)" }}>
          Can you tell which of these are scams? Tap your answer to find out.
        </p>
        <SpotTheScam items={mod.quiz} />
      </section>

      {/* Grokipedia / Research Links */}
      <section>
        <h2 className="text-lg font-bold mb-3" style={{ color: "var(--tc-text-main)" }}>🔍 Learn More</h2>
        <p className="text-sm mb-3" style={{ color: "var(--tc-text-muted)" }}>
          Want to dig deeper? Search these topics for more information:
        </p>
        <div className="flex flex-col gap-2">
          {mod.grokipediaQueries.map((q, i) => (
            <a
              key={i}
              href={`https://www.google.com/search?q=${encodeURIComponent(q.query)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:shadow-sm transition-all"
              style={{ borderColor: "var(--tc-border)", background: "var(--tc-surface)" }}
            >
              <span>🔍</span>
              <span className="font-medium" style={{ color: "var(--tc-primary)" }}>{q.label}</span>
              <span className="ml-auto text-sm" style={{ color: "var(--tc-text-muted)" }}>→</span>
            </a>
          ))}
        </div>
      </section>

      {/* Resources */}
      <section>
        <h2 className="text-lg font-bold mb-3" style={{ color: "var(--tc-text-main)" }}>📄 Resources</h2>
        <div className="flex flex-col gap-2">
          <div className="p-3 rounded-lg border" style={{ borderColor: "var(--tc-border)", background: "var(--tc-surface)" }}>
            <p className="font-medium">📋 Printable Checklist</p>
            <p className="text-sm" style={{ color: "var(--tc-text-muted)" }}>Keep this by your phone or computer — coming soon</p>
          </div>
          <div className="p-3 rounded-lg border" style={{ borderColor: "var(--tc-border)", background: "var(--tc-surface)" }}>
            <p className="font-medium">👨‍👩‍👧 Family Discussion Guide</p>
            <p className="text-sm" style={{ color: "var(--tc-text-muted)" }}>How to talk about this topic with your family — coming soon</p>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <div className="flex gap-3 mt-4">
        {mod.prevModule && (
          <Link
            href={`/academy/${mod.prevModule.id}`}
            className="flex-1 p-4 rounded-xl border text-center font-medium cursor-pointer"
            style={{ borderColor: "var(--tc-border)", color: "var(--tc-text-main)" }}
          >
            ← {mod.prevModule.title}
          </Link>
        )}
        {mod.nextModule && (
          <Link
            href={`/academy/${mod.nextModule.id}`}
            className="flex-1 p-4 rounded-xl text-center font-semibold cursor-pointer"
            style={{ background: "var(--tc-primary)", color: "white" }}
          >
            Next: {mod.nextModule.title} →
          </Link>
        )}
      </div>

      {/* Back to Academy */}
      <Link
        href="/academy"
        className="w-full py-3 rounded-xl border-2 text-center font-medium"
        style={{ borderColor: "var(--tc-primary)", color: "var(--tc-primary)" }}
      >
        Back to All Modules
      </Link>

      {/* Disclaimer */}
      <p className="text-xs text-center" style={{ color: "var(--tc-text-muted)" }}>
        This educational content is provided as a public service by TrustChekr. It is not legal or financial advice.
        If you believe you are a victim of fraud, contact CAFC at 1-888-495-8501.
      </p>
    </div>
  );
}
