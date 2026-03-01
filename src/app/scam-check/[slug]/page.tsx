// src/app/scam-check/[slug]/page.tsx
import type { Metadata } from "next";
import { getArticle, getAllArticles } from "@/lib/articles";
import { gradeToCssColor } from "@/lib/trustScore";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "Article Not Found | TrustChekr" };

  return {
    title: `${article.title} | TrustChekr`,
    description: article.summary,
    openGraph: {
      title: `${article.title} | TrustChekr`,
      description: article.summary,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
    },
    twitter: { card: "summary", title: article.title, description: article.summary },
  };
}

function scoreGrade(score: number): "A" | "B" | "C" | "D" | "F" {
  if (score >= 81) return "A";
  if (score >= 61) return "B";
  if (score >= 41) return "C";
  if (score >= 21) return "D";
  return "F";
}

export default async function ScamCheckArticle({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const grade = scoreGrade(article.trustScore);
  const gradeColor = gradeToCssColor(grade);
  const allArticles = getAllArticles().filter((a) => a.slug !== slug);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.title,
        description: article.summary,
        datePublished: article.publishedAt,
        dateModified: article.updatedAt,
        author: { "@type": "Organization", name: "TrustChekr" },
        publisher: { "@type": "Organization", name: "TrustChekr" },
      })}} />

      <main style={{ maxWidth: "720px", margin: "0 auto", padding: "32px 16px 48px", fontFamily: "system-ui, -apple-system, sans-serif", display: "flex", flexDirection: "column", gap: "24px" }}>

        {/* Header */}
        <header>
          <div style={{ fontSize: "13px", color: "var(--tc-text-muted)", marginBottom: "8px" }}>
            {article.category} — Updated {new Date(article.updatedAt).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" })}
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: 700, color: "var(--tc-text-main)", margin: 0, lineHeight: 1.3 }}>{article.title}</h1>
          <p style={{ fontSize: "17px", color: "var(--tc-text-muted)", margin: "12px 0 0", lineHeight: 1.6 }}>{article.summary}</p>
        </header>

        {/* Body */}
        <article style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {article.body.map((p, i) => (
            <p key={i} style={{ fontSize: "16px", color: "var(--tc-text-main)", lineHeight: 1.7, margin: 0 }}>{p}</p>
          ))}
        </article>

        {/* Verdict */}
        <div style={{ background: "var(--tc-surface)", border: "1px solid var(--tc-border)", borderTop: `4px solid ${gradeColor}`, borderRadius: "12px", padding: "24px", display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", border: `4px solid ${gradeColor}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontSize: "22px", fontWeight: 700, color: gradeColor, lineHeight: 1 }}>{grade}</span>
            <span style={{ fontSize: "11px", color: "var(--tc-text-muted)" }}>{article.trustScore}/100</span>
          </div>
          <div>
            <div style={{ fontSize: "20px", fontWeight: 700, color: gradeColor }}>{article.verdict}</div>
            <div style={{ fontSize: "14px", color: "var(--tc-text-muted)", marginTop: "4px" }}>TrustChekr Score: {article.trustScore} out of 100</div>
          </div>
        </div>

        {/* CTA */}
        <a href={`/scan/${article.domain}`} style={{ display: "block", padding: "16px", background: "var(--tc-primary, #A40000)", color: "#fff", borderRadius: "8px", textDecoration: "none", fontSize: "16px", fontWeight: 600, textAlign: "center" }}>
          Check {article.domain} yourself
        </a>

        {/* Disclaimer */}
        <div style={{ fontSize: "13px", color: "var(--tc-text-muted)", lineHeight: 1.7, padding: "12px 16px", background: "var(--tc-surface)", border: "1px solid var(--tc-border)", borderRadius: "8px" }}>
          This article reflects automated and manual analysis as of {new Date(article.updatedAt).toLocaleDateString("en-CA")}. Conditions may change. TrustChekr provides informational assessments, not guarantees of safety.
        </div>

        {/* Related */}
        {allArticles.length > 0 && (
          <section>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--tc-text-main)", margin: "0 0 12px" }}>Related articles</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {allArticles.map((a) => (
                <a key={a.slug} href={`/scam-check/${a.slug}`} style={{ display: "block", padding: "14px 16px", background: "var(--tc-surface)", border: "1px solid var(--tc-border)", borderRadius: "8px", textDecoration: "none" }}>
                  <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--tc-text-main)" }}>{a.title}</div>
                  <div style={{ fontSize: "13px", color: "var(--tc-text-muted)", marginTop: "4px" }}>{a.category} — Score: {a.trustScore}/100</div>
                </a>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
