'use client';

import { useState, useRef, useCallback } from 'react';

interface QRScanResult {
  found: boolean;
  raw_data: string | null;
  type: 'url' | 'text' | null;
  threat_level: string | null;
  flags: string[];
  url_scan_result?: any;
  error?: string;
}

export function QRScanner() {
  const [result, setResult] = useState<QRScanResult | null>(null);
  const [scanning, setScanning] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanning(true);
    setResult(null);
    setPreview(URL.createObjectURL(file));

    try {
      // Load jsqr dynamically (client-side only)
      const jsQR = (await import('jsqr')).default;

      // Decode image using browser Canvas API
      const img = new Image();
      const loaded = new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
      });
      img.src = URL.createObjectURL(file);
      await loaded;

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      const qrCode = jsQR(imageData.data, imageData.width, imageData.height);

      if (!qrCode) {
        setResult({ found: false, raw_data: null, type: null, threat_level: null, flags: [] });
        return;
      }

      const data = qrCode.data;
      const isUrl = /^https?:\/\//i.test(data);
      const flags: string[] = [];

      if (isUrl) {
        // Pipe URL through our existing scan API
        try {
          const scanRes = await fetch('/api/scan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ input: data, type: 'website' }),
          });
          const scanData = await scanRes.json();

          if (scanData.riskLevel === 'high-risk' || scanData.riskLevel === 'very-likely-scam') {
            flags.push('QUISHING_PHISHING');
          }

          setResult({
            found: true,
            raw_data: data,
            type: 'url',
            threat_level: scanData.riskLevel,
            flags,
            url_scan_result: scanData,
          });
        } catch {
          setResult({
            found: true,
            raw_data: data,
            type: 'url',
            threat_level: 'unknown',
            flags: ['SCAN_FAILED'],
          });
        }
      } else {
        // Non-URL QR payload
        flags.push('QR_NON_URL_PAYLOAD');
        setResult({
          found: true,
          raw_data: data,
          type: 'text',
          threat_level: 'info',
          flags,
        });
      }
    } catch (err: any) {
      setResult({ found: false, raw_data: null, type: null, threat_level: null, flags: [], error: err?.message });
    } finally {
      setScanning(false);
    }
  }, []);

  const threatColors: Record<string, { bg: string; text: string; border: string }> = {
    'safe': { bg: '#eafaf1', text: 'var(--tc-safe)', border: 'var(--tc-safe)' },
    'suspicious': { bg: '#fef9e7', text: 'var(--tc-warning)', border: 'var(--tc-warning)' },
    'high-risk': { bg: '#ffedd5', text: '#9a3412', border: '#fed7aa' },
    'very-likely-scam': { bg: '#fee2e2', text: '#991b1b', border: '#fecaca' },
    'info': { bg: '#e0f2fe', text: '#0369a1', border: '#bae6fd' },
    'unknown': { bg: 'var(--tc-surface)', text: 'var(--tc-text-muted)', border: 'var(--tc-border)' },
  };

  return (
    <div className="flex flex-col gap-4">
      <div
        className="p-6 rounded-xl border-2 border-dashed text-center cursor-pointer transition-all hover:shadow-sm"
        style={{ borderColor: 'var(--tc-border)', background: 'var(--tc-surface)' }}
        onClick={() => fileRef.current?.click()}
      >
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        <p className="text-3xl mb-2"></p>
        <p className="font-semibold" style={{ color: 'var(--tc-primary)' }}>
          Upload a QR code image to scan
        </p>
        <p className="text-sm mt-1" style={{ color: 'var(--tc-text-muted)' }}>
          We'll extract the URL or data and check it for scams
        </p>
      </div>

      {scanning && (
        <div className="text-center py-4">
          <div className="w-8 h-8 border-4 rounded-full animate-spin mx-auto" style={{ borderColor: 'var(--tc-primary-soft)', borderTopColor: 'var(--tc-primary)' }} />
          <p className="mt-2 text-sm" style={{ color: 'var(--tc-text-muted)' }}>Scanning QR code...</p>
        </div>
      )}

      {preview && !scanning && (
        <div className="flex justify-center">
          <img src={preview} alt="Uploaded QR" className="max-w-[200px] rounded-lg border" style={{ borderColor: 'var(--tc-border)' }} />
        </div>
      )}

      {result && !scanning && (
        <div className="flex flex-col gap-3">
          {!result.found ? (
            <div className="p-4 rounded-xl border text-center" style={{ borderColor: 'var(--tc-border)', background: 'var(--tc-surface)' }}>
              <p className="font-semibold" style={{ color: 'var(--tc-text-muted)' }}>
                No QR code found in this image
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--tc-text-muted)' }}>
                Try a clearer image or make sure the QR code is fully visible
              </p>
            </div>
          ) : (
            <>
              {/* Extracted data */}
              <div className="p-4 rounded-xl border" style={{ borderColor: 'var(--tc-border)', background: 'var(--tc-surface)' }}>
                <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--tc-text-muted)' }}>
                  Extracted {result.type === 'url' ? 'URL' : 'Data'}
                </p>
                <p className="font-mono text-sm break-all" style={{ color: 'var(--tc-text-main)' }}>
                  {result.raw_data}
                </p>
              </div>

              {/* Threat level */}
              {result.threat_level && (
                <div
                  className="p-4 rounded-xl border-2"
                  style={{
                    borderColor: (threatColors[result.threat_level] ?? threatColors.unknown).border,
                    background: (threatColors[result.threat_level] ?? threatColors.unknown).bg,
                  }}
                >
                  <p className="font-bold" style={{ color: (threatColors[result.threat_level] ?? threatColors.unknown).text }}>
                    {result.threat_level === 'safe' && <><span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block', marginRight: 6 }} />Low Risk</>}
                    {result.threat_level === 'suspicious' && <><span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#eab308', display: 'inline-block', marginRight: 6 }} />Suspicious</>}
                    {result.threat_level === 'high-risk' && <><span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#f97316', display: 'inline-block', marginRight: 6 }} />High Risk</>}
                    {result.threat_level === 'very-likely-scam' && <><span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#ef4444', display: 'inline-block', marginRight: 6 }} />Very Likely Scam</>}
                    {result.threat_level === 'info' && 'ℹ️ Non-URL Data Found'}
                    {result.threat_level === 'unknown' && '❓ Could Not Determine'}
                  </p>
                </div>
              )}

              {/* Flags */}
              {result.flags.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {result.flags.map((flag) => (
                    <span key={flag} className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: '#fee2e2', color: '#991b1b' }}>
                      🚩 {flag.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              )}

              {/* URL scan details */}
              {result.url_scan_result?.signals && (
                <div className="p-4 rounded-xl border" style={{ borderColor: 'var(--tc-border)', background: 'var(--tc-surface)' }}>
                  <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: 'var(--tc-text-muted)' }}>
                    URL Scan Details
                  </p>
                  <ul className="flex flex-col gap-1 text-sm">
                    {result.url_scan_result.signals.map((s: any, i: number) => (
                      <li key={i} className="flex gap-2">
                        <span>{s.weight > 0 ? '' : ''}</span>
                        <span>{s.description}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
