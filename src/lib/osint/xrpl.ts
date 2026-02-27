// XRPL Transaction & Wallet Analysis
// Detects: dust attacks, scam wallets, suspicious memos, trust line exploits
// Based on Wietse Wind's 6 scam vectors + community intelligence

import { decode } from "xrpl";

interface Signal {
  text: string;
  weight: number;
}

export interface XrplAnalysisResult {
  type: string | null;
  from: string | null;
  to: string | null;
  amount: number | null;
  memos: string[];
  risks: string[];
  signals: Signal[];
}

// Known scam wallet addresses (expandable via DB/API later)
const SCAM_WALLETS = new Set<string>([
  // Add confirmed scam addresses here as we discover them
]);

const SUSPICIOUS_MEMO_PATTERNS = [
  { pattern: /(https?:\/\/|www\.)[^\s]+/i, reason: "Contains a URL — scammers embed phishing links in transaction memos", weight: 25 },
  { pattern: /t\.me\/[A-Za-z0-9_]+/i, reason: "Contains a Telegram link — commonly used for scam group invitations", weight: 30 },
  { pattern: /airdrop|free.?token|claim.?now|reward/i, reason: "Contains airdrop/giveaway language — a very common XRPL scam tactic", weight: 30 },
  { pattern: /send.*back|return.*xrp|double/i, reason: "Asks you to send XRP back — this is always a scam. No legitimate entity does this.", weight: 40 },
  { pattern: /trust.?line|set.?trust|add.?token/i, reason: "Asks you to set a trust line — scammers use this to push worthless tokens into your wallet", weight: 25 },
  { pattern: /private.?key|secret|seed|recovery/i, reason: "References private keys or secrets — NEVER share these. This is a social engineering attack.", weight: 45 },
  { pattern: /support|help.?desk|verify.?account/i, reason: "Impersonates support — real XRPL/Xaman support will never contact you through transaction memos", weight: 30 },
];

function decodeMemos(memos: any[]): string[] {
  if (!Array.isArray(memos)) return [];
  return memos
    .map((m: any) => {
      try {
        const data = m?.Memo?.MemoData;
        if (!data) return null;
        return Buffer.from(data, "hex").toString("utf8");
      } catch {
        return null;
      }
    })
    .filter((m): m is string => m !== null);
}

// Analyze a raw transaction blob (hex-encoded)
export function analyzeXrplBlob(txBlob: string): XrplAnalysisResult {
  const signals: Signal[] = [];
  const risks: string[] = [];

  try {
    const decoded = decode(txBlob) as any;
    const { TransactionType, Account, Destination, Amount, Memos, Flags } = decoded;

    // Decode memos
    const memos = decodeMemos(Memos ?? []);

    // Parse amount for Payment transactions
    let xrpAmount: number | null = null;
    if (TransactionType === "Payment" && typeof Amount === "string") {
      xrpAmount = Number(Amount) / 1_000_000;
    }

    // ── Check 1: Dust attack detection ──
    if (TransactionType === "Payment" && xrpAmount !== null && xrpAmount > 0 && xrpAmount < 0.001) {
      signals.push({
        text: `This is a dust payment of ${xrpAmount} XRP — an extremely tiny amount. Scammers send dust payments to push phishing links via memos or to track active wallets.`,
        weight: 25,
      });
      risks.push("DUST_ATTACK");
    }

    // ── Check 2: Known scam wallet ──
    if (Destination && SCAM_WALLETS.has(Destination)) {
      signals.push({
        text: "The destination wallet address is in our database of known scam wallets. Do NOT send any funds to this address.",
        weight: 50,
      });
      risks.push("KNOWN_SCAM_WALLET");
    }
    if (Account && SCAM_WALLETS.has(Account)) {
      signals.push({
        text: "The sender's wallet address is flagged as a known scam wallet. Do not interact with this account.",
        weight: 45,
      });
      risks.push("KNOWN_SCAM_SENDER");
    }

    // ── Check 3: Suspicious memos ──
    for (const memo of memos) {
      for (const { pattern, reason, weight } of SUSPICIOUS_MEMO_PATTERNS) {
        if (pattern.test(memo)) {
          signals.push({ text: reason, weight });
          risks.push("SUSPICIOUS_MEMO");
          break; // One flag per memo is enough
        }
      }
    }

    // ── Check 4: Trust line manipulation (TrustSet) ──
    if (TransactionType === "TrustSet") {
      signals.push({
        text: "This transaction sets a trust line, which allows a token to enter your wallet. Only set trust lines for tokens you specifically chose to hold. Scammers use unsolicited trust line requests to push worthless or malicious tokens.",
        weight: 20,
      });
      risks.push("TRUST_LINE_REQUEST");
    }

    // ── Check 5: NFTokenCreateOffer (unsolicited NFT) ──
    if (TransactionType === "NFTokenCreateOffer") {
      signals.push({
        text: "This is an NFT offer. Scammers send unsolicited NFTs that contain phishing links or \"swap offers\" designed to drain your wallet when you interact with them.",
        weight: 20,
      });
      risks.push("UNSOLICITED_NFT");
    }

    // ── Check 6: OfferCreate with unusual flags ──
    if (TransactionType === "OfferCreate" && Flags) {
      signals.push({
        text: "This creates a trade offer on the XRPL DEX. Verify the exchange rate carefully — scammers create offers with extremely unfavorable rates hoping you'll accept without checking.",
        weight: 10,
      });
    }

    // Wietse's 6 vectors educational note if any risk found
    if (risks.length > 0) {
      signals.push({
        text: "Common XRPL scam methods include: fake giveaways, support impersonation on X/Telegram, malicious NFT airdrops, phishing sign requests that look routine, fake desktop wallet apps, and email phishing using leaked lists.",
        weight: 0, // Educational, no scoring weight
      });
    }

    return {
      type: TransactionType ?? null,
      from: Account ?? null,
      to: Destination ?? null,
      amount: xrpAmount,
      memos,
      risks,
      signals,
    };
  } catch {
    return {
      type: null,
      from: null,
      to: null,
      amount: null,
      memos: [],
      risks: [],
      signals: [{ text: "Could not decode this XRPL transaction. Please verify the transaction hash or blob is correct.", weight: 5 }],
    };
  }
}

// Analyze an XRPL wallet address by checking transaction history
export async function analyzeXrplWallet(address: string): Promise<XrplAnalysisResult> {
  const signals: Signal[] = [];
  const risks: string[] = [];

  // Check against known scam list
  if (SCAM_WALLETS.has(address)) {
    signals.push({
      text: "This wallet address is in our database of known scam wallets. Do NOT send any funds to this address.",
      weight: 50,
    });
    risks.push("KNOWN_SCAM_WALLET");
  }

  // Query XRPL public server for account info
  try {
    const res = await fetch("https://s1.ripple.com:51234/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        method: "account_info",
        params: [{ account: address, ledger_index: "validated" }],
      }),
      signal: AbortSignal.timeout(5000),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.result?.status === "success") {
        const info = data.result.account_data;
        const balance = Number(info.Balance) / 1_000_000;

        // Very low balance might indicate a throw-away scam wallet
        if (balance < 15) {
          signals.push({
            text: `This wallet has a very low balance (${balance.toFixed(2)} XRP). Scam wallets are often funded with just enough to operate and then abandoned.`,
            weight: 10,
          });
        }

        // Check sequence (number of transactions)
        if (info.Sequence && info.Sequence < 5) {
          signals.push({
            text: "This wallet has very few transactions, which could indicate it was recently created for a specific scam campaign.",
            weight: 10,
          });
        }
      } else if (data.result?.error === "actNotFound") {
        signals.push({
          text: "This wallet address does not exist on the XRP Ledger. It may be fake or not yet activated.",
          weight: 15,
        });
        risks.push("WALLET_NOT_FOUND");
      }
    }
  } catch {
    // XRPL node unavailable
  }

  // Query recent transactions for dust pattern
  try {
    const res = await fetch("https://s1.ripple.com:51234/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        method: "account_tx",
        params: [{ account: address, limit: 20, ledger_index_min: -1, ledger_index_max: -1 }],
      }),
      signal: AbortSignal.timeout(5000),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.result?.transactions) {
        const txs = data.result.transactions;

        // Count dust payments sent FROM this wallet
        let dustCount = 0;
        let uniqueDestinations = new Set<string>();

        for (const tx of txs) {
          const t = tx.tx ?? tx;
          if (t.TransactionType === "Payment" && typeof t.Amount === "string") {
            const amt = Number(t.Amount) / 1_000_000;
            if (amt > 0 && amt < 0.01 && t.Account === address) {
              dustCount++;
              if (t.Destination) uniqueDestinations.add(t.Destination);
            }
          }
        }

        if (dustCount >= 3) {
          signals.push({
            text: `This wallet has sent ${dustCount} dust payments to ${uniqueDestinations.size} different addresses. This is a common pattern for scam wallets that mass-distribute phishing memos.`,
            weight: 35,
          });
          risks.push("DUST_SENDER");
        }
      }
    }
  } catch {
    // Fail silently
  }

  return {
    type: null,
    from: null,
    to: address,
    amount: null,
    memos: [],
    risks,
    signals,
  };
}
