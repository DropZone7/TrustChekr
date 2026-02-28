import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'TrustChekr',
    short_name: 'TrustChekr',
    description: 'Free Canadian Scam Detection Tool',
    start_url: '/',
    display: 'standalone',
    background_color: '#fafafa',
    theme_color: '#A40000',
    icons: [
      { src: '/icon', sizes: '32x32', type: 'image/png' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  };
}
