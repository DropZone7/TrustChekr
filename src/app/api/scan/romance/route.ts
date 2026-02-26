import { NextRequest, NextResponse } from "next/server";
import type { RiskLevel, ScanResult } from "@/lib/types";

interface RomanceInput {
  platform: string;
  timeline: string;
  movedOffApp: string;
  videoCall: string;
  moneyAsked: string;
  moneySent: string;
  moneyAmount: string;
  messages: string;
}

interface Signal {
  text: string;
  weight: number;
}

export async function POST(req: NextRequest) {
  try {
    const data: RomanceInput = await req.json();
    const signals: Signal[] = [];

    // Timeline analysis
    if (data.timeline === "Less than a week" || data.timeline === "1–2 weeks") {
      if (data.moneyAsked === "Yes") {
        signals.push({
          text: `They asked for money after only ${data.timeline.toLowerCase()} of talking. This is a very strong sign of a romance scam — real relationships don't involve money requests this early.`,
          weight: 35,
        });
      }
    }

    // Moved off platform
    if (data.movedOffApp === "Yes") {
      signals.push({
        text: "They asked you to move off the dating platform quickly. Scammers do this to avoid the platform's fraud detection and to make it harder to report them.",
        weight: 20,
      });
    }

    // Video call refusal
    if (data.videoCall === "No, they always had an excuse") {
      signals.push({
        text: "They refuse or avoid video calls. Romance scammers always have excuses — bad connection, broken camera, working overseas. Real people who care about you will find a way to video call.",
        weight: 25,
      });
    }

    // Money asked
    if (data.moneyAsked === "Yes") {
      signals.push({
        text: "They have asked you for money. This is the single biggest red flag in online relationships. Someone who truly cares about you will not ask you for money, especially if you've never met in person.",
        weight: 35,
      });
    } else if (data.moneyAsked === "They hinted but didn't ask directly") {
      signals.push({
        text: "They've hinted at needing money without asking directly. This is a common early-stage tactic — scammers test your willingness to help before making a direct ask.",
        weight: 20,
      });
    }

    // Money already sent
    if (data.moneySent === "Yes") {
      signals.push({
        text: "You've already sent money to this person. If any of the other warning signs match, it's very important to stop sending more and contact your bank right away.",
        weight: 15,
      });
    }

    // Platform analysis
    const datingPlatforms = ["tinder", "bumble", "hinge", "match", "plenty of fish", "pof", "badoo", "okcupid", "zoosk"];
    const socialPlatforms = ["facebook", "instagram", "twitter", "tiktok", "snapchat"];
    const platformLower = data.platform.toLowerCase();

    if (socialPlatforms.some((p) => platformLower.includes(p))) {
      signals.push({
        text: `You met on ${data.platform}, which is not a dating platform. Scammers often reach out through social media with unsolicited friend requests or messages.`,
        weight: 10,
      });
    }

    // Message analysis if provided
    if (data.messages.trim()) {
      const lower = data.messages.toLowerCase();
      const romanceScriptPatterns = [
        { phrases: ["i love you", "my love", "my darling", "soulmate", "destiny", "god sent you"], signal: "Their messages contain very intense romantic language that's common in scam scripts.", weight: 15 },
        { phrases: ["hospital", "accident", "surgery", "medical bill", "customs", "release fee", "stranded"], signal: "They describe an urgent crisis that requires money — a classic romance scam story.", weight: 25 },
        { phrases: ["invest", "trading", "bitcoin", "crypto", "platform", "guaranteed returns", "profit"], signal: "They're pushing you toward investments or crypto. This matches 'pig butchering' — a scam where romance leads to fake investment platforms.", weight: 30 },
        { phrases: ["gift card", "itunes", "google play", "steam card", "amazon card"], signal: "They want gift cards. No real person in a genuine relationship asks to be paid in gift cards.", weight: 30 },
        { phrases: ["western union", "wire transfer", "moneygram", "send money"], signal: "They want wire transfers — a payment method chosen by scammers because it cannot be reversed.", weight: 25 },
        { phrases: ["military", "army", "deployed", "peacekeeping", "oil rig", "offshore"], signal: "Their claimed profession (military, oil rig) is one of the most commonly faked backgrounds in romance scams.", weight: 20 },
      ];

      for (const p of romanceScriptPatterns) {
        if (p.phrases.some((phrase) => lower.includes(phrase))) {
          signals.push({ text: p.signal, weight: p.weight });
        }
      }
    }

    // Score calculation
    const totalScore = signals.reduce((sum, s) => sum + s.weight, 0);
    let riskLevel: RiskLevel;
    if (totalScore <= 15) riskLevel = "safe";
    else if (totalScore <= 40) riskLevel = "suspicious";
    else if (totalScore <= 65) riskLevel = "high-risk";
    else riskLevel = "very-likely-scam";

    // Build next steps based on severity
    const nextSteps: string[] = [];
    if (data.moneySent === "Yes") {
      nextSteps.push("Contact your bank or card issuer right away — they may be able to help recover or stop payments.");
    }
    nextSteps.push("Pause any payments or transfers for now — there is no real emergency, even if they say there is.");
    if (riskLevel === "high-risk" || riskLevel === "very-likely-scam") {
      nextSteps.push("Do not send any more money, gift cards, or crypto to this person.");
    }
    nextSteps.push("Talk to a trusted friend or family member and show them the messages.");
    if (riskLevel !== "safe") {
      nextSteps.push("Consider reporting this to the platform where you met them.");
    }

    const summaryInput = `Romance check: met on ${data.platform || "dating app"}, talking for ${data.timeline || "unknown time"}`;

    const result: ScanResult = {
      inputType: "romance",
      inputValue: summaryInput,
      riskLevel,
      whyBullets: signals.slice(0, 6).map((s) => s.text),
      nextSteps: nextSteps.slice(0, 5),
      reportTo: [
        "Canadian Anti-Fraud Centre (CAFC) — 1-888-495-8501",
        "FTC (US) — reportfraud.ftc.gov",
        "The dating platform where you met them",
      ],
      educationalTip:
        "Romance scammers build trust over weeks or months before asking for money. Anyone who asks for money, crypto, or gift cards in an online relationship is very likely running a scam — no matter how real the feelings seem.",
      shareText: `TrustChekr flagged this online relationship as ${riskLevel === "very-likely-scam" ? "Very Likely Scam" : riskLevel === "high-risk" ? "High-Risk" : riskLevel === "suspicious" ? "Suspicious" : "Likely Safe"}. ${signals.length > 0 ? signals[0].text : ""}`,
    };

    // If no signals at all
    if (signals.length === 0) {
      result.riskLevel = "safe";
      result.whyBullets = [
        "Based on what you shared, we didn't find strong warning signs of a romance scam.",
        "This doesn't mean everything is guaranteed to be safe — trust your instincts.",
      ];
      result.nextSteps = [
        "Continue being cautious — never send money to someone you haven't met in person.",
        "Try to have a live video call before deepening the relationship.",
        "If they ever ask for money, come back and check again.",
      ];
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Our system is having trouble right now, but your information is safe. Please try again in a few minutes." },
      { status: 500 }
    );
  }
}
