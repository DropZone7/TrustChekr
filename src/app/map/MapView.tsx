'use client';

import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { RegionData } from './page';

function getColor(reports: number, country: string, maxReports: number): string {
  if (country !== 'CA') return '#3b82f6';
  const intensity = reports / maxReports;
  if (intensity > 0.7) return '#dc2626';
  if (intensity > 0.4) return '#f97316';
  if (intensity > 0.2) return '#facc15';
  return '#86efac';
}

function getRadius(reports: number, country: string, maxReports: number): number {
  if (country !== 'CA') return 6;
  return 8 + (reports / maxReports) * 18;
}

function formatMoney(n: number): string {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n}`;
}

export default function MapView({ regions, selected, onSelect }: {
  regions: RegionData[];
  selected: string | null;
  onSelect: (code: string | null) => void;
}) {
  const caRegions = regions.filter(r => r.country === 'CA');
  const maxReports = Math.max(...caRegions.map(r => r.reports), 1);

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--tc-border)', height: '450px' }}>
      <MapContainer
        center={[45, -95]}
        zoom={3}
        minZoom={2}
        maxZoom={7}
        style={{ height: '100%', width: '100%', background: '#f0f4f8' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
        />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"
        />

        {regions.map((region) => {
          const color = getColor(region.reports, region.country, maxReports);
          const radius = getRadius(region.reports, region.country, maxReports);
          const isSelected = selected === region.code;

          return (
            <CircleMarker
              key={region.code}
              center={[region.lat, region.lon]}
              radius={radius}
              pathOptions={{
                fillColor: color,
                fillOpacity: region.country !== 'CA' ? 0.4 : (isSelected ? 0.95 : 0.7),
                color: isSelected ? '#1f2937' : 'white',
                weight: isSelected ? 3 : 1.5,
              }}
              eventHandlers={{
                click: () => onSelect(isSelected ? null : region.code),
              }}
            >
              <Popup>
                <div style={{ minWidth: '150px', fontFamily: 'system-ui' }}>
                  <strong>{region.name}</strong>
                  <span style={{ marginLeft: '6px', fontSize: '0.8em' }}>
                    {region.country === 'CA' ? '🇨🇦' : region.country === 'US' ? '🇺🇸' : '🇲🇽'}
                  </span>
                  {region.country === 'CA' ? (
                    <div style={{ marginTop: '6px', fontSize: '0.85em', lineHeight: 1.6 }}>
                      <div>💰 {formatMoney(region.losses)} estimated losses</div>
                      <div>📊 {region.reports.toLocaleString()} reports</div>
                      <div>⚠️ Top: {region.topScam}</div>
                    </div>
                  ) : (
                    <div style={{ marginTop: '6px', fontSize: '0.85em', color: '#6b7280' }}>
                      Regional data coming soon
                    </div>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
