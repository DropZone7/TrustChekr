import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1a5276',
          borderRadius: '50%',
        }}
      >
        <span style={{ fontSize: 20, color: '#ffffff' }}>🛡</span>
      </div>
    ),
    { ...size }
  );
}
