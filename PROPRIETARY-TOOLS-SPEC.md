# TrustChekr — Proprietary Tools Specification
**March 1, 2026 | BUILD QUEUE**

These are TrustChekr-exclusive features. The data compounds — every user makes the system smarter, and competitors can't buy our dataset.

---

## PRIORITY 1: Scam Fingerprinting Engine

### What It Does
Every scam campaign has a "fingerprint" — shared language, timing, phone number clusters, payment methods, target demographics. When a user pastes suspicious content, we don't just say "this is risky" — we match it to a known campaign family and show them the full picture.

### User Experience
1. User pastes a suspicious text message
2. System analyzes language patterns, phone numbers, URLs, payment requests
3. Returns: "This matches **CRA Phone Scam — Variant #47**"
4. Shows: first seen date, number of reports, geographic spread, known phone numbers used, typical payment demand
5. "3,218 Canadians have reported this exact scam since January 2026"

### Technical Spec (for Perplexity)

**Data Model — `scam_campaigns` table:**
```
id: string (uuid)
family_name: string ("CRA Phone Scam", "Rogers Billing Scam")
category: string (CRA_IRS, BANK, ROMANCE, DELIVERY, etc.)
first_seen: datetime
last_seen: datetime
report_count: number
status: "active" | "declining" | "dormant"
regions: string[] (provinces/states where reported)
variants: ScamVariant[]
indicators: ScamIndicator[]
```

**Data Model — `scam_variants`:**
```
id: string
campaign_id: string (FK)
variant_number: number
template_text: string (canonical version of the scam message)
language_hash: string (fuzzy hash of normalized text)
phone_numbers: string[]
urls: string[]
email_addresses: string[]
crypto_wallets: string[]
payment_methods: string[] ("gift card", "e-Transfer", "crypto", "wire")
demand_amount_range: { min: number, max: number, currency: string }
first_seen: datetime
report_count: number
```

**Data Model — `scam_indicators` (IoCs):**
```
id: string
campaign_id: string (FK)
type: "phone" | "email" | "url" | "domain" | "crypto_wallet" | "ip"
value: string
first_seen: datetime
last_seen: datetime
report_count: number
```

**Matching Algorithm:**
1. Normalize input (lowercase, strip special chars, normalize whitespace)
2. Generate fuzzy hash (simhash or minhash) of the text
3. Compare against known variant hashes — similarity threshold 0.7+
4. Check for exact indicator matches (phone, URL, email, wallet)
5. If fuzzy match OR indicator match → link to campaign
6. If no match → create new "unclassified" entry for human review
7. Return campaign info + confidence score

**API Endpoint:**
```
POST /api/fingerprint
Body: { content: string, type: "text" | "phone" | "url" | "email" | "wallet" }
Response: {
  matched: boolean,
  confidence: number,
  campaign: { name, category, first_seen, report_count, status, regions },
  variant: { number, template_text, demand_amount_range },
  related_indicators: ScamIndicator[],
  similar_campaigns: Campaign[] (top 3)
}
```

**Frontend Component: `ScamFingerprint.tsx`**
- Card showing campaign name with status badge (ACTIVE/DECLINING/DORMANT)
- Timeline: "First seen Jan 12, 2026 → Last report 2 hours ago"
- Report counter with animation
- Map dots showing where it's been reported
- "Known numbers used in this scam" (expandable)
- "Share this warning" button

**Seeding Strategy:**
- Parse CAFC public reports to create initial campaign families
- Parse our existing scan results to build first fingerprints
- Every user scan contributes to the dataset automatically
- Manual campaign creation for known major scams (top 20 Canadian scams)

---

## PRIORITY 2: Reverse Scam Lookup

### What It Does
Paste a phone number, email, URL, or crypto wallet → get its full "criminal record." Every campaign it's connected to, when it first appeared, how many people reported it, what type of scam, and whether it's still active.

### User Experience
1. User types a phone number they received a call from
2. System returns: "This number has been reported 47 times"
3. Shows: connected campaigns, first report date, last activity, scam types, geographic targets
4. Risk score based on report density and recency
5. "Report this number" button to add to our database

### Technical Spec (for Perplexity)

**API Endpoint:**
```
POST /api/lookup
Body: { query: string, type: "auto" | "phone" | "email" | "url" | "domain" | "wallet" }
Response: {
  found: boolean,
  indicator: {
    value: string,
    type: string,
    first_seen: datetime,
    last_seen: datetime,
    total_reports: number,
    risk_level: "low" | "medium" | "high" | "critical",
    status: "active" | "inactive"
  },
  campaigns: [{
    name: string,
    category: string,
    role: "primary" | "associated",
    report_count: number,
    date_range: { from: datetime, to: datetime }
  }],
  related_indicators: [{
    type: string,
    value: string,
    relationship: "same_campaign" | "same_actor" | "co_reported"
  }],
  community_reports: [{
    date: datetime,
    region: string,
    excerpt: string (anonymized)
  }]
}
```

**Frontend Component: `ReverseLookup.tsx`**
- Clean search bar with auto-detect (phone/email/URL/wallet)
- Result card with big risk score badge
- "Reported X times" with trend arrow (↑ increasing, ↓ decreasing)
- Timeline of reports
- Connected campaigns as clickable cards
- "Other numbers/emails used by the same scam" section
- "Report this" CTA button
- Share button for warning others

**Auto-Detection Logic:**
- Phone: matches /^\+?[0-9\-\(\)\s]{7,15}$/
- Email: contains @
- URL: starts with http/https or contains .com/.ca/.org etc.
- Crypto: BTC (1/3/bc1 prefix, 26-35 chars), ETH (0x prefix, 42 chars), XRP (r prefix, 25-35 chars)
- Domain: no protocol but has TLD

**Data Sources (internal):**
- Our fingerprint database (Priority 1)
- User scan history (anonymized)
- Community reports
- OSINT checks (existing: RDAP, PhishTank, URLhaus, etc.)

**Page: `/tools/lookup`**
- Add to Tools nav section
- Also add search bar variant to homepage

---

## PRIORITY 3: Scam Alert Network

### What It Does
Opt-in push notifications when new scam campaigns target your area, your carrier, or your demographic. "A new scam targeting TD Bank customers in Ontario just started — here's what to look for."

### User Experience
1. User signs up with: province, carrier (optional), bank (optional), age range (optional)
2. We store ONLY these preferences — no name, no email, no personal data
3. When a new campaign spikes in their region/profile, they get an alert
4. Alert shows: what the scam looks like, how to spot it, what to do
5. Weekly digest option for less urgent trends

### Technical Spec (for Perplexity)

**Data Model — `alert_subscribers`:**
```
id: string (uuid)
created_at: datetime
province: string (2-letter code: ON, BC, AB, etc.)
carrier: string | null ("Rogers", "Bell", "Telus", "Freedom", etc.)
bank: string | null ("TD", "RBC", "Scotia", "BMO", "CIBC", "Desjardins", "credit union")
age_range: string | null ("18-30", "31-50", "51-65", "65+")
push_token: string | null (web push subscription)
email: string | null (for email digest)
telegram_chat_id: string | null
frequency: "instant" | "daily" | "weekly"
active: boolean
last_notified: datetime
```

**Data Model — `alerts`:**
```
id: string
campaign_id: string (FK to scam_campaigns)
title: string ("New CRA Scam Targeting Ontario")
body: string (2-3 sentence description)
severity: "info" | "warning" | "critical"
target_provinces: string[]
target_carriers: string[]
target_banks: string[]
target_age_ranges: string[]
created_at: datetime
sent_count: number
```

**Alert Trigger Logic:**
1. Campaign report_count crosses threshold (10+ reports in 24h = new campaign alert)
2. Campaign status changes to "active" in a new region
3. Spike detection: report rate 3x above 7-day average
4. Manual trigger for critical scams (admin)

**Delivery Channels:**
- Web Push (via Push API / service worker)
- Email digest (daily/weekly)
- Telegram bot (@TrustChekrbot — already exists!)
- Future: SMS (via Twilio, costs money)

**Frontend Components:**

`AlertSignup.tsx` — signup form:
- Province dropdown (required)
- Carrier selector (optional)
- Bank selector (optional)
- Age range selector (optional)
- Frequency toggle (instant/daily/weekly)
- Push notification permission request
- "We never store your name or personal info" trust badge

`AlertFeed.tsx` — public alert feed page:
- Chronological list of recent alerts
- Filter by province, category, severity
- No login required to VIEW alerts
- Login/signup required for push notifications

**Page: `/alerts`**
- Add to nav under Tools or Support
- Also show latest 3 alerts on homepage sidebar

**Privacy:**
- No names, no tracking, no profiles
- Subscriber data is province + optional preferences
- Can unsubscribe with one click
- Data deleted on unsubscribe, not retained

---

## BUILD ORDER

| # | Tool | Depends On | Est. Complexity | Value |
|---|------|-----------|-----------------|-------|
| 1 | Scam Fingerprinting | Nothing | Medium-High | Foundation for everything |
| 2 | Reverse Scam Lookup | Fingerprinting data | Medium | Sticky daily-use feature |
| 3 | Scam Alert Network | Fingerprinting + Lookup | Medium | Retention + subscriber base |

**Build 1 first.** It creates the data that powers 2 and 3. Without fingerprinting, lookup is just our existing OSINT. With fingerprinting, lookup becomes a unique product nobody else has.

---

## FUTURE TOOLS (Queue)

4. **Scam DNA Comparison** — paste two messages, see similarity score + shared campaign links
5. **Scam Simulator** — interactive "what would you do?" training scenarios
6. **Trust Score for Businesses** — public trustworthiness rating for Canadian companies
7. **Screenshot Forensics** — detect edited screenshots, extract metadata, identify source platform
8. **Scam Cost Calculator** — "If you'd fallen for this, here's what you would have lost" (emotional + shareable)

---

## DATABASE NOTE

We're currently stateless (no database). These tools require persistent storage. Options:
- **Vercel Postgres** (free tier: 256MB) — simplest, stays in Vercel ecosystem
- **Supabase** (free tier: 500MB + auth + realtime) — more features
- **PlanetScale** (free tier: 5GB) — MySQL, generous
- **Turso** (free tier: 9GB) — SQLite edge, fastest

**Recommendation:** Supabase — gives us database + auth + realtime subscriptions (useful for alerts) + generous free tier. One integration covers all three tools.

---

*These specs are ready to hand to a coding agent one at a time. Build in order. Test each before starting the next.*
