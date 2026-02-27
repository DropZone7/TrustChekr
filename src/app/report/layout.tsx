import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Report a Scam',
  description: 'Submit a scam report to help protect other Canadians. Your report helps build our community threat intelligence database.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
