# Prompt 5 — COMPLETE (Phone Scanner + Unified Router + Health)
# Files to create:
# - src/lib/scan/types.ts (shared types)
# - src/lib/scan/phoneScan.ts (phone analysis module)
# - src/app/api/scan/phone/route.ts (standalone phone endpoint)
# - src/app/api/health/route.ts (health check)
# Status: ALL CODE RECEIVED
# 
# CRITICAL: DO NOT replace existing src/app/api/scan/route.ts!
# Prompt 5 includes a "unified dispatcher" that would REPLACE our existing scan API.
# Our existing route.ts has 20+ modules wired in. Must MERGE phone module into existing, not replace.
#
# Issues:
# - missing || operators throughout (body?.phone || '', etc.)
# - Perplexity's unified scan route would DESTROY our existing 280-line route — must merge only phone module
# - src/lib/scan/types.ts may conflict with existing src/lib/types.ts — need to reconcile
# - phoneScan.ts is solid — standalone module, no conflicts
# - CANADIAN_SPOOF_AREA_CODES only has 3 codes — should expand
# - AREA_CODE_REGION_MAP needs all Canadian area codes
# - health route is clean, no conflicts
