# TrustChekr — Investor Summary
**March 1, 2026 | Prepared for Vancouver Pitch**

---

## The Problem

Canadians reported **$638 million** in fraud losses in 2024 — and only **5–10% of victims actually report**. The real number is likely in the billions. There is no consumer-facing tool in Canada that lets regular people check if something is a scam before they lose money.

**Source:** Canadian Anti-Fraud Centre, 2024 Annual Report

---

## The Solution

**TrustChekr** — a free, privacy-first scam detection platform. Paste a suspicious text, URL, phone number, or email → get a plain-language risk assessment in seconds. No account needed. No data stored.

**Live at:** [trustchekr.com](https://trustchekr.com)

---

## What We Built (in 3 weeks)

| Metric | Value |
|--------|-------|
| **Lines of code** | 21,800+ |
| **Pages & flows** | 29 pages |
| **Components** | 34 React components |
| **Detection rules** | 138 patterns across 13 scam categories |
| **OSINT modules** | 9 (RDAP, HIBP, VirusTotal, Google Safe Browsing, PhishTank, URLhaus, Etherscan, blockchain.info, XRPL) |
| **Domain blocklist** | 49,762 known scam domains |
| **Commits (last 48h)** | 119 |
| **Tech stack** | Next.js 15, React 19, TypeScript, Tailwind CSS, Vercel |

---

## Development Velocity (Last 48 Hours)

### 🔴 Scam Radar — Live Threat Dashboard (NEW)
- Real-time scam activity monitoring powered by X/Twitter data
- 5 categories tracked: CRA/IRS, Bank Fraud, Crypto, Romance, AI Deepfakes
- Color-coded threat levels (low → moderate → high → critical)
- Trend indicators (rising/stable/falling)
- Auto-refreshes every 5 minutes from cached data
- **Nobody else has this.** First consumer-facing live scam threat dashboard.

### 🤖 AI Chat Assistant (REDESIGNED)
- Conversational scam checker — describe what happened in plain English
- Dark theme UI with branded logo watermark
- Risk level badges on responses (LOW / MEDIUM / HIGH)
- Suggestion prompts for common scenarios
- Available on web + Telegram (@TrustChekrbot)

### 🔍 Grok/xAI Integration (NEW)
- Connected to xAI's x_search API for real-time social media intelligence
- Scans X/Twitter for emerging scam patterns every 6 hours
- Powers the Scam Radar with live data
- Invisible to users — appears as TrustChekr's own intelligence

### 📊 3 New Detection Categories (NEW)
- **Job Scams** — 7 rules (task deposit fraud, fake recruitment, WhatsApp/Telegram schemes)
- **Delivery/Parcel Scams** — 6 rules (Canada Post, UPS, FedEx impersonation)
- **Toll Road Scams** — 4 rules (407 ETR, EZPass, SunPass impersonation)

### 🌎 North America Coverage (EXPANDED)
- Full Canada + US + Mexico detection engine
- Mexico: 14 patterns including virtual kidnapping detection
- XRPL native blockchain analysis — **first consumer tool with this**

### 📝 Content & Education
- 3 new long-form articles: IRS scams, Zelle/Venmo fraud, Immigration scams
- 5 academy modules with new quiz scenarios
- Full de-AI content sweep — every page reads human, not generated
- Real founder story with sourced CAFC statistics

### 🎨 Professional Design Overhaul
- Lucide SVG icon system (replaced all emoji icons)
- Plus Jakarta Sans + Inter font pairing
- Standardized design tokens (border-radius hierarchy, touch targets)
- Senior-friendly 5-tab navigation: Home · Chat · Learn · Tools · Support
- Dark mode fully working across all pages
- Micro-interactions on cards and buttons

### 📋 Business & Regulatory
- Honest competitive analysis (real competitor capabilities documented)
- CanExport SMEs application draft ($50K project, $25K grant)
- Regulatory compliance map (PIPEDA, CCPA, CASL, PHIPA)
- Valuation estimate and 90-day business plan
- Federal incorporation complete (17734344 Canada Inc.)

---

## Complete Feature List

### Scan Engine
- URL/domain risk analysis with RDAP lookups
- Phone number pattern detection (CRA, IRS, bank impersonation)
- Email/message text analysis (138 detection rules)
- Crypto wallet risk scoring (XRPL, Ethereum, Bitcoin)
- AI-generated text detection (Gemini 2.5 Flash)
- Romance scam classifier (multi-class ML model)
- Screenshot OCR scanner (in-browser, no upload)
- QR code scanner
- Document manipulation detector
- Email header forensic analyzer
- Reverse image search
- Domain age & registration analysis
- Google Knowledge Graph entity verification
- Tranco ranking display (top 1M sites)
- 49,762-domain blocklist

### Intelligence
- **Scam Radar** — live threat dashboard (Grok/xAI powered)
- 9 OSINT modules running in parallel
- Phishing keyword engine (80+ keywords from 5,100 labeled emails)
- Brand impersonation detection (40+ legitimate domains)
- Time-decay freshness scoring

### Education
- **Safety Academy** — 8 modules with interactive quizzes
- **Learn Center** — 10+ long-form articles with sourced statistics
- **Scam-Check SEO Pages** — targeting high-volume search queries
- Grokipedia integration for real-time scam intelligence

### User-Facing
- AI chat assistant (web + Telegram)
- Scan history (local, no account needed)
- Shareable results with unique URLs
- Community scam reports
- Interactive North America scam heat map
- Newsletter signup for monthly alerts
- Embeddable widget for partners
- Browser extension (scaffold)
- PWA-ready (installable on mobile)

### Business
- Public API v1 with documentation
- Partner integration endpoints (webhook forwarding)
- Admin dashboard with feedback analytics
- Rate limiting and security hardening
- PIPEDA/CCPA compliant — no data stored

---

## What Separates Us From Competitors

| Feature | TrustChekr | ScamAdviser | Norton LifeLock | Bitdefender Scamio |
|---------|-----------|-------------|-----------------|-------------------|
| **Free, no account** | ✅ | Partial | ❌ ($12-35/mo) | ✅ |
| **Live threat dashboard** | ✅ (FIRST) | ❌ | ❌ | ❌ |
| **Real-time X/social monitoring** | ✅ (FIRST) | ❌ | ❌ | ❌ |
| **XRPL blockchain analysis** | ✅ (FIRST) | ❌ | ❌ | ❌ |
| **Canada-specific (CRA, Interac)** | ✅ | Limited | US-focused | EU-focused |
| **AI chat assistant** | ✅ | ❌ | ❌ | ✅ |
| **Romance scam ML classifier** | ✅ | ❌ | ❌ | ❌ |
| **Screenshot/QR/doc scanning** | ✅ | ❌ | ❌ | Limited |
| **Privacy-first (no data stored)** | ✅ | Stores data | Stores data | Stores data |
| **Open API for partners** | ✅ | Paid only | ❌ | ❌ |
| **Safety Academy + quizzes** | ✅ | ❌ | ❌ | ❌ |
| **Embeddable widget** | ✅ | Paid | ❌ | ❌ |
| **Trilingual (EN/FR/ES ready)** | ✅ | Limited | EN only | Multi |

### Our Unique Advantages
1. **First live scam threat dashboard** — no consumer tool shows real-time scam activity
2. **First XRPL native analysis** — as XRPL adoption grows, we're already there
3. **Canada-first** — ScamAdviser gets <3% Canadian traffic. We own this market.
4. **Privacy-first architecture** — we never store scan data. In a post-Moffatt v Air Canada world, this matters.
5. **Speed** — 119 commits in 48 hours. We ship faster than funded teams.
6. **AI-powered, human-built** — real founder story, real mission, not another AI wrapper

### What Competitors Have That We Don't (Yet)
- Mobile app (ScamAdviser, Norton)
- $1M identity theft insurance (Norton)
- Call blocking (Norton, McAfee)
- Credit monitoring (Norton, Aura)
- Enterprise ML models (all majors)
- Established user base (ScamAdviser: 6.5M/mo, Norton: millions)

---

## Revenue Model

1. **Freemium API** — free tier for individuals, paid for businesses ($49-499/mo)
2. **Credit union / library partnerships** — white-label widget ($500-2,000/mo)
3. **NordVPN affiliate** — security product recommendations
4. **Premium features** — real-time alerts, API access, priority scanning
5. **Enterprise** — custom integrations, bulk scanning, compliance reporting

**Target:** $1M+ ARR within 18 months

---

## Funding Potential

| Program | Amount | Status |
|---------|--------|--------|
| **CanExport SMEs** | Up to $25,000 | Application drafted, opens March 1 |
| **SR&ED Tax Credit** | ~43% of R&D spend | Eligible (CCPC incorporated) |
| **IRAP** | Up to $50,000 | Ready to apply |
| **Cybersecure Catalyst** | Accelerator + funding | Apply March |
| **CDAP** | Up to $15,000 | Digital adoption |
| **Total potential** | **$545K–$925K+** | |

---

## The Team

**Alex** — Founder, Toronto
- Telecom → Cybersecurity → Crypto → TrustChekr
- Google IT & Security Certificates, York University Cybersecurity Certificate
- CompTIA Network+ / Security+ (in progress)
- Attacker mindset — understands how scammers operate

**17734344 Canada Inc.** — Federal CCPC incorporation (Feb 28, 2026)

---

## The Ask

We're looking for:
- **Angel investment** ($50K–$150K) for mobile app development, ML infrastructure, and first hires
- **Strategic partnerships** with credit unions, consumer protection organizations, and fintech platforms
- **Pilot customers** for the embeddable widget and API

---

## Contact

- **Web:** [trustchekr.com](https://trustchekr.com)
- **Email:** hello@trustchekr.com
- **GitHub:** [github.com/DropZone7/TrustChekr](https://github.com/DropZone7/TrustChekr)
- **Telegram Bot:** [@TrustChekrbot](https://t.me/TrustChekrbot)

---

*Built in Toronto. For Canadians. Against scammers.*
