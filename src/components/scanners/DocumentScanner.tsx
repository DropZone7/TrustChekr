'use client';

import { useState, useRef } from 'react';

interface ELAResult {
  mean_ela: number;
  max_ela: number;
  std_ela: number;
  manipulation_detected: boolean;
}

interface ExifResult {
  has_exif: boolean;
  software: string | null;
  edited_in_photo_software: boolean;
  exif_stripped: boolean;
  camera_make: string | null;
  camera_model: string | null;
  date_taken: string | null;
}

interface DocumentForensicsResult {
  ela: ELAResult | null;
  exif: ExifResult;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  flags: string[];
}

// Run ELA entirely in the browser using Canvas API
async function runELA(file: File): Promise<ELAResult> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const original = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // Re-export at quality 90 (lossy recompression)
        const recompressedUrl = canvas.toDataURL('image/jpeg', 0.9);
        const reImg = new Image();
        reImg.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(reImg, 0, 0);
          const recompressed = ctx.getImageData(0, 0, canvas.width, canvas.height);

          // Calculate pixel-level difference
          let sum = 0;
          let max = 0;
          let sumSq = 0;
          const pixelCount = original.data.length / 4;

          for (let i = 0; i < original.data.length; i += 4) {
            const diff = (
              Math.abs(original.data[i] - recompressed.data[i]) +
              Math.abs(original.data[i + 1] - recompressed.data[i + 1]) +
              Math.abs(original.data[i + 2] - recompressed.data[i + 2])
            ) / 3;
            sum += diff;
            sumSq += diff * diff;
            if (diff > max) max = diff;
          }

          const mean_ela = sum / pixelCount;
          const std_ela = Math.sqrt(sumSq / pixelCount - mean_ela * mean_ela);

          resolve({
            mean_ela: Math.round(mean_ela * 100) / 100,
            max_ela: Math.round(max * 100) / 100,
            std_ela: Math.round(std_ela * 100) / 100,
            manipulation_detected: mean_ela > 8.0 || max > 180,
          });
        };
        reImg.onerror = reject;
        reImg.src = recompressedUrl;
      } catch (e) { reject(e); }
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

// Read EXIF from raw file bytes (lightweight parser)
async function readExif(file: File): Promise<ExifResult> {
  try {
    const exifr = (await import('exifr')).default;
    const data = await exifr.parse(file, { pick: ['Make', 'Model', 'Software', 'DateTimeOriginal', 'CreateDate'] });

    if (!data) {
      return { has_exif: false, software: null, edited_in_photo_software: false, exif_stripped: true, camera_make: null, camera_model: null, date_taken: null };
    }

    const software = data.Software ?? null;
    const photoEditors = ['photoshop', 'gimp', 'lightroom', 'affinity', 'canva', 'pixlr', 'paint.net', 'snapseed'];
    const edited = software ? photoEditors.some((ed) => software.toLowerCase().includes(ed)) : false;

    return {
      has_exif: true,
      software,
      edited_in_photo_software: edited,
      exif_stripped: false,
      camera_make: data.Make ?? null,
      camera_model: data.Model ?? null,
      date_taken: data.DateTimeOriginal?.toString() ?? data.CreateDate?.toString() ?? null,
    };
  } catch {
    return { has_exif: false, software: null, edited_in_photo_software: false, exif_stripped: true, camera_make: null, camera_model: null, date_taken: null };
  }
}

export function DocumentScanner() {
  const [result, setResult] = useState<DocumentForensicsResult | null>(null);
  const [scanning, setScanning] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanning(true);
    setResult(null);
    setFileName(file.name);

    try {
      const isImage = file.type.startsWith('image/');
      const flags: string[] = [];

      let ela: ELAResult | null = null;
      if (isImage) {
        ela = await runELA(file);
        if (ela.manipulation_detected) flags.push('IMAGE_MANIPULATION_DETECTED');
      }

      const exif = await readExif(file);
      if (exif.edited_in_photo_software) flags.push('EDITED_IN_PHOTO_SOFTWARE');
      if (exif.exif_stripped && isImage) flags.push('SUSPICIOUS_EXIF_STRIPPED');

      const risk_level: 'LOW' | 'MEDIUM' | 'HIGH' = flags.length >= 2 ? 'HIGH' : flags.length === 1 ? 'MEDIUM' : 'LOW';

      setResult({ ela, exif, risk_level, flags });
    } catch (err) {
      console.error('Document forensics error:', err);
      setResult({ ela: null, exif: { has_exif: false, software: null, edited_in_photo_software: false, exif_stripped: true, camera_make: null, camera_model: null, date_taken: null }, risk_level: 'LOW', flags: ['ANALYSIS_ERROR'] });
    } finally {
      setScanning(false);
    }
  }

  const riskColors = {
    LOW: { bg: '#eafaf1', text: 'var(--tc-safe)', border: 'var(--tc-safe)' },
    MEDIUM: { bg: '#fef9e7', text: 'var(--tc-warning)', border: 'var(--tc-warning)' },
    HIGH: { bg: '#fee2e2', text: '#991b1b', border: '#fecaca' },
  };

  return (
    <div className="flex flex-col gap-4">
      <div
        className="p-6 rounded-xl border-2 border-dashed text-center cursor-pointer transition-all hover:shadow-sm"
        style={{ borderColor: 'var(--tc-border)', background: 'var(--tc-surface)' }}
        onClick={() => fileRef.current?.click()}
      >
        <input ref={fileRef} type="file" accept="image/*,.pdf" onChange={handleFile} className="hidden" />
        <p className="text-3xl mb-2">📄</p>
        <p className="font-semibold" style={{ color: 'var(--tc-primary)' }}>
          Upload an image or document to analyze
        </p>
        <p className="text-sm mt-1" style={{ color: 'var(--tc-text-muted)' }}>
          We'll check for signs of editing, manipulation, and metadata anomalies
        </p>
      </div>

      {scanning && (
        <div className="text-center py-4">
          <div className="w-8 h-8 border-4 rounded-full animate-spin mx-auto" style={{ borderColor: 'var(--tc-primary-soft)', borderTopColor: 'var(--tc-primary)' }} />
          <p className="mt-2 text-sm" style={{ color: 'var(--tc-text-muted)' }}>Analyzing {fileName}...</p>
        </div>
      )}

      {result && !scanning && (
        <div className="flex flex-col gap-3">
          {/* Risk Level */}
          <div className="p-4 rounded-xl border-2" style={{ borderColor: riskColors[result.risk_level].border, background: riskColors[result.risk_level].bg }}>
            <p className="font-bold" style={{ color: riskColors[result.risk_level].text }}>
              {result.risk_level === 'LOW' && '🟢 No manipulation detected'}
              {result.risk_level === 'MEDIUM' && '🟡 Possible manipulation detected'}
              {result.risk_level === 'HIGH' && '🔴 Multiple manipulation indicators found'}
            </p>
          </div>

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

          {/* ELA Results */}
          {result.ela && (
            <div className="p-4 rounded-xl border" style={{ borderColor: 'var(--tc-border)', background: 'var(--tc-surface)' }}>
              <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: 'var(--tc-text-muted)' }}>
                Error Level Analysis (ELA)
              </p>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-lg font-bold" style={{ color: result.ela.mean_ela > 8 ? '#991b1b' : 'var(--tc-safe)' }}>{result.ela.mean_ela}</p>
                  <p className="text-xs" style={{ color: 'var(--tc-text-muted)' }}>Mean ELA</p>
                </div>
                <div>
                  <p className="text-lg font-bold" style={{ color: result.ela.max_ela > 180 ? '#991b1b' : 'var(--tc-safe)' }}>{result.ela.max_ela}</p>
                  <p className="text-xs" style={{ color: 'var(--tc-text-muted)' }}>Max ELA</p>
                </div>
                <div>
                  <p className="text-lg font-bold" style={{ color: 'var(--tc-text-main)' }}>{result.ela.std_ela}</p>
                  <p className="text-xs" style={{ color: 'var(--tc-text-muted)' }}>Std Dev</p>
                </div>
              </div>
              <p className="text-xs mt-2" style={{ color: 'var(--tc-text-muted)' }}>
                ELA detects areas that have been edited by analyzing compression artifacts.
                {result.ela.manipulation_detected ? ' ⚠️ Abnormal levels detected.' : ' Levels appear normal.'}
              </p>
            </div>
          )}

          {/* EXIF Results */}
          <div className="p-4 rounded-xl border" style={{ borderColor: 'var(--tc-border)', background: 'var(--tc-surface)' }}>
            <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: 'var(--tc-text-muted)' }}>
              Metadata (EXIF) Analysis
            </p>
            <div className="flex flex-col gap-1 text-sm">
              <div className="flex justify-between">
                <span style={{ color: 'var(--tc-text-muted)' }}>EXIF data present</span>
                <span style={{ color: result.exif.has_exif ? 'var(--tc-safe)' : 'var(--tc-warning)' }}>
                  {result.exif.has_exif ? 'Yes' : 'No (stripped)'}
                </span>
              </div>
              {result.exif.software && (
                <div className="flex justify-between">
                  <span style={{ color: 'var(--tc-text-muted)' }}>Software</span>
                  <span style={{ color: result.exif.edited_in_photo_software ? '#991b1b' : 'var(--tc-text-main)' }}>
                    {result.exif.software}
                  </span>
                </div>
              )}
              {result.exif.camera_make && (
                <div className="flex justify-between">
                  <span style={{ color: 'var(--tc-text-muted)' }}>Camera</span>
                  <span>{result.exif.camera_make} {result.exif.camera_model}</span>
                </div>
              )}
              {result.exif.date_taken && (
                <div className="flex justify-between">
                  <span style={{ color: 'var(--tc-text-muted)' }}>Date taken</span>
                  <span>{result.exif.date_taken}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
