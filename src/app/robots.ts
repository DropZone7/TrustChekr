import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/tc47x/', '/admin/', '/api/'],
      },
      {
        userAgent: '*',
        allow: '/api/v1/',
      },
    ],
    sitemap: 'https://trustchekr.com/sitemap.xml',
  };
}
