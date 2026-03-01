import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

interface TrendData {
  lastUpdated: string;
  categories: Array<{
    name: string;
    level: 'low' | 'moderate' | 'high' | 'critical';
    emoji: string;
    description: string;
    postCount: number;
    change: 'rising' | 'stable' | 'falling';
  }>;
}

const DEFAULT_TRENDS: TrendData = {
  lastUpdated: new Date().toISOString(),
  categories: [
    { name: "CRA / IRS Tax Scams", level: "moderate", emoji: "🏛️", description: "Steady reports of tax impersonation calls", postCount: 0, change: "stable" },
    { name: "Bank Impersonation", level: "moderate", emoji: "🏦", description: "Fake fraud department calls via Zelle", postCount: 0, change: "stable" },
    { name: "Crypto & Investment", level: "high", emoji: "💰", description: "Pig butchering and fake trading platforms", postCount: 0, change: "rising" },
    { name: "Romance Scams", level: "moderate", emoji: "💔", description: "Dating app to crypto pipeline active", postCount: 0, change: "stable" },
    { name: "AI-Powered Scams", level: "high", emoji: "🤖", description: "Voice cloning and deepfake reports increasing", postCount: 0, change: "rising" },
  ],
};

export async function GET() {
  try {
    const cachePath = join(process.cwd(), 'data', 'scam-trends.json');
    const data = await readFile(cachePath, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch {
    return NextResponse.json(DEFAULT_TRENDS);
  }
}
