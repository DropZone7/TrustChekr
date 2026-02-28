import { NextResponse } from 'next/server';

const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://trustchekr.com';

type ScamAlert = { id: string; title: string; description: string; link: string; publishedAt: string; category?: string };

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  let alerts: ScamAlert[] = [];

  try {
    const res = await fetch(`${base}/api/scam-intel/latest`, { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      const raw = json.alerts ?? json ?? [];
      alerts = raw.slice(0, 20).map((a: any) => ({
        id: a.id ?? a.slug ?? String(a.title),
        title: a.title ?? 'Scam Alert',
        description: a.summary ?? a.description ?? '',
        link: a.url ?? a.link ?? `${base}/safety/scams/${a.slug ?? a.id}`,
        publishedAt: a.publishedAt ?? a.createdAt ?? new Date().toISOString(),
        category: a.category,
      }));
    }
  } catch { /* empty feed is valid */ }

  const items = alerts.map((a) => `    <item>
      <guid isPermaLink="false">${escapeXml(a.id)}</guid>
      <title>${escapeXml(a.title)}</title>
      <link>${escapeXml(a.link)}</link>
      <description>${escapeXml(a.description)}</description>
      <pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate>${a.category ? `\n      <category>${escapeXml(a.category)}</category>` : ''}
    </item>`).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>TrustChekr Scam Alerts</title>
    <link>${base}</link>
    <description>Latest phone, email, and online scam alerts for Canadians.</description>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <language>en-ca</language>
${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
}
