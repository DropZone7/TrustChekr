import { NextRequest, NextResponse } from 'next/server';

const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://trustchekr.com';

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

type Alert = { id: string; title: string; summary: string; url: string; category?: string };
type Report = { id: string; title: string; summary: string; region?: string };
type Trend = { id: string; name: string; changeDescription: string };

async function fetchAlerts(): Promise<Alert[]> {
  try {
    const res = await fetch(`${base}/api/scam-intel/latest`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.alerts ?? json ?? []).slice(0, 10).map((a: any) => ({
      id: a.id ?? a.slug,
      title: a.title ?? 'Alert',
      summary: a.summary ?? a.description ?? '',
      url: a.url ?? a.link ?? `${base}/safety/scams/${a.slug ?? a.id}`,
      category: a.category,
    }));
  } catch { return []; }
}

async function fetchReports(): Promise<Report[]> {
  try {
    const res = await fetch(`${base}/api/community/reports`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.reports ?? json ?? []).slice(0, 5).map((r: any) => ({
      id: r.id,
      title: r.title ?? r.scam_type ?? 'Community Report',
      summary: r.summary ?? r.message ?? '',
      region: r.region ?? r.province,
    }));
  } catch { return []; }
}

const SAMPLE_ALERTS: Alert[] = [
  { id: 's1', title: 'CRA tax refund text with suspicious link', summary: 'Text messages claiming a tax refund is ready, with a link to a fake CRA website.', url: `${base}/threats` },
  { id: 's2', title: 'Bank fraud department call asking to move money', summary: 'Callers impersonating bank fraud departments, pressuring people to transfer funds to a "safe" account.', url: `${base}/threats` },
];

const SAMPLE_REPORTS: Report[] = [
  { id: 'sr1', title: 'Suspicious package delivery SMS', summary: 'Several people reported texts claiming a package needs a small fee to release.', region: 'Ontario' },
];

const SAMPLE_TRENDS: Trend[] = [
  { id: 'st1', name: 'Romance scams using crypto', changeDescription: 'Increased activity in romance scams requesting cryptocurrency payments.' },
  { id: 'st2', name: 'Fake delivery fee texts', changeDescription: 'Spike in SMS scams impersonating Canada Post and courier services.' },
];

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const preview = url.searchParams.get('preview') === '1';

  let alerts = await fetchAlerts();
  let reports = await fetchReports();
  let trends: Trend[] = []; // No dedicated trends endpoint yet

  // Preview/QA mode fills empty sections
  if (preview) {
    if (!alerts.length) alerts = SAMPLE_ALERTS;
    if (!reports.length) reports = SAMPLE_REPORTS;
    if (!trends.length) trends = SAMPLE_TRENDS;
  }

  const alertRows = alerts.length
    ? alerts.map((a) => `<tr><td style="padding:8px 0;border-bottom:1px solid #e5e7eb;">
        <div style="font-weight:600;font-size:14px;color:#111827;">${escapeHtml(a.title)}</div>
        <div style="font-size:13px;color:#4b5563;margin-top:2px;">${escapeHtml(a.summary)}</div>
        ${a.url ? `<a href="${escapeHtml(a.url)}" style="font-size:12px;color:#1a5276;">Read more</a>` : ''}
      </td></tr>`).join('')
    : '<tr><td style="padding:12px 0;font-size:13px;color:#9ca3af;">No specific alerts were added this week.</td></tr>';

  const reportRows = reports.length
    ? reports.map((r) => `<tr><td style="padding:8px 0;border-bottom:1px solid #e5e7eb;">
        <div style="font-weight:600;font-size:14px;color:#111827;">${escapeHtml(r.title)}</div>
        <div style="font-size:13px;color:#4b5563;margin-top:2px;">${escapeHtml(r.summary)}</div>
        ${r.region ? `<div style="font-size:11px;color:#9ca3af;margin-top:2px;">Region: ${escapeHtml(r.region)}</div>` : ''}
      </td></tr>`).join('')
    : '<tr><td style="padding:12px 0;font-size:13px;color:#9ca3af;">No new community reports this week.</td></tr>';

  const trendRows = trends.length
    ? trends.map((t) => `<tr><td style="padding:8px 0;border-bottom:1px solid #e5e7eb;">
        <div style="font-weight:600;font-size:14px;color:#111827;">${escapeHtml(t.name)}</div>
        <div style="font-size:13px;color:#4b5563;margin-top:2px;">${escapeHtml(t.changeDescription)}</div>
      </td></tr>`).join('')
    : '';

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head><body style="margin:0;padding:0;background-color:#f3f4f6;font-family:system-ui,-apple-system,BlinkMacSystemFont,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f3f4f6;">
  <tr><td align="center" style="padding:20px 10px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:#ffffff;border-collapse:collapse;border-radius:8px;overflow:hidden;">
      <!-- Header -->
      <tr><td style="background-color:#1a5276;padding:18px 16px;">
        <table width="100%"><tr>
          <td style="font-size:22px;font-weight:700;color:#ffffff;">🛡️ TrustChekr</td>
          <td align="right" style="font-size:13px;color:#dbeafe;">Weekly Scam Digest</td>
        </tr></table>
        <div style="font-size:12px;color:#93c5fd;margin-top:6px;">A short update on phone, email, and online scams affecting Canadians this week.</div>
      </td></tr>
      <!-- Intro -->
      <tr><td style="padding:16px 16px 8px;">
        <p style="margin:0;font-size:14px;color:#374151;line-height:1.5;">If something in this email sounds familiar, take a moment to pause before you respond. You have not done anything wrong by being careful.</p>
      </td></tr>
      <!-- Alerts -->
      <tr><td style="padding:8px 16px 16px;">
        <h2 style="margin:0 0 8px;font-size:16px;font-weight:700;color:#111827;">This week&rsquo;s top scam alerts</h2>
        <table width="100%" cellpadding="0" cellspacing="0" border="0">${alertRows}</table>
      </td></tr>
      <!-- Community -->
      <tr><td style="padding:8px 16px 16px;">
        <h2 style="margin:0 0 8px;font-size:16px;font-weight:700;color:#111827;">New community reports</h2>
        <table width="100%" cellpadding="0" cellspacing="0" border="0">${reportRows}</table>
      </td></tr>
      ${trends.length ? `<!-- Trends -->
      <tr><td style="padding:8px 16px 16px;">
        <h2 style="margin:0 0 8px;font-size:16px;font-weight:700;color:#111827;">Trending scam types</h2>
        <table width="100%" cellpadding="0" cellspacing="0" border="0">${trendRows}</table>
      </td></tr>` : ''}
      <!-- Footer -->
      <tr><td style="background-color:#f3f4f6;padding:14px 16px;">
        <p style="margin:0;font-size:11px;color:#9ca3af;line-height:1.5;">This email is for general information only and cannot guarantee whether something is legitimate. If something feels off, contact your bank or the company directly using contact details from their official website.</p>
        <p style="margin:8px 0 0;font-size:11px;color:#9ca3af;"><a href="${base}" style="color:#1a5276;">trustchekr.com</a></p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
}
