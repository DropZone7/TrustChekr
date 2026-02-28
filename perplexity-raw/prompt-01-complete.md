# Prompt 1 — Complete (Trust Score Page + Types + Actions + Print + API Mock)
# Status: SAVED, READY FOR MERGE
# Files to create:
# - src/lib/scan/types.ts
# - src/components/TrustScoreActions.tsx  
# - src/app/check/[domain]/page.tsx
# - src/app/check/[domain]/print/page.tsx (print-friendly)
# - src/app/api/check/route.ts (mock/stub)

## Known Issues to Fix:
# 1. "Likely safe" text → must change to "Low Risk" (Moffatt compliance)
# 2. <style jsx global> → not supported in App Router server components, use <style> tag
# 3. generateMetadata params need await in Next.js 16
# 4. domainInfo.registrar || 'Unknown' — Perplexity stripped the || operators
# 5. Dark mode vars may conflict with existing DarkModeToggle
# 6. exportData() is client-side but in server component — fixed by TrustScoreActions
# 7. fetch URL needs process.env.NEXT_PUBLIC_BASE_URL or relative URL
