// PERPLEXITY RAW — Prompt 1: Trust Score Page (/check/[domain])
// Status: NEEDS REVIEW + MERGE
// Issues to check: server component with client-side exportData(), generateMetadata params format (Next 16), fetch URL

import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';

type ScanData = {
  trustScore: number;
  domain: {
    registrar?: string;
    creationDate?: string;
    country?: string;
    sslStatus?: 'valid' | 'invalid' | 'none';
  };
  riskFactors: Array<{
    name: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
  }>;
  osint: Record<string, any>;
};

type PageProps = {
  params: { domain: string };
  searchParams: { data?: string };
};

export async function generateMetadata(
  { params, searchParams }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const domain = params.domain;
  return {
    title: `${domain} Trust Score | TrustChekr`,
    description: `Detailed trust analysis for ${domain}. See risk factors, OSINT results, and overall safety score.`,
    openGraph: {
      title: `${domain} Trust Score`,
      description: `TrustChekr analysis: ${domain} scored ${0} / 100`,
      url: `https://trustchekr.com/check/${domain}`,
    },
  };
}

async function fetchScanData(domain: string): Promise<ScanData | null> {
  try {
    const response = await fetch(`https://trustchekr.com/api/scan?domain=${domain}`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

export default async function TrustScorePage({ params, searchParams }: PageProps) {
  const domain = params.domain;
  let data: ScanData | null = null;

  if (searchParams.data) {
    try {
      data = JSON.parse(decodeURIComponent(searchParams.data)) as ScanData;
    } catch {}
  }

  if (!data) {
    data = await fetchScanData(domain);
  }

  if (!data) {
    notFound();
  }

  const { trustScore, domain: domainInfo, riskFactors, osint } = data;

  const scoreColor =
    trustScore < 30 ? '#ef4444' : trustScore < 60 ? '#f59e0b' : '#10b981';

  const severityColors: Record<string, string> = {
    low: '#10b981',
    medium: '#f59e0b',
    high: '#ef4444',
  };

  // NOTE: exportData is client-side only — needs 'use client' or separate component
  const exportData = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${domain}-trustchekr-report.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // TODO: Perplexity code was cut off here — need the JSX return
  return null;
}
