import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-heading',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});
import TextSizeControl from "@/components/TextSizeControl";
import HighContrastToggle from "@/components/HighContrastToggle";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { BackToTop } from "@/components/BackToTop";
import { SkipToContent } from "@/components/SkipToContent";
import { ToastProvider } from "@/components/Toast";
import { MobileNav } from "@/components/MobileNav";

export const metadata: Metadata = {
  metadataBase: new URL("https://trustchekr.com"),
  title: {
    default: "TrustChekr — Free Canadian Scam Detection Tool",
    template: "%s | TrustChekr",
  },
  description:
    "Check if a website, phone number, email, or message is a scam. Free, private, no sign-up. Powered by OSINT and threat intelligence databases. Made in Canada.",
  applicationName: "TrustChekr",
  manifest: "/manifest.webmanifest",
  keywords: ["scam checker", "is this a scam", "scam detection canada", "phishing checker", "url scam checker", "phone scam checker canada", "email scam detector", "CRA scam", "romance scam canada", "fraud prevention canada"],
  openGraph: {
    title: "TrustChekr — Free Canadian Scam Detection Tool",
    description: "Paste a suspicious website, message, phone number, or email and get a plain-language risk assessment in seconds. Free and private.",
    url: "/",
    siteName: "TrustChekr",
    locale: "en_CA",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "TrustChekr — Free Canadian Scam Detection Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TrustChekr — Free Canadian Scam Detection Tool",
    description: "Free Canadian Scam Detection Tool",
    images: ["/twitter-image"],
  },
  icons: {
    icon: "/favicon.png",
    apple: "/apple-icon.png",
  },
  other: {
    "theme-color": "#A40000",
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
        <link rel="alternate" hrefLang="en" href="https://trustchekr.com" />
        <link rel="alternate" hrefLang="fr" href="https://trustchekr.com/fr" />
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
      <body className={`min-h-screen flex flex-col ${jakarta.variable} ${inter.variable}`}>
        <SkipToContent />
        <ToastProvider>
        <header className="w-full border-b border-[var(--tc-border)] bg-[var(--tc-surface)]" style={{ position: 'relative' }}>
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2 text-xl font-bold" style={{ color: "var(--tc-primary)" }}>
              <img src="/logo.png" alt="TrustChekr" width={36} height={36} style={{ borderRadius: 4 }} />
              TrustChekr
            </a>
            <MobileNav />
          </div>
        </header>

        <main id="main-content" className="flex-1 w-full max-w-2xl mx-auto px-4 py-8">
          {children}
        </main>
        <BackToTop />

        <footer className="w-full border-t border-[var(--tc-border)] bg-[var(--tc-surface)]">
          <div className="max-w-2xl mx-auto px-4 py-4 text-sm" style={{ color: "var(--tc-text-muted)" }}>
            <div className="flex items-center justify-between">
              <p>© 17734344 Canada Inc. <a href="/privacy" className="underline">Privacy</a> · <a href="/about" className="underline">About</a></p>
              <div className="flex items-center gap-3">
                <HighContrastToggle />
                <DarkModeToggle />
                <TextSizeControl />
              </div>
            </div>
          </div>
        </footer>
        </ToastProvider>
      </body>
    </html>
  );
}
