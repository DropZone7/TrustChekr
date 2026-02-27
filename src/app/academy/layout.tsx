import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Scam Defence Academy — Free Courses',
  description: 'Free interactive courses on phishing, phone scams, romance fraud, identity theft, and more. Earn certificates and track your progress.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
