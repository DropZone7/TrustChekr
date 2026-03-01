// TrustChekr Scanner Engine
// Pattern-based scam detection across all input types
// No external APIs yet — pure heuristic analysis

import type { RiskLevel, ScanResult } from "./types";

interface Signal {
  text: string;
  weight: number;
}

// ── URL Analysis ──────────────────────────────────────────────
function analyzeUrl(input: string): Signal[] {
  const signals: Signal[] = [];
  const lower = input.toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "");

  // Suspicious TLDs
  const sketchyTlds = [".xyz", ".top", ".buzz", ".click", ".loan", ".work", ".gq", ".tk", ".ml", ".cf", ".ga", ".icu"];
  if (sketchyTlds.some((tld) => lower.endsWith(tld))) {
    signals.push({ text: "This website uses a domain ending that is very commonly seen in scam sites.", weight: 20 });
  }

  // Extract domain early (needed for brand checks)
  const domain = lower.split("/")[0];

  // Lookalike detection (common brands)
  // Map brand keywords to their known legitimate domains
  const brandDomains: Record<string, string[]> = {
    paypal: ["paypal.com"],
    amazon: ["amazon.com", "amazon.ca", "amazon.co.uk", "amazonaws.com"],
    apple: ["apple.com", "icloud.com"],
    microsoft: ["microsoft.com", "live.com", "outlook.com", "office.com", "xbox.com"],
    netflix: ["netflix.com"],
    google: ["google.com", "google.ca", "google.co.uk", "gmail.com", "youtube.com"],
    chase: ["chase.com"],
    wellsfargo: ["wellsfargo.com"],
    td: ["td.com", "tdbank.com", "tdcanadatrust.com"],
    rbc: ["rbc.com", "rbcroyalbank.com", "rbcinsurance.com", "rbcgam.com", "rbcdirectinvesting.com"],
    cibc: ["cibc.com"],
    scotiabank: ["scotiabank.com"],
    bmo: ["bmo.com", "bmoinvestorline.com", "bmoharris.com"],
    desjardins: ["desjardins.com", "disnat.com"],
    national: ["nbc.ca", "bnc.ca"],
    interac: ["interac.ca"],
    costco: ["costco.com", "costco.ca"],
    walmart: ["walmart.com", "walmart.ca"],
    bestbuy: ["bestbuy.com", "bestbuy.ca"],
    canadapost: ["canadapost.ca", "canadapost-postescanada.ca"],
    ups: ["ups.com"],
    fedex: ["fedex.com"],
    usps: ["usps.com"],
    cra: ["canada.ca"],
    irs: ["irs.gov"],
    meta: ["meta.com", "facebook.com", "instagram.com", "whatsapp.com"],
    tiktok: ["tiktok.com"],
    shopify: ["shopify.com", "myshopify.com"],
  };
  for (const [brand, legit] of Object.entries(brandDomains)) {
    if (lower.includes(brand)) {
      // Check if this is actually a legitimate domain for this brand
      const isLegit = legit.some((d) => domain === d || domain.endsWith("." + d));
      if (!isLegit) {
        signals.push({ text: `The website address contains "${brand}" but is not the official ${brand} website. This is a common trick.`, weight: 30 });
      }
      break;
    }
  }

  // Excessive hyphens or numbers in domain
  if ((domain.match(/-/g) || []).length >= 3) {
    signals.push({ text: "The website address has many hyphens, which is unusual for legitimate sites.", weight: 15 });
  }
  if ((domain.match(/\d/g) || []).length >= 4) {
    signals.push({ text: "The website address contains many numbers, which is common with throwaway scam sites.", weight: 10 });
  }

  // IP address instead of domain
  if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(domain)) {
    signals.push({ text: "This goes to a raw IP address instead of a proper website name. Legitimate businesses almost never do this.", weight: 25 });
  }

  // Very long URL (phishing indicator)
  if (input.length > 100) {
    signals.push({ text: "This is an unusually long web address, which is sometimes used to hide the real destination.", weight: 10 });
  }

  // Shortened URLs
  const shorteners = ["bit.ly", "tinyurl", "t.co", "goo.gl", "ow.ly", "is.gd", "buff.ly", "rebrand.ly", "shorte.st"];
  if (shorteners.some((s) => lower.startsWith(s))) {
    signals.push({ text: "This is a shortened link, which hides the real website. Scammers often use these to disguise dangerous links.", weight: 15 });
  }

  return signals;
}

// ── Message / Text Analysis ──────────────────────────────────
function analyzeMessage(input: string): Signal[] {
  const signals: Signal[] = [];
  const lower = input.toLowerCase();

  // Urgency patterns
  const urgencyPhrases = [
    "act now", "immediate action", "urgent", "expires today", "last chance",
    "limited time", "don't delay", "right away", "asap", "within 24 hours",
    "account suspended", "account locked", "verify immediately",
    "immediately", "arrested", "warrant", "legal action", "prosecuted",
    "suspended", "terminated", "frozen", "seized", "penalty",
    "you will be", "failure to", "if you do not", "within the next",
  ];
  const urgencyHits = urgencyPhrases.filter((p) => lower.includes(p));
  if (urgencyHits.length > 0) {
    signals.push({ text: "The message uses urgent or threatening language to pressure you into acting quickly. This is a very common scam tactic.", weight: 30 });
  }

  // Threat of arrest/legal action (massive red flag)
  const threatPhrases = ["arrested", "warrant", "jail", "prison", "prosecuted", "legal action", "law enforcement", "police will"];
  if (threatPhrases.some((p) => lower.includes(p))) {
    signals.push({ text: "The message threatens you with arrest or legal action. Real government agencies do not threaten people this way over the phone or by text.", weight: 35 });
  }

  // Money/payment requests
  const moneyPhrases = [
    "send money", "wire transfer", "gift card", "bitcoin", "crypto",
    "western union", "moneygram", "e-transfer", "etransfer", "interac",
    "pay a fee", "processing fee", "shipping fee", "customs fee",
    "pay with", "send payment", "cash app", "zelle", "venmo",
  ];
  const moneyHits = moneyPhrases.filter((p) => lower.includes(p));
  if (moneyHits.length > 0) {
    signals.push({ text: "The message asks for money or mentions specific payment methods. Legitimate organizations rarely ask for payment through gift cards, crypto, or wire transfers.", weight: 30 });
  }

  // Personal info requests
  const infoRequests = [
    "social security", "sin number", "social insurance", "password",
    "credit card", "bank account", "date of birth", "mother's maiden",
    "verify your identity", "confirm your details", "update your information",
  ];
  if (infoRequests.some((p) => lower.includes(p))) {
    signals.push({ text: "The message asks for sensitive personal information. Real companies will not ask for passwords, full card numbers, or SIN/SSN over text or email.", weight: 30 });
  }

  // Prize / lottery / inheritance
  const prizePhrases = [
    "you've won", "you have won", "congratulations", "winner",
    "lottery", "inheritance", "unclaimed funds", "million dollars",
    "claim your prize", "selected as a winner",
  ];
  if (prizePhrases.some((p) => lower.includes(p))) {
    signals.push({ text: "The message claims you've won something or have unclaimed money. This is one of the oldest and most common scam types.", weight: 25 });
  }

  // Impersonation signals
  const impersonation = [
    "cra", "irs", "canada revenue", "revenue agency",
    "amazon support", "microsoft support", "apple support",
    "your account has been", "we noticed suspicious",
    "from your bank",
  ];
  if (impersonation.some((p) => lower.includes(p))) {
    signals.push({ text: "The message appears to impersonate a government agency or major company. Scammers often pretend to be the CRA, IRS, Amazon, or your bank.", weight: 20 });
  }

  // ── Job scam detection ──
  const jobScamPhrases = [
    "no experience required", "no experience needed", "full training included",
    "full training provided", "work from home", "work remotely",
    "flexible remote", "remote opportunity", "own schedule",
    "same-day payouts", "same day payout", "same-day pay",
    "earn $", "make $", "/day", "per day",
    "top earners", "top performers make",
    "onboarding new", "hiring immediately", "start today", "start this week",
    "place ads", "post ads", "review products", "rate products",
    "message us on whatsapp", "contact us on whatsapp", "text us on whatsapp",
    "dm us on", "message us on telegram",
    "we found your profile", "we found your resume", "your profile caught",
    "we came across your", "you were selected",
  ];
  const jobScamHits = jobScamPhrases.filter((p) => lower.includes(p));
  if (jobScamHits.length >= 3) {
    signals.push({ text: "This message has multiple signs of a fake job scam: vague role, unrealistic pay, urgency to start, and contact through messaging apps instead of company email. Legitimate employers don't recruit this way.", weight: 40 });
  } else if (jobScamHits.length >= 2) {
    signals.push({ text: "This message shows signs of a job scam. Be cautious of vague job offers with high pay and no experience needed — especially if they ask you to contact them on WhatsApp or Telegram.", weight: 25 });
  }

  // WhatsApp/Telegram contact in unsolicited message (red flag for any scam type)
  if (/whatsapp|telegram|signal/i.test(lower) && /\+\d{10,}/.test(input)) {
    signals.push({ text: "The message asks you to contact someone on WhatsApp/Telegram with a phone number. Legitimate businesses use company email and official channels.", weight: 15 });
  }

  // "Too good to be true" earnings claims
  const earningsMatch = lower.match(/\$(\d+)[–\-\s]*\$?(\d+)?.*(?:per|a|\/)\s*(?:day|hour|hr|week)/);
  if (earningsMatch) {
    const amount = parseInt(earningsMatch[2] || earningsMatch[1]);
    if (amount >= 200) {
      signals.push({ text: `Claims of earning $${amount}+ per day with no experience are a hallmark of job scams and money mule recruitment.`, weight: 20 });
    }
  }

  // Delivery / parcel scam patterns
  const deliveryPhrases = [
    "package is being held", "parcel is pending", "delivery delayed",
    "unable to deliver", "redelivery fee", "update your delivery address",
    "missed delivery attempt", "customs fee", "clearance fee",
    "canada post", "purolator", "package held at warehouse",
  ];
  const deliveryHits = deliveryPhrases.filter((p) => lower.includes(p));
  if (deliveryHits.length >= 2) {
    signals.push({ text: "This looks like a fake delivery notification. Real carriers like Canada Post don't send texts demanding fees — they leave physical notices.", weight: 30 });
  } else if (deliveryHits.length === 1) {
    signals.push({ text: "This message mentions a package or delivery. If you weren't expecting anything, be suspicious — fake delivery texts are one of the most common scams in 2025.", weight: 15 });
  }

  // Toll road scam patterns
  const tollPhrases = [
    "unpaid toll", "toll balance", "toll penalty", "407 etr",
    "ezpass", "e-zpass", "sunpass", "fastrak", "toll road notice",
    "outstanding toll", "overdue toll",
  ];
  if (tollPhrases.some((p) => lower.includes(p))) {
    signals.push({ text: "This message claims you have unpaid tolls. Toll road scam texts surged massively in 2025 — real toll agencies send bills by mail, not SMS payment demands.", weight: 30 });
  }

  // QR code / quishing patterns
  if (/scan (this |the )?qr code/i.test(input) || /qr code.*(payment|verify|login|access)/i.test(input)) {
    signals.push({ text: "The message asks you to scan a QR code. 'Quishing' (QR phishing) is a fast-growing scam where QR codes lead to fake login pages or malware downloads.", weight: 25 });
  }

  // Grammar / spelling patterns (common in scams)
  const grammarPatterns = ["dear customer", "dear user", "dear friend", "kindly", "do the needful", "revert back"];
  if (grammarPatterns.some((p) => lower.includes(p))) {
    signals.push({ text: "The message uses generic greetings or unusual phrasing. Real companies usually address you by name.", weight: 10 });
  }

  // Links in message
  const urlPattern = /https?:\/\/\S+|www\.\S+/gi;
  const urls = input.match(urlPattern) || [];
  if (urls.length > 0) {
    signals.push({ text: "The message contains links. Be cautious about clicking any links in unexpected messages.", weight: 10 });
    // Run URL analysis on embedded links
    for (const url of urls.slice(0, 2)) {
      const urlSignals = analyzeUrl(url);
      signals.push(...urlSignals);
    }
  }

  return signals;
}

// ── Phone / Email / Other Analysis ───────────────────────────
function analyzeOther(input: string): Signal[] {
  const signals: Signal[] = [];
  const lower = input.toLowerCase().trim();

  // Phone number analysis
  const digitsOnly = lower.replace(/\D/g, "");
  if (digitsOnly.length >= 7) {
    // Toll-free numbers used in scams
    if (/^1?(800|888|877|866|855|844|833)/.test(digitsOnly)) {
      signals.push({ text: "This is a toll-free number. While many legitimate businesses use these, scammers also set them up easily. Verify the number on the company's official website.", weight: 10 });
    }
    // International prefixes commonly associated with scams
    const scamPrefixes = ["233", "234", "242", "246", "284", "345", "441", "473", "649", "664", "767", "809", "829", "849", "868", "876", "900"];
    if (scamPrefixes.some((p) => digitsOnly.startsWith(p) || digitsOnly.startsWith("1" + p))) {
      signals.push({ text: "This number's area code or country code is frequently associated with phone scams. Be very cautious about calling back or answering.", weight: 25 });
    }
    // Premium rate numbers
    if (digitsOnly.startsWith("1900") || digitsOnly.startsWith("900")) {
      signals.push({ text: "This is a premium-rate number that charges you per minute. Scammers trick people into calling these numbers.", weight: 30 });
    }
  }

  // Email analysis
  if (lower.includes("@")) {
    const domain = lower.split("@")[1];
    // Free email services (less trust for "official" communications)
    const freeProviders = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "aol.com", "mail.com", "protonmail.com"];
    if (freeProviders.some((p) => domain === p)) {
      signals.push({ text: "This email uses a free provider. Real companies and government agencies almost always use their own email domain (e.g., @td.com, not @gmail.com).", weight: 15 });
    }
    // Lookalike domains
    const brands = ["paypal", "amazon", "apple", "microsoft", "netflix", "chase", "td", "rbc"];
    for (const brand of brands) {
      if (domain.includes(brand) && !domain.startsWith(brand + ".")) {
        signals.push({ text: `The email domain contains "${brand}" but is not the real ${brand} email. This is a common impersonation trick.`, weight: 25 });
        break;
      }
    }
  }

  // Crypto address patterns
  if (/^(r[A-Za-z0-9]{24,34})$/.test(lower) || /^0x[a-f0-9]{40}$/i.test(lower) || /^(1|3|bc1)[A-Za-z0-9]{25,62}$/.test(input.trim())) {
    signals.push({ text: "This appears to be a cryptocurrency wallet address. If someone asked you to send crypto to this address, be very cautious — crypto payments are nearly impossible to reverse.", weight: 20 });
    signals.push({ text: "Legitimate companies, government agencies, and banks will never ask you to pay in cryptocurrency.", weight: 15 });
  }

  // Username / social handle
  if (lower.startsWith("@")) {
    signals.push({ text: "We can check this username across platforms. Be cautious of accounts that are very new, have few followers, or contacted you out of the blue.", weight: 10 });
  }

  return signals;
}

// ── Romance-specific signals ─────────────────────────────────
function analyzeRomance(input: string): Signal[] {
  const signals: Signal[] = [];
  const lower = input.toLowerCase();

  const romancePatterns = [
    { phrases: ["i love you", "my love", "my darling", "my sweetheart", "soulmate", "destiny"], signal: "The messages contain very strong romantic language, which can be genuine but is also a hallmark of romance scam scripts.", weight: 15 },
    { phrases: ["send money", "wire", "gift card", "bitcoin", "crypto", "invest", "trading platform", "pay for", "hospital bill", "customs fee", "release fee"], signal: "There are requests for money, investment, or payment. This is the number one sign of a romance scam.", weight: 35 },
    { phrases: ["can't video call", "camera broken", "bad connection", "in the military", "on an oil rig", "overseas", "deployed"], signal: "There are excuses for not doing video calls or meeting in person. Romance scammers always have reasons to avoid being seen.", weight: 25 },
    { phrases: ["move to whatsapp", "move to telegram", "text me on", "message me on", "let's talk on"], signal: "They asked to move the conversation off the dating platform. Scammers do this to avoid the platform's fraud detection.", weight: 20 },
    { phrases: ["emergency", "accident", "hospital", "stranded", "need help urgently", "please help me"], signal: "They've described an urgent crisis requiring money. Romance scammers create fake emergencies to pressure victims.", weight: 25 },
  ];

  for (const pattern of romancePatterns) {
    if (pattern.phrases.some((p) => lower.includes(p))) {
      signals.push({ text: pattern.signal, weight: pattern.weight });
    }
  }

  return signals;
}

// ── Main Scanner ─────────────────────────────────────────────
export function runScan(type: string, input: string): ScanResult {
  let signals: Signal[] = [];

  // Detect romance context
  const isRomance = detectRomanceContext(input);

  switch (type) {
    case "website":
      signals = analyzeUrl(input);
      break;
    case "message":
      signals = analyzeMessage(input);
      if (isRomance) signals.push(...analyzeRomance(input));
      break;
    case "other":
      signals = analyzeOther(input);
      break;
  }

  // If message analysis found URLs, those were already included
  // Calculate score
  const totalScore = signals.reduce((sum, s) => sum + s.weight, 0);
  const riskLevel = scoreToRisk(totalScore);
  const scamType = isRomance ? "romance scam" : type === "website" ? "website scam" : type === "message" ? "message scam" : "scam";

  // Build result - sort by weight so strongest signals come first
  signals.sort((a, b) => b.weight - a.weight);
  const topSignals = signals.slice(0, 6);
  const whyBullets = topSignals.map((s) => s.text);
  const _signalWeights = topSignals.map((s) => s.weight);
  const nextSteps = getNextSteps(riskLevel, type, isRomance);
  const reportTo = getReportTo();
  const educationalTip = getEducationalTip(type, isRomance);
  const shareText = buildShareText(riskLevel, scamType, whyBullets);

  // If no signals found, give a cautious safe result
  if (signals.length === 0) {
    return {
      inputType: type,
      inputValue: input,
      riskLevel: "safe",
      whyBullets: [
        "We didn't find any obvious warning signs in what you shared.",
        "This doesn't mean it's guaranteed to be safe — just that we didn't spot common scam patterns.",
      ],
      _signalWeights: [0, 0],
      nextSteps: [
        "If something still feels off, trust your instincts.",
        "Never send money to someone you haven't met in person.",
        "When in doubt, ask a trusted friend or family member for a second opinion.",
      ],
      reportTo: getReportTo(),
      educationalTip: "Even when something looks safe, it's always smart to be careful with personal information and money.",
      shareText: "I checked this with TrustChekr and it didn't find obvious scam signs, but they recommend staying cautious.",
    };
  }

  return {
    inputType: type,
    inputValue: input,
    riskLevel,
    whyBullets,
    _signalWeights,
    nextSteps,
    reportTo,
    educationalTip,
    shareText,
  };
}

function detectRomanceContext(input: string): boolean {
  const lower = input.toLowerCase();
  const romanceKeywords = [
    "dating", "tinder", "bumble", "hinge", "match.com", "plenty of fish", "pof",
    "boyfriend", "girlfriend", "partner", "met online", "love",
    "never met", "video call", "send money", "gift card",
    "oil rig", "military", "deployed", "overseas",
  ];
  return romanceKeywords.filter((k) => lower.includes(k)).length >= 2;
}

function scoreToRisk(score: number): RiskLevel {
  if (score <= 15) return "safe";
  if (score <= 40) return "suspicious";
  if (score <= 65) return "high-risk";
  return "very-likely-scam";
}

function getNextSteps(risk: RiskLevel, type: string, isRomance: boolean): string[] {
  if (isRomance) {
    return [
      "Pause any payments or transfers for now.",
      "Do not send any more money, gift cards, or crypto while you think this over.",
      "Talk to a trusted friend or family member and show them the messages.",
      risk === "very-likely-scam" || risk === "high-risk"
        ? "If you already sent money, contact your bank or card issuer as soon as possible."
        : "Take your time — there is no real emergency, even if they say there is.",
    ].filter(Boolean);
  }

  const steps: string[] = [];
  if (type === "website") {
    steps.push("Do not enter any personal information on this site.");
    steps.push("Do not click any links in messages that sent you here.");
    if (risk === "high-risk" || risk === "very-likely-scam") {
      steps.push("If you already entered information, contact your bank right away.");
    }
  } else if (type === "message") {
    steps.push("Do not reply to this message.");
    steps.push("Do not click any links in this message.");
    if (risk === "high-risk" || risk === "very-likely-scam") {
      steps.push("If you already shared information or sent money, contact your bank right away.");
    }
  } else {
    steps.push("Do not call back or respond to this number/address.");
    steps.push("If someone is pressuring you using this contact, stop communication.");
  }
  steps.push("If you are unsure, ask someone you trust to review this with you.");
  return steps;
}

function getReportTo(): string[] {
  return [
    "Canadian Anti-Fraud Centre (CAFC) — 1-888-495-8501",
    "FTC (US) — reportfraud.ftc.gov",
    "Your local police non-emergency line",
  ];
}

function getEducationalTip(type: string, isRomance: boolean): string {
  if (isRomance) {
    return "Romance scammers build trust over weeks or months before asking for money. Anyone who asks for money, crypto, or gift cards in an online relationship is very likely running a scam — no matter how real the feelings seem.";
  }
  if (type === "website") {
    return "Real banks and companies will never send you a link and ask you to log in urgently. When in doubt, go directly to the website by typing the address yourself.";
  }
  if (type === "message") {
    return "Scam messages create a sense of urgency to stop you from thinking clearly. If a message says you must act right now, that's often the biggest red flag.";
  }
  return "Legitimate organizations will never ask you to pay with gift cards, crypto, or wire transfers. These payment methods are chosen by scammers because they're hard to reverse.";
}

function buildShareText(risk: RiskLevel, scamType: string, bullets: string[]): string {
  const riskLabels: Record<RiskLevel, string> = {
    safe: "Low Risk",
    suspicious: "Suspicious",
    "high-risk": "High-Risk",
    "very-likely-scam": "Very Likely Scam",
  };
  const topReason = bullets[0] ? ` — ${bullets[0].toLowerCase()}` : "";
  return `TrustChekr flagged this as ${riskLabels[risk]} for a ${scamType}${topReason}`;
}
