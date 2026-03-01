# TrustChekr — Regulatory & Legal Research Map (Living Document)
**Last Updated:** March 1, 2026  
**Stage:** Pre-launch, Canada-only beta, no payments  
**Source:** Perplexity deep research + internal analysis

---

## A. 90-Day Action Plan (Canada-Only Beta, No Payments)

### Month 1 — Privacy, MVP Hardening, First Users

**Product & Engineering**
- Lock MVP scope: paste box (SMS/email/URL/phone/crypto), Low/Medium/High risk score, 1-3 plain language reasons
- Canada-only flows: CRA, Interac, generic phishing, romance/crypto
- Data minimization: do NOT store raw pasted content by default; store hashes/metadata/risk only
- Add config to disable logging of message bodies in production

**Compliance & Security**
- Appoint Privacy Officer (PIPEDA Principle 1: accountability) — Alex
- Create data inventory: what PII collected (IP, email, logs), where stored, retention
- Draft and publish:
  - Privacy Policy following PIPEDA's 10 fair information principles
  - Terms of Service with clear disclaimers (not legal advice, informational only)
- Implement basic safeguards: HTTPS only, encryption at rest, least-privilege access, audit logs (PIPEDA Principle 7)

**B2C Growth**
- Launch closed beta: invite small Canadian test group (friends, Reddit testers) — web app + Telegram bot
- Add simple in-product feedback ("Was this helpful?" with text box)

**Key Metric:** Daily scans, error rates, % scans by channel

---

### Month 2 — CASL-Compliant Communication, Education Content, Beta Expansion

**Product & Engineering**
- Add education snippets under each result ("What were the red flags here?")
- Build 2-3 micro-quizzes (CRA scam, fake Interac, romance scripts) with 3-5 questions each

**Compliance & Security**
- Make ALL user outreach CASL-compliant:
  - Obtain express or implied consent before sending promotional emails/SMS
  - Include sender identification + easy unsubscribe in every CEM
  - Add email preferences screen (opt-out of marketing, keep transactional)
- Confirm logs/backups follow PIPEDA limiting retention (Principle 5): define retention windows + purge schedule

**B2C Growth**
- Open beta broadly to Canadians
- Publish first 3-5 SEO articles targeting:
  - "CRA text message scam Canada"
  - "Is this Interac e-transfer a scam?"
  - "Romance scam warning signs in Canada"
- Soft-launch Telegram bot publicly with in-bot disclosure + privacy policy link

**Key Metric:** Registered Canadian users, repeat usage (scans/user/week), quiz completion rates

---

### Month 3 — FI-Ready Basics, Vendor Packet, Early Outreach

**Product & Engineering**
- Add country selector (keep feature set Canada-only in practice for now)
- Build basic API endpoint for URL/domain risk lookups (precursor to FI/API product)

**Compliance & Security**
- Draft Security & Compliance Overview for FI partners, referencing:
  - PIPEDA principles and implementation
  - Alignment with OSFI Integrity and Security Guideline expectations
- Prepare vendor questionnaire response pack:
  - Data flow diagram (where data enters, where stored, third parties)
  - List of subprocessors (Vercel, Supabase, etc.) and roles
  - Incident response process (detection, containment, notification)

**B2B/FI Preparation**
- Identify 20-30 target Canadian credit unions and smaller banks
- Draft 4-5 touch outreach sequence (email + LinkedIn):
  - Fraud losses and under-reporting in Canada
  - Total cost of fraud (operational/reputational)
  - How TrustChekr's tools align with OSFI/FCAC obligations

**Key Metric:** # FIs contacted, response rate, meetings booked, API endpoint stability

---

## B. Regulatory Index — Canada (Tier 1: Must Consider Now)

### 1. Privacy & Data Protection

**PIPEDA — Personal Information Protection and Electronic Documents Act**
- **Why:** Core federal privacy law for private-sector orgs in commercial activities across Canada
- **Key obligations (10 principles):** accountability, identifying purposes, consent, limiting collection, limiting use/disclosure/retention, accuracy, safeguards, openness, individual access, challenging compliance
- **Read:** OPC — "PIPEDA fair information principles"
- **Trigger:** Applies by default. More scrutiny once partnering with FIs or handling sensitive data

**Provincial Private-Sector Laws**
- Québec (Law 25), Alberta (PIPA), British Columbia (PIPA) have own laws "substantially similar" to PIPEDA
- **FLAG FOR COUNSEL:** PIPEDA vs Québec Law 25 interplay for hosting/data residency

### 2. Anti-Spam / Communications

**CASL — Canada's Anti-Spam Legislation**
- **Why:** Regulates commercial electronic messages (email/SMS) sent from/to Canadian computers
- **Key obligations:** Obtain consent (opt-in), sender identification, easy unsubscribe in every CEM
- **Read:** CRTC FAQ on CASL
- **Trigger:** Applies as soon as you send email/SMS about product updates, newsletters, promotions

### 3. Consumer Protection & Advertising

**Competition Act — Misleading Advertising**
- **Why:** Prohibits false/misleading representations to the public
- **Implication:** Don't over-promise ("we stop all scams"). Keep claims evidence-based. "Low Risk" not "Safe."

**Provincial Consumer Protection Acts**
- Ontario CPA, etc. — unfair practice rules for paid subscriptions (cancellation, refunds, pricing disclosures)

**FCAC — Financial Consumer Agency of Canada**
- **Why:** Oversees consumer protection for FIs. Our FI clients judged partly on how they protect consumers from fraud
- **Implication:** Education modules positioned as helping FIs meet FCAC expectations

### 4. Fraud, Cybercrime & Financial Sector

**PCMLTFA — Proceeds of Crime (Money Laundering) and Terrorist Financing Act**
- **Why:** AML obligations for "reporting entities" via FINTRAC
- **Current state:** Advisory only — we support FIs' fraud/AML functions without being subject ourselves
- **Trigger:** If we later move into money transfer or wallet custody → may become reporting entity requiring AML compliance program
- **FLAG FOR COUNSEL:** Potential MSB classification if TrustChekr integrates wallet custody for crypto

**OSFI Integrity and Security Guideline (I&S)**
- **Why:** Sets expectations for federally regulated FIs re: integrity/security including cyber/fraud
- **Implication:** FIs want vendors to have reasonable security controls and clear data policies
- **Read:** OSFI guidelines, Gowling/JD Supra summaries

### 5. Cybercrime & Internet

**Criminal Code (Canada)**
- Offences: fraud, unauthorized computer use, identity theft, cybercrime
- **Implication:** Ensure OSINT/data collection methods do NOT involve unauthorized access

### 6. Accessibility & Language

**Accessible Canada Act + AODA (Ontario)**
- Not directly mandated for us yet, but designing for accessibility (seniors, screen readers, contrast) is both ethical and commercially important

**Official Languages / Québec French Requirements**
- If targeting Quebec: need French-language interfaces and content
- **Trigger:** Québec's laws on French usage apply to commerce and websites

---

## C. Tier Summary

| Tier | When | Laws/Regs |
|------|------|-----------|
| **Tier 1** (now) | Pre-launch, current operations | PIPEDA, CASL, Competition Act, Criminal Code, AODA |
| **Tier 2** (selling to FIs/gov) | Month 3-6 | OSFI I&S, FCAC alignment, PCMLTFA awareness, provincial CPAs |
| **Tier 3** (money movement/wallets) | If/when custody | PCMLTFA/FINTRAC, BSA/FinCEN (US), LFPDPPP (MX), MSB registration |

---

## D. Monitoring Checklist (Cron/Weekly)

Track updates to:
- [ ] PIPEDA reforms (possible Consumer Privacy Protection Act)
- [ ] OSFI I&S Guideline implementation expectations
- [ ] CASL enforcement actions clarifying grey areas
- [ ] Québec Law 25 implementation phases
- [ ] FCAC fraud-related guidance updates
- [ ] FINTRAC guidance on crypto/fintech

For each change: annotate "Impact on TrustChekr: low/medium/high"

---

## E. Immediate TODO

1. ⬜ Appoint Privacy Officer (Alex)
2. ⬜ Create data inventory
3. ⬜ Publish Privacy Policy (PIPEDA-compliant)
4. ⬜ Publish Terms of Service (disclaimers)
5. ⬜ Implement data minimization (don't store raw pasted content)
6. ⬜ CASL-compliant email/SMS infrastructure
7. ⬜ Define data retention windows + purge schedule
8. ⬜ Draft vendor security overview for FI outreach

---

*This is a research document, not legal advice. Consult counsel for specific compliance decisions.*
*Next review: March 8, 2026*
