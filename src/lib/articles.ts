// src/lib/articles.ts

export interface Article {
  slug: string;
  title: string;
  domain: string;
  category: string;
  publishedAt: string;
  updatedAt: string;
  summary: string;
  body: string[];
  verdict: string;
  trustScore: number;
}

const articles: Article[] = [
  {
    slug: "is-temu-a-scam",
    title: "Is Temu a Scam? What Canadians Should Know",
    domain: "temu.com",
    category: "Online Shopping",
    publishedAt: "2026-02-28",
    updatedAt: "2026-02-28",
    summary: "Temu is a legitimate e-commerce platform owned by PDD Holdings, but there are real consumer concerns around data privacy, product quality, and aggressive marketing practices.",
    body: [
      "Temu launched in September 2022 and quickly became one of the most downloaded shopping apps in North America. It is owned by PDD Holdings, the same Chinese company behind Pinduoduo, one of China's largest e-commerce platforms.",
      "The platform is not a scam in the traditional sense. Orders are fulfilled, payments are processed through standard channels, and the company has a visible corporate structure. It operates under PDD Holdings (Nasdaq: PDD), a publicly traded company valued at over $130 billion.",
      "However, there are legitimate concerns. Consumer reports consistently mention product quality issues, with items frequently not matching their listings. Shipping times can range from 7 to 20 days for Canadian customers, and returns are often impractical given the low price points.",
      "Privacy advocates have raised alarms about Temu's data collection practices. The app requests extensive device permissions, and PDD Holdings has faced scrutiny from US lawmakers over potential data sharing with Chinese government entities. In 2023, Google temporarily suspended Pinduoduo from the Play Store over malware concerns.",
      "The aggressive referral and gamification system has also drawn criticism. Users are incentivized to share the app through credit rewards, which some consumer protection groups compare to multi-level marketing tactics.",
      "For Canadian shoppers, it is worth noting that purchases under $20 CAD are exempt from import duties, but items above that threshold may incur unexpected customs charges. Temu does not always make this clear at checkout.",
      "Our assessment: Temu is a real company that delivers real products, but buyers should set realistic expectations about quality and be cautious about the personal data they share through the app.",
    ],
    verdict: "Use Caution",
    trustScore: 52,
  },
  {
    slug: "is-shein-a-scam",
    title: "Is Shein a Scam? A Detailed Look for Canadian Shoppers",
    domain: "shein.com",
    category: "Online Shopping",
    publishedAt: "2026-02-28",
    updatedAt: "2026-02-28",
    summary: "Shein is a legitimate fast-fashion retailer, but faces serious concerns around labour practices, environmental impact, intellectual property theft, and data privacy.",
    body: [
      "Shein is a global fast-fashion retailer founded in 2008, now headquartered in Singapore. It is one of the largest online-only fashion companies in the world, reportedly valued at over $60 billion as of 2024.",
      "The company is not a scam. It processes millions of orders globally, accepts standard payment methods, and has established logistics networks in North America. Canadian customers generally receive their orders within 7 to 14 days.",
      "The primary concerns with Shein are ethical rather than fraudulent. Investigative reports from the BBC, Channel 4, and others have documented labour conditions in Shein's supply chain, with workers reportedly logging 18-hour days for per-garment wages well below minimum standards.",
      "Environmental groups have criticized Shein's business model, which relies on producing thousands of new designs weekly using low-cost synthetic fabrics. A 2022 report found that Shein produces an estimated 6,000 new styles daily, creating significant textile waste.",
      "Shein has also faced hundreds of intellectual property lawsuits from independent designers and established brands who allege their designs were copied. Several lawsuits have been settled or decided against Shein.",
      "On the data privacy front, Shein suffered a data breach in 2018 affecting 39 million users. The company was fined $1.9 million by the New York Attorney General in 2022 for failing to properly notify affected customers.",
      "For Canadian consumers, Shein products are generally functional but quality varies significantly. The low prices reflect the true cost of production — buyers should not expect durability or consistency across orders.",
    ],
    verdict: "Use Caution",
    trustScore: 55,
  },
  {
    slug: "is-wish-a-scam",
    title: "Is Wish a Scam? What You Need to Know Before Ordering",
    domain: "wish.com",
    category: "Online Shopping",
    publishedAt: "2026-02-28",
    updatedAt: "2026-02-28",
    summary: "Wish is a legitimate marketplace but has a well-documented history of misleading product listings, long shipping times, and difficulty obtaining refunds.",
    body: [
      "Wish is an e-commerce marketplace founded in 2010 and headquartered in San Francisco. It went public in 2020 (Nasdaq: WISH) and was later acquired by Qoo10 in 2024 for approximately $173 million — a fraction of its peak $14 billion valuation.",
      "Wish is not technically a scam. It operates as a marketplace connecting buyers with third-party sellers, similar to how Amazon Marketplace or eBay function. However, the platform has developed a reputation for misleading product listings that differ significantly from what buyers receive.",
      "The Federal Trade Commission (FTC) in the United States took action against Wish in 2023, alleging that the platform allowed misleading advertising and fake discounts. The FTC order required Wish to verify product claims before displaying them.",
      "In France, the government went further — temporarily removing Wish from search engine results in 2021 after testing found that 95% of electronics and 62% of toys sold on the platform failed to meet EU safety standards.",
      "Canadian consumers report that shipping times from Wish can range from 2 to 8 weeks, and many products arrive looking nothing like their listings. The refund process exists but is often described as slow and difficult to navigate.",
      "The platform's business model relies on extremely low prices subsidized by direct-from-manufacturer shipping, primarily from China. This means limited quality control and virtually no accountability for individual sellers.",
      "Our assessment: While Wish is a real company with a real marketplace, the history of regulatory action, misleading listings, and quality control problems means Canadian consumers should approach it with significant caution.",
    ],
    verdict: "Suspicious",
    trustScore: 38,
  },
];

export function getArticle(slug: string): Article | null {
  return articles.find((a) => a.slug === slug) ?? null;
}

export function getAllArticles(): Article[] {
  return articles;
}
