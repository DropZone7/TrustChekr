// Crypto OSINT - XRPL address analysis + Bitcoin/ETH pattern detection
export interface CryptoResult {
  type: string; // xrpl, bitcoin, ethereum, unknown
  address: string;
  signals: { text: string; weight: number }[];
}

function detectCryptoType(input: string): string {
  const trimmed = input.trim();
  if (/^r[A-Za-z0-9]{24,34}$/.test(trimmed)) return "xrpl";
  if (/^(1|3)[A-Za-z0-9]{25,34}$/.test(trimmed)) return "bitcoin";
  if (/^bc1[a-zA-Z0-9]{39,59}$/.test(trimmed)) return "bitcoin";
  if (/^0x[a-fA-F0-9]{40}$/.test(trimmed)) return "ethereum";
  if (/^T[A-Za-z0-9]{33}$/.test(trimmed)) return "tron";
  return "unknown";
}

export async function analyzeCrypto(input: string): Promise<CryptoResult> {
  const signals: { text: string; weight: number }[] = [];
  const address = input.trim();
  const type = detectCryptoType(address);

  if (type === "unknown") {
    return { type, address, signals: [
      { text: "We couldn't identify this as a known cryptocurrency address format.", weight: 5 }
    ]};
  }

  // Universal crypto warning
  signals.push({
    text: "If someone asked you to send cryptocurrency to this address, be very cautious. Crypto payments are nearly impossible to reverse once sent.",
    weight: 15,
  });

  signals.push({
    text: "Legitimate companies, government agencies, and banks will never ask you to pay in cryptocurrency.",
    weight: 10,
  });

  // XRPL-specific analysis via XRPSCAN
  if (type === "xrpl") {
    try {
      const xrpRes = await fetch(`https://api.xrpscan.com/api/v1/account/${address}`, {
        signal: AbortSignal.timeout(5000),
      });
      if (xrpRes.ok) {
        const data = await xrpRes.json();

        // Check account age
        if (data.inception) {
          const created = new Date(data.inception);
          const ageDays = Math.floor((Date.now() - created.getTime()) / (1000 * 60 * 60 * 24));
          if (ageDays < 30) {
            signals.push({
              text: `This XRPL wallet was created only ${ageDays} days ago. Brand new wallets used to receive payments are a common sign of scams.`,
              weight: 20,
            });
          }
        }

        // Check transaction count
        if (data.txCount !== undefined) {
          if (data.txCount > 1000) {
            signals.push({
              text: "This wallet has a very high number of transactions, which could indicate it's being used to collect payments from many victims.",
              weight: 15,
            });
          } else if (data.txCount < 5) {
            signals.push({
              text: "This wallet has very few transactions, suggesting it was recently created — possibly for a single scam.",
              weight: 10,
            });
          }
        }

        // Check balance
        if (data.xrpBalance !== undefined) {
          const balance = parseFloat(data.xrpBalance);
          if (balance < 10) {
            signals.push({
              text: "This wallet has a very low balance, which is common for scam wallets that quickly move funds elsewhere.",
              weight: 10,
            });
          }
        }
      } else if (xrpRes.status === 404) {
        signals.push({
          text: "This XRPL address doesn't appear to be activated yet. It has no transaction history.",
          weight: 10,
        });
      }
    } catch {
      // XRPSCAN unavailable
    }
  }

  // Bitcoin analysis via Blockchain.info (free, no key)
  if (type === "bitcoin") {
    try {
      const btcRes = await fetch(`https://blockchain.info/rawaddr/${address}?limit=1`, {
        signal: AbortSignal.timeout(5000),
      });
      if (btcRes.ok) {
        const data = await btcRes.json();
        const txCount = data.n_tx || 0;
        const totalReceived = (data.total_received || 0) / 100000000; // satoshis to BTC

        if (txCount === 0) {
          signals.push({
            text: "This Bitcoin address has no transaction history — it may have been freshly generated for a scam.",
            weight: 15,
          });
        } else if (txCount > 100) {
          signals.push({
            text: `This Bitcoin address has ${txCount} transactions and has received ${totalReceived.toFixed(4)} BTC total. High volume could indicate it's collecting from many people.`,
            weight: 15,
          });
        }
      }
    } catch {
      // Blockchain.info unavailable
    }
  }

  // Ethereum analysis via Etherscan (free tier)
  if (type === "ethereum" && process.env.ETHERSCAN_API_KEY) {
    try {
      const ethRes = await fetch(
        `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=1&sort=asc&apikey=${process.env.ETHERSCAN_API_KEY}`,
        { signal: AbortSignal.timeout(5000) }
      );
      if (ethRes.ok) {
        const data = await ethRes.json();
        if (data.result && data.result.length === 0) {
          signals.push({
            text: "This Ethereum address has no transaction history — it appears to be brand new.",
            weight: 15,
          });
        }
      }
    } catch {
      // Etherscan unavailable
    }
  }

  return { type, address, signals };
}
