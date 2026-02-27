import type { Metadata } from "next";
import "./globals.css";
import TextSizeControl from "@/components/TextSizeControl";
import HighContrastToggle from "@/components/HighContrastToggle";

export const metadata: Metadata = {
  title: "TrustChekr — Free Canadian Scam Detection Tool",
  description:
    "Check if a website, phone number, email, or message is a scam. Free, private, no sign-up. Powered by OSINT and threat intelligence databases. Made in Canada.",
  keywords: ["scam checker", "is this a scam", "scam detection canada", "phishing checker", "url scam checker", "phone scam checker canada", "email scam detector", "CRA scam", "romance scam canada", "fraud prevention canada"],
  openGraph: {
    title: "TrustChekr — Free Canadian Scam Detection Tool",
    description: "Paste a suspicious website, message, phone number, or email and get a plain-language risk assessment in seconds. Free and private.",
    url: "https://trustchekr.com",
    siteName: "TrustChekr",
    locale: "en_CA",
    type: "website",
  },
  alternates: {
    canonical: "https://trustchekr.com",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "TrustChekr",
              url: "https://trustchekr.com",
              description: "Free Canadian scam detection tool. Check websites, phone numbers, emails, and messages for scam indicators.",
              applicationCategory: "SecurityApplication",
              operatingSystem: "Any",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "CAD",
              },
              creator: {
                "@type": "Organization",
                name: "TrustChekr",
                url: "https://trustchekr.com",
              },
            }),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <header className="w-full border-b border-[var(--tc-border)] bg-[var(--tc-surface)]">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="/" className="text-xl font-bold" style={{ color: "var(--tc-primary)" }}>
              🛡️ TrustChekr
            </a>
            <nav className="flex gap-4 text-sm" style={{ color: "var(--tc-text-muted)" }}>
              <a href="/" className="hover:underline">Home</a>
              <a href="/academy" className="hover:underline">Academy</a>
              <a href="/tools" className="hover:underline">Tools</a>
              <a href="/report" className="hover:underline">Report</a>
              <a href="/learn" className="hover:underline">Learn</a>
              <a href="/help" className="hover:underline">Help</a>
            </nav>
          </div>
        </header>

        <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-8">
          {children}
        </main>

        <footer className="w-full border-t border-[var(--tc-border)] bg-[var(--tc-surface)]">
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between text-sm" style={{ color: "var(--tc-text-muted)" }}>
            <p>We never sell your information. <a href="/privacy" className="underline">Privacy & Terms</a></p>
            <div className="flex items-center gap-3">
              <HighContrastToggle />
              <TextSizeControl />
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
