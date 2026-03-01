# TrustChekr Security Audit — 2026-02-28 Evening

**Auditor:** Master Chief (automated)  
**Scope:** All API routes in `src/app/api/`, `middleware.ts`, `next.config.ts`, key lib files  
**Date:** 2026-02-28 22:03 EST

---

## Summary

| Severity | Count |
|----------|-------|
| CRITICAL | 1 |
| HIGH | 5 |
| MEDIUM | 8 |
| LOW | 5 |
| INFO | 4 |

---

## Findings

### CRITICAL

| # | File | Finding | Recommendation |
|---|------|---------|----------------|
| 1 | `src/app/api/sms/route.ts` | **No Twilio request signature validation.** Anyone can POST to this endpoint pretending to be Twilio. An attacker can invoke unlimited internal `/api/scan` calls (SSRF amplification) by forging SMS webhook requests, bypassing all middleware rate limits since the call originates from localhost. | Validate `X-Twilio-Signature` header using your Twilio auth token. Reject unsigned requests with 403. See [Twilio docs](https://www.twilio.com/docs/usage/security#validating-requests). |

### HIGH

| # | File | Finding | Recommendation |
|---|------|---------|----------------|
| 2 | `src/app/api/sms/route.ts` | **Server-Side Request Forgery (SSRF) via internal fetch.** The SMS route calls `fetch(new URL('/api/scan', req.url))` — the base URL comes from the inbound request's `Host` header. An attacker can manipulate the Host header to redirect the internal fetch to an arbitrary server. | Hardcode the internal base URL (e.g., `http://localhost:3000/api/scan`) or use `process.env.NEXT_PUBLIC_BASE_URL`. |
| 3 | `src/app/api/v1/scan/route.ts` | **Same SSRF pattern.** `fetch(new URL('/api/scan', req.url))` uses attacker-controlled Host header to construct the target URL. | Same fix — hardcode internal URL. |
| 4 | `src/app/api/digest/route.ts` | **Admin auth uses Bearer token but route is NOT in middleware matcher.** The `/api/digest` route checks `Authorization` header manually, but it's not listed in the middleware `config.matcher`, so no rate limiting applies. Brute-force of the admin token is possible. | Add `/api/digest` to middleware matcher with strict rate limiting (e.g., 10/hour). |
| 5 | `src/app/api/feedback/summary/route.ts` | **No authentication on feedback summary endpoint.** Exposes all feedback data (comments, risk levels, scan types, IP hashes, trend data) to any anonymous user. Could leak operational intelligence about scan volume and user sentiment. | Add admin auth (Bearer token check like `/api/digest`) or move behind the admin path. |
| 6 | `src/middleware.ts` | **Admin token passed in query string (`?k=`).** Query params are logged in server access logs, browser history, Referer headers, and CDN logs. This exposes the admin token. | Switch to `Authorization: Bearer <token>` header or cookie-based auth. Remove query-string auth. |

### MEDIUM

| # | File | Finding | Recommendation |
|---|------|---------|----------------|
| 7 | `src/middleware.ts` | **In-memory rate limiting resets on cold start / new serverless instance.** Each Vercel function instance has its own `Map`, so rate limits are per-instance, not global. Under load, limits are effectively multiplied by instance count. | Use edge-compatible distributed rate limiting (Vercel KV, Upstash Redis, or Vercel's built-in rate limiting). |
| 8 | `src/middleware.ts` | **Rate limit maps grow unbounded.** `ipCounters` and `newsletterCounters` never prune expired entries. Over time (or under attack), this causes memory growth. | Add periodic cleanup or use a fixed-size LRU cache (e.g., `lru-cache` package). |
| 9 | `src/app/api/certificate/route.ts` | **No rate limiting.** Not in middleware matcher. Could be used for resource exhaustion (SVG generation). | Add to middleware matcher with reasonable rate limit. |
| 10 | `src/app/api/health/route.ts` | **No rate limiting.** Not in middleware matcher. Minor, but could be abused for uptime probing at scale. | Add to matcher or accept the risk (it's lightweight). |
| 11 | `src/app/api/scam-intel/[id]/route.ts`, `src/app/api/scam-intel/latest/route.ts` | **No rate limiting.** Not in middleware matcher despite being public-facing data endpoints. | Add `/api/scam-intel/:path*` to middleware matcher. |
| 12 | `src/app/api/stats/overview/route.ts`, `src/app/api/stats/provinces/route.ts` | **No rate limiting.** Not in middleware matcher. Expensive Supabase queries could be abused. | Add `/api/stats/:path*` to middleware matcher. |
| 13 | `src/app/api/claim/status/route.ts` | **Claim ID enumeration.** Claim IDs use `Math.random()` which is predictable. An attacker can enumerate claim IDs to discover all pending claims (domain, email, status). | Use `crypto.randomUUID()` or a cryptographically random ID. Also add rate limiting to the status endpoint. |
| 14 | `src/app/api/scan/route.ts` | **No input length validation on `input` field inside the handler.** Middleware checks `content-length` for `/api/scan`, but the actual `input` string length is unbounded within the JSON body. A small JSON envelope can contain a very large `input` string. | Add explicit `input.length` check (e.g., max 5000 chars) in the route handler. |

### LOW

| # | File | Finding | Recommendation |
|---|------|---------|----------------|
| 15 | `src/app/api/certificate/route.ts` | **Incomplete XSS sanitization in SVG.** Only strips `< > & " '` but doesn't handle other SVG injection vectors. The `safeName` is embedded in an SVG `<text>` element — while the current sanitization is likely sufficient for this context, consider using a proper XML escaping library. | Use a proper XML/HTML escape function. Current impl is acceptable but fragile. |
| 16 | `src/app/api/v1/entities/route.ts` | **Supabase `ilike` with user input.** `ilike('%${value}%')` — while Supabase parameterizes this, the `%` wildcards make the query expensive on large tables (sequential scan). | Add length validation on `value` param. Consider requiring a minimum length (3+ chars). |
| 17 | `src/app/api/community/reports/route.ts` | **No input validation on `province` field in POST.** The `province` value is passed directly to `submitScamReport` without validation against a known list. | Validate against a whitelist of Canadian province codes. |
| 18 | `next.config.ts` | **CSP allows `'unsafe-inline'` for both script-src and style-src.** This significantly weakens XSS protection. `unsafe-inline` for scripts essentially disables CSP's main benefit. | Use nonce-based CSP for scripts. `unsafe-inline` for styles is more acceptable but could use nonces too. |
| 19 | `src/app/api/feedback/route.ts` | **No rate limiting.** Not in middleware matcher. Users could spam feedback entries. | Add to middleware matcher. |

### INFO

| # | File | Finding | Recommendation |
|---|------|---------|----------------|
| 20 | All API routes | **No hardcoded secrets found in source code.** All API keys and tokens properly use `process.env`. ✅ | No action needed. |
| 21 | `src/app/api/scan/route.ts` | **Sensitive data redaction is applied.** SSN/SIN and credit card patterns are caught and rejected before processing. ✅ | Consider expanding patterns (e.g., passport numbers). |
| 22 | `src/middleware.ts` | **Admin routes are gated.** Both `/admin/` and `/tc47x/` paths require `TC_ADMIN_TOKEN`. ✅ | See HIGH #6 about query-string token exposure. |
| 23 | `next.config.ts` | **Good security headers present.** HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy all configured. ✅ | No action needed. |

---

## Middleware Coverage Gap Analysis

**Routes in middleware matcher:**
`/api/v1/*`, `/api/scan`, `/api/scan/*`, `/api/chat/analyze`, `/api/newsletter`, `/api/user-reports`, `/api/community/*`, `/api/partnerships`, `/api/feed/*`, `/api/phone/*`, `/tc47x/*`, `/admin/*`

**Routes NOT in middleware matcher (no rate limiting):**
- `/api/certificate` — SVG generation
- `/api/claim` — POST (has own internal rate limit by email, but no IP-based)
- `/api/claim/status` — GET (no rate limiting at all)
- `/api/digest` — GET (has own auth check, no rate limit)
- `/api/feedback` — POST
- `/api/feedback/summary` — GET (no auth, no rate limit)
- `/api/health` — GET
- `/api/scam-intel/[id]` — GET
- `/api/scam-intel/latest` — GET
- `/api/sms` — POST (Twilio webhook)
- `/api/stats/overview` — GET
- `/api/stats/provinces` — GET

---

## Priority Remediation Order

1. **CRITICAL #1** — Twilio signature validation (immediate)
2. **HIGH #2, #3** — SSRF via Host header manipulation (immediate)
3. **HIGH #6** — Move admin token out of query strings (this week)
4. **HIGH #4, #5** — Auth gaps on digest/feedback-summary (this week)
5. **MEDIUM #7** — Distributed rate limiting (before significant traffic)
6. **MEDIUM #9-12** — Add missing routes to middleware matcher (this week)
7. **LOW #18** — CSP nonce-based scripts (next sprint)
