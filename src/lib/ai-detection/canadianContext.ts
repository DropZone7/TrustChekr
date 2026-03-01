import type { ScamCategory } from './types';

/**
 * Maps detected scam categories to Canadian-specific guidance.
 * This is what makes TrustChekr uniquely valuable — no competitor does this.
 */

interface CanadianGuidance {
  context: string[];
  actions: string[];
}

const GUIDANCE: Record<ScamCategory, CanadianGuidance> = {
  CRA_IMPERSONATION: {
    context: [
      'The real CRA will never threaten arrest, demand gift cards, or ask for payment by Bitcoin ATM.',
      'CRA communicates primarily through My Account (cra-arc.gc.ca/myaccount) and regular mail.',
      'The CRA will only call from 1-800-959-8281 — and only after sending a written notice first.',
      'CRA impersonation is the #1 fraud type in Canada, costing over $50M in 2023 alone (CAFC).',
    ],
    actions: [
      'Hang up immediately — do not press any buttons or call back the number they gave you.',
      'Verify by logging into your CRA My Account directly at cra-arc.gc.ca/myaccount.',
      'Call the real CRA at 1-800-959-8281 if you want to confirm your tax status.',
      'Report to the CAFC at 1-888-495-8501 or antifraudcentre-centreantifraude.ca.',
    ],
  },

  BANK_IMPERSONATION: {
    context: [
      'Your bank will never ask for your password, PIN, or one-time code by phone, text, or email.',
      'Real bank alerts come from verified short codes — RBC: 722373, TD: 74836.',
      'The May 2024 e-Transfer daily limit increase to $10,000 has enabled larger scam hauls.',
      'BMO faced a $1.5M class action in 2024 after malware-enabled unauthorized transfers.',
    ],
    actions: [
      'Hang up and call your bank using the number on the back of your card.',
      'Never click links in texts claiming to be from your bank — open the banking app directly.',
      'Report phishing: RBC phishing@rbc.com, TD abuse@td.com.',
      'Report to the CAFC at 1-888-495-8501.',
    ],
  },

  INTERAC_PHISHING: {
    context: [
      'Real Interac e-Transfer notifications come from @interac.ca email addresses only.',
      'Interac will never ask you to log into your bank via a link in a notification email.',
      'With auto-deposit enabled, legitimate transfers arrive automatically — no action needed.',
      'Interception fraud occurs when scammers hack email to redirect e-Transfers before deposit.',
    ],
    actions: [
      'Do not click any links — check your banking app directly for pending transfers.',
      'If you received money unexpectedly, do NOT send it back via a new e-Transfer. Call your bank.',
      'Enable Interac e-Transfer auto-deposit to prevent interception of incoming transfers.',
      'Report to your bank and the CAFC at 1-888-495-8501.',
    ],
  },

  PIG_BUTCHERING: {
    context: [
      'This pattern matches romance-investment fraud — the FBI calls it "pig butchering."',
      'Average losses are $170,000 per victim. The FBI reported $5.8B in losses from this scam type in 2024.',
      'The "trading platform" showing your profits is fake — the balance was never real.',
      'CAFC reports romance-crypto as the dominant investment fraud pattern in 2024 ($250M+).',
    ],
    actions: [
      'Stop all contact with this person immediately — do not send any more money.',
      'Do not attempt to withdraw "profits" — withdrawal fees are part of the scam.',
      'Report to the CAFC at 1-888-495-8501 and your local police.',
      'If you used a Canadian exchange (Coinbase, Newton, etc.), contact them to report the receiving wallet.',
    ],
  },

  TECH_SUPPORT: {
    context: [
      'Microsoft, Apple, and Google will never call you about a virus on your computer.',
      'Tech support scams generated 50,000+ CAFC reports in 2024 — a top-10 fraud category.',
      'Remote access tools like AnyDesk and TeamViewer are legitimate but abused by scammers.',
      'Cyber-enabled fraud accounted for 75% of Canada\'s $641M in total losses (CAFC 2024).',
    ],
    actions: [
      'Close the browser tab or hang up the phone immediately.',
      'If you gave remote access: disconnect from the internet, change all passwords from a different device, call your bank.',
      'Run a full malware scan using your computer\'s built-in security (Windows Defender or equivalent).',
      'Report to the CAFC at 1-888-495-8501.',
    ],
  },

  CRYPTO_INVESTMENT: {
    context: [
      'No legitimate investment can guarantee returns. If it says "guaranteed," it is a scam.',
      'In Canada, crypto exchanges must register with provincial securities regulators — check at securities-administrators.ca.',
      'The IC3 reported $9.3B in cryptocurrency fraud losses in 2024, up 66% from 2023.',
      'CAFC flagged $14.2M in Bitcoin ATM scams in 2024 alone, with 3,500+ ATMs across Canada.',
    ],
    actions: [
      'Verify any platform at securities-administrators.ca before sending money.',
      'Never share your seed phrase with anyone — no exchange or support agent will ever ask for it.',
      'If you sent crypto to a scammer, report to CAFC and the exchange you used (they may freeze the wallet).',
      'Report to your local police and the OSC (if in Ontario) or your provincial securities regulator.',
    ],
  },

  RENTAL_SCAM: {
    context: [
      'Rental fraud costs Canadians $10M+ yearly (CAFC/RCMP estimate), up 50% since COVID.',
      'Scammers copy real MLS/Realtor.ca listings and repost them at lower prices on Kijiji and Facebook Marketplace.',
      'Toronto, Vancouver, and Montreal are the top cities for rental scams due to housing pressure.',
      'The median loss is $2,000 per victim via e-Transfer (BBB).',
    ],
    actions: [
      'Never send a deposit via e-Transfer before viewing the property in person.',
      'Reverse image search listing photos at images.google.com or tineye.com.',
      'Verify ownership through your municipality\'s property tax records.',
      'Check if the listing also appears on Realtor.ca — if so, contact the listing agent directly.',
      'Report to the CAFC at 1-888-495-8501 and your local police.',
    ],
  },

  GENERIC_PHISHING: {
    context: [
      'Phishing reports to the CAFC increased 6.8% in 2024 — it remains a top-10 fraud category.',
      'AI-written phishing emails now have perfect grammar and spelling. "Check for typos" is no longer reliable advice.',
      'QR code phishing ("quishing") is emerging — 10 cases reported in Montreal and Ottawa since 2024.',
    ],
    actions: [
      'Do not click any links or scan QR codes from unexpected messages.',
      'Go directly to the official website by typing the URL yourself.',
      'Change your password immediately if you entered credentials on a suspicious site.',
      'Report to the CAFC at 1-888-495-8501.',
    ],
  },
};

/**
 * Get Canadian context and recommended actions for detected scam categories.
 */
export function getCanadianGuidance(
  categories: ScamCategory[],
): { context: string[]; actions: string[] } {
  const contextSet = new Set<string>();
  const actionSet = new Set<string>();

  // Deduplicate across categories
  for (const cat of categories) {
    const g = GUIDANCE[cat];
    if (g) {
      g.context.forEach((c) => contextSet.add(c));
      g.actions.forEach((a) => actionSet.add(a));
    }
  }

  return {
    context: Array.from(contextSet),
    actions: Array.from(actionSet),
  };
}
