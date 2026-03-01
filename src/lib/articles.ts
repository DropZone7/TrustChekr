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
      "Temu launched in the United States in September 2022 and was downloaded over 100 million times in its first year. The platform is operated by PDD Holdings (NASDAQ: PDD), a company valued at over $150 billion that also owns Pinduoduo, one of the largest e-commerce platforms in China. Temu is a real business with verifiable corporate ownership — it is not a fly-by-night storefront.",
      "The most consistent complaint from Temu customers is shipping time. Products are shipped directly from manufacturers and warehouses in China, which means delivery windows of 7 to 20 business days are common. Temu does offer a Purchase Protection Program that covers refunds for items that do not arrive or that significantly differ from their listing description, and in practice most reported refund requests are honored without returning the item.",
      "Product quality is the second major concern. Because Temu sells directly from third-party suppliers at heavily discounted prices, quality control is inconsistent. Items sold at unusually low prices — particularly electronics, tools, and clothing — frequently receive reviews noting that the product looks different from photographs or is made from cheaper materials than expected. This is not fraud in the legal sense, but it is a real risk shoppers should account for.",
      "Data privacy is a more serious concern. Temu's app requests access to a wide range of device data. In 2023, Arkansas filed a lawsuit alleging that Temu's app functions as \"dangerous malware\" — the first U.S. state to take legal action against the platform. A 2024 report from Grizzly Research flagged 18 specific permissions the app requests, including location tracking and clipboard access. Temu denied the allegations. The app has been downloaded over 300 million times globally, making the data collection question significant at scale.",
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
      "In 2021, France's consumer protection agency DGCCRF ordered Wish removed from all major app stores and search engines after testing 140 products and finding that 95% failed EU safety standards. Tested toys contained up to 10 times the legal limit of phthalates. Electrical items lacked basic insulation. The ban lasted several months and cost Wish an estimated $50 million in lost European revenue. No other major e-commerce platform has faced a national ban of this severity.",
      "Counterfeit goods are a systemic problem on Wish. The platform has appeared on the United States Trade Representative's \"Notorious Markets\" list every year since 2018 — a list that names the worst online and physical markets for trademark infringement. Wish's own disclosures to the SEC acknowledged over $5.7 million in refunds related to product quality complaints in a single quarter. Buyer reports of receiving fake branded products remain common.",
      "Product photography on Wish is frequently misleading. A well-documented pattern exists where product listing images bear little resemblance to what is actually shipped. This is particularly prevalent in categories including clothing, electronics, and home goods. In some cases the discrepancy is a matter of quality; in others the product received is categorically different from what was shown.",
      "Shipping times on Wish are among the longest of any major retail platform. Delivery windows of 2 to 6 weeks are common, and orders shipped via economy carriers can take longer. Wish's return policy formally covers non-delivery and significant item mismatch, but multiple consumer reviews describe difficulty completing the refund process, particularly for low-value orders where the dispute process may not be worth the time invested.",
      "Wish does process payments securely and there is no documented pattern of payment fraud attributable to the platform itself. The financial risk of a Wish purchase is typically the purchase price of the item — the more probable outcome is receiving a product that does not meet expectations rather than receiving nothing at all.",
      "Wish may be appropriate for purchasing commodity items where brand and exact specification do not matter and where a long wait is acceptable. It is not suitable for purchasing electronics, safety-critical items, products for children, or anything where brand authenticity is a concern. The platform's track record over the past five years reflects a marketplace with meaningful structural quality problems that have not been fully resolved.",
    ],
  },
  {
    slug: "is-facebook-marketplace-a-scam",
    title: "Is Facebook Marketplace a Scam?",
    domain: "facebook.com",
    category: "Marketplace",
    publishedAt: "2025-12-05",
    updatedAt: "2026-02-20",
    trustScore: 62,
    verdict: "Use Caution",
    summary:
      "Facebook Marketplace is a legitimate platform operated by Meta, but it has become one of the most common environments for peer-to-peer scams in North America. The platform itself is not fraudulent, but its design creates significant opportunities for bad actors.",
    body: [
      "Facebook Marketplace launched in 2016 and is now used by over 1 billion people monthly worldwide. It is a feature within Facebook, not a separate company. Meta does not handle payments or shipping for most local transactions — it simply connects buyers and sellers. This means there is no built-in purchase protection for the majority of Marketplace transactions.",
      "The Canadian Anti-Fraud Centre and the FTC have both documented significant increases in Marketplace-related fraud. Common schemes include fake rental listings, non-delivery after payment, counterfeit goods sold as authentic, overpayment scams using fake checks, and phishing links sent through Messenger. In 2024, the BBB identified online purchase scams — many originating on social media marketplaces — as the riskiest scam type in North America.",
      "Rental scams are particularly damaging on Marketplace. Scammers copy legitimate rental listings, repost them at below-market prices, and collect deposits from multiple victims before disappearing. The RCMP and local police services across Canada have issued repeated warnings about this pattern. Victims typically lose $1,000 to $3,000 per incident.",
      "Payment method is the single most important safety factor on Marketplace. Scammers strongly prefer payment methods that cannot be reversed: e-transfer, wire transfer, gift cards, and cryptocurrency. Legitimate sellers are generally willing to accept cash at an in-person meeting. Any seller who insists on payment before you see the item, or who refuses to meet in person for a local transaction, is exhibiting a high-risk pattern.",
      "Facebook does offer a limited checkout feature with Purchase Protection for shipped items, but this only applies to transactions processed through Facebook's own payment system. The vast majority of local Marketplace transactions — which are the most common type — have no protection whatsoever. If you pay someone cash and they give you a broken item, Facebook will not intervene.",
      "Marketplace can be used safely by following consistent rules: meet in a public place for local transactions, pay cash or use Facebook's checkout for shipped items, never send deposits for rentals without verifying the listing independently, and be skeptical of prices that are significantly below market value. The platform is not a scam, but it requires more caution than buying from a retailer.",
    ],
  },
  {
    slug: "is-cashapp-a-scam",
    title: "Is Cash App a Scam?",
    domain: "cash.app",
    category: "Finance",
    publishedAt: "2025-11-18",
    updatedAt: "2026-02-12",
    trustScore: 70,
    verdict: "Low Risk",
    summary:
      "Cash App is a legitimate peer-to-peer payment service owned by Block, Inc. (formerly Square). The app itself is not a scam, but it has become one of the most commonly exploited platforms for payment fraud because transactions are instant and difficult to reverse.",
    body: [
      "Cash App was launched in 2013 by Square (now Block, Inc.), a publicly traded financial technology company founded by Jack Dorsey. The app is licensed as a money transmitter in every U.S. state where it operates and is a legitimate financial service used by over 50 million monthly active users. It is not a fraudulent platform.",
      "The core risk with Cash App is that it was designed for sending money to people you know and trust. Transactions are instant and, in most cases, irreversible. Cash App's own support documentation states that they cannot guarantee a refund if you send money to the wrong person or are deceived by a scammer. This makes it a preferred tool for fraudsters.",
      "The most common Cash App scams include fake giveaways (impersonating Cash App or celebrities promising to multiply your money), fake customer support accounts on social media, romance scams requesting Cash App payments, fake selling (requesting payment for items that are never shipped), and \"money flipping\" schemes that promise to turn small amounts into large returns.",
      "Cash App does not have a formal purchase protection program comparable to PayPal Goods and Services. If you send money to a scammer, your primary recourse is to request a refund through the app — which the recipient can decline — or to dispute the transaction with your linked bank or card. Success rates for disputes vary.",
      "In 2023, Block settled a $175 million class action lawsuit (Garner v. Block) covering an estimated 15 million affected users, alleging that the company failed to adequately address fraud on Cash App and made it too difficult for victims to recover stolen funds. The settlement included changes to Cash App's fraud prevention processes, but the fundamental design — instant, irreversible transfers — remains unchanged.",
      "Cash App is safe to use for sending money to people you personally know and trust. It should not be used to pay strangers for goods or services, to participate in giveaways or money-flipping schemes, or to send money to anyone who contacts you claiming to be Cash App support. Cash App will never ask for your PIN or sign-in code outside the app.",
    ],
  },
  {
    slug: "is-amazon-a-scam",
    title: "Is Amazon a Scam?",
    domain: "amazon.ca",
    category: "Shopping",
    publishedAt: "2025-10-30",
    updatedAt: "2026-02-18",
    trustScore: 85,
    verdict: "Low Risk",
    summary:
      "Amazon is one of the largest and most established e-commerce companies in the world. The platform itself is legitimate and offers strong buyer protection, but third-party sellers on Amazon Marketplace can and do engage in deceptive practices that shoppers should understand.",
    body: [
      "Amazon was founded in 1994 and is one of the most valuable publicly traded companies in the world. Amazon.ca has operated in Canada since 2002. The company processes billions of transactions annually and offers an A-to-Z Guarantee that covers most purchases made through the platform. Amazon is not a scam.",
      "The distinction that matters for consumers is between items sold by Amazon directly and items sold by third-party marketplace sellers. Amazon acts as both a retailer and a marketplace — approximately 60% of units sold on Amazon come from third-party sellers. While Amazon vets sellers and holds them to policies, enforcement is imperfect and some sellers engage in review manipulation, counterfeit goods sales, and bait-and-switch tactics.",
      "Counterfeit goods are a documented problem on Amazon, particularly in categories like electronics accessories, beauty products, and supplements. Amazon's commingled inventory system — where products from multiple sellers are stored together in Amazon warehouses — has been cited in lawsuits as a contributing factor. Amazon has invested heavily in anti-counterfeiting programs (Brand Registry, Project Zero, Transparency), but the problem persists at scale.",
      "Review manipulation remains common despite Amazon's efforts. The FTC has taken enforcement actions against companies that buy fake reviews, and in 2023 Amazon sued over 10,000 Facebook group administrators who ran paid review schemes. Shoppers should be skeptical of products with overwhelmingly positive reviews and no critical feedback, particularly from newer or unknown brands.",
      "Amazon's customer service and return policies are among the strongest in e-commerce. The A-to-Z Guarantee covers situations where items are not received, are materially different from the listing, or where a seller fails to process an agreed-upon return. Most return requests are processed automatically. This is a significant advantage over platforms like Wish, Temu, or Facebook Marketplace.",
      "Amazon is a safe platform for most purchases. Shoppers can reduce risk by checking whether an item is sold by Amazon directly (\"Ships from and sold by Amazon.ca\"), reading recent reviews rather than overall ratings, avoiding deals that seem too good to be true from unknown brands, and using Amazon's built-in payment system rather than any off-platform payment method a seller might suggest.",
    ],
  },
  {
    slug: "is-paypal-a-scam",
    title: "Is PayPal a Scam?",
    domain: "paypal.com",
    category: "Finance",
    publishedAt: "2025-09-28",
    updatedAt: "2026-01-30",
    trustScore: 82,
    verdict: "Low Risk",
    summary:
      "PayPal is one of the oldest and most widely used online payment platforms in the world. It is a legitimate, publicly traded financial institution — but it is also one of the most impersonated brands in phishing campaigns, and its dispute resolution system has documented limitations.",
    body: [
      "PayPal was founded in 1998, went public in 2002, and currently processes over $1.5 trillion in payment volume annually. It is licensed as a financial institution in every jurisdiction where it operates, including Canada. PayPal is not a scam — it is a mainstream payment processor used by hundreds of millions of people and businesses worldwide.",
      "PayPal offers Buyer Protection and Seller Protection programs that cover unauthorized transactions and items that are not received or significantly different from their description. These protections apply to most transactions made through PayPal's platform when goods or services are selected as the payment type. Sending money through the \"Friends and Family\" option does not carry purchase protection — a distinction that scammers actively exploit.",
      "PayPal is the single most impersonated brand in phishing emails worldwide — accounting for roughly 30% of all financial phishing attempts in 2024 according to Check Point and Avanan. Phishing emails claiming to be from PayPal typically warn of account suspension, unauthorized transactions, or security verification requirements. These emails direct victims to fake login pages that capture credentials. PayPal will never ask you to confirm sensitive information via email.",
      "The most common PayPal-related scams include phishing emails with fake login pages, overpayment scams where a buyer sends more than the agreed price and asks for the difference back (using a stolen account or fraudulent funds), fake PayPal payment confirmation emails sent directly by scammers (not through PayPal's system), and invoice scams where fraudulent invoices are sent through PayPal's own invoicing system.",
      "PayPal's dispute resolution process has received mixed reviews from both buyers and sellers. Buyers generally report favorable outcomes when goods are not received. Sellers have documented cases where PayPal sided with buyers in disputes involving returned items that were empty boxes or different products — a vulnerability in the system that has been exploited by bad actors.",
      "PayPal is safe to use for most online transactions. Always log in to PayPal directly through paypal.com rather than clicking email links, always select Goods and Services (not Friends and Family) when paying someone you do not personally know, and verify that payment confirmation emails actually come from PayPal by checking your account directly.",
    ],
  },
  {
    slug: "is-zelle-a-scam",
    title: "Is Zelle a Scam?",
    domain: "zellepay.com",
    category: "Finance",
    publishedAt: "2025-11-02",
    updatedAt: "2026-02-08",
    trustScore: 72,
    verdict: "Low Risk",
    summary:
      "Zelle is a legitimate bank-to-bank payment network owned by Early Warning Services, a consortium of major U.S. banks. Like Cash App and Venmo, Zelle's instant and irreversible transfers make it a frequent vehicle for payment scams.",
    body: [
      "Zelle is operated by Early Warning Services, LLC, which is owned by Bank of America, Capital One, JPMorgan Chase, PNC, Truist, U.S. Bank, and Wells Fargo. It is integrated directly into the mobile banking apps of over 1,700 banks and credit unions. Zelle processed $806 billion in payments in 2023. It is a legitimate financial infrastructure — not a scam.",
      "Zelle's core risk is identical to Cash App's: payments are instant and generally irreversible. Zelle was designed for sending money to people you know. Unlike credit card transactions, which can be disputed under Regulation E and the Fair Credit Billing Act, Zelle transfers that you authorized — even if you were deceived — have historically been difficult to reverse.",
      "In 2023 and 2024, U.S. senators and the Consumer Financial Protection Bureau (CFPB) publicly criticized Zelle's member banks for failing to reimburse fraud victims. A 2022 Senate report found that four major banks reported over $166 million in Zelle-related fraud and scam complaints in 2021 alone, and that banks reimbursed only 47% of disputed transactions. Under regulatory pressure, several banks have since expanded their reimbursement policies for impersonation scams.",
      "The most common Zelle scams include impersonation of bank fraud departments (calling victims and instructing them to \"move money to a safe account\" via Zelle), Marketplace purchase scams where payment is sent for goods that never arrive, and phishing texts that appear to come from the victim's bank asking them to verify a Zelle transaction.",
      "In Canada, Zelle is not widely available — Interac e-Transfer is the equivalent system. However, Canadians with U.S. bank accounts or who transact with U.S. contacts may encounter Zelle. The same caution applies: never send Zelle payments to people you have not met in person or verified through independent means.",
      "Zelle is safe for its intended purpose: sending money to people you personally know. It should never be used to pay for goods from strangers, to \"verify\" your bank account at anyone's request, or to move money because someone claiming to be your bank told you to. Your bank will never ask you to send yourself money via Zelle as a security measure.",
    ],
  },
  {
    slug: "is-coinbase-a-scam",
    title: "Is Coinbase a Scam?",
    domain: "coinbase.com",
    category: "Crypto",
    publishedAt: "2025-10-15",
    updatedAt: "2026-02-05",
    trustScore: 78,
    verdict: "Low Risk",
    summary:
      "Coinbase is a legitimate, publicly traded cryptocurrency exchange (NASDAQ: COIN). It is the largest regulated crypto exchange in the United States. The platform itself is not a scam, but cryptocurrency scams frequently impersonate Coinbase, and the irreversible nature of crypto transactions creates elevated risk.",
    body: [
      "Coinbase was founded in 2012 and went public on the NASDAQ in April 2021. It is registered as a Money Services Business with FinCEN, holds money transmitter licenses in most U.S. states, and is registered with FINTRAC in Canada. Coinbase holds customer assets and is subject to financial regulations. It is a real, audited company — not a scam.",
      "Coinbase has had security problems. In 2021, roughly 6,000 accounts were drained — totaling an estimated $21.5 million in losses — after attackers exploited a flaw in SMS-based two-factor authentication. Coinbase reimbursed every affected customer. The company now pushes hardware security keys and authenticator apps instead of SMS codes.",
      "The most significant risk associated with Coinbase is impersonation scams. Scammers contact victims by phone, email, or text claiming to be Coinbase support and warning of unauthorized account activity. They direct victims to fake websites or remote access tools to \"secure\" their accounts, then drain the cryptocurrency. The FTC and FBI IC3 have documented substantial losses from this pattern.",
      "Coinbase's support system has been a persistent source of customer complaints. During periods of high market volatility, users have reported locked accounts, delayed responses, and difficulty reaching human support. While Coinbase has expanded its support team and introduced phone support for account takeover situations, the experience remains inconsistent compared to traditional financial institutions.",
      "Cryptocurrency transactions are irreversible by design. If you send Bitcoin, Ethereum, or any other cryptocurrency to a scammer's wallet, neither Coinbase nor any other entity can reverse the transaction. This is fundamentally different from credit card or bank transactions. Coinbase cannot recover crypto sent to external wallets.",
      "Coinbase is a legitimate platform for buying, selling, and holding cryptocurrency. Users should enable the strongest available two-factor authentication (not SMS), never share credentials with anyone claiming to be support, verify all communications by logging into coinbase.com directly, and understand that crypto transactions cannot be reversed regardless of the circumstances.",
    ],
  },
  {
    slug: "is-etransfer-a-scam",
    title: "Is Interac e-Transfer a Scam?",
    domain: "interac.ca",
    category: "Finance",
    publishedAt: "2025-11-25",
    updatedAt: "2026-02-22",
    trustScore: 88,
    verdict: "Low Risk",
    summary:
      "Interac e-Transfer is Canada's dominant person-to-person payment system, operated by Interac Corp and integrated into every major Canadian bank. The system itself is secure and legitimate, but it is the most common payment method exploited in Canadian scams due to the speed and difficulty of reversing completed transfers.",
    body: [
      "Interac e-Transfer moved over $400 billion in 2023 across more than 1 billion transactions. Interac Corp. has run Canada's bank network since 1984. Every major bank in Canada supports e-Transfer. It is real, regulated financial infrastructure — not a scam.",
      "Autodeposit made e-Transfer much safer. Before Autodeposit, scammers could intercept transfers by hacking email accounts and guessing security questions. With Autodeposit turned on, money goes straight into the recipient's account — no question needed. Over 60% of Canadian e-Transfer users now have Autodeposit enabled. Interac says this single feature stopped most interception fraud.",
      "Even so, e-Transfer is the payment method that shows up most in Canadian fraud cases. The CAFC reported $638 million in total fraud losses in 2024, and e-Transfer was involved in a large share of those cases. Why? Because it is fast, every Canadian has it, and once the money lands, it is very hard to get back. Scammers love it for the same reasons consumers do.",
      "Your bank can pull back an e-Transfer only if the other person has not deposited it yet. Once it lands in their account, it is gone. Some banks have added fraud alerts that flag unusual transfers — TD, RBC, and Scotiabank all have warning prompts — but these vary by bank and are not foolproof.",
      "The top e-Transfer scams in Canada right now: CRA calls threatening arrest unless you pay by e-Transfer (the CRA never does this). Rental scams collecting $1,000-$3,000 deposits for fake listings on Kijiji or Facebook. Job scams that send you an e-Transfer and ask you to forward part of it — making you an unwitting money mule. Romance scams where someone you met online asks for money \"just this once.\"",
      "Use e-Transfer freely with people you know in real life. Never send one to a stranger, never send one because someone on the phone told you to, and turn on Autodeposit today if you have not already. If you think you sent money to a scammer, call your bank within minutes — not hours. Speed is everything.",
    ],
  },
  {
    slug: "how-to-spot-a-crypto-scam",
    title: "How to Spot a Crypto Scam",
    domain: "trustchekr.com",
    category: "Crypto Safety",
    publishedAt: "2026-02-15",
    updatedAt: "2026-02-28",
    trustScore: 100,
    verdict: "Educational",
    summary:
      "Cryptocurrency scams cost consumers over $5.6 billion in 2023 according to the FBI. Most scams follow a small number of patterns that are easy to recognize once you know what to look for. This guide covers the five most common types and how to protect yourself.",
    body: [
      "Crypto scams are growing fast. The FBI's IC3 reported $5.6 billion in cryptocurrency fraud losses in 2023 — a 45% increase from 2022. In Canada, the CAFC flagged cryptocurrency as the #1 payment method used in investment fraud. You do not need to understand blockchain to protect yourself. You just need to recognize the patterns.",
      "The most common crypto scam is fake investment platforms. A stranger — often met on social media or a dating app — introduces you to a \"trading platform\" that shows your money growing. The website looks professional. Your balance goes up every day. But when you try to withdraw, you are told to pay a \"tax\" or \"fee\" first. The platform is fake. The balance was never real. The FBI calls this \"pig butchering\" because scammers fatten victims with fake profits before taking everything. Losses average $170,000 per victim.",
      "Giveaway scams are the second most common. Someone impersonating Elon Musk, a crypto exchange, or a celebrity posts on social media: \"Send me 1 BTC and I will send back 2.\" No one will ever double your money for free. These scams pulled in over $80 million in 2023 according to the FTC. They work because crypto transactions cannot be reversed — once you send it, it is gone.",
      "Fake wallets and exchanges steal your money directly. A website that looks exactly like Coinbase, Binance, or MetaMask asks you to log in. You enter your credentials or seed phrase. The scammer now controls your wallet. Always type the URL directly — never click a link from an email, text, or social media post. Real exchanges will never ask for your seed phrase. Ever. Your seed phrase is the master key to your crypto. Anyone who has it can take everything.",
      "Rug pulls happen in newer, smaller tokens. A team launches a new cryptocurrency with hype and marketing. Early buyers drive the price up. Then the creators sell all their tokens at once, crashing the price to zero and walking away with everyone's money. Over $2.8 billion was lost to rug pulls in 2021 alone according to Chainalysis. If you cannot find the team's real names, the project has no working product, and the only selling point is \"get in early\" — walk away.",
      "Here is how to stay safe. Never send crypto to someone you met online who promises returns. Never share your seed phrase or private keys with anyone — not support, not an exchange, not a friend. Use two-factor authentication (an app like Google Authenticator, not SMS). Only use exchanges you can verify are regulated — in Canada, check the CSA's registered list at securities-administrators.ca. And if someone says you need to \"act fast\" or an \"opportunity\" will disappear, that pressure is the scam.",
      "Crypto itself is not a scam. Bitcoin, Ethereum, and other major cryptocurrencies are real technology used by millions of people. But the lack of regulation and the irreversibility of transactions make crypto a magnet for fraud. Think of it like cash — it is real money, but if you hand cash to a stranger on the street, nobody can get it back for you. The same rules apply: verify before you trust, and never rush a financial decision.",
    ],
  },
  {
    slug: "what-is-a-seed-phrase",
    title: "What Is a Seed Phrase and Why Scammers Want Yours",
    domain: "trustchekr.com",
    category: "Crypto Safety",
    publishedAt: "2026-02-20",
    updatedAt: "2026-02-28",
    trustScore: 100,
    verdict: "Educational",
    summary:
      "Your seed phrase is a 12 or 24 word password that controls your entire crypto wallet. If someone gets it, they can steal everything you own — instantly and irreversibly. Here is what it is, how scammers try to get it, and how to protect it.",
    body: [
      "When you create a crypto wallet — whether it is MetaMask, Trust Wallet, Ledger, or any other — you are given a list of 12 or 24 random English words. This is your seed phrase (also called a recovery phrase or mnemonic). It is the master key to your wallet. Anyone who has these words can access your crypto from any device, anywhere in the world, without needing your password or your phone.",
      "Think of your seed phrase like the deed to your house, except there are no police and no courts. If someone copies it, they own everything inside your wallet. There is no customer support to call. There is no way to reverse the transaction. Blockchain transactions are final by design. In 2023, the FBI received over 69,000 complaints related to cryptocurrency fraud. A large share of those involved stolen seed phrases.",
      "Scammers use three main tactics to get seed phrases. First: fake support. Someone posts on Twitter or Discord pretending to be MetaMask support and asks you to \"verify your wallet\" by entering your seed phrase on a website. No legitimate wallet or exchange will ever ask for your seed phrase. Second: phishing sites. You click a Google ad or email link that looks like your wallet's real website but the URL is slightly different (metamask.io vs metamaask.io). You enter your phrase and it goes straight to the scammer. Third: malware. You download a fake wallet app or browser extension that records your phrase when you type it.",
      "How to protect your seed phrase: Write it on paper — not in a notes app, not in an email, not in a screenshot. Store the paper somewhere safe, like a fireproof safe or safety deposit box. Never type it into any website. The only time you should ever enter your seed phrase is when recovering your wallet on a new device using the official app. Some people use metal seed phrase backups (stamped steel plates) that survive fire and water.",
      "If anyone — a customer support agent, a friend, a website, an app — asks for your seed phrase, it is a scam. No exceptions. Coinbase support will never ask for it. MetaMask support will never ask for it. Your bank will never ask for it. The words exist for one purpose: for you to recover your own wallet. They are not a login. They are not a verification code. They are the keys to your money.",
    ],
  },
  {
    slug: "crypto-scams-in-canada",
    title: "Crypto Scams in Canada — What the CAFC Is Seeing",
    domain: "trustchekr.com",
    category: "Crypto Safety",
    publishedAt: "2026-02-10",
    updatedAt: "2026-02-28",
    trustScore: 100,
    verdict: "Educational",
    summary:
      "Canadian crypto fraud losses are rising fast. The Canadian Anti-Fraud Centre tracks cryptocurrency as the leading payment method in investment scams. Here is what is happening, which scams are hitting Canadians hardest, and where to report them.",
    body: [
      "Cryptocurrency has become the #1 payment method in Canadian investment fraud. The CAFC's 2024 annual report showed $638 million in total fraud losses across Canada — and investment fraud, increasingly paid in crypto, was the single largest category. The Ontario Securities Commission (OSC) has issued over 20 investor alerts specifically about crypto-related schemes since 2022.",
      "The biggest crypto scam hitting Canadians is the romance-investment hybrid. It starts on a dating app or social media. The scammer builds a relationship over weeks or months. Then they introduce a \"trading opportunity\" — usually a fake app or website showing fake returns. Victims are coached to buy crypto through a legitimate exchange like Newton, Shakepay, or Coinbase and then send it to the scammer's wallet. Average losses are $100,000 to $500,000. The RCMP and local police forces across Ontario and BC have issued repeated public warnings.",
      "ATM crypto scams are growing in Canada. There are over 3,000 Bitcoin ATMs across the country — more per capita than almost any nation. Scammers call victims, often pretending to be the CRA, police, or a utility company, and instruct them to deposit cash into a Bitcoin ATM with a QR code the scammer provides. The money goes directly to the scammer's wallet. Once sent, it cannot be recovered. These machines are legitimate, but the transactions are being used for fraud.",
      "Fake Canadian exchanges and tokens are another pattern. Scammers create professional-looking websites claiming to be registered with FINTRAC or the OSC. They are not. Before sending money to any crypto platform, check two things: the Canadian Securities Administrators registered firm list (securities-administrators.ca) and FINTRAC's MSB registry. If the platform is not on either list, do not use it.",
      "If you have been scammed, report it to the CAFC at 1-888-495-8501 or antifraudcentre.ca. Also report to your local police, the OSC (if investment-related), and the platform where you bought the crypto (they may be able to flag the receiving wallet). Acting quickly matters — in some cases, exchanges can freeze funds if the scammer has not moved them yet. You should also file a report with the RCMP's National Cybercrime Coordination Centre (NC3).",
      "Crypto is legal and widely used in Canada. The problem is not the technology — it is that irreversible payments attract criminals. The same way wire fraud existed before email, crypto fraud is the modern version of an old crime. Protecting yourself comes down to three rules: never send crypto to anyone you have not met in person, verify any platform through official registries before depositing money, and remember that any \"guaranteed return\" is a lie.",
    ],
  },
];

export function getArticle(slug: string): Article | null {
  return ARTICLES.find((a) => a.slug === slug) ?? null;
}

export function getAllArticles(): Article[] {
  return ARTICLES;
}
