import type { Metadata } from 'next';
import { EmailHeaderAnalyzer } from '@/components/tools/EmailHeaderAnalyzer';
import { BackButton } from '@/components/BackButton';

export const metadata: Metadata = {
  title: 'Email Header Analyzer',
  description:
    'Paste raw email headers to analyze sender information, SPF/DKIM/DMARC results, routing hops, spoofing indicators, and overall phishing risk.',
  openGraph: {
    title: 'Email Header Analyzer | TrustChekr',
    description:
      'Decode email headers to see authentication results, routing hops, and spoofing indicators before you trust a message.',
    url: 'https://trustchekr.com/tools/email-headers',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Email Header Analyzer | TrustChekr',
    description:
      'Analyze SPF, DKIM, DMARC and routing hops in email headers to spot phishing and spoofing attempts.',
  },
};

export default function EmailHeadersPage() {
  return (
    <div>
      <BackButton />
      <h1
        style={{
          margin: 0,
          fontSize: '2rem',
          fontWeight: 700,
          color: 'var(--tc-primary)',
        }}
      >
        Email Header Analyzer
      </h1>
      <p
        style={{
          margin: '0.5rem 0 1.5rem',
          fontSize: '1rem',
          color: 'var(--tc-text-muted)',
        }}
      >
        Paste raw email headers to see sender details, authentication results,
        routing hops, spoofing indicators, and a structured risk assessment.
      </p>
      <EmailHeaderAnalyzer />
    </div>
  );
}
