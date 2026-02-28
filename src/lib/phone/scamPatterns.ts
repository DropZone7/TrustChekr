export type ScamRiskLevel = 'low' | 'medium' | 'high';
export type ScamRegion = 'CA' | 'US' | 'CA_US';

export type ScamPattern = {
  id: string;
  name: string;
  description: string;
  riskLevel: ScamRiskLevel;
  numbers: RegExp[];
  tactics: string[];
  targetDemographic: string;
  reportedLosses: string;
  active: boolean;
  region: ScamRegion;
};

const index = new Map<string, number>();

export const SCAM_PATTERNS: ScamPattern[] = [
  { id: 'cra-tax', name: 'CRA Tax Scam', description: 'Callers impersonate the Canada Revenue Agency, threatening arrest or demanding immediate payment via gift cards or crypto.', riskLevel: 'high', numbers: [/^1?8(00|33|44|55|66|77|88)\d{7}$/, /^1?(226|343|289|416|905|613|647)\d{7}$/], tactics: ['Arrest threats', 'Gift card payment', 'SIN suspension'], targetDemographic: 'All Canadians, especially seniors and new immigrants', reportedLosses: 'Millions annually per CAFC reports', active: true, region: 'CA' },
  { id: 'irs-impersonation', name: 'IRS Impersonation Scam', description: 'Callers claim to be IRS agents demanding immediate tax payment or threatening arrest and deportation.', riskLevel: 'high', numbers: [/^1?8(00|33|44|55|66|77|88)\d{7}$/], tactics: ['Arrest threats', 'Wire transfer demands', 'SSN suspension'], targetDemographic: 'US taxpayers, immigrants', reportedLosses: 'Over $72M reported to TIGTA', active: true, region: 'US' },
  { id: 'tech-support-ms', name: 'Microsoft Tech Support Scam', description: 'Pop-ups or calls claiming your computer has a virus, asking for remote access and payment to "fix" it.', riskLevel: 'high', numbers: [/^1?8(00|33|44|55|66|77|88)\d{7}$/], tactics: ['Remote access', 'Fake virus alerts', 'Gift card payment'], targetDemographic: 'Seniors and non-technical users', reportedLosses: 'FTC reports billions lost to tech support scams annually', active: true, region: 'CA_US' },
  { id: 'tech-support-apple', name: 'Apple ID / iCloud Scam', description: 'Calls or texts claiming your Apple ID is compromised, directing to fake login pages to steal credentials.', riskLevel: 'high', numbers: [/^1?8(00|33|44|55|66|77|88)\d{7}$/], tactics: ['Account lockout threats', 'Phishing links', 'Remote access'], targetDemographic: 'Apple device users', reportedLosses: 'Significant losses reported to FTC and CAFC', active: true, region: 'CA_US' },
  { id: 'amazon-order', name: 'Amazon Order Confirmation Scam', description: 'Calls or emails about fake Amazon orders or Prime renewals, asking to "confirm" payment info or grant remote access.', riskLevel: 'high', numbers: [/^1?8(00|33|44|55|66|77|88)\d{7}$/], tactics: ['Fake order alerts', 'Remote access', 'Credit card harvesting'], targetDemographic: 'Amazon customers, seniors', reportedLosses: 'Top impersonated brand per FTC', active: true, region: 'CA_US' },
  { id: 'bank-fraud-dept', name: 'Bank Fraud Department Impersonation', description: 'Callers pretend to be your bank\'s fraud department, convincing you to transfer money to a "safe" account.', riskLevel: 'high', numbers: [/^1?(416|905|604|514|403|613|647|289|226|343)\d{7}$/, /^1?8(00|33|44|55|66|77|88)\d{7}$/], tactics: ['Caller ID spoofing', 'Urgency', 'Transfer to "safe" account'], targetDemographic: 'Banking customers', reportedLosses: 'Among top loss categories at CAFC', active: true, region: 'CA_US' },
  { id: 'auto-warranty', name: 'Extended Auto Warranty Robocall', description: 'Automated calls about expiring vehicle warranties, pressing to buy fake extended coverage.', riskLevel: 'medium', numbers: [/^\d{10,11}$/], tactics: ['Robocall', 'High-pressure sales', 'Fake urgency'], targetDemographic: 'Vehicle owners', reportedLosses: 'Most reported robocall type in the US', active: true, region: 'CA_US' },
  { id: 'student-loan', name: 'Student Loan Forgiveness Scam', description: 'Calls promising student loan forgiveness or consolidation for an upfront fee.', riskLevel: 'medium', numbers: [/^1?8(00|33|44|55|66|77|88)\d{7}$/], tactics: ['Upfront fees', 'Government impersonation', 'Urgency'], targetDemographic: 'Student loan borrowers', reportedLosses: 'FTC reports significant losses', active: true, region: 'US' },
  { id: 'rcmp-warrant', name: 'RCMP / Police Arrest Warrant Scam', description: 'Callers impersonate RCMP officers threatening immediate arrest for alleged crimes, demanding payment to clear warrants.', riskLevel: 'high', numbers: [/^1?(613|416|604|905|289|226|343|647|437)\d{7}$/, /^1?8(00|33|44|55|66|77|88)\d{7}$/], tactics: ['Arrest threats', 'SIN suspension', 'Wire transfer demands'], targetDemographic: 'All Canadians, especially new immigrants', reportedLosses: 'Top fraud category at CAFC', active: true, region: 'CA' },
  { id: 'fbi-warrant', name: 'FBI / Federal Warrant Scam', description: 'Callers claim to be FBI or federal agents with warrants, demanding payment to avoid arrest.', riskLevel: 'high', numbers: [/^1?8(00|33|44|55|66|77|88)\d{7}$/, /^1?(202|212|312)\d{7}$/], tactics: ['Federal impersonation', 'Arrest threats', 'Wire transfer'], targetDemographic: 'US residents, immigrants', reportedLosses: 'Millions reported annually', active: true, region: 'US' },
  { id: 'utility-disconnect', name: 'Utility Disconnection Scam', description: 'Callers threaten immediate power, gas, or internet disconnection unless payment is made right away.', riskLevel: 'high', numbers: [/^\d{10,11}$/], tactics: ['Disconnection threats', 'Immediate payment', 'Gift cards'], targetDemographic: 'Homeowners and renters', reportedLosses: 'Common across Canada and US', active: true, region: 'CA_US' },
  { id: 'customs-parcel', name: 'Customs / Border Agency Parcel Scam', description: 'Calls or texts claiming a parcel is held at customs and requires a fee or personal info to release.', riskLevel: 'high', numbers: [/^1?8(00|33|44|55|66|77|88)\d{7}$/], tactics: ['CBSA/CBP impersonation', 'Fee demands', 'SIN/SSN requests'], targetDemographic: 'Online shoppers, immigrants', reportedLosses: 'Growing category per CAFC', active: true, region: 'CA_US' },
  { id: 'grandparent', name: 'Grandparent Emergency Scam', description: 'Caller pretends to be a grandchild in trouble — arrested, in an accident, or stranded — and begs for money urgently.', riskLevel: 'high', numbers: [/^\d{10,11}$/], tactics: ['Emotional manipulation', 'Secrecy requests', 'Wire transfer or gift cards'], targetDemographic: 'Seniors', reportedLosses: 'Average loss $7,000-$10,000 per CAFC', active: true, region: 'CA_US' },
  { id: 'romance-callback', name: 'Romance Scam Callback', description: 'Calls from someone met online asking for money, often escalating from small amounts to large transfers or crypto.', riskLevel: 'high', numbers: [/^\d{10,11}$/], tactics: ['Emotional grooming', 'Crypto investment', 'Emergency money requests'], targetDemographic: 'Adults using dating apps', reportedLosses: 'Highest median loss category per FTC ($4,400)', active: true, region: 'CA_US' },
  { id: 'crypto-recovery', name: 'Crypto Investment / Recovery Scam', description: 'Calls promising crypto investment returns or offering to recover lost crypto funds for an upfront fee.', riskLevel: 'high', numbers: [/^\d{10,11}$/], tactics: ['Guaranteed returns', 'Recovery fees', 'Fake trading platforms'], targetDemographic: 'Crypto investors, scam victims', reportedLosses: 'Over $5.6B in US crypto fraud (FBI 2023)', active: true, region: 'CA_US' },
  { id: 'health-insurance', name: 'Health Insurance / Benefits Scam', description: 'Calls offering fake health insurance plans or claiming benefits are expiring, harvesting personal and financial info.', riskLevel: 'medium', numbers: [/^1?8(00|33|44|55|66|77|88)\d{7}$/], tactics: ['Open enrollment urgency', 'Info harvesting', 'Fake plans'], targetDemographic: 'Uninsured or recently retired', reportedLosses: 'Significant during open enrollment periods', active: true, region: 'US' },
  { id: 'jury-duty', name: 'Jury Duty / Court Fine Scam', description: 'Callers claim you missed jury duty and must pay a fine immediately to avoid arrest.', riskLevel: 'high', numbers: [/^\d{10,11}$/], tactics: ['Court impersonation', 'Arrest threats', 'Gift card payment'], targetDemographic: 'General public', reportedLosses: 'Reported across all US states', active: true, region: 'US' },
  { id: 'lottery-prize', name: 'Lottery / Prize Winner Scam', description: 'Calls announcing you won a lottery or prize, requiring a fee or taxes to claim winnings.', riskLevel: 'high', numbers: [/^1?8(00|33|44|55|66|77|88)\d{7}$/, /^1?(876|809|284)\d{7}$/], tactics: ['Advance fee', 'Tax payment demands', 'Gift cards'], targetDemographic: 'Seniors, general public', reportedLosses: 'Perennial top fraud type per CAFC', active: true, region: 'CA_US' },
  { id: 'fake-charity', name: 'Fake Charity Donation Call', description: 'Callers solicit donations for fake charities, often after natural disasters or during holiday seasons.', riskLevel: 'medium', numbers: [/^1?8(00|33|44|55|66|77|88)\d{7}$/], tactics: ['Emotional appeals', 'Pressure to donate now', 'Vague charity names'], targetDemographic: 'Generous individuals, seniors', reportedLosses: 'Spikes after major disasters', active: true, region: 'CA_US' },
  { id: 'visa-immigration', name: 'Visa / Immigration Status Scam', description: 'Calls threatening visa cancellation or deportation, demanding payment to "resolve" immigration issues.', riskLevel: 'high', numbers: [/^1?8(00|33|44|55|66|77|88)\d{7}$/, /^1?(613|416|905|202)\d{7}$/], tactics: ['IRCC/USCIS impersonation', 'Deportation threats', 'Wire transfer'], targetDemographic: 'Immigrants and visa holders', reportedLosses: 'Growing category', active: true, region: 'CA_US' },
  { id: 'sin-ssn-suspension', name: 'SIN / SSN Suspension Scam', description: 'Automated calls claiming your Social Insurance Number or Social Security Number has been suspended due to suspicious activity.', riskLevel: 'high', numbers: [/^1?8(00|33|44|55|66|77|88)\d{7}$/], tactics: ['Government impersonation', 'Identity theft threats', 'Immediate action demands'], targetDemographic: 'All residents', reportedLosses: 'Top robocall scam in both countries', active: true, region: 'CA_US' },
  { id: 'can-you-hear-me', name: '"Can You Hear Me?" Voice Recording Scam', description: 'Caller asks "Can you hear me?" to record your "yes" response, potentially for voice authorization fraud.', riskLevel: 'medium', numbers: [/^\d{10,11}$/], tactics: ['Voice capture', 'Social engineering', 'Authorization fraud'], targetDemographic: 'Anyone who answers unknown calls', reportedLosses: 'Widespread but individual losses vary', active: true, region: 'CA_US' },
];

// Build index
SCAM_PATTERNS.forEach((p, i) => index.set(p.id, i));

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return `1${digits}`;
  return digits;
}

export function matchScamPattern(phoneNumber: string, callDescription?: string): ScamPattern[] {
  const normalized = normalizePhone(phoneNumber);
  const desc = (callDescription ?? '').toLowerCase();

  const KEYWORDS: Record<string, string[]> = {
    'cra-tax': ['cra', 'canada revenue', 'tax refund', 'tax owed'],
    'irs-impersonation': ['irs', 'internal revenue'],
    'tech-support-ms': ['microsoft', 'windows', 'tech support', 'virus'],
    'tech-support-apple': ['apple', 'icloud', 'apple id'],
    'amazon-order': ['amazon', 'prime renewal', 'order confirmation'],
    'bank-fraud-dept': ['bank', 'fraud department', 'fraud team', 'safe account'],
    'auto-warranty': ['warranty', 'vehicle warranty', 'auto warranty'],
    'student-loan': ['student loan', 'loan forgiveness'],
    'rcmp-warrant': ['rcmp', 'police', 'arrest warrant', 'mountie'],
    'fbi-warrant': ['fbi', 'federal agent', 'federal warrant'],
    'utility-disconnect': ['hydro', 'utility', 'disconnect', 'power shut'],
    'customs-parcel': ['customs', 'cbsa', 'parcel', 'border'],
    'grandparent': ['grandparent', 'grandchild', 'grandson', 'granddaughter', 'bail money'],
    'romance-callback': ['romance', 'dating', 'love', 'met online'],
    'crypto-recovery': ['crypto', 'bitcoin', 'investment return', 'recovery'],
    'health-insurance': ['health insurance', 'benefits', 'medicare'],
    'jury-duty': ['jury duty', 'court fine', 'missed jury'],
    'lottery-prize': ['lottery', 'prize', 'winner', 'sweepstake'],
    'fake-charity': ['charity', 'donation', 'donate'],
    'visa-immigration': ['visa', 'immigration', 'deportation', 'ircc'],
    'sin-ssn-suspension': ['sin', 'ssn', 'social insurance', 'social security', 'suspended'],
    'can-you-hear-me': ['can you hear me', 'hear me'],
  };

  return SCAM_PATTERNS.filter((p) => {
    if (!p.active) return false;
    // Check number regex
    const numberMatch = p.numbers.some((re) => re.test(normalized) || re.test(phoneNumber.replace(/\D/g, '')));
    // Check keywords in description
    const kws = KEYWORDS[p.id] ?? [];
    const keywordMatch = desc && kws.some((kw) => desc.includes(kw));
    return numberMatch || keywordMatch;
  });
}

export function getPatternsByRegion(region?: string): ScamPattern[] {
  const r = (region ?? '').toUpperCase();
  return SCAM_PATTERNS.filter((p) => {
    if (!p.active) return false;
    if (r === 'CA') return p.region === 'CA' || p.region === 'CA_US';
    if (r === 'US') return p.region === 'US' || p.region === 'CA_US';
    return true;
  });
}

export function upsertScamPattern(pattern: ScamPattern): void {
  const existing = index.get(pattern.id);
  if (existing !== undefined) {
    SCAM_PATTERNS[existing] = pattern;
  } else {
    SCAM_PATTERNS.push(pattern);
    index.set(pattern.id, SCAM_PATTERNS.length - 1);
  }
}

export function deactivateScamPattern(id: string): void {
  const idx = index.get(id);
  if (idx !== undefined) SCAM_PATTERNS[idx].active = false;
}
