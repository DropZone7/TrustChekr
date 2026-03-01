import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id || !id.startsWith("clm_")) {
    return NextResponse.json({ error: "Valid claim ID required." }, { status: 400 });
  }

  const { data, error } = await supabaseServer
    .from("website_claims")
    .select(
      "claim_id, domain, status, submitted_at, reviewed_at, reviewer_notes, verification_method"
    )
    .eq("claim_id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Claim not found." }, { status: 404 });
  }

  return NextResponse.json({ claim: data });
}
