// Phone OSINT - format analysis + area code lookup + known scam patterns
export interface PhoneResult {
  formatted: string | null;
  country: string | null;
  type: string | null; // landline, mobile, voip, toll-free, premium
  isScamAreaCode: boolean;
  signals: { text: string; weight: number }[];
}

// Area codes frequently associated with phone scams
const SCAM_AREA_CODES: Record<string, string> = {
  "226": "Ontario, CA", "249": "Ontario, CA", "289": "Ontario, CA",
  "343": "Ontario, CA", "365": "Ontario, CA", "382": "Ontario, CA",
  // Caribbean/international premium scam codes
  "242": "Bahamas", "246": "Barbados", "284": "British Virgin Islands",
  "345": "Cayman Islands", "441": "Bermuda", "473": "Grenada",
  "649": "Turks and Caicos", "664": "Montserrat", "721": "Sint Maarten",
  "758": "St. Lucia", "767": "Dominica", "784": "St. Vincent",
  "809": "Dominican Republic", "829": "Dominican Republic",
  "849": "Dominican Republic", "868": "Trinidad", "876": "Jamaica",
  "900": "Premium Rate", "976": "Premium Rate",
};

const KNOWN_SCAM_PREFIXES = [
  "242", "246", "284", "345", "441", "473", "649", "664",
  "767", "809", "829", "849", "868", "876", "900", "976",
];

export async function analyzePhone(input: string): Promise<PhoneResult> {
  const signals: { text: string; weight: number }[] = [];

  // Clean the number
  const digitsOnly = input.replace(/\D/g, "");

  if (digitsOnly.length < 7) {
    return {
      formatted: null, country: null, type: null, isScamAreaCode: false,
      signals: [{ text: "This phone number appears to be incomplete.", weight: 5 }],
    };
  }

  // Extract area code (North American)
  let areaCode = "";
  if (digitsOnly.length === 10) {
    areaCode = digitsOnly.substring(0, 3);
  } else if (digitsOnly.length === 11 && digitsOnly.startsWith("1")) {
    areaCode = digitsOnly.substring(1, 4);
  }

  const isScamArea = KNOWN_SCAM_PREFIXES.includes(areaCode);

  // Premium rate numbers
  if (areaCode === "900" || areaCode === "976") {
    signals.push({
      text: "This is a premium-rate number that charges you per minute. Scammers trick people into calling these numbers to rack up charges.",
      weight: 30,
    });
  }

  // Caribbean scam codes (one-ring scams)
  if (isScamArea && areaCode !== "900" && areaCode !== "976") {
    const location = SCAM_AREA_CODES[areaCode] || "unknown";
    signals.push({
      text: `This number's area code (${areaCode}) is for ${location}. This area code is frequently used in phone scams, especially "one-ring" scams that trick you into calling back expensive international numbers.`,
      weight: 25,
    });
  }

  // Toll-free analysis
  const tollFree = ["800", "888", "877", "866", "855", "844", "833"];
  if (tollFree.includes(areaCode)) {
    signals.push({
      text: "This is a toll-free number. While many real businesses use these, scammers can easily set them up too. Verify the number on the company's official website before calling.",
      weight: 5,
    });
  }

  // Format for display
  let formatted = input;
  if (digitsOnly.length === 10) {
    formatted = `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
  } else if (digitsOnly.length === 11 && digitsOnly.startsWith("1")) {
    formatted = `+1 (${digitsOnly.slice(1, 4)}) ${digitsOnly.slice(4, 7)}-${digitsOnly.slice(7)}`;
  }

  // NumVerify API (free tier - 100 requests/month)
  if (process.env.NUMVERIFY_API_KEY) {
    try {
      const nvRes = await fetch(
        `http://apilayer.net/api/validate?access_key=${process.env.NUMVERIFY_API_KEY}&number=${digitsOnly}`,
        { signal: AbortSignal.timeout(5000) }
      );
      if (nvRes.ok) {
        const data = await nvRes.json();
        if (data.valid === false) {
          signals.push({
            text: "This phone number does not appear to be a valid, active number.",
            weight: 15,
          });
        }
        if (data.line_type === "voip") {
          signals.push({
            text: "This is an internet-based (VoIP) phone number, not a traditional phone line. Scammers often use VoIP numbers because they're cheap, anonymous, and disposable.",
            weight: 15,
          });
        }
      }
    } catch {
      // API unavailable
    }
  }

  return {
    formatted,
    country: digitsOnly.startsWith("1") ? "North America" : null,
    type: tollFree.includes(areaCode) ? "toll-free" : null,
    isScamAreaCode: isScamArea,
    signals,
  };
}
