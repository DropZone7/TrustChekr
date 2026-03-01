import { MailOpen, Globe, Smartphone, Mail, Coins, Gift, Bot, Shield, AlertTriangle } from 'lucide-react';
import type { Metadata } from 'next';

const ARTICLE_ICONS: Record<string, React.ComponentType<any>> = {
  '💌': MailOpen,
  '🌐': Globe,
  '📱': Smartphone,
  '📧': Mail,
  '💰': Coins,
  '🎁': Gift,
};

export const metadata: Metadata = {
  title: 'Learn About Scams',
  description: 'Free guides on spotting phishing, phone scams, romance fraud, and more. Protect yourself and your family with plain-language scam education.',
};

export default function LearnPage() {
  const articles = [
    {
      emoji: "💌",
      title: "Romance Scams: How They Work",
      summary: "Someone online says they love you and then asks for money? Here's how to spot the signs.",
      tips: [
        "They say \"I love you\" very quickly — often within days or weeks.",
        "They always have an excuse not to video call or meet in person.",
        "They have a crisis that only your money can solve.",
        "They want you to pay with gift cards, crypto, or wire transfers.",
        "They asked you to move off the dating app to WhatsApp or Telegram.",
      ],
    },
    {
      emoji: "🌐",
      title: "Fake Websites That Steal Your Info",
      summary: "A website that looks like your bank but isn't? Scammers create convincing copies to steal your login.",
      tips: [
        "Check the website address carefully — scammers use addresses that look almost right (e.g., td-banking.xyz instead of td.com).",
        "Real banks never send you a link and ask you to log in urgently.",
        "Look for strange domain endings like .xyz, .top, .buzz, or .click.",
        "When in doubt, type your bank's address directly into your browser.",
      ],
    },
    {
      emoji: "📱",
      title: "Phone Scams and Spoofed Numbers",
      summary: "That call from the 'CRA' threatening to arrest you? It's not real. Here's how phone scams work.",
      tips: [
        "The CRA, IRS, and police will never call and threaten to arrest you.",
        "Scammers can make any number appear on your caller ID — even your bank's real number.",
        "If someone says you owe money and must pay right now, hang up.",
        "Call back using the number on the official website or the back of your card.",
      ],
    },
    {
      emoji: "📧",
      title: "Phishing Emails That Look Real",
      summary: "An email from Amazon about a purchase you didn't make? Don't click that link.",
      tips: [
        "Check the sender's email address — scammers use addresses like support@amaz0n-help.com.",
        "Hover over links before clicking to see where they really go.",
        "Real companies won't ask for your password or full card number by email.",
        "If an email says something went wrong with your account, go to the website directly instead of clicking the link.",
      ],
    },
    {
      emoji: "💰",
      title: "Crypto and Investment Scams",
      summary: "Guaranteed returns? A special trading platform? If it sounds too good to be true, it probably is.",
      tips: [
        "No legitimate investment guarantees returns — especially not 10%, 50%, or 100% per week.",
        "Scammers create fake trading platforms that show fake profits to keep you investing more.",
        "\"Pig butchering\" scams combine romance and investment — they gain your trust, then push you to invest.",
        "Real financial advisors don't contact you on dating apps or social media.",
      ],
    },
    {
      emoji: "🎁",
      title: "Gift Card Scams",
      summary: "No real company, government, or person in need asks to be paid in gift cards. Ever.",
      tips: [
        "If anyone asks you to buy gift cards and read them the numbers — it's a scam, 100% of the time.",
        "The CRA, IRS, and utility companies do not accept gift cards as payment.",
        "Once you share gift card numbers, the money is gone and cannot be recovered.",
        "If you're at a store buying gift cards and the cashier warns you, listen to them.",
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center pt-4">
        <h1 className="text-3xl font-bold" style={{ color: "var(--tc-primary)" }}>
          Learn About Common Scams
        </h1>
        <p className="mt-2" style={{ color: "var(--tc-text-muted)" }}>
          Knowledge is your best protection. These guides explain common scams in simple language.
        </p>
      </div>

      {/* Featured article */}
      <a
        href="/learn/ai-deanonymization"
        className="block p-6 rounded-xl border-2 transition-all hover:shadow-lg"
        style={{ borderColor: "var(--tc-danger)", background: "#fdedec" }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: "var(--tc-danger)", color: "white" }}>
            NEW
          </span>
          <span className="text-xs font-medium" style={{ color: "var(--tc-danger)" }}>
            February 26, 2026
          </span>
        </div>
        <h2 className="text-xl font-bold" style={{ color: "var(--tc-text-main)" }}>
          <Bot size={20} strokeWidth={1.75} style={{ display: 'inline', verticalAlign: 'text-bottom' }} /> How AI Can Figure Out Who You Are — Even From Anonymous Posts
        </h2>
        <p className="mt-2" style={{ color: "var(--tc-text-muted)" }}>
          New research shows AI can identify anonymous internet users from their posts alone — at 67% accuracy, for as little as $1 per person. Here's what you need to know.
        </p>
        <span className="inline-block mt-3 text-sm font-semibold" style={{ color: "var(--tc-danger)" }}>
          Read the full article →
        </span>
      </a>

      <div className="flex flex-col gap-6">
        {articles.map((a, i) => (
          <article
            key={i}
            className="p-6 rounded-xl border"
            style={{ borderColor: "var(--tc-border)", background: "var(--tc-surface)" }}
          >
            <h2 className="text-xl font-bold mb-1 flex items-center gap-2" style={{ color: "var(--tc-text-main)" }}>
              {(() => { const Icon = ARTICLE_ICONS[a.emoji]; return Icon ? <Icon size={20} strokeWidth={1.75} /> : null; })()}
              {a.title}
            </h2>
            <p className="mb-3" style={{ color: "var(--tc-text-muted)" }}>{a.summary}</p>
            <h3 className="font-semibold mb-2" style={{ color: "var(--tc-text-main)" }}>
              Warning signs:
            </h3>
            <ul className="flex flex-col gap-1.5">
              {a.tips.map((tip, j) => (
                <li key={j} className="flex gap-2">
                  <span style={{ color: "var(--tc-warning)", display: 'flex', flexShrink: 0 }}><AlertTriangle size={16} strokeWidth={1.75} /></span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div
        className="text-center p-6 rounded-xl"
        style={{ background: "var(--tc-primary-soft)" }}
      >
        <p className="font-semibold" style={{ color: "var(--tc-primary)" }}>
          Remember: Scams are designed to fool smart people. You are not foolish for being targeted.
        </p>
        <p className="mt-1" style={{ color: "var(--tc-text-muted)" }}>
          Checking is always the right move. <Shield size={16} strokeWidth={1.75} style={{ display: 'inline', verticalAlign: 'text-bottom' }} />
        </p>
      </div>
    </div>
  );
}
