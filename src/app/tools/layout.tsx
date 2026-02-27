import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Scam Detection Tools',
  description: 'Screenshot OCR scanner, QR code checker, document forensics, and reverse image search. All free, all private, no sign-up required.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
