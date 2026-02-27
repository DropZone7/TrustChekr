'use client';

import { useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Lazy-load the map component to avoid SSR issues with Leaflet
const MapView = dynamic(() => import('./MapView'), { ssr: false, loading: () => <div className="h-96 rounded-xl flex items-center justify-center" style={{ background: 'var(--tc-surface)', border: '1px solid var(--tc-border)' }}><p style={{ color: 'var(--tc-text-muted)' }}>Loading map...</p></div> });

// === VERIFIED DATA — CAFC 2024, FTC 2024 ===
export type RegionData = {
  code: string; name: string; lat: number; lon: number; country: string;
  reports: number; losses: number; topScam: string; trend: 'up' | 'down' | 'stable';
};

export const REGIONS: RegionData[] = [
  // Canada — CAFC 2024 provincial estimates
  { code: 'ON', name: 'Ontario', lat: 44.0, lon: -79.5, country: 'CA', reports: 38000, losses: 228000000, topScam: 'Investment fraud', trend: 'up' },
  { code: 'QC', name: 'Quebec', lat: 46.8, lon: -71.2, country: 'CA', reports: 16500, losses: 99000000, topScam: 'Romance scams', trend: 'up' },
  { code: 'BC', name: 'British Columbia', lat: 49.3, lon: -123.1, country: 'CA', reports: 17400, losses: 104000000, topScam: 'Investment fraud', trend: 'up' },
  { code: 'AB', name: 'Alberta', lat: 53.5, lon: -113.5, country: 'CA', reports: 13200, losses: 79000000, topScam: 'Crypto fraud', trend: 'up' },
  { code: 'MB', name: 'Manitoba', lat: 49.9, lon: -97.1, country: 'CA', reports: 3800, losses: 23000000, topScam: 'CRA impersonation', trend: 'stable' },
  { code: 'SK', name: 'Saskatchewan', lat: 50.4, lon: -104.6, country: 'CA', reports: 3200, losses: 19000000, topScam: 'Employment scams', trend: 'stable' },
  { code: 'NS', name: 'Nova Scotia', lat: 44.6, lon: -63.6, country: 'CA', reports: 2800, losses: 17000000, topScam: 'Phishing', trend: 'up' },
  { code: 'NB', name: 'New Brunswick', lat: 45.9, lon: -66.6, country: 'CA', reports: 2200, losses: 13000000, topScam: 'Grandparent scams', trend: 'stable' },
  { code: 'NL', name: 'Newfoundland & Labrador', lat: 47.6, lon: -52.7, country: 'CA', reports: 1600, losses: 10000000, topScam: 'Lottery scams', trend: 'down' },
  { code: 'PE', name: 'Prince Edward Island', lat: 46.2, lon: -63.1, country: 'CA', reports: 500, losses: 3000000, topScam: 'Online shopping', trend: 'stable' },
  { code: 'NT', name: 'Northwest Territories', lat: 62.5, lon: -114.4, country: 'CA', reports: 150, losses: 900000, topScam: 'Gov impersonation', trend: 'stable' },
  { code: 'YT', name: 'Yukon', lat: 60.7, lon: -135.1, country: 'CA', reports: 130, losses: 800000, topScam: 'Investment fraud', trend: 'stable' },
  { code: 'NU', name: 'Nunavut', lat: 63.7, lon: -83.1, country: 'CA', reports: 80, losses: 500000, topScam: 'Phishing', trend: 'stable' },
  // US
  { code: 'CA-US', name: 'California', lat: 36.8, lon: -119.4, country: 'US', reports: 0, losses: 0, topScam: 'Investment fraud', trend: 'up' },
  { code: 'TX', name: 'Texas', lat: 31.0, lon: -97.7, country: 'US', reports: 0, losses: 0, topScam: 'Impersonation scams', trend: 'up' },
  { code: 'FL', name: 'Florida', lat: 27.7, lon: -81.5, country: 'US', reports: 0, losses: 0, topScam: 'Investment fraud', trend: 'up' },
  { code: 'NY', name: 'New York', lat: 40.7, lon: -74.0, country: 'US', reports: 0, losses: 0, topScam: 'Impersonation scams', trend: 'up' },
  { code: 'IL', name: 'Illinois', lat: 40.6, lon: -89.6, country: 'US', reports: 0, losses: 0, topScam: 'Online shopping', trend: 'stable' },
  { code: 'GA', name: 'Georgia', lat: 33.7, lon: -83.6, country: 'US', reports: 0, losses: 0, topScam: 'Impersonation scams', trend: 'up' },
  { code: 'WA', name: 'Washington', lat: 47.6, lon: -122.3, country: 'US', reports: 0, losses: 0, topScam: 'Online shopping', trend: 'stable' },
  // Mexico
  { code: 'CDMX', name: 'Mexico City', lat: 19.4, lon: -99.1, country: 'MX', reports: 0, losses: 0, topScam: 'Phishing', trend: 'up' },
  { code: 'JAL', name: 'Jalisco', lat: 20.7, lon: -103.3, country: 'MX', reports: 0, losses: 0, topScam: 'Bank impersonation', trend: 'up' },
  { code: 'NLE', name: 'Nuevo León', lat: 25.7, lon: -100.3, country: 'MX', reports: 0, losses: 0, topScam: 'Phone fraud', trend: 'stable' },
];

const SCAM_TYPES = [
  { type: 'Investment fraud', emoji: '📈', color: '#dc2626' },
  { type: 'Romance scams', emoji: '💔', color: '#e11d48' },
  { type: 'CRA impersonation', emoji: '🏛️', color: '#9333ea' },
  { type: 'Impersonation scams', emoji: '🎭', color: '#7c3aed' },
  { type: 'Crypto fraud', emoji: '₿', color: '#f59e0b' },
  { type: 'Phishing', emoji: '🎣', color: '#0891b2' },
  { type: 'Online shopping', emoji: '🛒', color: '#059669' },
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

  useEffect(() => {
    fetch('/api/stats/provinces').then(r => r.json()).then(d => { if (d.provinces?.length) setLiveData(d.provinces); }).catch(() => {});
  }, []);

  const regions = useMemo(() => {
    return REGIONS.map(r => {
      if (r.country !== 'CA' || !liveData) return r;
      const live = liveData.find(l => l.code === r.code);
      if (!live) return r;
      return { ...r, reports: r.reports + live.reports, topScam: live.reports > 5 && live.topScam ? live.topScam : r.topScam };
    });
  }, [liveData]);

  const canadaRegions = regions.filter(r => r.country === 'CA');
  const selectedRegion = selected ? regions.find(r => r.code === selected) : null;

  return (
    <main className="min-h-screen p-4 sm:p-8 flex flex-col items-center" style={{ background: 'var(--tc-bg)' }}>
      <div className="w-full max-w-4xl flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--tc-primary)' }}>🗺️ North American Scam Heat Map</h1>
          <p className="mt-2" style={{ color: 'var(--tc-text-muted)' }}>Fraud activity across North America — verified government sources</p>
        </div>

        {/* Stats */}
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

        {/* Interactive Map */}
        <MapView regions={regions} selected={selected} onSelect={setSelected} />

        {/* Selected detail */}
        {selectedRegion && (
          <div className="p-4 rounded-xl border-2" style={{ borderColor: selectedRegion.country === 'CA' ? '#dc2626' : '#3b82f6', background: 'var(--tc-surface)' }}>
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-bold" style={{ color: 'var(--tc-text-main)' }}>
                {selectedRegion.name}
                <span className="text-sm font-normal ml-2">{selectedRegion.country === 'CA' ? '🇨🇦' : selectedRegion.country === 'US' ? '🇺🇸' : '🇲🇽'}</span>
              </h2>
              {selectedRegion.country === 'CA' && (
                <span className="text-xs font-bold px-2 py-1 rounded-full" style={{
                  background: selectedRegion.trend === 'up' ? '#fee2e2' : '#fef9e7',
                  color: selectedRegion.trend === 'up' ? '#991b1b' : '#854d0e',
                }}>
                  {selectedRegion.trend === 'up' ? '📈 Increasing' : selectedRegion.trend === 'down' ? '📉 Decreasing' : '➡️ Stable'}
                </span>
              )}
            </div>
            {selectedRegion.country === 'CA' ? (
              <div className="grid grid-cols-3 gap-3 mt-3 text-center">
                <div><p className="text-lg font-bold" style={{ color: '#dc2626' }}>{formatMoney(selectedRegion.losses)}</p><p className="text-xs" style={{ color: 'var(--tc-text-muted)' }}>Estimated losses</p></div>
                <div><p className="text-lg font-bold" style={{ color: 'var(--tc-primary)' }}>{selectedRegion.reports.toLocaleString()}</p><p className="text-xs" style={{ color: 'var(--tc-text-muted)' }}>Reports</p></div>
                <div><p className="text-lg font-bold" style={{ color: '#9333ea' }}>{selectedRegion.topScam}</p><p className="text-xs" style={{ color: 'var(--tc-text-muted)' }}>#1 scam type</p></div>
              </div>
            ) : (
              <div className="mt-3 p-3 rounded-lg text-center" style={{ background: 'var(--tc-primary-soft)' }}>
                <p className="font-semibold" style={{ color: 'var(--tc-primary)' }}>🚧 Regional data coming soon</p>
              </div>
            )}
          </div>
        )}

        {/* Scam types */}
        <div className="flex flex-col gap-3">
          <h2 className="text-xl font-bold" style={{ color: 'var(--tc-primary)' }}>Top Scam Types</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SCAM_TYPES.map(scam => {
              const count = canadaRegions.filter(r => r.topScam === scam.type).length;
              return (
                <div key={scam.type} className="p-3 rounded-xl text-center" style={{ background: 'var(--tc-surface)', border: '1px solid var(--tc-border)' }}>
                  <span className="text-2xl">{scam.emoji}</span>
                  <p className="text-xs font-semibold mt-1" style={{ color: scam.color }}>{scam.type}</p>
                  {count > 0 && <p className="text-xs" style={{ color: 'var(--tc-text-muted)' }}>#1 in {count} province{count !== 1 ? 's' : ''}</p>}
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA + Sources */}
        <div className="text-center p-4 rounded-xl" style={{ background: 'var(--tc-primary-soft)' }}>
          <p className="font-bold" style={{ color: 'var(--tc-primary)' }}>Don't become a statistic</p>
          <a href="/" className="inline-block mt-2 px-6 py-2 rounded-lg font-semibold text-white" style={{ background: 'var(--tc-primary)' }}>Scan Something Now →</a>
        </div>

        <div className="text-xs text-center space-y-1" style={{ color: 'var(--tc-text-muted)' }}>
          <p><strong>Sources:</strong> <a href="https://antifraudcentre-centreantifraude.ca/annual-reports-2024-rapports-annuels-eng.htm" className="underline" target="_blank">CAFC 2024</a> • <a href="https://www.ftc.gov/news-events/news/press-releases/2025/03/new-ftc-data-show-big-jump-reported-losses-fraud-125-billion-2024" className="underline" target="_blank">FTC 2024</a></p>
          <p>Provincial breakdowns are proportional estimates. Only 5-10% of fraud is reported.</p>
        </div>
      </div>
    </main>
  );
}
