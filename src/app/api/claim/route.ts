// src/app/api/claim/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

const DOMAIN_RE = /^(?:[a-z0-9](?:[a-z0-9\-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// In-memory rate limit (resets on cold start — fine for MVP)
const claimCounts = new Map<string, { count: number; resetAt: number }>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { domain, name, email, role, evidence, method } = body;

    // Validate
    if (!domain || !name || !email || !role || !evidence || !method) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const cleanDomain = domain.trim().toLowerCase().replace(/^https?:\/\//i, "").replace(/\/.*$/, "").replace(/^www\./, "");
    if (!DOMAIN_RE.test(cleanDomain)) {
      return NextResponse.json({ error: "Please enter a valid domain (e.g. example.com)." }, { status: 400 });
    }

    if (!EMAIL_RE.test(email.trim())) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    if (!["owner", "developer", "marketing", "other"].includes(role)) {
      return NextResponse.json({ error: "Invalid role." }, { status: 400 });
    }

    if (!["meta_tag", "dns_txt", "other_proof"].includes(method)) {
      return NextResponse.json({ error: "Invalid verification method." }, { status: 400 });
    }

    if (evidence.trim().length === 0 || evidence.length > 2000) {
      return NextResponse.json({ error: "Evidence must be between 1 and 2,000 characters." }, { status: 400 });
    }

    // Rate limit: 3 claims per email per 24h
    const emailKey = email.trim().toLowerCase();
    const now = Date.now();
    const limit = claimCounts.get(emailKey);
    if (limit && now < limit.resetAt) {
      if (limit.count >= 3) {
        return NextResponse.json({ error: "Too many claims from this email. Please wait 24 hours." }, { status: 429 });
      }
      limit.count++;
    } else {
      claimCounts.set(emailKey, { count: 1, resetAt: now + 86_400_000 });
    }

    // Generate claim ID
    const claimId = "clm_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

    // Store in Supabase
    const { error } = await supabaseServer
      .from("website_claims")
      .insert({
        claim_id: claimId,
        domain: cleanDomain,
        submitter_name: name.trim(),
        submitter_email: emailKey,
        submitter_role: role,
        evidence: evidence.trim().slice(0, 2000),
        verification_method: method,
        status: "pending",
        submitted_at: new Date().toISOString(),
      });

    if (error) {
      console.error("[Claim API] Insert error:", error.message);
      return NextResponse.json({ error: "Failed to save your claim. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ success: true, claimId }, { status: 201 });
  } catch (err: any) {
    console.error("[Claim API] Error:", err?.message);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

/*
-- Supabase migration: run once in SQL editor
create table if not exists website_claims (
  id bigint generated always as identity primary key,
  claim_id text not null unique,
  domain text not null,
  submitter_name text not null,
  submitter_email text not null,
  submitter_role text not null,
  evidence text not null,
  verification_method text not null,
  status text not null default 'pending',
  reviewer_notes text,
  reviewed_at timestamptz,
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists idx_website_claims_domain on website_claims (domain);
create index if not exists idx_website_claims_email on website_claims (submitter_email);
create index if not exists idx_website_claims_status on website_claims (status);

alter table website_claims enable row level security;
*/
