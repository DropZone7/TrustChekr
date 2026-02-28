# Prompt 8 — COMPLETE (Scam Reporting Flow)
# Files:
# - src/app/report/page.tsx (server page + SEO metadata)
# - src/components/report/ScamReportForm.tsx (6-step wizard, evidence upload, CAFC forward)
# - src/app/api/user-reports/route.ts (POST handler)
# Status: MASTER PROMPT RECEIVED — Perplexity will generate actual code from this spec
# NOTE: We already HAVE /api/user-reports — must MERGE not replace
# CAFC URL: https://reportcyberandfraud.canada.ca/
# Issues to watch:
# - Existing report-a-scam page at different path — may need to redirect or replace
# - Must preserve existing rate limiting on /api/user-reports
# - Evidence images as base64 in POST body could hit payload limits — need size validation
# - EXIF stripping via FileReader.readAsDataURL is minimal — canvas re-render would be better
