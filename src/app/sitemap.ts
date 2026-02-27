import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://trustchekr.com';

  return [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${base}/academy`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    ...['phishing-basics', 'phone-scams', 'romance-scams', 'online-shopping', 'identity-theft', 'investment-fraud', 'social-media', 'ai-scams'].map((slug) => ({
      url: `${base}/academy/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    { url: `${base}/tools`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/community`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${base}/map`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/report`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/learn`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/learn/ai-deanonymization`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/stats`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.6 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/about/founder`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/press`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/api-docs`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/help`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/romance`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ];
}
