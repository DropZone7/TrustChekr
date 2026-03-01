'use client';

import React, { useState } from 'react';

import type { ScanResult } from '@/lib/types';

type ShareResultProps = {
  result: ScanResult;
  riskLabel: string;
  riskColor: string;
};

export function ShareResult({ result }: ShareResultProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const textToCopy = result.shareText;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleTweet = () => {
    const text = `${result.shareText} — Check yours free at trustchekr.com`;
    const url = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(text);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleFacebookShare = () => {
    const url =
      'https://www.facebook.com/sharer/sharer.php?u=' +
      encodeURIComponent('https://trustchekr.com');
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      style={{
        marginTop: '24px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
      }}
    >
      <button
        type="button"
        onClick={handleCopy}
        style={{
          height: '44px',
          padding: '0 16px',
          borderRadius: '12px',
          border: '1px solid var(--tc-border)',
          backgroundColor: 'var(--tc-primary-soft)',
          color: 'var(--tc-text-main)',
          fontSize: '14px',
          fontWeight: 500,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}
      >
        <span>📋</span>
        <span>{copied ? 'Copied!' : 'Copy result text'}</span>
      </button>

      <button
        type="button"
        onClick={handleTweet}
        style={{
          height: '44px',
          padding: '0 16px',
          borderRadius: '12px',
          border: '1px solid var(--tc-border)',
          backgroundColor: 'var(--tc-primary)',
          color: '#ffffff',
          fontSize: '14px',
          fontWeight: 500,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}
      >
        <span>🐦</span>
        <span>Share on X</span>
      </button>

      <button
        type="button"
        onClick={handleFacebookShare}
        style={{
          height: '44px',
          padding: '0 16px',
          borderRadius: '12px',
          border: '1px solid var(--tc-border)',
          backgroundColor: 'var(--tc-surface)',
          color: 'var(--tc-text-main)',
          fontSize: '14px',
          fontWeight: 500,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}
      >
        <span>📘</span>
        <span>Share on Facebook</span>
      </button>
    </div>
  );
}
