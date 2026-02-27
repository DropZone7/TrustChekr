import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'North American Scam Heat Map',
  description: 'Interactive map showing scam activity across Canadian provinces and US states. See where fraud is hitting hardest.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
