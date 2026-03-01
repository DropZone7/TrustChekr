'use client';

import { useState, useEffect } from 'react';
import { BackButton } from '@/components/BackButton';
import { AlertSignup } from '@/components/alerts/AlertSignup';
import { Bell, AlertTriangle, Info, Shield } from 'lucide-react';

interface AlertData {
  id: string;
  campaign_id: string;
  title: string;
  body: string;
  severity: 'info' | 'warning' | 'critical';
  target_provinces: string[];
  created_at: string;
  sent_count: number;
}

const SEVERITY_CONFIG = {
  critical: { color: '#ef4444', bg: '#fef2f2', icon: AlertTriangle, label: 'Critical' },
  warning: { color: '#f97316', bg: '#fff7ed', icon: AlertTriangle, label: 'Warning' },
  info: { color: '#3b82f6', bg: '#eff6ff', icon: Info, label: 'Info' },
};

const PROVINCE_MAP: Record<string, string> = {
  AB: 'Alberta', BC: 'British Columbia', MB: 'Manitoba', NB: 'New Brunswick',
  NL: 'Newfoundland', NS: 'Nova Scotia', NT: 'Northwest Territories', NU: 'Nunavut',
  ON: 'Ontario', PE: 'PEI', QC: 'Quebec', SK: 'Saskatchewan', YT: 'Yukon',
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterProvince, setFilterProvince] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('');

  useEffect(() => {
    fetch('/api/alerts')
      .then((r) => r.json())
      .then((data) => { setAlerts(data.alerts || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = alerts.filter((a) => {
    if (filterProvince && a.target_provinces.length > 0 && !a.target_provinces.includes(filterProvince)) return false;
    if (filterSeverity && a.severity !== filterSeverity) return false;
    return true;
  });

  return (
    <main className="min-h-screen p-4 sm:p-8 flex flex-col items-center" style={{ background: 'var(--tc-bg)' }}>
      <BackButton />
      <div className="w-full max-w-2xl flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--tc-text-main)' }}>
            <Bell size={28} style={{ display: 'inline', verticalAlign: '-4px', marginRight: 8 }} />
            Scam Alerts
          </h1>
          <p className="mt-2" style={{ color: 'var(--tc-text-muted)' }}>
            Stay ahead of scams targeting your area. Subscribe for personalized alerts.
          </p>
        </div>

        {/* Signup CTA */}
        <AlertSignup />

        {/* Filters */}
        <div className="flex gap-3">
          <select
            value={filterProvince}
            onChange={(e) => setFilterProvince(e.target.value)}
            className="flex-1 py-2 px-3 rounded-lg text-sm"
            style={{ background: 'var(--tc-surface)', border: '1px solid var(--tc-border)', color: 'var(--tc-text-main)', minHeight: '44px' }}
          >
            <option value="">All Provinces</option>
            {Object.entries(PROVINCE_MAP).map(([code, name]) => (
              <option key={code} value={code}>{name}</option>
            ))}
          </select>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="flex-1 py-2 px-3 rounded-lg text-sm"
            style={{ background: 'var(--tc-surface)', border: '1px solid var(--tc-border)', color: 'var(--tc-text-main)', minHeight: '44px' }}
          >
            <option value="">All Severities</option>
            <option value="critical">Critical</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
          </select>
        </div>

        {/* Alert Feed */}
        {loading && (
          <p className="text-center py-8" style={{ color: 'var(--tc-text-muted)' }}>Loading alerts...</p>
        )}

        {!loading && filtered.length === 0 && (
          <div className="p-6 rounded-xl text-center" style={{ background: 'var(--tc-surface)', border: '1px solid var(--tc-border)' }}>
            <Shield size={48} style={{ color: 'var(--tc-primary)', margin: '0 auto 12px' }} />
            <p style={{ color: 'var(--tc-text-muted)' }}>No alerts match your filters.</p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {filtered.map((alert) => {
            const config = SEVERITY_CONFIG[alert.severity];
            const SevIcon = config.icon;
            return (
              <div key={alert.id} className="p-4 rounded-xl" style={{ background: 'var(--tc-surface)', border: '1px solid var(--tc-border)' }}>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: config.bg }}>
                    <SevIcon size={16} style={{ color: config.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ background: config.bg, color: config.color }}>
                        {config.label}
                      </span>
                      <span className="text-xs" style={{ color: 'var(--tc-text-muted)' }}>
                        {new Date(alert.created_at).toLocaleDateString('en-CA')}
                      </span>
                    </div>
                    <h3 className="font-semibold mt-1 text-sm" style={{ color: 'var(--tc-text-main)' }}>
                      {alert.title}
                    </h3>
                    <p className="text-sm mt-1" style={{ color: 'var(--tc-text-muted)' }}>
                      {alert.body}
                    </p>
                    {alert.target_provinces.length > 0 && (
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {alert.target_provinces.map((p) => (
                          <span key={p} className="text-xs px-2 py-0.5 rounded-full"
                            style={{ background: 'var(--tc-bg)', color: 'var(--tc-text-muted)' }}>
                            {PROVINCE_MAP[p] || p}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
