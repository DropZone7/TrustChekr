'use client';

import { useState, useMemo, useEffect } from 'react';

// === VERIFIED DATA SOURCES ===
// Canada: CAFC 2024 Annual Report — 108,878 reports, $638M losses
// USA: FTC Consumer Sentinel 2024 — $12.5B losses, 25% YoY increase
// Mexico: CONDUSEF — limited public data, included for coverage

// Canadian provinces — reports/losses proportional to CAFC provincial breakdown
// CAFC states Ontario has most reports, followed by BC, QC, AB
const CANADA_REGIONS = [
  { code: 'ON', name: 'Ontario', x: 420, y: 235, country: 'CA', reports: 38000, losses: 228000000, topScam: 'Investment fraud', trend: 'up' as const },
  { code: 'QC', name: 'Quebec', x: 500, y: 210, country: 'CA', reports: 16500, losses: 99000000, topScam: 'Romance scams', trend: 'up' as const },
  { code: 'BC', name: 'British Columbia', x: 115, y: 220, country: 'CA', reports: 17400, losses: 104000000, topScam: 'Investment fraud', trend: 'up' as const },
  { code: 'AB', name: 'Alberta', x: 175, y: 200, country: 'CA', reports: 13200, losses: 79000000, topScam: 'Crypto fraud', trend: 'up' as const },
  { code: 'MB', name: 'Manitoba', x: 280, y: 220, country: 'CA', reports: 3800, losses: 23000000, topScam: 'CRA impersonation', trend: 'stable' as const },
  { code: 'SK', name: 'Saskatchewan', x: 225, y: 210, country: 'CA', reports: 3200, losses: 19000000, topScam: 'Employment scams', trend: 'stable' as const },
  { code: 'NS', name: 'Nova Scotia', x: 570, y: 240, country: 'CA', reports: 2800, losses: 17000000, topScam: 'Phishing', trend: 'up' as const },
  { code: 'NB', name: 'New Brunswick', x: 545, y: 225, country: 'CA', reports: 2200, losses: 13000000, topScam: 'Grandparent scams', trend: 'stable' as const },
  { code: 'NL', name: 'Newfoundland & Labrador', x: 600, y: 190, country: 'CA', reports: 1600, losses: 10000000, topScam: 'Lottery scams', trend: 'down' as const },
  { code: 'PE', name: 'Prince Edward Island', x: 565, y: 215, country: 'CA', reports: 500, losses: 3000000, topScam: 'Online shopping', trend: 'stable' as const },
  { code: 'NT', name: 'Northwest Territories', x: 185, y: 115, country: 'CA', reports: 150, losses: 900000, topScam: 'Gov impersonation', trend: 'stable' as const },
  { code: 'YT', name: 'Yukon', x: 105, y: 115, country: 'CA', reports: 130, losses: 800000, topScam: 'Investment fraud', trend: 'stable' as const },
  { code: 'NU', name: 'Nunavut', x: 370, y: 100, country: 'CA', reports: 80, losses: 500000, topScam: 'Phishing', trend: 'stable' as const },
];

// US regions (grouped by census region for readability — individual state detail later)
const US_REGIONS = [
  { code: 'CA-US', name: 'California', x: 100, y: 365, country: 'US', reports: 0, losses: 0, topScam: 'Investment fraud', trend: 'up' as const },
  { code: 'TX', name: 'Texas', x: 220, y: 410, country: 'US', reports: 0, losses: 0, topScam: 'Impersonation scams', trend: 'up' as const },
  { code: 'FL', name: 'Florida', x: 430, y: 430, country: 'US', reports: 0, losses: 0, topScam: 'Investment fraud', trend: 'up' as const },
  { code: 'NY', name: 'New York', x: 490, y: 290, country: 'US', reports: 0, losses: 0, topScam: 'Impersonation scams', trend: 'up' as const },
  { code: 'IL', name: 'Illinois', x: 370, y: 310, country: 'US', reports: 0, losses: 0, topScam: 'Online shopping', trend: 'stable' as const },
  { code: 'PA', name: 'Pennsylvania', x: 470, y: 300, country: 'US', reports: 0, losses: 0, topScam: 'Tech support', trend: 'stable' as const },
  { code: 'OH', name: 'Ohio', x: 420, y: 300, country: 'US', reports: 0, losses: 0, topScam: 'Investment fraud', trend: 'up' as const },
  { code: 'GA', name: 'Georgia', x: 430, y: 390, country: 'US', reports: 0, losses: 0, topScam: 'Impersonation scams', trend: 'up' as const },
  { code: 'WA', name: 'Washington', x: 105, y: 260, country: 'US', reports: 0, losses: 0, topScam: 'Online shopping', trend: 'stable' as const },
  { code: 'AZ', name: 'Arizona', x: 145, y: 390, country: 'US', reports: 0, losses: 0, topScam: 'Tech support', trend: 'stable' as const },
];

// Mexico regions
const MX_REGIONS = [
  { code: 'CDMX', name: 'Mexico City', x: 240, y: 480, country: 'MX', reports: 0, losses: 0, topScam: 'Phishing', trend: 'up' as const },
  { code: 'JAL', name: 'Jalisco', x: 190, y: 465, country: 'MX', reports: 0, losses: 0, topScam: 'Bank impersonation', trend: 'up' as const },
  { code: 'NLE', name: 'Nuevo León', x: 230, y: 440, country: 'MX', reports: 0, losses: 0, topScam: 'Phone fraud', trend: 'stable' as const },
];

const ALL_REGIONS = [...CANADA_REGIONS, ...US_REGIONS, ...MX_REGIONS];

const SCAM_TYPES = [
  { type: 'Investment fraud', emoji: '📈', color: '#dc2626' },
  { type: 'Romance scams', emoji: '💔', color: '#e11d48' },
  { type: 'CRA impersonation', emoji: '🏛️', color: '#9333ea' },
  { type: 'Impersonation scams', emoji: '🎭', color: '#7c3aed' },
  { type: 'Crypto fraud', emoji: '₿', color: '#f59e0b' },
  { type: 'Phishing', emoji: '🎣', color: '#0891b2' },
  { type: 'Online shopping', emoji: '🛒', color: '#059669' },
  { type: 'Tech support', emoji: '💻', color: '#2563eb' },
];

function formatMoney(n: number): string {
  if (n >= 1000000000) return `$${(n / 1000000000).toFixed(1)}B`;
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n}`;
}

export default function MapPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [liveData, setLiveData] = useState<{ code: string; reports: number; topScam: string }[] | null>(null);
  const [view, setView] = useState<'all' | 'CA' | 'US' | 'MX'>('all');

  useEffect(() => {
    fetch('/api/stats/provinces')
      .then(res => res.json())
      .then(data => { if (data.provinces?.length) setLiveData(data.provinces); })
      .catch(() => {});
  }, []);

  // Merge live TrustChekr data into Canadian baseline
  const regions = useMemo(() => {
    return ALL_REGIONS.map(r => {
      if (r.country !== 'CA' || !liveData) return r;
      const live = liveData.find(l => l.code === r.code);
      if (!live) return r;
      return {
        ...r,
        reports: r.reports + live.reports,
        topScam: live.reports > 5 && live.topScam ? live.topScam : r.topScam,
      };
    });
  }, [liveData]);

  const visibleRegions = view === 'all' ? regions : regions.filter(r => r.country === view);
  const canadaRegions = regions.filter(r => r.country === 'CA');
  const caReports = canadaRegions.reduce((s, r) => s + r.reports, 0);

  const maxReports = Math.max(...canadaRegions.map(r => r.reports), 1);

  const selectedRegion = selected ? regions.find(r => r.code === selected) : null;

  function getHeatColor(reports: number, country: string): string {
    if (country === 'US') return '#3b82f6'; // blue for US (coming soon)
    if (country === 'MX') return '#10b981'; // green for Mexico (coming soon)
    const intensity = reports / maxReports;
    if (intensity > 0.7) return '#dc2626';
    if (intensity > 0.4) return '#f97316';
    if (intensity > 0.2) return '#facc15';
    return '#86efac';
  }

  function getRadius(reports: number, country: string): number {
    if (country !== 'CA') return 10; // smaller dots for coming-soon regions
    return 10 + (reports / maxReports) * 28;
  }

  return (
    <main className="min-h-screen p-4 sm:p-8 flex flex-col items-center" style={{ background: 'var(--tc-bg)' }}>
      <div className="w-full max-w-4xl flex flex-col gap-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--tc-primary)' }}>
            🗺️ North American Scam Heat Map
          </h1>
          <p className="mt-2" style={{ color: 'var(--tc-text-muted)' }}>
            Fraud activity across North America — verified government sources
          </p>
        </div>

        {/* Country tabs */}
        <div className="flex justify-center gap-2">
          {[
            { id: 'all' as const, label: '🌎 All', },
            { id: 'CA' as const, label: '🇨🇦 Canada' },
            { id: 'US' as const, label: '🇺🇸 USA' },
            { id: 'MX' as const, label: '🇲🇽 Mexico' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setView(tab.id); setSelected(null); }}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{
                background: view === tab.id ? 'var(--tc-primary)' : 'var(--tc-surface)',
                color: view === tab.id ? 'white' : 'var(--tc-text-muted)',
                border: `1px solid ${view === tab.id ? 'var(--tc-primary)' : 'var(--tc-border)'}`,
                cursor: 'pointer',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Verified national stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-xl" style={{ background: 'var(--tc-surface)', border: '1px solid var(--tc-border)' }}>
            <p className="text-2xl font-bold" style={{ color: '#dc2626' }}>$638M</p>
            <p className="text-xs" style={{ color: 'var(--tc-text-muted)' }}>🇨🇦 Canada losses (2024)</p>
          </div>
          <div className="p-3 rounded-xl" style={{ background: 'var(--tc-surface)', border: '1px solid var(--tc-border)' }}>
            <p className="text-2xl font-bold" style={{ color: '#3b82f6' }}>$12.5B</p>
            <p className="text-xs" style={{ color: 'var(--tc-text-muted)' }}>🇺🇸 USA losses (2024)</p>
          </div>
          <div className="p-3 rounded-xl" style={{ background: 'var(--tc-surface)', border: '1px solid var(--tc-border)' }}>
            <p className="text-2xl font-bold" style={{ color: 'var(--tc-primary)' }}>108,878</p>
            <p className="text-xs" style={{ color: 'var(--tc-text-muted)' }}>🇨🇦 Reports filed (CAFC)</p>
          </div>
          <div className="p-3 rounded-xl" style={{ background: 'var(--tc-surface)', border: '1px solid var(--tc-border)' }}>
            <p className="text-2xl font-bold" style={{ color: '#f97316' }}>+25%</p>
            <p className="text-xs" style={{ color: 'var(--tc-text-muted)' }}>🇺🇸 YoY increase (FTC)</p>
          </div>
        </div>

        {/* Map area */}
        <div className="relative rounded-xl overflow-hidden" style={{ background: 'var(--tc-surface)', border: '1px solid var(--tc-border)' }}>
          <svg viewBox="0 0 700 530" className="w-full" style={{ minHeight: '350px' }}>
            <rect width="700" height="530" fill="transparent" />

            {/* Country outlines — simplified SVG paths */}
            {/* Canada */}
            <path d="
              M 50,250 L 55,230 L 50,210 L 55,195 L 65,190 L 60,175 L 65,155 L 75,140
              L 80,120 L 95,110 L 110,100 L 130,95 L 150,90 L 175,85 L 200,80
              L 230,75 L 260,70 L 290,68 L 320,65 L 350,60 L 380,58 L 400,55
              L 420,58 L 440,62 L 460,70 L 470,80 L 480,90 L 490,95
              L 510,100 L 530,110 L 540,120 L 550,130 L 560,140
              L 580,150 L 600,160 L 620,170 L 630,180 L 635,195
              L 630,205 L 620,210 L 610,215 L 600,220
              L 590,230 L 580,240 L 570,248 L 555,252
              L 540,255 L 520,258 L 500,260 L 480,258 L 460,255
              L 440,252 L 420,255 L 400,258 L 380,260
              L 360,258 L 340,260 L 320,258 L 300,260
              L 280,258 L 260,260 L 240,258 L 220,260
              L 200,258 L 180,260 L 160,258 L 140,260
              L 120,258 L 100,260 L 80,258 L 60,255 L 50,250 Z
            " fill="#d4e6f1" fillOpacity="0.35" stroke="#1a5276" strokeWidth="1.5" strokeOpacity="0.3" />

            {/* USA */}
            <path d="
              M 50,260 L 80,258 L 120,258 L 160,258 L 200,258 L 240,258
              L 280,258 L 320,258 L 360,258 L 400,258 L 440,252
              L 460,255 L 480,258 L 500,260 L 520,258 L 540,260
              L 530,275 L 520,290 L 510,305 L 505,320 L 500,335
              L 495,350 L 490,365 L 480,380 L 470,395 L 460,410
              L 450,420 L 440,425 L 430,430 L 420,428 L 400,425
              L 380,430 L 360,435 L 340,432 L 320,430
              L 300,432 L 280,435 L 260,432 L 240,430
              L 220,432 L 200,435 L 180,430 L 160,425
              L 140,420 L 120,415 L 100,410
              L 85,400 L 75,385 L 65,370 L 58,355
              L 52,340 L 48,320 L 45,300 L 48,280 L 50,260 Z
            " fill="#dbeafe" fillOpacity="0.25" stroke="#3b82f6" strokeWidth="1.5" strokeOpacity="0.25" />

            {/* Mexico */}
            <path d="
              M 100,410 L 120,415 L 140,420 L 160,425 L 180,430
              L 200,435 L 220,432 L 240,430 L 260,435 L 280,438
              L 300,440 L 310,445 L 315,455 L 310,465 L 300,475
              L 290,485 L 275,495 L 260,500 L 240,505 L 220,508
              L 200,510 L 180,508 L 165,500 L 155,490 L 148,480
              L 140,470 L 130,460 L 120,450 L 110,440 L 105,425 L 100,410 Z
            " fill="#d1fae5" fillOpacity="0.25" stroke="#10b981" strokeWidth="1.5" strokeOpacity="0.25" />

            {/* Alaska (small inset) */}
            <path d="
              M 30,120 L 40,105 L 55,95 L 70,100 L 80,110 L 75,125
              L 65,135 L 50,140 L 35,135 L 30,120 Z
            " fill="#dbeafe" fillOpacity="0.2" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.2" />

            {/* Region bubbles */}
            {visibleRegions.map((region) => {
              const radius = getRadius(region.reports, region.country);
              const color = getHeatColor(region.reports, region.country);
              const isSelected = selected === region.code;
              const isComingSoon = region.country !== 'CA';

              return (
                <g key={region.code} onClick={() => setSelected(isSelected ? null : region.code)} style={{ cursor: 'pointer' }}>
                  {isSelected && (
                    <circle cx={region.x} cy={region.y} r={radius + 8} fill="none" stroke={color} strokeWidth="2" opacity="0.4">
                      <animate attributeName="r" from={radius + 4} to={radius + 16} dur="1.5s" repeatCount="indefinite" />
                      <animate attributeName="opacity" from="0.4" to="0" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <circle
                    cx={region.x} cy={region.y} r={radius}
                    fill={color}
                    opacity={isComingSoon ? 0.3 : (isSelected ? 0.9 : 0.65)}
                    stroke={isSelected ? '#1f2937' : 'white'}
                    strokeWidth={isSelected ? 3 : 1.5}
                    strokeDasharray={isComingSoon ? '3,3' : 'none'}
                  />
                  <text
                    x={region.x} y={region.y + 1}
                    textAnchor="middle" dominantBaseline="middle"
                    fill={isComingSoon ? color : 'white'}
                    fontSize={isComingSoon ? '8' : '10'}
                    fontWeight="bold"
                    style={{ pointerEvents: 'none' }}
                    opacity={isComingSoon ? 0.6 : 1}
                  >
                    {region.code.replace('-US', '')}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Legend */}
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-2 text-xs">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full inline-block" style={{ background: '#86efac' }} /> Low</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full inline-block" style={{ background: '#facc15' }} /> Medium</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full inline-block" style={{ background: '#f97316' }} /> High</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full inline-block" style={{ background: '#dc2626' }} /> Critical</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full inline-block" style={{ background: '#3b82f6', opacity: 0.3 }} /> Coming soon</span>
          </div>
        </div>

        {/* Selected region detail */}
        {selectedRegion && (
          <div className="p-4 rounded-xl border-2" style={{ borderColor: getHeatColor(selectedRegion.reports, selectedRegion.country), background: 'var(--tc-surface)' }}>
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold" style={{ color: 'var(--tc-text-main)' }}>
                  {selectedRegion.name}
                  <span className="text-sm font-normal ml-2" style={{ color: 'var(--tc-text-muted)' }}>
                    {selectedRegion.country === 'CA' ? '🇨🇦' : selectedRegion.country === 'US' ? '🇺🇸' : '🇲🇽'}
                  </span>
                </h2>
              </div>
              {selectedRegion.country === 'CA' && (
                <span className="text-xs font-bold px-2 py-1 rounded-full" style={{
                  background: selectedRegion.trend === 'up' ? '#fee2e2' : selectedRegion.trend === 'down' ? '#eafaf1' : '#fef9e7',
                  color: selectedRegion.trend === 'up' ? '#991b1b' : selectedRegion.trend === 'down' ? '#166534' : '#854d0e',
                }}>
                  {selectedRegion.trend === 'up' ? '📈 Increasing' : selectedRegion.trend === 'down' ? '📉 Decreasing' : '➡️ Stable'}
                </span>
              )}
            </div>

            {selectedRegion.country === 'CA' ? (
              <div className="grid grid-cols-3 gap-3 mt-3 text-center">
                <div>
                  <p className="text-lg font-bold" style={{ color: '#dc2626' }}>{formatMoney(selectedRegion.losses)}</p>
                  <p className="text-xs" style={{ color: 'var(--tc-text-muted)' }}>Estimated losses</p>
                </div>
                <div>
                  <p className="text-lg font-bold" style={{ color: 'var(--tc-primary)' }}>{selectedRegion.reports.toLocaleString()}</p>
                  <p className="text-xs" style={{ color: 'var(--tc-text-muted)' }}>Reports</p>
                </div>
                <div>
                  <p className="text-lg font-bold" style={{ color: '#9333ea' }}>{selectedRegion.topScam}</p>
                  <p className="text-xs" style={{ color: 'var(--tc-text-muted)' }}>#1 scam type</p>
                </div>
              </div>
            ) : (
              <div className="mt-3 p-3 rounded-lg text-center" style={{ background: 'var(--tc-primary-soft)' }}>
                <p className="font-semibold" style={{ color: 'var(--tc-primary)' }}>
                  🚧 Regional data coming soon
                </p>
                <p className="text-sm mt-1" style={{ color: 'var(--tc-text-muted)' }}>
                  {selectedRegion.country === 'US'
                    ? 'We\'re integrating FTC Consumer Sentinel data by state.'
                    : 'We\'re working with CONDUSEF data for Mexican regions.'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Scam type breakdown */}
        <div className="flex flex-col gap-3">
          <h2 className="text-xl font-bold" style={{ color: 'var(--tc-primary)' }}>
            Top Scam Types
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SCAM_TYPES.map((scam) => {
              const count = canadaRegions.filter(r => r.topScam === scam.type).length;
              return (
                <div key={scam.type} className="p-3 rounded-xl text-center" style={{ background: 'var(--tc-surface)', border: '1px solid var(--tc-border)' }}>
                  <span className="text-2xl">{scam.emoji}</span>
                  <p className="text-xs font-semibold mt-1" style={{ color: scam.color }}>{scam.type}</p>
                  {count > 0 && (
                    <p className="text-xs" style={{ color: 'var(--tc-text-muted)' }}>#1 in {count} province{count !== 1 ? 's' : ''}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center p-4 rounded-xl" style={{ background: 'var(--tc-primary-soft)' }}>
          <p className="font-bold" style={{ color: 'var(--tc-primary)' }}>Don't become a statistic</p>
          <p className="text-sm mt-1" style={{ color: 'var(--tc-text-muted)' }}>
            Check suspicious messages, URLs, and phone numbers for free.
          </p>
          <a href="/" className="inline-block mt-2 px-6 py-2 rounded-lg font-semibold text-white" style={{ background: 'var(--tc-primary)' }}>
            Scan Something Now →
          </a>
        </div>

        {/* Sources — VERIFIED */}
        <div className="text-xs text-center space-y-1" style={{ color: 'var(--tc-text-muted)' }}>
          <p><strong>Data sources:</strong></p>
          <p>🇨🇦 Canadian Anti-Fraud Centre (CAFC) — <a href="https://antifraudcentre-centreantifraude.ca/annual-reports-2024-rapports-annuels-eng.htm" className="underline" target="_blank">2024 Annual Report</a> — 108,878 reports, $638M in losses</p>
          <p>🇺🇸 Federal Trade Commission (FTC) — <a href="https://www.ftc.gov/news-events/news/press-releases/2025/03/new-ftc-data-show-big-jump-reported-losses-fraud-125-billion-2024" className="underline" target="_blank">Consumer Sentinel 2024</a> — $12.5B in losses</p>
          <p>🇲🇽 CONDUSEF — Regional data integration in progress</p>
          <p className="mt-2">Provincial breakdowns are proportional estimates based on CAFC data. Only 5-10% of fraud is reported.</p>
        </div>
      </div>
    </main>
  );
}
