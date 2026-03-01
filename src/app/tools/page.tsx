'use client';

import { BackButton } from '@/components/BackButton';

import { useState } from 'react';
import { Smartphone, ScanLine, FileText, HeartCrack, Lock, AlertTriangle, Search } from 'lucide-react';
import { ScreenshotScanner } from '@/components/scanners/ScreenshotScanner';
import { QRScanner } from '@/components/scanners/QRScanner';
import { DocumentScanner } from '@/components/scanners/DocumentScanner';
import { ReverseImageSearch } from '@/components/scanners/ReverseImageSearch';

type Tool = 'screenshot' | 'qr' | 'document' | 'reverse-image';

const TOOL_ICONS: Record<Tool, React.ComponentType<any>> = {
  screenshot: Smartphone,
  qr: ScanLine,
  document: FileText,
  'reverse-image': HeartCrack,
};

const tools: { id: Tool; title: string; desc: string }[] = [
  { id: 'screenshot', title: 'Screenshot Scanner', desc: 'Upload a screenshot of a suspicious text, email, or DM' },
  { id: 'qr', title: 'QR Code Scanner', desc: 'Check if a QR code leads to a scam website' },
  { id: 'document', title: 'Document Checker', desc: 'Check if an image or document has been manipulated' },
  { id: 'reverse-image', title: 'Reverse Image Search', desc: 'Check if a photo from a romance interest is stolen' },
];

export default function ToolsPage() {
  const [activeTool, setActiveTool] = useState<Tool | null>(null);

  return (
    <main className="min-h-screen p-4 sm:p-8 flex flex-col items-center" style={{ background: 'var(--tc-bg)' }}>
      <BackButton />
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

        {/* Featured: Scam Lookup */}
        <a href="/tools/lookup" className="block p-4 rounded-xl transition-all tc-card"
          style={{ background: 'var(--tc-primary)', color: 'white', textDecoration: 'none' }}>
          <div className="flex items-center gap-3">
            <Search size={24} />
            <div>
              <p className="font-semibold">Scam Lookup</p>
              <p className="text-sm opacity-85">Check if a phone number, email, or URL has been reported in a scam</p>
            </div>
            <span className="text-xl opacity-75 ml-auto">→</span>
          </div>
        </a>

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
              <span className="text-2xl">{(() => { const Icon = TOOL_ICONS[tool.id]; return <Icon size={24} strokeWidth={1.75} />; })()}</span>
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
            <Lock size={16} strokeWidth={1.75} style={{ display: 'inline', verticalAlign: 'text-bottom' }} /> All image processing happens in your browser. Your files are never uploaded to our servers.
          </p>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-center leading-relaxed" style={{ color: 'var(--tc-text-muted)' }}>
          <AlertTriangle size={16} strokeWidth={1.75} style={{ display: 'inline', verticalAlign: 'text-bottom' }} /> These tools use automated analysis and may not be accurate. Results do not constitute professional advice.
          When in doubt, contact the{' '}
          <a href="https://antifraudcentre-centreantifraude.ca/" target="_blank" rel="noopener" style={{ color: 'var(--tc-primary)' }}>
            Canadian Anti-Fraud Centre
          </a>.
        </p>
      </div>
    </main>
  );
}
