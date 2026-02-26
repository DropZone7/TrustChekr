import type { Metadata } from "next";
import "./globals.css";
import TextSizeControl from "@/components/TextSizeControl";
import HighContrastToggle from "@/components/HighContrastToggle";

export const metadata: Metadata = {
  title: "TrustChekr — Check if it's a scam",
  description:
    "Paste a message, website, phone number, or email and get a plain-language scam check in seconds. Free, private, no sign-up required.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <header className="w-full border-b border-[var(--tc-border)] bg-[var(--tc-surface)]">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="/" className="text-xl font-bold" style={{ color: "var(--tc-primary)" }}>
              🛡️ TrustChekr
            </a>
            <nav className="flex gap-4 text-sm" style={{ color: "var(--tc-text-muted)" }}>
              <a href="/" className="hover:underline">Home</a>
              <a href="/romance" className="hover:underline">Romance Check</a>
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
            <p>We never sell your information. Your checks stay private.</p>
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
