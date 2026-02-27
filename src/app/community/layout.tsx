import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Community Scam Reports',
  description: 'Browse and submit scam reports from across Canada. Help protect your neighbours by sharing what you have seen.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
