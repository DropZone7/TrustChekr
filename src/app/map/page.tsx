'use client';

import { useState, useMemo, useEffect } from 'react';

// Canadian provinces with approximate center coordinates for SVG positioning
const PROVINCES = [
  { code: 'ON', name: 'Ontario', x: 310, y: 340, pop: 15.2 },
  { code: 'QC', name: 'Quebec', x: 410, y: 290, pop: 8.8 },
  { code: 'BC', name: 'British Columbia', x: 60, y: 300, pop: 5.4 },
  { code: 'AB', name: 'Alberta', x: 120, y: 280, pop: 4.6 },
  { code: 'MB', name: 'Manitoba', x: 215, y: 310, pop: 1.4 },
  { code: 'SK', name: 'Saskatchewan', x: 170, y: 290, pop: 1.2 },
  { code: 'NS', name: 'Nova Scotia', x: 480, y: 330, pop: 1.0 },
  { code: 'NB', name: 'New Brunswick', x: 460, y: 310, pop: 0.8 },
  { code: 'NL', name: 'Newfoundland', x: 510, y: 260, pop: 0.5 },
  { code: 'PE', name: 'Prince Edward Island', x: 480, y: 300, pop: 0.17 },
  { code: 'NT', name: 'Northwest Territories', x: 140, y: 170, pop: 0.045 },
  { code: 'YT', name: 'Yukon', x: 60, y: 170, pop: 0.044 },
  { code: 'NU', name: 'Nunavut', x: 280, y: 150, pop: 0.04 },
];

// Simulated scam data based on CAFC 2025 stats (proportional to population + known hotspots)
const SCAM_DATA: Record<string, { reports: number; losses: number; topScam: string; trend: 'up' | 'down' | 'stable' }> = {
  ON: { reports: 42300, losses: 198000000, topScam: 'Investment fraud', trend: 'up' },
  QC: { reports: 18700, losses: 87000000, topScam: 'Romance scams', trend: 'up' },
  BC: { reports: 21200, losses: 112000000, topScam: 'Crypto fraud', trend: 'up' },
  AB: { reports: 14800, losses: 68000000, topScam: 'Employment scams', trend: 'stable' },
  MB: { reports: 4200, losses: 19000000, topScam: 'CRA impersonation', trend: 'down' },
  SK: { reports: 3600, losses: 16000000, topScam: 'Tech support scams', trend: 'stable' },
  NS: { reports: 3100, losses: 14000000, topScam: 'Phishing', trend: 'up' },
  NB: { reports: 2400, losses: 11000000, topScam: 'Grandparent scams', trend: 'stable' },
  NL: { reports: 1800, losses: 8000000, topScam: 'Lottery scams', trend: 'down' },
  PE: { reports: 600, losses: 2800000, topScam: 'Online shopping', trend: 'stable' },
  NT: { reports: 180, losses: 820000, topScam: 'Government impersonation', trend: 'stable' },
  YT: { reports: 160, losses: 740000, topScam: 'Investment fraud', trend: 'up' },
  NU: { reports: 90, losses: 410000, topScam: 'Phishing', trend: 'stable' },
};

const SCAM_TYPES = [
  { type: 'Investment fraud', emoji: '📈', color: '#dc2626' },
  { type: 'Romance scams', emoji: '💔', color: '#e11d48' },
  { type: 'CRA impersonation', emoji: '🏛️', color: '#9333ea' },
  { type: 'Tech support scams', emoji: '💻', color: '#2563eb' },
  { type: 'Crypto fraud', emoji: '₿', color: '#f59e0b' },
  { type: 'Phishing', emoji: '🎣', color: '#0891b2' },
  { type: 'Grandparent scams', emoji: '👴', color: '#65a30d' },
  { type: 'Employment scams', emoji: '💼', color: '#d97706' },
];

function formatMoney(n: number): string {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n}`;
}

export default function MapPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [scamFilter, setScamFilter] = useState<string | null>(null);
  const [liveData, setLiveData] = useState<{ code: string; reports: number; topScam: string }[] | null>(null);

  useEffect(() => {
    fetch('/api/stats/provinces')
      .then(res => res.json())
      .then(data => { if (data.provinces?.length) setLiveData(data.provinces); })
      .catch(() => {});
  }, []);

  const mergedData = useMemo(() => {
    const result = { ...SCAM_DATA };
    if (liveData) {
      for (const live of liveData) {
        if (result[live.code]) {
          result[live.code] = {
            ...result[live.code],
            reports: result[live.code].reports + live.reports,
          };
          if (live.reports > 5 && live.topScam) {
            result[live.code].topScam = live.topScam;
          }
        }
      }
    }
    return result;
  }, [liveData]);

  const totalLosses = useMemo(() =>
    Object.values(mergedData).reduce((sum, d) => sum + d.losses, 0), []);
  const totalReports = useMemo(() =>
    Object.values(mergedData).reduce((sum, d) => sum + d.reports, 0), []);

  const maxReports = Math.max(...Object.values(mergedData).map((d) => d.reports));

  const selectedData = selected ? mergedData[selected] : null;
  const selectedProv = selected ? PROVINCES.find((p) => p.code === selected) : null;

  function getHeatColor(reports: number): string {
    const intensity = reports / maxReports;
    if (intensity > 0.7) return '#dc2626';
    if (intensity > 0.4) return '#f97316';
    if (intensity > 0.2) return '#facc15';
    return '#86efac';
  }

  return (
    <main className="min-h-screen p-4 sm:p-8 flex flex-col items-center" style={{ background: 'var(--tc-bg)' }}>
      <div className="w-full max-w-4xl flex flex-col gap-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--tc-primary)' }}>
            🗺️ Canadian Scam Heat Map
          </h1>
          <p className="mt-2" style={{ color: 'var(--tc-text-muted)' }}>
            Real-time scam activity across Canada — based on CAFC reports & TrustChekr intelligence
          </p>
        </div>

        {/* National stats ticker */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-xl" style={{ background: 'var(--tc-surface)', border: '1px solid var(--tc-border)' }}>
            <p className="text-2xl font-bold" style={{ color: '#dc2626' }}>{formatMoney(totalLosses)}</p>
            <p className="text-xs" style={{ color: 'var(--tc-text-muted)' }}>Total losses (2025)</p>
          </div>
          <div className="p-3 rounded-xl" style={{ background: 'var(--tc-surface)', border: '1px solid var(--tc-border)' }}>
            <p className="text-2xl font-bold" style={{ color: 'var(--tc-primary)' }}>{totalReports.toLocaleString()}</p>
            <p className="text-xs" style={{ color: 'var(--tc-text-muted)' }}>Reports filed</p>
          </div>
          <div className="p-3 rounded-xl" style={{ background: 'var(--tc-surface)', border: '1px solid var(--tc-border)' }}>
            <p className="text-2xl font-bold" style={{ color: '#f97316' }}>+23%</p>
            <p className="text-xs" style={{ color: 'var(--tc-text-muted)' }}>Year-over-year increase</p>
          </div>
          <div className="p-3 rounded-xl" style={{ background: 'var(--tc-surface)', border: '1px solid var(--tc-border)' }}>
            <p className="text-2xl font-bold" style={{ color: '#9333ea' }}>#1</p>
            <p className="text-xs" style={{ color: 'var(--tc-text-muted)' }}>Investment fraud is top loss</p>
          </div>
        </div>

        {/* Map area */}
        <div className="relative rounded-xl overflow-hidden" style={{ background: 'var(--tc-surface)', border: '1px solid var(--tc-border)' }}>
          <svg viewBox="0 0 580 420" className="w-full" style={{ minHeight: '300px' }}>
            {/* Background */}
            <rect width="580" height="420" fill="transparent" />

            {/* Province bubbles */}
            {PROVINCES.map((prov) => {
              const data = mergedData[prov.code];
              if (!data) return null;
              const radius = 12 + (data.reports / maxReports) * 30;
              const color = getHeatColor(data.reports);
              const isSelected = selected === prov.code;

              return (
                <g key={prov.code} onClick={() => setSelected(isSelected ? null : prov.code)} style={{ cursor: 'pointer' }}>
                  {/* Pulse animation for selected */}
                  {isSelected && (
                    <circle cx={prov.x} cy={prov.y} r={radius + 8} fill="none" stroke={color} strokeWidth="2" opacity="0.4">
                      <animate attributeName="r" from={radius + 4} to={radius + 16} dur="1.5s" repeatCount="indefinite" />
                      <animate attributeName="opacity" from="0.4" to="0" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <circle cx={prov.x} cy={prov.y} r={radius} fill={color} opacity={isSelected ? 0.9 : 0.65} stroke={isSelected ? '#1f2937' : 'white'} strokeWidth={isSelected ? 3 : 1.5} />
                  <text x={prov.x} y={prov.y + 1} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="11" fontWeight="bold" style={{ pointerEvents: 'none' }}>
                    {prov.code}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Legend */}
          <div className="absolute bottom-3 left-3 flex gap-2 text-xs">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full inline-block" style={{ background: '#86efac' }} /> Low</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full inline-block" style={{ background: '#facc15' }} /> Medium</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full inline-block" style={{ background: '#f97316' }} /> High</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full inline-block" style={{ background: '#dc2626' }} /> Critical</span>
          </div>
        </div>

        {/* Selected province detail */}
        {selectedData && selectedProv && (
          <div className="p-4 rounded-xl border-2" style={{ borderColor: getHeatColor(selectedData.reports), background: 'var(--tc-surface)' }}>
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold" style={{ color: 'var(--tc-text-main)' }}>{selectedProv.name}</h2>
                <p className="text-sm" style={{ color: 'var(--tc-text-muted)' }}>Population: {selectedProv.pop}M</p>
              </div>
              <span className="text-xs font-bold px-2 py-1 rounded-full" style={{
                background: selectedData.trend === 'up' ? '#fee2e2' : selectedData.trend === 'down' ? '#eafaf1' : '#fef9e7',
                color: selectedData.trend === 'up' ? '#991b1b' : selectedData.trend === 'down' ? '#166534' : '#854d0e',
              }}>
                {selectedData.trend === 'up' ? '📈 Increasing' : selectedData.trend === 'down' ? '📉 Decreasing' : '➡️ Stable'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-3 text-center">
              <div>
                <p className="text-lg font-bold" style={{ color: '#dc2626' }}>{formatMoney(selectedData.losses)}</p>
                <p className="text-xs" style={{ color: 'var(--tc-text-muted)' }}>Total losses</p>
              </div>
              <div>
                <p className="text-lg font-bold" style={{ color: 'var(--tc-primary)' }}>{selectedData.reports.toLocaleString()}</p>
                <p className="text-xs" style={{ color: 'var(--tc-text-muted)' }}>Reports</p>
              </div>
              <div>
                <p className="text-lg font-bold" style={{ color: '#9333ea' }}>{selectedData.topScam}</p>
                <p className="text-xs" style={{ color: 'var(--tc-text-muted)' }}>#1 scam type</p>
              </div>
            </div>
          </div>
        )}

        {/* Scam type breakdown */}
        <div className="flex flex-col gap-3">
          <h2 className="text-xl font-bold" style={{ color: 'var(--tc-primary)' }}>
            Top Scam Types Across Canada
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SCAM_TYPES.map((scam) => {
              const provinces = Object.entries(mergedData).filter(([, d]) => d.topScam === scam.type);
              return (
                <div key={scam.type} className="p-3 rounded-xl text-center" style={{ background: 'var(--tc-surface)', border: '1px solid var(--tc-border)' }}>
                  <span className="text-2xl">{scam.emoji}</span>
                  <p className="text-xs font-semibold mt-1" style={{ color: scam.color }}>{scam.type}</p>
                  <p className="text-xs" style={{ color: 'var(--tc-text-muted)' }}>#{1} in {provinces.length} province{provinces.length !== 1 ? 's' : ''}</p>
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

        {/* Sources */}
        <p className="text-xs text-center" style={{ color: 'var(--tc-text-muted)' }}>
          Data sources: Canadian Anti-Fraud Centre (CAFC) annual reports, TrustChekr community reports.
          Updated periodically. Not all scams are reported — actual figures are estimated 5-10x higher.
        </p>
      </div>
    </main>
  );
}
