# Security Audit — March 1, 2026

## Summary

Overall security posture: **Good**. The codebase implements rate limiting, input validation, security headers, and admin auth. A few areas noted below for monitoring.

---

## 1. API Routes

### Rate Limiting ✅
All API routes are rate-limited via middleware.ts with per-IP counters:
- `/api/scan` — 50/day
- `/api/chat/analyze` — 30/day
- `/api/v1/*` — 100/day
- `/api/newsletter` — 5/hour
- `/api/user-reports` — 10/hour
- `/api/community/*` — 10/hour
- `/api/scan/*` sub-endpoints — 30/day
- `/api/feed/*` — 60/hour
- `/api/phone/*` — 100/day
- `/api/partnerships` — 5/hour
- `/api/claim*` — 10/hour
- `/api/certificate` — 20/hour
- `/api/feedback*` — 20/hour
- `/api/scam-intel/*` — 60/hour
- `/api/stats/*` — 30/hour
- `/api/sms` — 60/hour
- `/api/digest` — 10/hour
- `/api/health` — 120/hour

Memory pruning runs every 5 minutes to prevent unbounded map growth.

### Input Validation ✅
- `/api/scan` validates type, input string, length (5000 char max), and rejects payloads >10KB
- `/api/scan/romance-chat` validates message array shape, caps at 200 messages
- `/api/partnerships` validates required fields and email format
- `/api/sms` validates body length
- Sensitive data (SSN, SIN, credit cards, passport) detected and rejected in scan

### SQL Injection ✅ N/A
Uses Supabase client with parameterized queries — no raw SQL.

### SSRF ✅
- `/api/sms` uses `NEXT_PUBLIC_BASE_URL` or hardcoded `trustchekr.com` — no user-controlled fetch URLs
- `/api/partnerships` webhook URL from env var only
- `/api/chat/analyze` uses hardcoded Gemini endpoint
- No user input directly used in fetch URLs

### Admin Auth ✅
- `/admin/*` and `/tc47x/*` routes require `TC_ADMIN_TOKEN` via query param or Authorization header
- Admin page (`tc47x/...`) is a Server Component — `process.env.TC_ADMIN_TOKEN` stays server-side

### Exposed Secrets ✅
- No API keys in client-side code
- `.env` and `.env.local` in `.gitignore`
- Only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_BASE_URL` exposed (by design)

---

## 2. Security Headers ✅

All implemented in `next.config.ts`:
- **HSTS**: `max-age=63072000; includeSubDomains; preload` ✅
- **X-Content-Type-Options**: `nosniff` ✅
- **X-Frame-Options**: `DENY` ✅
- **Referrer-Policy**: `strict-origin-when-cross-origin` ✅
- **Permissions-Policy**: camera, microphone, geolocation disabled ✅
- **CSP**: Configured with appropriate sources, `frame-ancestors 'none'`, `upgrade-insecure-requests` ✅

### CSP Note
`script-src 'unsafe-inline'` is present — common for Next.js but worth monitoring. Consider nonce-based CSP if feasible in future.

---

## 3. Client-Side

### XSS via dangerouslySetInnerHTML ✅
Three uses found, all safe:
1. `scan/[domain]/page.tsx` — JSON-LD with `</` escaped via `\\u003c`
2. `scam-check/[slug]/page.tsx` — JSON-LD with `</` escaped
3. `layout.tsx` — structured data (no user input)

### Exposed Env Vars ✅
- `process.env.TC_ADMIN_TOKEN` used in `tc47x/` page — **Server Component only**, safe
- `process.env.VERCEL_URL` used in `scan/[domain]/page.tsx` — **Server Component**, safe

### localStorage Usage ✅ Low Risk
Stores only:
- Navigation timestamps (`tc-last-report`)
- Form drafts (claim page)
- Academy progress
- Locale preference
- Dark mode preference
- Chat history
- Scan history

No tokens, passwords, or sensitive data in localStorage.

---

## 4. Dependencies

```
npm audit: 9 vulnerabilities (2 low, 4 moderate, 1 high, 2 critical)
```

All in `node-telegram-bot-api` → `@cypress/request-promise` → `request` dependency chain:
- **Critical**: `request` package (deprecated, prototype pollution)
- **High**: `qs` DoS via memory exhaustion
- **Moderate**: `tough-cookie` prototype pollution

**Impact**: These are in `node-telegram-bot-api`, not in the web app's runtime path. Low real-world risk for the Next.js app but should be monitored.

**Recommendation**: Consider upgrading `node-telegram-bot-api` when a fix is available, or replacing with `grammy`/`telegraf`.

---

## 5. Recommendations

| Priority | Item | Status |
|----------|------|--------|
| ✅ Done | Rate limiting on all API routes | Implemented |
| ✅ Done | Security headers (HSTS, CSP, etc.) | Implemented |
| ✅ Done | Input validation on scan endpoints | Implemented |
| ✅ Done | Admin auth on admin routes | Implemented |
| 📋 Low | Replace `'unsafe-inline'` in CSP with nonces | Future improvement |
| 📋 Low | Upgrade or replace `node-telegram-bot-api` | When fix available |
| 📋 Low | Add Twilio request signature validation | Production hardening |

---

## Fixes Applied This Audit

No critical/high code fixes needed — codebase was already well-secured.

### Typography & Consistency Fixes (same commit):
- Partners page: Added BackButton, fixed title case on subtitle, added heading font
- learn/ai-deanonymization: Added BackButton component (replaced manual back link)
- Verified BackButton present on all 23+ page files
- globals.css already applies `--font-heading` to all h1-h6 and `--font-body` to body
- Color variables (--tc-text-main, --tc-text-muted, --tc-surface, --tc-bg) used consistently
- Remaining hardcoded colors are intentional (data viz, severity badges, code blocks)
