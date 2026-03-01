// src/lib/osint/tranco.ts

export interface TrancoResult {
  rank: number | null;
  isPopular: boolean;
  signals: { text: string; weight: number }[];
  checkedAt: string;
}

interface TrancoApiEntry {
  date: string;
  rank: number;
}

interface TrancoApiResponse {
  ranks: TrancoApiEntry[];
}

const TIER_TOP_10K = 10_000;
const TIER_TOP_100K = 100_000;
const TIER_TOP_1M = 1_000_000;

export async function checkTrancoRank(
  domain: string
): Promise<TrancoResult | null> {
  const signals: { text: string; weight: number }[] = [];

  const bare = domain
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//i, "")
    .replace(/\/.*$/, "")
    .replace(/^www\./, "");

  if (!bare) return null;

  let data: TrancoApiResponse;
  try {
    const res = await fetch(
      `https://tranco-list.eu/api/ranks/domain/${encodeURIComponent(bare)}`,
      {
        signal: AbortSignal.timeout(2000),
        headers: {
          Accept: "application/json",
          "User-Agent": "TrustChekr/1.0 (+https://trustchekr.com)",
        },
      }
    );

    if (!res.ok) return null;
    data = (await res.json()) as TrancoApiResponse;
  } catch {
    return null;
  }

  const latestEntry = data.ranks?.[0] ?? null;
  const rank = latestEntry?.rank ?? null;

  if (rank != null) {
    if (rank <= TIER_TOP_10K) {
      signals.push({
        text: `This is one of the ${TIER_TOP_10K.toLocaleString("en-CA")} most visited websites in the world (Tranco rank #${rank.toLocaleString("en-CA")})`,
        weight: -15,
      });
    } else if (rank <= TIER_TOP_100K) {
      signals.push({
        text: `This website ranks in the top ${TIER_TOP_100K.toLocaleString("en-CA")} globally (Tranco rank #${rank.toLocaleString("en-CA")})`,
        weight: -10,
      });
    } else if (rank <= TIER_TOP_1M) {
      signals.push({
        text: `This website has moderate global traffic (Tranco rank #${rank.toLocaleString("en-CA")})`,
        weight: -5,
      });
    }
  }

  const isPopular = rank != null && rank <= TIER_TOP_100K;

  return {
    rank,
    isPopular,
    signals,
    checkedAt: new Date().toISOString(),
  };
}
