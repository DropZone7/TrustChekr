# X/Twitter API Display Terms Research

**Date:** March 1, 2026  
**Purpose:** Determine what TrustChekr can display from X data on our website

## Key Findings

### 1. Can we display analysis/summaries derived from X data?

**YES — with conditions.**

Per X's Developer Policy (restricted use cases page):
> "Aggregate analysis of X content that does not store any personal data (for example, user IDs, usernames, and other identifiers) is permitted, provided that the analysis also complies with applicable laws and all parts of the Developer Agreement and Policy."

This is exactly what TrustChekr's Scam Radar does — we show aggregate threat levels and trend categories, NOT individual posts or user data.

### 2. Can we show post counts/trends without embedding actual tweets?

**YES.**

Aggregate counts (e.g., "247 posts about CRA scams in the last 24h") are permitted as long as:
- No personal data (usernames, user IDs) is stored or displayed
- No individual tweet content is reproduced outside of embedded tweets
- The data complies with X's Developer Agreement

Our approach of showing category-level threat indicators with post counts is compliant.

### 3. Do we need to attribute X as a data source?

**Recommended but specifics vary.**

X's Display Requirements primarily govern how individual tweets are rendered (must use embeds or follow specific formatting). For aggregate data, there's no explicit attribution requirement in the Developer Policy, but best practice is to include attribution.

**Our approach:** Include "Powered by real-time X data" in small text — this is good practice and adds credibility.

### 4. Are there restrictions on commercial use of x_search results?

**This is where it gets nuanced.**

We're using the **xAI API** (Grok with x_search tool), not the traditional X/Twitter API directly. Key distinctions:

- **xAI Enterprise ToS:** Output from the API is owned by the user. You retain ownership of User Content (Input + Output).
- **x_search is a Grok tool**, not a Twitter API endpoint. The data flows through Grok's model, making our output AI-generated analysis rather than raw X data.
- **xAI Acceptable Use Policy** prohibits illegal use but doesn't restrict commercial use of API output.

**Important:** Since we're getting Grok's *analysis* of X posts (not raw tweet data), we're in a stronger position. We're displaying AI-derived threat intelligence, not reproducing tweets.

## Risk Assessment

| Aspect | Risk Level | Notes |
|--------|-----------|-------|
| Showing aggregate threat levels | ✅ Low | Explicitly permitted by X Developer Policy |
| Post count indicators | ✅ Low | Aggregate, no PII |
| Category descriptions (AI-generated) | ✅ Low | Grok output, not raw tweets |
| "Powered by X data" attribution | ✅ Good practice | Adds credibility, shows transparency |
| Displaying individual tweets | ⚠️ Medium | Must use embeds — we don't do this |
| Storing usernames/user IDs | 🔴 Not allowed | We don't do this |

## Recommendations for TrustChekr

1. **Continue with current approach** — aggregate threat levels are clearly permitted
2. **Never display individual tweet content** unless using official embeds
3. **Never store or display usernames/user IDs** from X data
4. **Keep the "Powered by real-time X data" attribution** — transparency is good
5. **Store only aggregate/derived data** in scam-trends.json (threat levels, counts, descriptions)
6. **If we ever want to show specific posts**, use Twitter's official embed widgets

## Sources

- X Developer Policy: https://developer.x.com/en/developer-terms/policy
- X Display Requirements: https://developer.x.com/en/developer-terms/display-requirements
- X Restricted Use Cases: https://developer.twitter.com/en/developer-terms/more-on-restricted-use-cases
- xAI Terms of Service (Consumer): https://x.ai/legal/terms-of-service
- xAI Terms of Service (Enterprise): https://x.ai/legal/terms-of-service-enterprise
- xAI Acceptable Use Policy: https://x.ai/legal/acceptable-use-policy
