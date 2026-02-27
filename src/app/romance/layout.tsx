import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Romance Scam Assessment',
  description: 'Confidential, blame-free assessment tool for potential romance scams. Answer a few questions and get a clear risk picture.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
