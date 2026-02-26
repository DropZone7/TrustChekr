import { NextRequest, NextResponse } from "next/server";
import { runScan } from "@/lib/scanner";

export async function POST(req: NextRequest) {
  try {
    const { type, input } = await req.json();

    if (!type || !input || typeof input !== "string" || input.trim().length === 0) {
      return NextResponse.json(
        { error: "Please provide something to check." },
        { status: 400 }
      );
    }

    // Redact obvious sensitive data before processing
    const sensitivePatterns = [
      /\b\d{3}[-.]?\d{2}[-.]?\d{4}\b/g, // SSN
      /\b\d{9}\b/g, // SIN
      /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, // Credit card
    ];

    let cleaned = input.trim();
    for (const pattern of sensitivePatterns) {
      if (pattern.test(cleaned)) {
        return NextResponse.json({
          warning: true,
          message:
            "It looks like you may have included sensitive information like a card number or government ID. Please remove that before checking — we don't need it and don't want to see it. Your safety comes first.",
        });
      }
    }

    const result = runScan(type, cleaned);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      {
        error:
          "Our system is having trouble right now, but your information is safe. Please try again in a few minutes.",
      },
      { status: 500 }
    );
  }
}
