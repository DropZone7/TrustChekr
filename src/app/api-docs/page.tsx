import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'API Documentation',
  description: 'Integrate TrustChekr scam detection into your app. Free public API for researchers, journalists, and developers.',
};

export default function APIDocsPage() {
  return (
    <main className="min-h-screen p-4 sm:p-8 flex flex-col items-center" style={{ background: 'var(--tc-bg)' }}>
      <div className="w-full max-w-3xl flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--tc-primary)' }}>
            🔌 TrustChekr API
          </h1>
          <p className="mt-2" style={{ color: 'var(--tc-text-muted)' }}>
            Free public API for scam detection and entity lookup. For researchers, journalists, and developers.
          </p>
        </div>

        {/* Scan API */}
        <div className="p-5 rounded-xl" style={{ background: 'var(--tc-surface)', border: '1px solid var(--tc-border)' }}>
          <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--tc-primary)' }}>POST /api/v1/scan</h2>
          <p className="text-sm mb-3" style={{ color: 'var(--tc-text-muted)' }}>Scan any input for scam indicators.</p>

          <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--tc-text-muted)' }}>Request</p>
          <pre className="p-3 rounded-lg text-sm overflow-x-auto" style={{ background: '#1f2937', color: '#e5e7eb' }}>{`POST https://trustchekr.com/api/v1/scan
Content-Type: application/json

{
  "type": "website",   // website | email | phone | crypto | message
  "input": "https://suspicious-site.com"
}`}</pre>

          <p className="text-xs font-bold uppercase tracking-wide mt-3 mb-1" style={{ color: 'var(--tc-text-muted)' }}>Response</p>
          <pre className="p-3 rounded-lg text-sm overflow-x-auto" style={{ background: '#1f2937', color: '#e5e7eb' }}>{`{
  "riskLevel": "suspicious",       // safe | suspicious | high-risk | very-likely-scam
  "whyBullets": [                   // Human-readable risk signals
    "Domain registered 3 days ago",
    "URL flagged by 2/70 security vendors"
  ],
  "nextSteps": [...],               // Recommended actions
  "graph": {                        // Entity graph intelligence
    "network_risk_score": 0.35,
    "network_risk_label": "MEDIUM"
  },
  "ai_detection": {                 // AI text analysis (message type only)
    "ai_probability": 0.82,
    "label": "AI_GENERATED"
  },
  "overall_risk_score": 0.42,
  "overall_risk_label": "MEDIUM",
  "api_version": "v1",
  "scanned_at": "2026-02-27T20:00:00.000Z"
}`}</pre>
        </div>

        {/* Entity API */}
        <div className="p-5 rounded-xl" style={{ background: 'var(--tc-surface)', border: '1px solid var(--tc-border)' }}>
          <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--tc-primary)' }}>GET /api/v1/entities</h2>
          <p className="text-sm mb-3" style={{ color: 'var(--tc-text-muted)' }}>Search the TrustChekr entity database.</p>

          <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--tc-text-muted)' }}>Parameters</p>
          <div className="flex flex-col gap-1 text-sm mb-3">
            {[
              { param: 'type', desc: 'Filter by type: email, phone, url, domain, crypto_wallet' },
              { param: 'value', desc: 'Search by value (partial match)' },
              { param: 'confirmed', desc: 'Set to "true" for confirmed scam entities only' },
              { param: 'limit', desc: 'Results per page (max 100, default 20)' },
            ].map(({ param, desc }) => (
              <div key={param} className="flex gap-2">
                <code className="text-xs px-1.5 py-0.5 rounded font-mono" style={{ background: 'var(--tc-primary-soft)', color: 'var(--tc-primary)' }}>{param}</code>
                <span style={{ color: 'var(--tc-text-muted)' }}>{desc}</span>
              </div>
            ))}
          </div>

          <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--tc-text-muted)' }}>Example</p>
          <pre className="p-3 rounded-lg text-sm overflow-x-auto" style={{ background: '#1f2937', color: '#e5e7eb' }}>{`GET https://trustchekr.com/api/v1/entities?type=phone&confirmed=true&limit=10

{
  "entities": [
    {
      "type": "phone",
      "value": "+14165551234",
      "report_count": 47,
      "confirmed_scam": true,
      "first_seen": "2026-01-15",
      "last_seen": "2026-02-27"
    }
  ],
  "count": 1,
  "api_version": "v1"
}`}</pre>
        </div>

        {/* Widget */}
        <div className="p-5 rounded-xl" style={{ background: 'var(--tc-surface)', border: '1px solid var(--tc-border)' }}>
          <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--tc-primary)' }}>🧩 Embeddable Widget</h2>
          <p className="text-sm mb-3" style={{ color: 'var(--tc-text-muted)' }}>Add a scam scanner to any website with one line of code.</p>
          <pre className="p-3 rounded-lg text-sm overflow-x-auto" style={{ background: '#1f2937', color: '#e5e7eb' }}>{`<script src="https://trustchekr.com/widget.js"></script>`}</pre>
          <p className="text-sm mt-2" style={{ color: 'var(--tc-text-muted)' }}>
            The widget auto-renders a branded TrustChekr scanner. Optionally add{' '}
            <code className="text-xs px-1 py-0.5 rounded" style={{ background: 'var(--tc-primary-soft)' }}>&lt;div id=&quot;trustchekr-widget&quot;&gt;&lt;/div&gt;</code> to control placement.
          </p>
        </div>

        {/* Terms */}
        <div className="p-4 rounded-xl text-center" style={{ background: 'var(--tc-primary-soft)' }}>
          <p className="text-sm" style={{ color: 'var(--tc-primary)' }}>
            <strong>Free for research and non-commercial use.</strong><br />
            Commercial API access and custom integrations: partnerships@trustchekr.com
          </p>
        </div>
      </div>
    </main>
  );
}
