// src/lib/articles.ts

export type Article = {
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
};

const ARTICLES: Article[] = [
  {
    slug: "is-temu-a-scam",
    title: "Is Temu a Scam?",
    domain: "temu.com",
    category: "Shopping",
    publishedAt: "2025-11-10",
    updatedAt: "2026-02-15",
    trustScore: 71,
    verdict: "Low Risk",
    summary:
      "Temu is a legitimate e-commerce platform owned by PDD Holdings, but shoppers regularly report long shipping times, inconsistent product quality, and aggressive data collection practices. Here is what you need to know before buying.",
    body: [
      "Temu launched in the United States in September 2022 and quickly became one of the most downloaded shopping apps in the country. The platform is operated by PDD Holdings, a Nasdaq-listed company that also owns Pinduoduo, one of the largest e-commerce platforms in China. Temu is a real business with verifiable corporate ownership — it is not a fly-by-night storefront.",
      "The most consistent complaint from Temu customers is shipping time. Products are shipped directly from manufacturers and warehouses in China, which means delivery windows of 7 to 20 business days are common. Temu does offer a Purchase Protection Program that covers refunds for items that do not arrive or that significantly differ from their listing description, and in practice most reported refund requests are honored without returning the item.",
      "Product quality is the second major concern. Because Temu sells directly from third-party suppliers at heavily discounted prices, quality control is inconsistent. Items sold at unusually low prices — particularly electronics, tools, and clothing — frequently receive reviews noting that the product looks different from photographs or is made from cheaper materials than expected. This is not fraud in the legal sense, but it is a real risk shoppers should account for.",
      "Data privacy is a more serious concern. Temu's app has been the subject of scrutiny from security researchers and U.S. lawmakers over the breadth of data it collects. In 2023, Arkansas filed a lawsuit alleging that Temu's app functions as \"dangerous malware.\" Temu denied these allegations. A 2024 report from Grizzly Research described the app as a potential data security risk. Independent researchers have reached different conclusions, but the weight of evidence suggests the app collects more data than most shopping applications.",
      "Temu's business model relies on subsidized pricing to acquire customers — the company operates at a significant loss per order with the goal of building long-term market share. This means the deep discounts are real and not inherently a sign of fraud. However, it also means the platform has strong financial incentives to collect and monetize user data to offset those losses.",
      "From a payment security standpoint, Temu uses standard SSL encryption and accepts major credit cards, PayPal, and Apple Pay. There is no credible evidence that Temu misuses payment information. Shoppers who are concerned about data exposure may prefer to use a one-time virtual card number for purchases.",
      "The practical conclusion is that Temu is a real retailer with real consumer risks. Shoppers who understand that prices reflect product quality, who do not install the mobile app, and who use a virtual payment method can shop with an acceptable level of risk. The platform is not a scam in the sense of taking money without delivering anything — but it warrants informed caution.",
    ],
  },
  {
    slug: "is-shein-a-scam",
    title: "Is Shein a Scam?",
    domain: "shein.com",
    category: "Shopping",
    publishedAt: "2025-10-22",
    updatedAt: "2026-02-10",
    trustScore: 68,
    verdict: "Use Caution",
    summary:
      "Shein is one of the largest fast-fashion retailers in the world and does fulfill orders, but the company has faced documented allegations involving labor practices, intellectual property violations, and product safety failures that informed shoppers should understand.",
    body: [
      "Shein was founded in 2008 and is headquartered in Singapore, with primary operations in China. The company has grown into one of the most visited retail websites globally and was valued at over $60 billion at its peak. It is a real company that ships real products — the core question is not whether it is fraudulent but whether the risks associated with using it are acceptable to you.",
      "Shein's business model depends on an extraordinarily fast design-to-market cycle. The company reportedly adds between 2,000 and 10,000 new items per day to its catalog. This speed has come with well-documented costs. Multiple independent investigations — including those by Channel 4 News and the Canadian Broadcasting Corporation — have documented working conditions in Shein's supply chain that fall below the standards the company publicly claims to uphold.",
      "Intellectual property infringement is a persistent legal issue for Shein. The company has faced dozens of lawsuits from independent designers and major brands alleging that Shein copied original designs without permission or payment. Shein has settled several of these cases. This does not affect the safety of a purchase but speaks to the company's operational standards.",
      "Product safety is a documented concern. In 2021 and 2023, CBC Marketplace tested Shein children's clothing and accessories and found items with lead levels exceeding Health Canada and U.S. Consumer Product Safety Commission limits. Shein disputed some findings and removed flagged items, but the pattern across multiple independent tests is difficult to dismiss, particularly for products intended for children.",
      "On the customer experience side, Shein does ship orders and does process refunds through its in-app dispute system. Complaints about shipping delays, incorrect items, and size inconsistencies are common — these are operational failures rather than fraud. Customer service quality is widely reported as poor, which can make resolving a dispute slow and frustrating.",
      "Shein's website uses HTTPS and standard payment processing. There is no credible pattern of payment information being misappropriated. Like Temu, the more relevant data concern is the app, which requests an extensive range of device permissions. Using the mobile website through a browser rather than installing the app reduces this exposure.",
      "Shoppers who choose to use Shein should avoid purchasing items that come into contact with children's skin, use a virtual card number, and order through the browser rather than the app. The platform is not a scam but carries consumer risk that other mainstream retailers do not.",
    ],
  },
  {
    slug: "is-wish-a-scam",
    title: "Is Wish a Scam?",
    domain: "wish.com",
    category: "Shopping",
    publishedAt: "2025-09-14",
    updatedAt: "2026-01-28",
    trustScore: 52,
    verdict: "Use Caution",
    summary:
      "Wish is a real e-commerce platform operated by ContextLogic Inc., but it has experienced a prolonged decline in user trust following widespread reports of counterfeit goods, misleading product images, and a temporary ban in France over safety concerns.",
    body: [
      "Wish was founded in 2010 and was once among the top-grossing shopping apps in the world. The platform operates as a marketplace connecting buyers with third-party sellers, the majority of whom are based in China. ContextLogic Inc., the parent company, is publicly traded on the Nasdaq under the ticker WISH. The company is legitimate — but its platform has experienced significant trust and quality problems over the past several years.",
      "In 2021, France's consumer protection agency DGCCRF ordered Wish to be removed from major app stores and search engines after an investigation found that 95 percent of a sample of tested products failed to meet EU safety standards. Products included toys with excessive chemical levels and electrical items without proper insulation. The ban lasted several months before Wish undertook compliance measures. This is the most serious regulatory action taken against any major e-commerce platform in recent years.",
      "Counterfeit goods are a systemic problem on Wish. The platform has been listed on the United States Trade Representative's \"Notorious Markets\" list, which identifies online and physical markets that facilitate trademark infringement and piracy. Wish has implemented seller policies against counterfeits, but enforcement is inconsistent and buyer reports of receiving fake branded products remain common.",
      "Product photography on Wish is frequently misleading. A well-documented pattern exists where product listing images bear little resemblance to what is actually shipped. This is particularly prevalent in categories including clothing, electronics, and home goods. In some cases the discrepancy is a matter of quality; in others the product received is categorically different from what was shown.",
      "Shipping times on Wish are among the longest of any major retail platform. Delivery windows of 2 to 6 weeks are common, and orders shipped via economy carriers can take longer. Wish's return policy formally covers non-delivery and significant item mismatch, but multiple consumer reviews describe difficulty completing the refund process, particularly for low-value orders where the dispute process may not be worth the time invested.",
      "Wish does process payments securely and there is no documented pattern of payment fraud attributable to the platform itself. The financial risk of a Wish purchase is typically the purchase price of the item — the more probable outcome is receiving a product that does not meet expectations rather than receiving nothing at all.",
      "Wish may be appropriate for purchasing commodity items where brand and exact specification do not matter and where a long wait is acceptable. It is not suitable for purchasing electronics, safety-critical items, products for children, or anything where brand authenticity is a concern. The platform's track record over the past five years reflects a marketplace with meaningful structural quality problems that have not been fully resolved.",
    ],
  },
];

export function getArticle(slug: string): Article | null {
  return ARTICLES.find((a) => a.slug === slug) ?? null;
}

export function getAllArticles(): Article[] {
  return ARTICLES;
}
