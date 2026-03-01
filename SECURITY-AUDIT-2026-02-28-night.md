# TrustChekr Security Audit — 2026-02-28 (Night)

**Auditor:** Master Chief (automated)  
**Scope:** Full application — API routes, middleware, client components, secrets, dependencies, headers, data flow, new code  
**App:** Next.js (App Router) + Supabase + Gemini AI  

---

## Summary

| Severity | Count |
|----------|-------|
| CRITICAL | 2 |
| HIGH | 3 |
| MEDIUM | 5 |
| LOW | 3 |
| INFO | 4 |

---

## CRITICAL

### C1. Real Secrets Exposed in `.env.local` — Readable by Any Process

**File:** `.env.local`  
**Finding:** The file contains production Supabase service role key, admin token, and Gemini API key in plaintext. While `.env.local` is in `.gitignore`, it was readable during this audit scan. If this file has **ever** been committed to git history, all secrets are compromised.

**Exposed values observed:**
- `SUPABASE_SERVICE_ROLE_KEY` (service role = full database bypass of RLS)
- `TC_ADMIN_TOKEN` (admin panel access)
- `GEMINI_API_KEY` (billable Google API)

**Remediation:**
1. Run `git log --all --full-history -- .env.local` — if ANY commits show, rotate ALL keys immediately
2. Rotate the Supabase service role key in Supabase dashboard → Settings → API
3. Rotate `TC_ADMIN_TOKEN` and `GEMINI_API_KEY`
4. Use Vercel Environment Variables (encrypted at rest) instead of `.env.local` in production
5. Add a pre-commit hook: `git secrets --install` to prevent future leaks

### C2. Supabase Service Role Key Used Server-Side Without RLS Enforcement

**File:** `src/lib/supabase/server.ts`  
**Finding:** The server client uses `SUPABASE_SERVICE_ROLE_KEY`, which **bypasses all Row Level Security policies**. Every API route that uses `supabaseServer` has unrestricted read/write access to every table. If any API route has an injection or logic flaw, the attacker gets full database access.

**Affected routes:** All 15+ API routes using `supabaseServer`.

**Remediation:**
1. For public-facing routes (newsletter, feedback, user-reports, community, claims), create a **restricted Supabase client** using the anon key with proper RLS policies
2. Reserve the service role key for admin-only routes (`/api/digest`, `/api/feedback/summary`)
3. Verify RLS is actually **enabled and has policies** on: `newsletter_subscribers`, `user_reports`, `scan_feedback`, `website_claims`, `entities`, `scam_patterns`
4. The claim migration SQL shows `enable row level security` but **no policies are defined** — RLS without policies = deny all for anon, but service key bypasses anyway

---

## HIGH

### H1. SQL Wildcard Injection via `ilike` in Entity Search API

**File:** `src/app/api/v1/entities/route.ts:26`  
**Finding:** User-supplied `value` parameter is interpolated directly into an `ilike` pattern:
```ts
query = query.ilike('value', `%${value}%`);
```
An attacker can inject SQL wildcards (`%`, `_`) to craft expensive queries or enumerate data. Example: `value=____` matches all 4-char values. While Supabase parameterizes the value (preventing true SQL injection), the wildcard injection enables data enumeration and potential DoS via expensive LIKE scans on unindexed columns.

**Remediation:**
1. Escape `%` and `_` in user input: `value.replace(/%/g, '\\%').replace(/_/g, '\\_')`
2. Add a minimum length of 5+ characters for search queries
3. Add an index on `entities.value` if not present

### H2. SMS Webhook (`/api/sms`) Has No Twilio Signature Verification

**File:** `src/app/api/sms/route.ts`  
**Finding:** The SMS endpoint accepts any POST with `From`/`Body` form fields. There is no Twilio request signature validation (`X-Twilio-Signature`). An attacker can spoof SMS webhooks to:
- Abuse the scan API (internally called without rate limiting)
- Generate fake TwiML responses
- Probe the scan engine with crafted inputs

**Remediation:**
1. Install `twilio` package and use `validateRequest()` to verify the `X-Twilio-Signature` header
2. Alternatively, use Twilio's webhook URL signing with your auth token
3. The internal `fetch` to `/api/scan` bypasses middleware rate limiting — add a shared secret or use direct function calls instead

### H3. Admin Token Comparison Vulnerable to Timing Attacks

**Files:** `src/middleware.ts:254`, `src/app/api/feedback/summary/route.ts:18`, `src/app/api/digest/route.ts:29`  
**Finding:** Admin token comparison uses `===` string equality, which is vulnerable to timing side-channel attacks. An attacker can statistically determine the token character-by-character by measuring response times.

**Remediation:**
1. Use `crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b))` for all token comparisons
2. Create a shared `verifyAdminToken(provided: string): boolean` utility

---

## MEDIUM

### M1. In-Memory Rate Limiting Resets on Cold Start / Multiple Instances

**File:** `src/middleware.ts`  
**Finding:** Rate limiting uses `Map` objects in middleware memory. On Vercel:
- Each serverless function invocation may have its own memory space
- Cold starts reset all counters
- Multiple concurrent instances don't share state

Attackers can bypass rate limits by waiting for cold starts or hitting different edge regions.

**Remediation:**
1. Use Vercel KV (Redis) or Upstash for distributed rate limiting
2. Alternatively, use `@vercel/edge-config` or Supabase for persistent counters
3. Current approach is acceptable for MVP but should be upgraded before significant traffic

### M2. No CSRF Protection on State-Changing POST Endpoints

**Files:** All POST API routes  
**Finding:** No CSRF tokens or `SameSite` cookie enforcement. Since the app uses Supabase service key (not user sessions), traditional CSRF is less critical, but form-based endpoints (`/api/newsletter`, `/api/feedback`, `/api/partnerships`, `/api/claim`) can be triggered by cross-origin forms.

**Remediation:**
1. Verify `Origin` or `Referer` header matches your domain on all POST routes
2. Add `SameSite=Strict` to any cookies if introduced later
3. The existing CSP `form-action 'self'` helps but doesn't protect against JavaScript-initiated requests

### M3. `dangerouslySetInnerHTML` in JSON-LD Uses `domain` from URL Path

**File:** `src/app/scan/[domain]/page.tsx:179`  
**Finding:** The `buildJsonLd()` function takes `domain` from the URL path parameter and puts it through `JSON.stringify()` into a `<script>` tag via `dangerouslySetInnerHTML`. While `JSON.stringify` escapes quotes, a carefully crafted domain with `</script>` sequences could break out of the JSON-LD context.

**Remediation:**
1. Sanitize the `domain` parameter: strip any `<`, `>`, `"` characters before use
2. Use a library like `serialize-javascript` for safe script injection
3. Current risk is LOW in practice because `JSON.stringify` escapes `"` — but defense in depth is warranted

### M4. Wildcard CORS on `/api/scan` and `/api/scam-intel/*`

**File:** `next.config.ts`  
**Finding:** `Access-Control-Allow-Origin: *` on scan and scam-intel endpoints. While these are intentionally public APIs, this allows any website to make authenticated requests on behalf of users if cookies/auth are ever added.

**Remediation:**
1. Acceptable for truly public read-only APIs
2. If auth is ever added, restrict to specific origins
3. Consider adding `Access-Control-Max-Age` to reduce preflight requests

### M5. Community Search Query Passed Unsanitized to `searchReports()`

**File:** `src/app/api/community/reports/route.ts:8`  
**Finding:** The `q` parameter from search is passed directly to `searchReports(query)`. Without seeing the full implementation, if this uses `.textSearch()` or `.ilike()`, it has the same wildcard/injection risks as H1.

**Remediation:**
1. Sanitize search input: strip SQL wildcards, limit length
2. Use Supabase full-text search with `plainto_tsquery` (auto-sanitizes)

---

## LOW

### L1. CSP Allows `'unsafe-inline'` for Scripts and Styles

**File:** `next.config.ts`  
**Finding:** `script-src 'self' 'unsafe-inline'` allows inline script injection if any XSS vector exists. This weakens the CSP significantly.

**Remediation:** Use nonce-based CSP (`'nonce-<random>'`) for inline scripts when feasible with Next.js.

### L2. No `X-Request-ID` or Request Logging Correlation

**Finding:** API errors log to console but have no correlation ID. Debugging production issues across serverless invocations is difficult.

### L3. Claim Status Endpoint Allows Enumeration

**File:** `src/app/api/claim/status/route.ts`  
**Finding:** The claim ID format `clm_<16hex>` provides adequate entropy (64 bits), but the endpoint returns different responses for "not found" vs. invalid format, which leaks information about valid claim IDs.

---

## INFO

### I1. npm audit: 9 Vulnerabilities (2 critical, 1 high, 4 moderate, 2 low)

All from `node-telegram-bot-api` → `request` dependency chain:
- **critical:** `form-data` unsafe random boundary (GHSA-fjxv-7rqg-78g4)
- **critical:** `form-data` (duplicate)
- **high:** `qs` arrayLimit DoS (GHSA-6rw7-vpxm-498p)
- **moderate:** `tough-cookie` prototype pollution

Fix: `npm audit fix --force` (breaking change to `node-telegram-bot-api@0.63.0`). These are in a transitive dep unlikely to affect the web app directly.

### I2. Articles Use Static Data — No Injection Risk

**File:** `src/lib/articles.ts`  
**Finding:** Article content is hardcoded in source. No user input flows into article rendering. Safe.

### I3. Scoring/Decay Module is Pure Math — No Security Concerns

**File:** `src/lib/scoring/decay.ts`  
**Finding:** Pure computation, no I/O, no user input. Clean.

### I4. Security Headers Are Well-Configured

**File:** `next.config.ts`  
**Finding:** All recommended headers present: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `HSTS` with preload, `Permissions-Policy`, `Referrer-Policy`, `CSP` (with the `unsafe-inline` caveat in L1). `frame-ancestors 'none'` provides clickjacking protection. Good work.

---

## New Code Review (Since Last Audit)

| File | Status |
|------|--------|
| `src/lib/articles.ts` | ✅ Static data, no risk |
| `src/lib/scoring/decay.ts` | ✅ Pure math, no risk |
| `src/app/api/claim/route.ts` | ⚠️ See C2 (service key), otherwise well-validated |
| `src/app/api/claim/status/route.ts` | ⚠️ See L3 (enumeration) |
| Academy module data | ✅ Static content, no injection vectors |

---

## Priority Remediation Order

1. **Immediately:** Verify `.env.local` was never committed to git. Rotate all secrets if it was. (C1)
2. **This week:** Add Twilio signature verification to SMS webhook (H2)
3. **This week:** Implement timing-safe token comparison (H3)
4. **This week:** Escape wildcards in entity search ilike (H1)
5. **Next sprint:** Migrate to anon key + RLS for public routes (C2)
6. **Next sprint:** Add Origin/Referer CSRF checks (M2)
7. **Next sprint:** Upgrade rate limiting to distributed store (M1)

---

*Generated: 2026-02-28T23:00:00-05:00*
