'use client';

import { useState } from 'react';
import { ScreenshotScanner } from '@/components/scanners/ScreenshotScanner';
import { QRScanner } from '@/components/scanners/QRScanner';
import { DocumentScanner } from '@/components/scanners/DocumentScanner';
import { ReverseImageSearch } from '@/components/scanners/ReverseImageSearch';

type Tool = 'screenshot' | 'qr' | 'document' | 'reverse-image';

const tools: { id: Tool; emoji: string; title: string; desc: string }[] = [
  { id: 'screenshot', emoji: '📱', title: 'Screenshot Scanner', desc: 'Upload a screenshot of a suspicious text, email, or DM' },
  { id: 'qr', emoji: '📷', title: 'QR Code Scanner', desc: 'Check if a QR code leads to a scam website' },
  { id: 'document', emoji: '📄', title: 'Document Checker', desc: 'Check if an image or document has been manipulated' },
  { id: 'reverse-image', emoji: '💔', title: 'Reverse Image Search', desc: 'Check if a photo from a romance interest is stolen' },
];

export default function ToolsPage() {
  const [activeTool, setActiveTool] = useState<Tool | null>(null);

  return (
    <main className="min-h-screen p-4 sm:p-8 flex flex-col items-center" style={{ background: 'var(--tc-bg)' }}>
      <div className="w-full max-w-2xl flex flex-col gap-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--tc-primary)' }}>
            Advanced Scan Tools
          </h1>
          <p className="mt-2" style={{ color: 'var(--tc-text-muted)' }}>
            Specialized scanners for screenshots, QR codes, and documents.
            <br />All processing happens in your browser — nothing leaves your device.
          </p>
        </div>

        {/* Tool picker */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(activeTool === tool.id ? null : tool.id)}
              className="p-4 rounded-xl text-center transition-all tc-card"
              style={{
                background: activeTool === tool.id ? 'var(--tc-primary)' : 'var(--tc-surface)',
                color: activeTool === tool.id ? 'white' : 'var(--tc-text-main)',
                border: `2px solid ${activeTool === tool.id ? 'var(--tc-primary)' : 'var(--tc-border)'}`,
                cursor: 'pointer',
              }}
            >
              <span className="text-2xl">{tool.emoji}</span>
              <p className="font-semibold mt-1 text-sm">{tool.title}</p>
              <p className="text-xs mt-0.5" style={{ opacity: 0.8 }}>{tool.desc}</p>
            </button>
          ))}
        </div>

        {/* Active scanner */}
        {activeTool === 'screenshot' && <ScreenshotScanner />}
        {activeTool === 'qr' && <QRScanner />}
        {activeTool === 'document' && <DocumentScanner />}
        {activeTool === 'reverse-image' && <ReverseImageSearch />}

        {/* Privacy note */}
        <div className="text-center p-3 rounded-xl" style={{ background: 'var(--tc-primary-soft)' }}>
          <p className="text-sm" style={{ color: 'var(--tc-primary)' }}>
            🔒 All image processing happens in your browser. Your files are never uploaded to our servers.
          </p>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-center leading-relaxed" style={{ color: 'var(--tc-text-muted)' }}>
          ⚠️ These tools use automated analysis and may not be accurate. Results do not constitute professional advice.
          When in doubt, contact the{' '}
          <a href="https://antifraudcentre-centreantifraude.ca/" target="_blank" rel="noopener" style={{ color: 'var(--tc-primary)' }}>
            Canadian Anti-Fraud Centre
          </a>.
        </p>
      </div>
    </main>
  );
}
