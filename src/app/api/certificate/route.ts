import { NextRequest, NextResponse } from 'next/server';

// Generate an SVG certificate — can be converted to PDF/PNG client-side
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get('name') ?? 'Participant';
  const modules = searchParams.get('modules') ?? '8';
  const date = searchParams.get('date') ?? new Date().toLocaleDateString('en-CA');

  // Sanitize inputs
  const safeName = name.replace(/[<>&"']/g, '').slice(0, 60);
  const safeModules = Math.min(8, Math.max(1, parseInt(modules) || 8));

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 560" width="800" height="560">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f0fdf4"/>
      <stop offset="100%" style="stop-color:#ecfdf5"/>
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="800" height="560" fill="url(#bg)" rx="0"/>
  
  <!-- Border -->
  <rect x="20" y="20" width="760" height="520" fill="none" stroke="#1a6b64" stroke-width="3" rx="8"/>
  <rect x="28" y="28" width="744" height="504" fill="none" stroke="#1a6b64" stroke-width="1" rx="6" stroke-dasharray="4,4"/>
  
  <!-- Shield icon -->
  <text x="400" y="90" text-anchor="middle" font-size="48">🛡️</text>
  
  <!-- Title -->
  <text x="400" y="130" text-anchor="middle" font-family="Georgia, serif" font-size="14" fill="#6b7280" letter-spacing="4">CERTIFICATE OF COMPLETION</text>
  
  <!-- Org name -->
  <text x="400" y="165" text-anchor="middle" font-family="Georgia, serif" font-size="22" fill="#1a6b64" font-weight="bold">TrustChekr Online Safety Academy</text>
  
  <!-- Divider -->
  <line x1="200" y1="185" x2="600" y2="185" stroke="#1a6b64" stroke-width="1" opacity="0.3"/>
  
  <!-- This certifies -->
  <text x="400" y="220" text-anchor="middle" font-family="Georgia, serif" font-size="13" fill="#6b7280">This certifies that</text>
  
  <!-- Name -->
  <text x="400" y="270" text-anchor="middle" font-family="Georgia, serif" font-size="36" fill="#1f2937" font-weight="bold">${safeName}</text>
  
  <!-- Underline for name -->
  <line x1="180" y1="280" x2="620" y2="280" stroke="#1a6b64" stroke-width="1" opacity="0.4"/>
  
  <!-- Has completed -->
  <text x="400" y="320" text-anchor="middle" font-family="Georgia, serif" font-size="14" fill="#6b7280">has successfully completed ${safeModules} of 8 modules in the</text>
  <text x="400" y="345" text-anchor="middle" font-family="Georgia, serif" font-size="16" fill="#1a6b64" font-weight="bold">Elder &amp; Family Online Safety Program</text>
  
  <!-- Topics covered -->
  <text x="400" y="380" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#6b7280">
    Phone Scams · Bank &amp; CRA Fraud · Tech Support Scams · Romance Scams · Phishing · Social Media Safety
  </text>
  
  <!-- Date -->
  <text x="400" y="430" text-anchor="middle" font-family="Georgia, serif" font-size="13" fill="#6b7280">Issued: ${date}</text>
  
  <!-- Signatures area -->
  <line x1="120" y1="480" x2="320" y2="480" stroke="#1a6b64" stroke-width="1"/>
  <text x="220" y="500" text-anchor="middle" font-family="Georgia, serif" font-size="11" fill="#6b7280">TrustChekr Safety Academy</text>
  
  <line x1="480" y1="480" x2="680" y2="480" stroke="#1a6b64" stroke-width="1"/>
  <text x="580" y="500" text-anchor="middle" font-family="Georgia, serif" font-size="11" fill="#6b7280">trustchekr.com/academy</text>
  
  <!-- Canada flag -->
  <text x="400" y="530" text-anchor="middle" font-size="16">🇨🇦</text>
  <text x="400" y="545" text-anchor="middle" font-family="Arial, sans-serif" font-size="9" fill="#9ca3af">Built in Canada · Free · Private</text>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'no-store',
    },
  });
}
