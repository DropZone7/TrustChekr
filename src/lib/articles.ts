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
    updatedAt: "2026-03-01",
    trustScore: 71,
    verdict: "Low Risk",
    summary:
      "Temu is a legitimate e-commerce platform owned by PDD Holdings, but the FTC hit it with a $2 million penalty in 2025, EU tests found 65% of its products failed safety standards, and a Canada-wide class action targets its data collection. Here is what you need to know before buying.",
    body: [
      "Over 300 million people have downloaded an app that a U.S. state attorney general called \"dangerous malware.\" Temu is not a scam — it is a real retailer backed by PDD Holdings (NASDAQ: PDD), a $150 billion company — but its risks go well beyond slow shipping.",
      "Arkansas filed the first state lawsuit against Temu in June 2023, alleging the app operates as spyware. A report from Grizzly Research flagged 18 specific device permissions the app requests, including clipboard access and location tracking. In 2025, the FTC slapped Temu with a $2 million penalty for violating the INFORM Act — failing to provide adequate reporting on suspicious sellers. A Canada-wide class action has also been filed over Temu's excessive data collection and privacy violations. The CAFC has warned Canadians about suspiciously cheap platforms that harvest personal data at scale.",
      "Product quality is the other gamble. Items ship directly from Chinese manufacturers at prices that seem impossible — $3 headphones, $7 jackets — because they often are. EU consumer testing found 65% of Temu products failed safety standards, and 96% of kids' toys tested were non-compliant. Temu operates at a significant loss per order, spending an estimated $30 in customer acquisition costs for every new buyer according to analysts at Bernstein. The deep discounts are subsidized, not fraudulent, but you get what you pay for. CBC Marketplace also exposed Temu's delivery operations in Canada — drivers working 12-hour shifts delivering 120 to 150 packages daily, with one owed $1,800 in unpaid wages.",
      "On the payment side, Temu uses standard SSL encryption and accepts Visa, Mastercard, PayPal, and Apple Pay. There is no credible evidence of payment data theft. The Purchase Protection Program covers refunds for items that never arrive or differ significantly from the listing — and in practice, most refund requests are honored without requiring a return.",
      "Shipping takes 7 to 20 business days from China. That alone kills the experience for many Canadian shoppers used to Amazon Prime's two-day delivery. During peak seasons, some buyers report waits of 30 days or more.",
      "The bottom line: shop through the mobile browser — not the app — and pay with a virtual card or PayPal. Expect dollar-store quality at dollar-store prices. If you treat Temu like a flea market rather than a department store, the experience is manageable. But installing the app on your phone gives a company with documented data collection concerns full access to your device, and that trade-off is harder to justify.",
    ],
  },
  {
    slug: "is-shein-a-scam",
    title: "Is Shein a Scam?",
    domain: "shein.com",
    category: "Shopping",
    publishedAt: "2025-10-22",
    updatedAt: "2026-03-01",
    trustScore: 68,
    verdict: "Use Caution",
    summary:
      "Shein is one of the largest fast-fashion retailers in the world and does fulfill orders, but Health Canada recalled a Shein kids' jacket with 20 times the legal lead limit, EU tests found 73% of products failed safety standards, and the company faces ongoing counterfeiting lawsuits from Coach and Oakley.",
    body: [
      "Health Canada recalled a Shein children's jacket in 2021 after testing revealed lead levels 20 times higher than the legal limit. CBC Marketplace later confirmed similar findings in 2023. EU consumer tests found 73% of Shein products failed safety standards — and all 27 kids' toys tested were non-compliant. Shein is not a scam — it is a $60 billion fast-fashion empire that ships real products — but \"real\" does not mean \"safe.\"",
      "The company adds between 2,000 and 10,000 new items per day. That speed has a cost. Channel 4 News and the CBC have both documented supply chain conditions that contradict Shein's public commitments to ethical manufacturing. Workers in some facilities were found earning as little as 3 cents per garment. Shein has disputed specific claims but has not opened its full supply chain to independent audits.",
      "Intellectual property theft is a pattern, not an accident. Shein has faced dozens of lawsuits from independent designers and major brands — including a $100 million suit from Levi Strauss in 2023 and fresh 2025 lawsuits from Coach and Oakley over trademark-infringing counterfeits. France hit Shein with a €150 million fine for cookie data misuse. Several cases have been settled, but new ones keep coming. For shoppers, this does not affect order safety, but it reveals how the company operates.",
      "On the consumer experience side, orders do arrive and refunds are processed through the in-app dispute system. Complaints about wrong sizes, flimsy materials, and items that look nothing like the photos are common on the BBB and across Reddit. Customer service is widely described as slow and unhelpful.",
      "Shein's app requests extensive device permissions — similar to Temu's data collection concerns. The CAFC recommends using the mobile browser instead of installing shopping apps that request unnecessary access to contacts, location, and clipboard data.",
      "If you shop Shein, avoid anything that touches children's skin, pay with a virtual card, and skip the app entirely. The platform delivers what you order — the question is whether what you order is worth the hidden costs.",
    ],
  },
  {
    slug: "is-wish-a-scam",
    title: "Is Wish a Scam?",
    domain: "wish.com",
    category: "Shopping",
    publishedAt: "2025-09-14",
    updatedAt: "2026-03-01",
    trustScore: 52,
    verdict: "Use Caution",
    summary:
      "Wish is a real e-commerce platform operated by ContextLogic Inc., but it has experienced a prolonged decline in user trust following widespread reports of counterfeit goods, misleading product images, and a temporary ban in France over safety concerns.",
    body: [
      "France banned Wish from every app store and search engine in the country in 2021. The reason: 95% of products tested by France's consumer protection agency DGCCRF failed EU safety standards. Tested toys contained up to 10 times the legal limit of phthalates. No other major e-commerce platform has ever been banned by a national government.",
      "Wish is not technically a scam. ContextLogic Inc. (NASDAQ: WISH) operates the marketplace, connecting buyers with third-party sellers — mostly based in China. But the platform's track record makes it the riskiest mainstream shopping app still operating. The French ban alone cost an estimated $50 million in lost revenue.",
      "The U.S. Trade Representative has placed Wish on its \"Notorious Markets\" list every year since 2018 — a designation reserved for the worst global marketplaces for counterfeiting. In SEC filings, Wish disclosed over $5.7 million in refunds for product quality complaints in a single quarter. Buyer reports of receiving fake branded products remain a constant theme across BBB complaints and Reddit forums.",
      "Product photos on Wish are famously misleading. A cottage industry of YouTube videos and blog posts exists solely to document the gap between listing images and delivered items. In clothing, electronics, and home goods, the item received is frequently a different product entirely — not just a lower-quality version.",
      "Shipping takes 2 to 6 weeks, sometimes longer. The return process formally covers non-delivery and significant mismatch, but the FTC has noted that dispute resolution on platforms like Wish often favors the seller for low-value orders. Many buyers find the refund process not worth the effort for a $4 item.",
      "Wish processes payments securely — there is no documented pattern of stolen credit card data. The real financial risk is simpler: you will probably receive something that does not match what you ordered. For commodity items where brand and quality do not matter, Wish can work. For electronics, children's products, or anything safety-critical, shop elsewhere.",
    ],
  },
  {
    slug: "is-facebook-marketplace-a-scam",
    title: "Is Facebook Marketplace a Scam?",
    domain: "facebook.com",
    category: "Marketplace",
    publishedAt: "2025-12-05",
    updatedAt: "2026-03-01",
    trustScore: 62,
    verdict: "Use Caution",
    summary:
      "Facebook Marketplace is a legitimate platform operated by Meta, but the FTC reported $789 million in social media imposter losses in 2024, and Interac e-Transfer scams on Marketplace — especially rental fraud in Toronto and Vancouver — are hitting Canadians hard.",
    body: [
      "A billion people use Facebook Marketplace every month — and scammers know it. The platform is not a scam itself, but Meta does not handle payments or shipping for most local transactions, which means there is zero buyer protection for the majority of deals made there.",
      "The FTC reported $789 million in imposter scam losses on social media in 2024 — and Marketplace is ground zero. The BBB identified online purchase scams as the riskiest scam type in North America that same year. The CAFC has documented a surge in Marketplace-related fraud across Canada, with rental scams, non-delivery schemes, and counterfeit goods topping the list.",
      "Rental scams are the most financially devastating pattern — and Toronto and Vancouver are the hardest-hit cities. Scammers copy real listings from Realtor.ca or Kijiji, repost them on Marketplace at $200 to $400 below market rate, then collect deposits from multiple victims before vanishing. One common twist: the scammer sends a fake Interac \"confirmation\" email from a Gmail address mimicking Interac to make the victim think the deposit went through safely. Victims typically lose $1,000 to $3,000 each.",
      "Payment method is the single most important safety factor. Scammers push Interac e-Transfer, wire transfers, gift cards, and crypto — all irreversible. Legitimate local sellers will meet in person and accept cash. If a seller insists on payment before you see the item, or refuses to meet face-to-face, walk away.",
      "Facebook does offer Purchase Protection for items bought through its checkout system, but this only covers shipped transactions processed through Meta's payment platform. Local cash deals — the most common Marketplace transaction — have no protection at all. If you hand someone $500 for a broken PS5, Meta will not help.",
      "Use Marketplace safely by meeting in a well-lit public place, paying cash, and verifying rental listings independently before sending any deposit. Never click links sent through Messenger that redirect you to external payment pages. The platform is a powerful tool for finding local deals — just remember that Meta built a marketplace without building the safeguards to match.",
    ],
  },
  {
    slug: "is-cashapp-a-scam",
    title: "Is Cash App a Scam?",
    domain: "cash.app",
    category: "Finance",
    publishedAt: "2025-11-18",
    updatedAt: "2026-03-01",
    trustScore: 70,
    verdict: "Low Risk",
    summary:
      "Cash App is a legitimate peer-to-peer payment service owned by Block, Inc. The CFPB ordered Block to pay $175 million in 2025 — $120 million in refunds plus a $55 million fine — for failing to protect users from fraud. The app is not a scam, but its design makes it one of the most exploited payment tools in North America.",
    body: [
      "The CFPB ordered Block, Inc. to pay $175 million in 2025 — $120 million in consumer refunds and a $55 million penalty — for failing to investigate fraud complaints and creating barriers to recovering stolen funds. State regulators piled on with an $80 million BSA/AML fine for high-risk account failures. The app is not a scam. But its design makes it one of the most exploited payment tools in North America.",
      "Cash App was launched in 2013 by Square (now Block, Inc.) and has over 50 million monthly active users. It is licensed as a money transmitter in every U.S. state where it operates. The core problem is simple: transactions are instant and, in most cases, irreversible. Cash App's own support pages state they cannot guarantee a refund if you send money to the wrong person or get deceived.",
      "The Garner v. Block settlement covered an estimated 15 million affected users. The lawsuit alleged Block failed to adequately address fraud and created barriers to recovering stolen funds. The CAFC has similarly warned Canadians about peer-to-peer payment scams, noting that apps like Cash App and Venmo are designed for people who know each other — not for buying from strangers.",
      "The most common scams: fake giveaways promising to double your money (the FTC says these pulled in over $80 million across platforms in 2023), impersonation of Cash App support on Twitter and Instagram, romance scams requesting Cash App payments, and \"money flipping\" schemes. A Raleigh woman Googled \"Cash App support,\" called a fake number from the search results, and lost $4,000 after the scammer drained her account. All of these scams rely on the same vulnerability — once you hit send, the money is gone.",
      "Cash App has no purchase protection comparable to PayPal's Goods and Services feature. If you send money to a scammer, you can request a refund through the app — which the recipient can simply decline — or dispute through your linked bank. Success rates vary widely.",
      "Use Cash App to split dinner with friends or pay your barber. Never use it to pay strangers for goods, participate in giveaways, or send money to anyone who contacts you claiming to be Cash App support. The real Cash App will never ask for your PIN or sign-in code outside the app itself.",
    ],
  },
  {
    slug: "is-amazon-a-scam",
    title: "Is Amazon a Scam?",
    domain: "amazon.ca",
    category: "Shopping",
    publishedAt: "2025-10-30",
    updatedAt: "2026-03-01",
    trustScore: 85,
    verdict: "Low Risk",
    summary:
      "Amazon is one of the largest and most established e-commerce companies in the world. The platform itself is legitimate and offers strong buyer protection, but third-party sellers on Amazon Marketplace can and do engage in deceptive practices that shoppers should understand.",
    body: [
      "Amazon sued over 10,000 Facebook group administrators in 2023 for running paid fake review schemes on its platform. Amazon is not a scam — it is the most dominant e-commerce company on the planet — but roughly 60% of units sold come from third-party marketplace sellers, and that is where the problems live.",
      "Amazon.ca has operated in Canada since 2002. The company's A-to-Z Guarantee covers most purchases: if an item does not arrive, differs materially from its listing, or if a seller refuses a legitimate return, Amazon will typically refund you. That policy is genuinely strong and is a major advantage over platforms like Temu, Wish, or Facebook Marketplace.",
      "Counterfeit goods are a documented and persistent problem. Amazon's commingled inventory system — where products from multiple sellers are stored together in the same warehouse bin — has been cited in lawsuits by brands like Apple, Nike, and Birkenstock as a contributing factor. If a counterfeiter sends fakes to an Amazon warehouse, those fakes can ship under a legitimate seller's listing. Amazon has invested over $1.2 billion in anti-counterfeiting programs including Brand Registry, Project Zero, and Transparency, but the FTC continues to flag the issue.",
      "Review manipulation is the other major concern. The FTC took enforcement actions against multiple companies buying fake reviews in 2023 and 2024. Products with thousands of five-star reviews and zero critical feedback — especially from unknown brands — should trigger skepticism. Third-party tools like Fakespot and ReviewMeta can help, but they are not foolproof.",
      "For Canadian shoppers, the safest move is to check whether an item is \"Ships from and sold by Amazon.ca\" — which means Amazon controls inventory and fulfillment directly. Read recent reviews, not just the overall rating. Avoid deals from unknown brands that seem impossibly cheap. And never pay a seller outside Amazon's checkout system, no matter what they claim.",
      "Amazon is one of the safest places to shop online, full stop. The risks are real but manageable, and the buyer protection is among the best in e-commerce. Just remember: Amazon the retailer and Amazon the marketplace are two different experiences.",
    ],
  },
  {
    slug: "is-paypal-a-scam",
    title: "Is PayPal a Scam?",
    domain: "paypal.com",
    category: "Finance",
    publishedAt: "2025-09-28",
    updatedAt: "2026-03-01",
    trustScore: 82,
    verdict: "Low Risk",
    summary:
      "PayPal is one of the oldest and most widely used online payment platforms in the world. The CFPB sued PayPal in 2023 for illegally signing users up for PayPal Credit, and payment app fraud losses hit $171 million in the first half of 2024 alone. PayPal is not a scam — but scammers impersonate it aggressively.",
    body: [
      "PayPal processes over $1.5 trillion in payments annually and is the most impersonated financial brand in phishing emails worldwide. In 2023, the CFPB sued PayPal for illegally enrolling users in PayPal Credit without consent. Online payment app fraud losses hit $171 million in the first half of 2024 alone (FTC). It is emphatically not a scam — but scammers impersonate it so aggressively that the FTC and the CAFC both issue warnings about fake PayPal emails every year.",
      "Check Point and Avanan reported in 2024 that PayPal accounted for roughly 30% of all financial phishing attempts globally. The emails look convincing — warning of suspended accounts, unauthorized charges, or security verifications — and direct victims to fake login pages that capture credentials. PayPal will never ask you to confirm sensitive information through email. Ever.",
      "PayPal's Buyer Protection covers most transactions made using the \"Goods and Services\" payment type: items not received, items significantly different from the listing, and unauthorized transactions. This protection is genuinely useful. The critical distinction scammers exploit is the \"Friends and Family\" option, which carries zero purchase protection. If a seller asks you to pay via Friends and Family to \"save on fees,\" that is a red flag — they are stripping your ability to dispute.",
      "Common PayPal scams beyond phishing include overpayment schemes — a buyer sends more than the agreed price and asks for the difference back, using stolen funds — and fake payment confirmation emails sent directly by scammers rather than through PayPal's actual system. A Florida couple lost $83,000 after responding to a text impersonating Norton — scammers used fake PayPal deposits and cash courier handoffs to drain them over weeks. The BBB documented a 35% increase in invoice scams sent through PayPal's own invoicing tool in 2023, making them harder to distinguish from real requests.",
      "Sellers have legitimate complaints too. PayPal's dispute resolution has historically favored buyers, and sellers have documented cases where returned items were empty boxes or different products entirely. PayPal's Seller Protection covers some scenarios but not all, and the $20,000 annual cap leaves larger sellers exposed.",
      "Log in to PayPal directly at paypal.com — never through an email link. Always select Goods and Services when paying someone you do not know. Verify payment confirmations by checking your actual PayPal account, not by trusting the email. These three habits stop the vast majority of PayPal-related fraud.",
    ],
  },
  {
    slug: "is-zelle-a-scam",
    title: "Is Zelle a Scam?",
    domain: "zellepay.com",
    category: "Finance",
    publishedAt: "2025-11-02",
    updatedAt: "2026-03-01",
    trustScore: 72,
    verdict: "Low Risk",
    summary:
      "Zelle moved $806 billion in 2023 — and $400 million of that was lost to scams and fraud. The New York AG filed a 2025 lawsuit claiming $1 billion in total consumer losses. Zelle is not available in Canada, where Interac e-Transfer fills the same role, but Canadians with U.S. bank accounts should know the risks.",
    body: [
      "Four major U.S. banks reported over $166 million in Zelle fraud complaints in 2021 alone — and reimbursed victims only 47% of the time. That statistic, from a 2022 U.S. Senate investigation, captures the core problem: Zelle is legitimate financial infrastructure, but when something goes wrong, getting your money back is a coin flip.",
      "Zelle is operated by Early Warning Services, LLC — owned by Bank of America, Capital One, JPMorgan Chase, PNC, Truist, U.S. Bank, and Wells Fargo. It is embedded in over 1,700 banking apps and moved $806 billion in 2023, with $400 million lost to scams and fraud on those transactions. The New York Attorney General filed a lawsuit in 2025 claiming Zelle's security failures have caused over $1 billion in consumer losses. This is not a startup or a fintech experiment — it is the banking industry's answer to Venmo, and it is under serious fire.",
      "The fundamental issue is that Zelle payments are instant and generally irreversible. Unlike credit card charges — which can be disputed under Regulation E and the Fair Credit Billing Act — a Zelle transfer you authorized, even under false pretenses, has historically been treated as your problem. The CFPB publicly criticized this gap in 2023 and 2024, pressuring banks to expand reimbursement for impersonation scams.",
      "The most common Zelle scam is devastatingly simple: someone calls pretending to be your bank's fraud department, warns of suspicious activity, and instructs you to \"move money to a safe account\" via Zelle. The safe account is the scammer's. Marketplace scams — paying for goods that never arrive — and phishing texts disguised as bank alerts round out the top three patterns. The FBI's IC3 has flagged all three.",
      "Zelle is not available in Canada — period. There is no Canadian bank integration and no way to sign up with a Canadian account. Interac e-Transfer is Canada's equivalent, processing over $400 billion in 2023. The same scam patterns — fake fraud alerts, marketplace non-delivery, impersonation calls — play out on both systems. The CAFC's advice applies equally: never send instant, irreversible payments to anyone you have not verified in person.",
      "Use Zelle to pay people you know and trust in real life. Never use it to buy from strangers, \"verify\" your account at anyone's request, or move money because a caller told you to. Your bank will never ask you to Zelle yourself money as a security step — that script is always a scam.",
    ],
  },
  {
    slug: "is-coinbase-a-scam",
    title: "Is Coinbase a Scam?",
    domain: "coinbase.com",
    category: "Crypto",
    publishedAt: "2025-10-15",
    updatedAt: "2026-03-01",
    trustScore: 78,
    verdict: "Low Risk",
    summary:
      "Coinbase is a legitimate, publicly traded cryptocurrency exchange (NASDAQ: COIN) and registered as a Restricted Dealer in Canada since 2024. Blockchain investigator ZachXBT reported $65 million or more in social engineering losses from Coinbase users in just December 2024 through January 2025. The platform is not the scam — but scammers target its users relentlessly.",
    body: [
      "In 2021, attackers exploited a flaw in Coinbase's SMS-based two-factor authentication and drained roughly 6,000 accounts — $21.5 million gone before the company patched the hole. Coinbase reimbursed every victim. The incident reveals two truths at once: Coinbase is a legitimate, accountable company, and crypto security failures can be catastrophic.",
      "Coinbase (NASDAQ: COIN) went public in April 2021 and is registered as a Money Services Business with FinCEN, holds licenses in most U.S. states, and registered as a Restricted Dealer in Canada in 2024 — meaning Canadian users can trade through Coinbase under provincial securities oversight. The SEC filed charges in 2023 alleging Coinbase operated as an unregistered exchange and broker in the U.S., a case that reshaped crypto regulation. It holds over $130 billion in customer assets as of late 2025. This is a real, audited financial institution — with real regulatory heat.",
      "The biggest risk to Coinbase users is not Coinbase itself — it is scammers impersonating Coinbase. Blockchain investigator ZachXBT documented over $65 million in social engineering losses from Coinbase users in just December 2024 through January 2025. The FBI's IC3 reported over $5.6 billion in crypto fraud losses in 2023, and impersonation of exchanges is one of the top vectors. The script is predictable: a call or text warns of unauthorized account activity, directs you to a fake website, and captures your credentials or convinces you to install remote access software.",
      "Customer support has been Coinbase's Achilles' heel. During market volatility, users report locked accounts, multi-week response times, and difficulty reaching a human. The BBB gives Coinbase a middling rating driven largely by support complaints. Coinbase has added phone support for account takeovers, but the experience still lags behind traditional banks.",
      "Crypto transactions are irreversible by design. If you send Bitcoin or Ethereum to a scammer's wallet, no one — not Coinbase, not the police, not the blockchain — can reverse it. This is fundamentally different from disputing a credit card charge. The CAFC warns Canadians specifically that cryptocurrency sent to a fraudulent wallet is almost always unrecoverable.",
      "Use Coinbase with hardware security keys or an authenticator app — never SMS codes. Never share credentials with anyone claiming to be support. Verify all communications by logging into coinbase.com directly. And understand the core reality of crypto: once it leaves your wallet, it is gone.",
    ],
  },
  {
    slug: "is-etransfer-a-scam",
    title: "Is Interac e-Transfer a Scam?",
    domain: "interac.ca",
    category: "Finance",
    publishedAt: "2025-11-25",
    updatedAt: "2026-03-01",
    trustScore: 88,
    verdict: "Low Risk",
    summary:
      "Interac e-Transfer is Canada's dominant person-to-person payment system — designated by the Bank of Canada as a prominent payment system and now under Competition Bureau monitoring. The system itself is secure and legitimate, but it is the most common payment method exploited in Canadian scams due to the speed and difficulty of reversing completed transfers.",
    body: [
      "Canadians moved over $400 billion through Interac e-Transfer in 2023 — more than 1 billion transactions. It is the backbone of person-to-person payments in this country, and scammers exploit it for exactly the same reasons everyone else loves it: it is instant, universal, and nearly impossible to reverse.",
      "Interac Corp. has run Canada's interbank network since 1984. The Bank of Canada designated Interac as a prominent payment system — putting it alongside Visa and Mastercard in terms of systemic importance. The Competition Bureau announced 2025 monitoring of Interac's pricing commitments as it shifts to flat-fee structures. The system is not a scam — it is regulated, encrypted, and genuinely secure. The CAFC reported $638 million in total fraud losses across Canada in 2024, and e-Transfer was the most common payment method in reported scams. The problem is not the technology. The problem is that scammers have a favorite tool, and this is it.",
      "Autodeposit changed the security picture dramatically. Before it existed, scammers could intercept transfers by compromising email accounts and guessing weak security questions. With Autodeposit enabled, money goes directly into the recipient's bank account — no question required. Over 60% of users now have it turned on, and Interac says interception fraud has dropped sharply as a result. If you have not enabled it, do that today.",
      "Interception fraud is the sneakiest pattern: a scammer compromises your email, watches for an incoming e-Transfer notification, and diverts the money by answering the security question before the real recipient does. Autodeposit blocks this entirely, but not everyone uses it. Once an e-Transfer is deposited, your bank can only claw it back if the recipient's bank cooperates — which rarely happens. One victim received a $3,000 auto-deposit from a hacked account, returned the money at the scammer's request via a new transfer, and then had the bank reverse the original — leaving them $3,000 in the hole. TD, RBC, and Scotiabank have added fraud warning prompts, but these vary by institution.",
      "The scams hitting Canadians hardest right now: CRA impersonators threatening arrest unless you pay by e-Transfer — the CRA never does this. Rental scams on Kijiji and Facebook Marketplace collecting $1,000 to $3,000 deposits for listings that do not exist. Job scams that send you an e-Transfer and ask you to forward part of it, making you an unwitting money mule. The RCMP has issued public advisories on all three patterns.",
      "Send e-Transfers freely to people you know in real life. Never send one to a stranger, never send one because someone on the phone told you to, and never forward money that was sent to you by someone you have not met. Report suspected fraud to the CAFC at 1-888-495-8501 and your bank immediately.",
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
      "The FBI says Americans lost $5.6 billion to crypto scams in 2023 — up 45% from the year before. In Canada, the CAFC flagged crypto as the top payment method in investment fraud. You do not need to understand blockchain to protect yourself. You just need to spot five patterns.",
      "Pattern one: fake investment platforms. A stranger — usually met on a dating app or Instagram — introduces you to a \"trading platform\" that shows your balance growing daily. The charts look real. The returns look incredible. But when you try to withdraw, you are told to pay a \"tax\" or \"fee\" first. The balance was never real. The FBI calls this \"pig butchering\" because scammers build trust slowly before taking everything. Average losses hit $170,000 per victim.",
      "Pattern two: giveaway scams. Someone impersonating Elon Musk or a major exchange posts on social media: \"Send me 1 BTC, get 2 back.\" The FTC says these schemes pulled in over $80 million in 2023. They work because crypto is irreversible — once sent, it is gone forever. No one will ever double your money for free.",
      "Pattern three: fake wallets and exchanges. A website clones the look of Coinbase, Binance, or MetaMask and asks you to log in. You type your credentials or seed phrase. The scammer now owns your wallet. Always type URLs directly — never click links from emails, texts, or social media ads. No real exchange will ever ask for your seed phrase.",
      "Pattern four: rug pulls. A team launches a flashy new token, hypes it on Twitter and Discord, waits for early buyers to drive the price up, then dumps their entire stake and disappears. Chainalysis tracked over $2.8 billion lost to rug pulls in 2021 alone. If you cannot find the team's real identities, the project has no working product, and the only pitch is \"get in early\" — that is your exit cue.",
      "Pattern five: impersonation calls. Someone phones claiming to be Coinbase support or the CRA, warning that your account has been compromised. They walk you through \"securing\" your funds — which actually means sending crypto to their wallet. The CAFC and RCMP have both issued alerts about this tactic targeting Canadians specifically.",
      "Protecting yourself comes down to a short list. Never send crypto to someone you met online. Never share your seed phrase with anyone — not support, not a friend, not a website. Use an authenticator app for two-factor, not SMS. Verify any Canadian platform through the CSA's registered firm list at securities-administrators.ca. And if someone says you need to act fast or miss out — that urgency is the scam itself.",
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
      "Twelve words. That is all it takes to drain a crypto wallet holding $10,000 — or $10 million. Your seed phrase is the master key to everything you own on the blockchain, and scammers have built an entire industry around tricking people into handing it over.",
      "When you create a wallet — MetaMask, Trust Wallet, Ledger, or any other — the software generates 12 or 24 random English words in a specific order. This is your seed phrase, also called a recovery phrase. It is not a password you chose. It is a cryptographic key that controls your wallet from any device, anywhere, without needing your phone or your login credentials. Think of it as the deed to a house with no locks, no police, and no courts.",
      "The FBI received over 69,000 crypto fraud complaints in 2023, and the CAFC flagged cryptocurrency theft as a growing category in Canadian fraud reports. A significant portion of these cases involve stolen seed phrases — because once a scammer has your 12 words, they can empty your wallet in seconds from the other side of the world. There is no \"undo\" button on the blockchain. Transactions are final by design.",
      "Scammers use three proven tactics. First: fake customer support. Someone on Twitter, Discord, or Telegram poses as MetaMask or Coinbase support and asks you to \"verify your wallet\" by entering your seed phrase on a website. This is always a scam. Second: phishing sites that clone legitimate wallet interfaces — the URL might be metamaask.io instead of metamask.io. You enter your phrase, and it goes straight to the attacker. Third: malware disguised as wallet apps or browser extensions that silently record your phrase when you type it.",
      "Protect your seed phrase the old-fashioned way: write it on paper and store it in a fireproof safe or safety deposit box. Never type it into a notes app, email draft, screenshot, or cloud document — all of these can be compromised. The only time you should ever enter your seed phrase digitally is when recovering your wallet on a new device using the official app you downloaded from the developer's website. Some people use stamped steel plates that survive fire, flood, and time. At $30 to $50, they are cheap insurance for a wallet holding thousands.",
      "If anyone asks for your seed phrase — a support agent, a website, an app, a friend — it is a scam. No exceptions exist. Coinbase will never ask for it. MetaMask will never ask for it. Your bank will never ask for it. Those 12 or 24 words exist for exactly one purpose: letting you recover your own wallet. Guard them like the keys to your money, because that is exactly what they are.",
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
      "The CAFC's 2024 report showed $638 million in total fraud losses across Canada — and investment fraud, increasingly paid in cryptocurrency, was the single largest category. Crypto is now the #1 payment method in Canadian investment scams. The Ontario Securities Commission has issued over 20 investor alerts about crypto schemes since 2022.",
      "The dominant scam pattern is the romance-investment hybrid. It starts on Hinge, Bumble, or Instagram. The scammer invests weeks building a relationship before introducing a \"trading opportunity\" — typically a slick-looking app or website showing fake returns. Victims are coached to buy crypto through a legitimate Canadian exchange like Newton or Shakepay, then transfer it to the scammer's wallet. The RCMP says average losses run between $100,000 and $500,000 per victim. Police forces across Ontario and British Columbia have issued repeated public warnings.",
      "Bitcoin ATM scams are surging. Canada has over 3,000 crypto ATMs — more per capita than almost any country on Earth. Scammers call victims pretending to be the CRA, local police, or a utility company, then instruct them to deposit cash into a Bitcoin ATM using a QR code. The money flows directly to the scammer's wallet. The machines themselves are legitimate businesses registered with FINTRAC, but the transactions are exploited for fraud. The CAFC warns that no government agency will ever ask for payment through a Bitcoin ATM.",
      "Fake Canadian exchanges are another growing threat. Scammers build professional websites claiming registration with FINTRAC or the OSC. They are not. Before depositing money anywhere, check two registries: the Canadian Securities Administrators' registered firm list at securities-administrators.ca and FINTRAC's money services business registry. If a platform does not appear on either list, do not send it money.",
      "If you have been scammed, act fast. Report to the CAFC at 1-888-495-8501 or antifraudcentre.ca. File a report with your local police and the RCMP's National Cybercrime Coordination Centre (NC3). Contact the OSC if the scam involved an investment pitch. Notify the exchange where you bought the crypto — Newton, Shakepay, and Coinbase can sometimes freeze receiving wallets if the scammer has not moved the funds yet. Hours matter.",
      "Crypto is legal and widely used in Canada. The technology is not the problem — irreversible payments attract criminals the same way wire fraud existed before email. Three rules will protect you: never send crypto to anyone you have not met in person, verify every platform through official registries before depositing a single dollar, and remember that guaranteed returns do not exist in any asset class — crypto or otherwise.",
    ],
  },
];

export function getArticle(slug: string): Article | null {
  return ARTICLES.find((a) => a.slug === slug) ?? null;
}

export function getAllArticles(): Article[] {
  return ARTICLES;
}
