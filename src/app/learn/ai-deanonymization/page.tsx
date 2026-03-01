import { Bot, AlertTriangle, Target, Landmark, Briefcase, Search, FileText } from 'lucide-react';
import { BackButton } from '@/components/BackButton';

const DEANON_ICON_MAP: Record<string, React.ComponentType<any>> = {
  '🎯': Target,
  '🏛️': Landmark,
  '💼': Briefcase,
  '🔍': Search,
};
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How AI Can Identify You From Anonymous Posts — TrustChekr",
  description:
    "New research shows AI can figure out who you are from your anonymous online posts. Here's what you need to know and how to protect yourself.",
};

export default function AIDeanonymizationArticle() {
  return (
    <article className="flex flex-col gap-6">
      {/* Header */}
      <div className="pt-4">
        <BackButton />
        <h1
          className="text-3xl font-bold mt-3"
          style={{ color: "var(--tc-primary)" }}
        >
          <Bot size={24} strokeWidth={1.75} style={{ display: 'inline', verticalAlign: 'text-bottom' }} /> How AI Can Figure Out Who You Are — Even From Anonymous Posts
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--tc-text-muted)" }}>
          Published February 26, 2026 · 5 minute read
        </p>
      </div>

      {/* Key takeaway box */}
      <div
        className="p-5 rounded-xl border-2"
        style={{
          borderColor: "var(--tc-danger)",
          background: "var(--tc-surface)",
        }}
      >
        <p
          className="font-bold text-lg"
          style={{ color: "var(--tc-danger)" }}
        >
          The short version
        </p>
        <p className="mt-2">
          Researchers just proved that AI can read your anonymous online posts —
          on Reddit, forums, or anywhere else — and figure out who you really
          are. It costs as little as <strong>$1 to $4 per person</strong> and
          works about <strong>67% of the time</strong>.
        </p>
      </div>

      {/* What happened */}
      <section>
        <h2
          className="text-xl font-bold mb-3"
          style={{ color: "var(--tc-text-main)" }}
        >
          What happened?
        </h2>
        <p>
          On February 24, 2026, a team of researchers from ETH Zurich and
          Anthropic (the company behind Claude AI) published a study called{" "}
          <em>"Large-Scale Online Deanonymization with LLMs."</em>
        </p>
        <p className="mt-3">
          They showed that AI programs — the same kind that power ChatGPT and
          Claude — can read someone's anonymous online posts and figure out who
          they are in real life. No hacking required. No stolen passwords. Just
          reading what you've written.
        </p>
      </section>

      {/* How it works */}
      <section>
        <h2
          className="text-xl font-bold mb-3"
          style={{ color: "var(--tc-text-main)" }}
        >
          How does it work?
        </h2>
        <p className="mb-3">
          Think of it like a detective reading all your posts and piecing together
          clues. Except this detective is an AI that can read thousands of posts
          in seconds. Here's what it picks up on:
        </p>
        <ul className="flex flex-col gap-2">
          {[
            "What topics you talk about (your job, hobbies, interests)",
            "Details you mention casually (your city, your pet's name, a restaurant you like)",
            "How you write (your word choices, sentence patterns, opinions)",
            "What you know about (technical skills, professional knowledge)",
            "When you post (your timezone, your schedule patterns)",
          ].map((item, i) => (
            <li key={i} className="flex gap-2">
              <span style={{ color: "var(--tc-warning)", display: 'flex', flexShrink: 0 }}><AlertTriangle size={16} strokeWidth={1.75} /></span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3">
          The AI then searches the internet — LinkedIn, company websites, social
          media — and matches those clues to a real person. In the study, it
          correctly identified <strong>226 out of 338 people</strong> on Hacker
          News, just from their anonymous comments.
        </p>
      </section>

      {/* Why it matters */}
      <section>
        <h2
          className="text-xl font-bold mb-3"
          style={{ color: "var(--tc-text-main)" }}
        >
          Why should I care?
        </h2>
        <p className="mb-3">
          If you post anything online — even under a fake name — someone could
          use AI to figure out who you are. This matters because:
        </p>
        <ul className="flex flex-col gap-3">
          {[
            {
              emoji: "🎯",
              title: "Targeted scams become much easier.",
              desc: "A scammer who knows your real name, job, and interests can craft a much more convincing scam message. Instead of a generic 'Dear Customer,' they can write something that feels personal and real.",
            },
            {
              emoji: "🏛️",
              title: "Whistleblowers and activists are at risk.",
              desc: "People who post anonymously about corruption, abuse, or unsafe conditions could be identified and targeted by the people they're exposing.",
            },
            {
              emoji: "💼",
              title: "Employers could find your anonymous posts.",
              desc: "That anonymous Reddit post complaining about your boss? AI might be able to link it back to you.",
            },
            {
              emoji: "🔍",
              title: "Stalkers have a powerful new tool.",
              desc: "Someone trying to find a person's real identity now has an affordable, automated way to do it.",
            },
          ].map((item, i) => (
            <li
              key={i}
              className="p-4 rounded-xl border"
              style={{
                borderColor: "var(--tc-border)",
                background: "var(--tc-surface)",
              }}
            >
              <p className="font-semibold flex items-center gap-2">
                {(() => { const Icon = DEANON_ICON_MAP[item.emoji]; return Icon ? <Icon size={18} strokeWidth={1.75} /> : null; })()}
                {item.title}
              </p>
              <p
                className="mt-1 text-sm"
                style={{ color: "var(--tc-text-muted)" }}
              >
                {item.desc}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* How to protect yourself */}
      <section>
        <h2
          className="text-xl font-bold mb-3"
          style={{ color: "var(--tc-text-main)" }}
        >
          How can I protect myself?
        </h2>
        <p className="mb-3">
          You don't need to stop using the internet. But you should be more
          thoughtful about what you share. Here are practical steps:
        </p>
        <ul className="flex flex-col gap-3">
          {[
            {
              title: "Think before you share details",
              desc: "Every time you mention your city, your job, a conference you attended, or a specific project you worked on, you're giving AI another puzzle piece. Ask yourself: could someone use this to find me?",
            },
            {
              title: "Don't use the same username everywhere",
              desc: "If your Reddit username is the same as your gaming handle, which is linked to your real email — you've made it easy. Use different names on different platforms.",
            },
            {
              title: "Be careful with 'throwaway' accounts",
              desc: "Even on a throwaway account, if you mention specific details about your life, AI can connect the dots. A 'throwaway' only works if you don't share identifying information on it.",
            },
            {
              title: "Separate your identities",
              desc: "Keep your professional online presence (LinkedIn, company bio) separate from your anonymous presence (Reddit, forums). The less overlap, the harder it is for AI to connect them.",
            },
            {
              title: "Review your old posts",
              desc: "Years of posts create a detailed picture. Consider deleting old posts that contain identifying details you no longer want public.",
            },
            {
              title: "Use a VPN",
              desc: "While this research doesn't use IP addresses, a VPN adds one more layer of protection against other types of tracking.",
            },
          ].map((item, i) => (
            <li key={i} className="flex gap-2">
              <span
                className="text-lg font-bold mt-0.5"
                style={{ color: "var(--tc-safe)" }}
              >
                ✅
              </span>
              <div>
                <p className="font-semibold">{item.title}</p>
                <p
                  className="text-sm mt-0.5"
                  style={{ color: "var(--tc-text-muted)" }}
                >
                  {item.desc}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* The numbers */}
      <section
        className="p-5 rounded-xl"
        style={{ background: "var(--tc-primary-soft)" }}
      >
        <h2
          className="text-xl font-bold mb-3"
          style={{ color: "var(--tc-primary)" }}
        >
          By the numbers
        </h2>
        <ul className="flex flex-col gap-2">
          <li>
            <strong>67%</strong> — how often the AI correctly identified
            anonymous users
          </li>
          <li>
            <strong>90%</strong> — precision rate (when it made a guess, it was
            right 9 out of 10 times)
          </li>
          <li>
            <strong>$1–$4</strong> — cost per person to de-anonymize
          </li>
          <li>
            <strong>$2,000</strong> — total cost of the entire research experiment
          </li>
          <li>
            <strong>338</strong> — number of Hacker News users tested
          </li>
          <li>
            <strong>Tens of thousands</strong> — the method scales to large
            candidate pools
          </li>
        </ul>
      </section>

      {/* What platforms should do */}
      <section>
        <h2
          className="text-xl font-bold mb-3"
          style={{ color: "var(--tc-text-main)" }}
        >
          What should websites do about this?
        </h2>
        <p className="mb-3">The researchers recommend that platforms:</p>
        <ul className="flex flex-col gap-2">
          {[
            "Limit how much user data can be scraped or downloaded in bulk",
            "Detect and block automated data collection",
            "Assume that anonymous users CAN be identified, and design privacy protections accordingly",
            "Give users tools to easily delete old posts and personal data",
          ].map((item, i) => (
            <li key={i} className="flex gap-2">
              <span>👉</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Source */}
      <section
        className="p-4 rounded-xl border"
        style={{
          borderColor: "var(--tc-border)",
          background: "var(--tc-surface)",
        }}
      >
        <p className="font-semibold" style={{ color: "var(--tc-text-main)" }}>
          <FileText size={16} strokeWidth={1.75} style={{ display: 'inline', verticalAlign: 'text-bottom' }} /> Source
        </p>
        <p className="mt-1 text-sm" style={{ color: "var(--tc-text-muted)" }}>
          "Large-Scale Online Deanonymization with LLMs" — Simon Lermen (MATS
          Research), Daniel Paleka, Joshua Swanson, Michael Aerni (ETH Zurich),
          Nicholas Carlini (Anthropic), Florian Tramèr (ETH Zurich). Published
          February 24, 2026.
        </p>
      </section>

      {/* Bottom CTA */}
      <div
        className="text-center p-6 rounded-xl"
        style={{ background: "var(--tc-primary-soft)" }}
      >
        <p
          className="font-semibold"
          style={{ color: "var(--tc-primary)" }}
        >
          Knowledge is your best protection. Share this article with someone
          you care about.
        </p>
        <p
          className="mt-1 text-sm"
          style={{ color: "var(--tc-text-muted)" }}
        >
          TrustChekr — Helping you stay safe online
        </p>
        <div className="flex gap-3 justify-center mt-4">
          <a
            href="/learn"
            className="px-5 py-2 rounded-xl font-medium"
            style={{
              background: "var(--tc-primary)",
              color: "white",
            }}
          >
            Read more articles
          </a>
          <a
            href="/"
            className="px-5 py-2 rounded-xl font-medium border-2"
            style={{
              borderColor: "var(--tc-primary)",
              color: "var(--tc-primary)",
            }}
          >
            Check something for scams
          </a>
        </div>
      </div>
    </article>
  );
}
