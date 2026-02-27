'use client';

import { useState } from 'react';

interface CertificateGeneratorProps {
  completedModules: number;
}

export function CertificateGenerator({ completedModules }: CertificateGeneratorProps) {
  const [name, setName] = useState('');
  const [generated, setGenerated] = useState(false);

  if (completedModules < 1) return null;

  const certUrl = `/api/certificate?name=${encodeURIComponent(name || 'Participant')}&modules=${completedModules}&date=${new Date().toLocaleDateString('en-CA')}`;

  function handleDownload() {
    // Open SVG in new tab — user can save/print
    window.open(certUrl, '_blank');
    setGenerated(true);
  }

  return (
    <div className="p-4 rounded-xl" style={{ background: 'var(--tc-primary-soft)', border: '2px solid var(--tc-primary)' }}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">🏆</span>
        <h3 className="font-bold" style={{ color: 'var(--tc-primary)' }}>
          {completedModules >= 8 ? 'Congratulations! Get Your Certificate' : `${completedModules}/8 Modules Complete — Keep Going!`}
        </h3>
      </div>

      {completedModules >= 4 && (
        <>
          <p className="text-sm mb-3" style={{ color: 'var(--tc-text-muted)' }}>
            {completedModules >= 8
              ? 'You\'ve completed the full Online Safety Academy! Generate your certificate to share on LinkedIn or print.'
              : 'You\'re eligible for a progress certificate. Complete all 8 modules for the full certificate!'}
          </p>

          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--tc-text-muted)' }}>
                Your name (for the certificate)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-3 py-2 rounded-lg text-sm"
                style={{ border: '1px solid var(--tc-border)', background: 'white' }}
                maxLength={60}
              />
            </div>
            <button
              onClick={handleDownload}
              disabled={!name.trim()}
              className="px-4 py-2 rounded-lg font-semibold text-sm text-white transition-all"
              style={{
                background: name.trim() ? 'var(--tc-primary)' : 'var(--tc-border)',
                cursor: name.trim() ? 'pointer' : 'not-allowed',
              }}
            >
              🎓 Generate Certificate
            </button>
          </div>

          {generated && (
            <p className="text-xs mt-2" style={{ color: 'var(--tc-safe)' }}>
              ✅ Certificate opened in new tab — save or print it! Share on LinkedIn to show your commitment to online safety.
            </p>
          )}
        </>
      )}
    </div>
  );
}
