import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'TrustChekr — Free Canadian Scam Detection Tool';

export default function TwitterImage() {
  const primary = '#1a5276';
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px 96px',
          backgroundColor: primary,
          color: '#ffffff',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div
              style={{
                width: 88,
                height: 88,
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: 52, color: primary }}>🛡</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 72, fontWeight: 700, letterSpacing: 1.5 }}>
                TrustChekr
              </div>
              <div style={{ marginTop: 8, fontSize: 32, fontWeight: 500 }}>
                Free Canadian Scam Detection Tool
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            fontSize: 26,
          }}
        >
          <div style={{ maxWidth: '70%', lineHeight: 1.5 }}>
            🛡 Check websites, messages, phone numbers &amp; emails
          </div>
          <div style={{ fontSize: 24, opacity: 0.9 }}>trustchekr.com</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
