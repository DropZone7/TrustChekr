# Prompt 7 — COMPLETE (Phone Scam Pattern Database)
# Files:
# - src/lib/phone/scamPatterns.ts (22+ patterns, matchScamPattern, getPatternsByRegion, upsert/deactivate)
# - src/app/api/phone/scam-patterns/route.ts (GET with ?region=CA|US)
# - Integration helper: applyScamPatternsToPhoneResult()
# Status: MASTER PROMPT RECEIVED — Perplexity will generate the actual code from this spec
# NOTE: This was a PROMPT TEMPLATE, not generated code. Alex needs to send this to Perplexity to get the actual implementation.
# Issues to watch:
# - missing || operators in generated code
# - RegExp serialization in JSON responses
# - Must not conflict with existing phone analysis in src/lib/osint/
