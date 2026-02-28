import type { Metadata } from 'next';
import { ChatScanner } from '@/components/chat/ChatScanner';

export const metadata: Metadata = {
  title: 'Chat with TrustChekr',
  description:
    'Describe suspicious messages or calls in plain language and get a clear risk assessment and practical advice from TrustChekr.',
  openGraph: {
    title: 'Chat with TrustChekr | Scam Checker',
    description:
      'Paste texts, emails, or stories about what happened and get an easy-to-understand risk assessment and next steps.',
    url: 'https://trustchekr.com/chat',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chat with TrustChekr',
    description:
      'A conversational scam checker designed for Canadians, in plain language and without blame.',
  },
};

export default function ChatPage() {
  return (
    <div>
      <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 700, color: 'var(--tc-primary)' }}>
        Chat with TrustChekr
      </h1>
      <p style={{ margin: '0.5rem 0 1.5rem', fontSize: '1rem', color: 'var(--tc-text-muted)' }}>
        Tell us what&apos;s going on in your own words. For example: &ldquo;Someone texted me saying I won a
        prize&rdquo; or &ldquo;I got an email from CRA asking for my SIN.&rdquo; You haven&apos;t done
        anything wrong by being cautious.
      </p>
      <ChatScanner />
    </div>
  );
}
