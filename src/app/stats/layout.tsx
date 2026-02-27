import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TrustChekr Stats Dashboard',
  description: 'Live platform statistics showing how Canadians are using TrustChekr to detect and report scams.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
