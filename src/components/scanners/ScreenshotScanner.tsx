'use client';

import { useState, useRef, useCallback } from 'react';

interface ScreenshotScanState {
  phase: 'idle' | 'ocr' | 'scanning' | 'done' | 'error';
  extractedText: string | null;
  scanResult: any | null;
  error: string | null;
  ocrConfidence: number | null;
}

export function ScreenshotScanner() {
  const [state, setState] = useState<ScreenshotScanState>({
    phase: 'idle', extractedText: null, scanResult: null, error: null, ocrConfidence: null,
  });
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setState({ phase: 'ocr', extractedText: null, scanResult: null, error: null, ocrConfidence: null });

    try {
      // Dynamic import — tesseract.js is heavy, only load when needed
      const Tesseract = await import('tesseract.js');
      const worker = await Tesseract.createWorker('eng');
      const { data } = await worker.recognize(file);
      await worker.terminate();

      const text = data.text.trim();
      const confidence = Math.round(data.confidence);

      if (!text || text.length < 10) {
        setState({ phase: 'done', extractedText: null, scanResult: null, error: null, ocrConfidence: confidence });
        return;
      }

      setState((s) => ({ ...s, phase: 'scanning', extractedText: text, ocrConfidence: confidence }));

      // Send extracted text through our scan engine
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: text, type: 'message' }),
      });
      const scanResult = await res.json();

      setState({ phase: 'done', extractedText: text, scanResult, error: null, ocrConfidence: confidence });
    } catch (err: any) {
      setState({ phase: 'error', extractedText: null, scanResult: null, error: err?.message ?? 'OCR failed', ocrConfidence: null });
    }
  }, []);

  const handlePaste = useCallback(async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (const item of Array.from(items)) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          // Create a synthetic event-like flow
          const dt = new DataTransfer();
          dt.items.add(file);
          if (fileRef.current) {
            fileRef.current.files = dt.files;
            fileRef.current.dispatchEvent(new Event('change', { bubbles: true }));
          }
          // Trigger directly
          handleFile({ target: { files: dt.files } } as any);
        }
        break;
      }
    }
  }, [handleFile]);

  const threatColors: Record<string, { bg: string; text: string; border: string }> = {
    'safe': { bg: '#eafaf1', text: 'var(--tc-safe)', border: 'var(--tc-safe)' },
    'suspicious': { bg: '#fef9e7', text: 'var(--tc-warning)', border: 'var(--tc-warning)' },
    'high-risk': { bg: '#ffedd5', text: '#9a3412', border: '#fed7aa' },
    'very-likely-scam': { bg: '#fee2e2', text: '#991b1b', border: '#fecaca' },
  };

  return (
    <div className="flex flex-col gap-4" onPaste={handlePaste} tabIndex={0}>
      {/* Upload area */}
      <div
        className="p-6 rounded-xl border-2 border-dashed text-center cursor-pointer transition-all hover:shadow-sm"
        style={{ borderColor: 'var(--tc-border)', background: 'var(--tc-surface)' }}
        onClick={() => fileRef.current?.click()}
      >
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        <p className="text-3xl mb-2">📱</p>
        <p className="font-semibold" style={{ color: 'var(--tc-primary)' }}>
          Upload or paste a screenshot
        </p>
        <p className="text-sm mt-1" style={{ color: 'var(--tc-text-muted)' }}>
          Got a suspicious text, email, or DM? Take a screenshot and drop it here.
          <br />We'll read the text and check it for scams.
        </p>
        <p className="text-xs mt-2 px-3 py-1 rounded-full inline-block" style={{ background: 'var(--tc-primary-soft)', color: 'var(--tc-primary)' }}>
          💡 Tip: You can also paste from clipboard (Ctrl+V / Cmd+V)
        </p>
      </div>

      {/* Preview */}
      {preview && state.phase !== 'idle' && (
        <div className="flex justify-center">
          <img src={preview} alt="Uploaded screenshot" className="max-w-full max-h-[300px] rounded-lg border" style={{ borderColor: 'var(--tc-border)' }} />
        </div>
      )}

      {/* OCR Progress */}
      {state.phase === 'ocr' && (
        <div className="text-center py-4">
          <div className="w-8 h-8 border-4 rounded-full animate-spin mx-auto" style={{ borderColor: 'var(--tc-primary-soft)', borderTopColor: 'var(--tc-primary)' }} />
          <p className="mt-2 font-semibold" style={{ color: 'var(--tc-primary)' }}>Reading text from image...</p>
          <p className="text-sm" style={{ color: 'var(--tc-text-muted)' }}>This may take a few seconds</p>
        </div>
      )}

      {/* Scanning Progress */}
      {state.phase === 'scanning' && (
        <div className="text-center py-4">
          <div className="w-8 h-8 border-4 rounded-full animate-spin mx-auto" style={{ borderColor: 'var(--tc-primary-soft)', borderTopColor: 'var(--tc-primary)' }} />
          <p className="mt-2 font-semibold" style={{ color: 'var(--tc-primary)' }}>Analyzing for scam signals...</p>
        </div>
      )}

      {/* Results */}
      {state.phase === 'done' && (
        <div className="flex flex-col gap-3">
          {/* No text found */}
          {!state.extractedText && (
            <div className="p-4 rounded-xl border text-center" style={{ borderColor: 'var(--tc-border)', background: 'var(--tc-surface)' }}>
              <p className="font-semibold" style={{ color: 'var(--tc-text-muted)' }}>
                Couldn't read any text from this image
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--tc-text-muted)' }}>
                Try a clearer screenshot, or type/paste the suspicious text directly into the main scan box
              </p>
            </div>
          )}

          {/* Extracted text */}
          {state.extractedText && (
            <div className="p-4 rounded-xl border" style={{ borderColor: 'var(--tc-border)', background: 'var(--tc-surface)' }}>
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--tc-text-muted)' }}>
                  Extracted Text
                </p>
                {state.ocrConfidence !== null && (
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{
                    background: state.ocrConfidence > 80 ? '#eafaf1' : state.ocrConfidence > 50 ? '#fef9e7' : '#fee2e2',
                    color: state.ocrConfidence > 80 ? 'var(--tc-safe)' : state.ocrConfidence > 50 ? 'var(--tc-warning)' : '#991b1b',
                  }}>
                    {state.ocrConfidence}% confidence
                  </span>
                )}
              </div>
              <p className="text-sm whitespace-pre-wrap leading-relaxed" style={{ color: 'var(--tc-text-main)' }}>
                {state.extractedText.length > 500 ? state.extractedText.slice(0, 500) + '...' : state.extractedText}
              </p>
            </div>
          )}

          {/* Scan result */}
          {state.scanResult && !state.scanResult.error && (
            <>
              <div
                className="p-4 rounded-xl border-2"
                style={{
                  borderColor: (threatColors[state.scanResult.riskLevel] ?? threatColors.safe).border,
                  background: (threatColors[state.scanResult.riskLevel] ?? threatColors.safe).bg,
                }}
              >
                <p className="font-bold text-lg" style={{ color: (threatColors[state.scanResult.riskLevel] ?? threatColors.safe).text }}>
                  {state.scanResult.riskLevel === 'safe' && '🟢 Low Risk'}
                  {state.scanResult.riskLevel === 'suspicious' && '🟡 Suspicious'}
                  {state.scanResult.riskLevel === 'high-risk' && '🟠 High Risk'}
                  {state.scanResult.riskLevel === 'very-likely-scam' && '🔴 Very Likely Scam'}
                </p>
              </div>

              {/* Why bullets */}
              {state.scanResult.whyBullets?.length > 0 && (
                <div className="p-4 rounded-xl border" style={{ borderColor: 'var(--tc-border)', background: 'var(--tc-surface)' }}>
                  <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: 'var(--tc-text-muted)' }}>
                    What We Found
                  </p>
                  <ul className="flex flex-col gap-1.5 text-sm">
                    {state.scanResult.whyBullets.map((bullet: string, i: number) => (
                      <li key={i} className="flex gap-2">
                        <span>•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* AI Detection */}
              {state.scanResult.ai_detection && state.scanResult.ai_detection.label !== 'TOO_SHORT' && (
                <div className="p-3 rounded-xl border" style={{
                  borderColor: state.scanResult.ai_detection.ai_probability > 0.7 ? '#fecaca' : 'var(--tc-border)',
                  background: state.scanResult.ai_detection.ai_probability > 0.7 ? '#fee2e2' : 'var(--tc-surface)',
                }}>
                  <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--tc-text-muted)' }}>
                    🤖 AI Detection
                  </p>
                  <p className="text-sm font-semibold" style={{ color: state.scanResult.ai_detection.ai_probability > 0.7 ? '#991b1b' : 'var(--tc-safe)' }}>
                    {state.scanResult.ai_detection.label === 'AI_GENERATED' && `${Math.round(state.scanResult.ai_detection.ai_probability * 100)}% likely AI-generated`}
                    {state.scanResult.ai_detection.label === 'UNCERTAIN' && `Uncertain — ${Math.round(state.scanResult.ai_detection.ai_probability * 100)}% AI probability`}
                    {state.scanResult.ai_detection.label === 'LIKELY_HUMAN' && 'Appears to be human-written'}
                  </p>
                </div>
              )}

              {/* Disclaimer */}
              <p className="text-xs leading-relaxed" style={{ color: 'var(--tc-text-muted)' }}>
                ⚠️ This analysis is based on automated pattern matching and may not be accurate. It does not constitute professional advice.
                Results generated {new Date().toLocaleDateString('en-CA')}. When in doubt, contact the{' '}
                <a href="https://antifraudcentre-centreantifraude.ca/" target="_blank" rel="noopener" style={{ color: 'var(--tc-primary)' }}>
                  Canadian Anti-Fraud Centre
                </a>.
              </p>
            </>
          )}
        </div>
      )}

      {/* Error */}
      {state.phase === 'error' && (
        <div className="p-4 rounded-xl border text-center" style={{ borderColor: '#fecaca', background: '#fee2e2' }}>
          <p className="font-semibold" style={{ color: '#991b1b' }}>Something went wrong</p>
          <p className="text-sm mt-1" style={{ color: '#991b1b' }}>{state.error}</p>
        </div>
      )}
    </div>
  );
}
