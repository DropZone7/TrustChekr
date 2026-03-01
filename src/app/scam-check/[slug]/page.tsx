import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticle, getAllArticles, type Article } from "@/lib/articles";

export function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  const url = `${process.env.NEXT_PUBLIC_BASE_URL ?? "https://www.trustchekr.com"}/scam-check/${article.slug}`;
  return {
    title: `Is ${article.domain} a Scam? Honest Review | TrustChekr`,
    description: article.summary,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: `Is ${article.domain} a Scam? Honest Review`,
      description: article.summary,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      section: article.category,
      tags: [article.domain, article.category, "scam check", "trust score"],
    },
    twitter: {
      card: "summary",
      title: `Is ${article.domain} a Scam?`,
      description: article.summary,
    },
  };
}

function ArticleJsonLd({ article }: { article: Article }) {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "https://www.trustchekr.com";
  const url = `${base}/scam-check/${article.slug}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Is ${article.domain} a Scam? Honest Review`,
    description: article.summary,
    url,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: { "@type": "Organization", name: "TrustChekr", url: base },
    publisher: { "@type": "Organization", name: "TrustChekr", url: base },
    mainEntityOfPage: { "@type": "@id", "@id": url },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getVerdictColor(verdict: string): string {
  if (verdict === "Low Risk") return "var(--tc-success, #16a34a)";
  if (verdict === "Use Caution") return "var(--tc-warning, #f59e0b)";
  return "var(--tc-danger, #dc2626)";
}

function ArticleHeader({ article }: { article: Article }) {
  return (
    <header style={{ marginBottom: "2rem" }}>
      <nav
        aria-label="Breadcrumb"
        style={{
          fontSize: "0.8125rem",
          color: "var(--tc-text-muted)",
          marginBottom: "1rem",
          display: "flex",
          alignItems: "center",
          gap: "0.375rem",
          flexWrap: "wrap",
        }}
      >
        <a href="/" style={{ color: "var(--tc-primary)", textDecoration: "none" }}>Home</a>
        <span aria-hidden="true">/</span>
        <span>{article.title}</span>
      </nav>

      <span
        style={{
          display: "inline-block",
          fontSize: "0.75rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          color: "var(--tc-primary)",
          backgroundColor: "rgba(164, 0, 0, 0.06)",
          padding: "0.2rem 0.625rem",
          borderRadius: "9999px",
          marginBottom: "0.75rem",
        }}
      >
        {article.category}
      </span>

      <h1
        style={{
          fontSize: "clamp(1.625rem, 4vw, 2.25rem)",
          fontWeight: 800,
          lineHeight: 1.2,
          color: "var(--tc-text-main)",
          margin: "0 0 1rem 0",
          letterSpacing: "-0.01em",
        }}
      >
        {article.title}
      </h1>

      <p
        style={{
          fontSize: "1.0625rem",
          color: "var(--tc-text-muted)",
          lineHeight: 1.7,
          margin: "0 0 1.25rem 0",
          maxWidth: "65ch",
        }}
      >
        {article.summary}
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1.25rem",
          fontSize: "0.8125rem",
          color: "var(--tc-text-muted)",
          paddingTop: "1rem",
          borderTop: "1px solid var(--tc-border)",
        }}
      >
        {(
          [
            ["Published", formatDate(article.publishedAt)],
            ["Updated", formatDate(article.updatedAt)],
            ["Domain reviewed", article.domain],
          ] as [string, string][]
        ).map(([label, value]) => (
          <span key={label}>
            <span style={{ fontWeight: 600, color: "var(--tc-text-main)" }}>{label}:</span> {value}
          </span>
        ))}
      </div>
    </header>
  );
}

function VerdictBox({ article }: { article: Article }) {
  const color = getVerdictColor(article.verdict);
  const fill = Math.max(0, Math.min(100, article.trustScore));
  const grade = fill >= 80 ? "A" : fill >= 65 ? "B" : fill >= 50 ? "C" : fill >= 35 ? "D" : "F";

  return (
    <div
      style={{
        backgroundColor: "var(--tc-surface)",
        border: "1px solid var(--tc-border)",
        borderRadius: "12px",
        padding: "1.5rem",
        marginBottom: "2rem",
      }}
    >
      <p
        style={{
          margin: "0 0 1rem 0",
          fontSize: "0.75rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          color: "var(--tc-text-muted)",
        }}
      >
        Our verdict
      </p>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            border: `4px solid ${color}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            backgroundColor: "var(--tc-surface)",
          }}
        >
          <span style={{ fontSize: "1.375rem", fontWeight: 800, lineHeight: 1, color }}>{grade}</span>
          <span
            style={{
              fontSize: "0.625rem",
              color: "var(--tc-text-muted)",
              lineHeight: 1,
              marginTop: "2px",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {fill}/100
          </span>
        </div>
        <div>
          <p style={{ margin: 0, fontSize: "1.375rem", fontWeight: 800, color, lineHeight: 1.2 }}>
            {article.verdict}
          </p>
          <p style={{ margin: "0.25rem 0 0", fontSize: "0.875rem", color: "var(--tc-text-muted)" }}>
            Trust score: {fill} / 100
          </p>
        </div>
      </div>

      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "0.75rem",
            color: "var(--tc-text-muted)",
            marginBottom: "0.375rem",
          }}
        >
          <span>Lower trust</span>
          <span>Higher trust</span>
        </div>
        <div
          style={{
            width: "100%",
            height: "8px",
            borderRadius: "4px",
            backgroundColor: "var(--tc-border)",
            overflow: "hidden",
          }}
        >
          <div style={{ width: `${fill}%`, height: "100%", borderRadius: "4px", backgroundColor: color }} />
        </div>
      </div>
    </div>
  );
}

function RelatedArticles({ current, all }: { current: Article; all: Article[] }) {
  const related = all.filter((a) => a.slug !== current.slug).slice(0, 3);
  if (related.length === 0) return null;

  return (
    <section aria-labelledby="related-heading" style={{ marginTop: "2.5rem" }}>
      <h2
        id="related-heading"
        style={{
          fontSize: "1.25rem",
          fontWeight: 700,
          color: "var(--tc-text-main)",
          margin: "0 0 1rem 0",
          paddingBottom: "0.625rem",
          borderBottom: "1px solid var(--tc-border)",
        }}
      >
        Related reviews
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
        {related.map((article) => (
          <a
            key={article.slug}
            href={`/scam-check/${article.slug}`}
            style={{
              display: "block",
              textDecoration: "none",
              backgroundColor: "var(--tc-surface)",
              border: "1px solid var(--tc-border)",
              borderRadius: "12px",
              padding: "1rem 1.125rem",
            }}
          >
            <p
              style={{
                margin: "0 0 0.375rem",
                fontSize: "0.75rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "var(--tc-text-muted)",
              }}
            >
              {article.category}
            </p>
            <p
              style={{
                margin: "0 0 0.5rem",
                fontSize: "0.9375rem",
                fontWeight: 700,
                color: "var(--tc-text-main)",
                lineHeight: 1.3,
              }}
            >
              {article.title}
            </p>
            <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: getVerdictColor(article.verdict) }}>
              {article.verdict}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

export default async function ScamCheckArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();
  const allArticles = getAllArticles();

  return (
    <>
      <ArticleJsonLd article={article} />
      <main style={{ maxWidth: "720px", margin: "0 auto", padding: "3rem 1.25rem" }}>
        <ArticleHeader article={article} />
        <VerdictBox article={article} />

        <div style={{ display: "flex", flexDirection: "column", gap: "1.375rem", marginBottom: "2.5rem" }}>
          {article.body.map((para, i) => (
            <p key={i} style={{ margin: 0, fontSize: "1rem", lineHeight: 1.8, color: "var(--tc-text-main)" }}>
              {para}
            </p>
          ))}
        </div>

        {/* Scan CTA */}
        <div
          style={{
            backgroundColor: "var(--tc-surface)",
            border: "1px solid var(--tc-border)",
            borderRadius: "12px",
            padding: "1.5rem",
            marginBottom: "2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <p style={{ margin: "0 0 0.25rem", fontWeight: 700, fontSize: "1rem", color: "var(--tc-text-main)" }}>
              Check {article.domain} yourself
            </p>
            <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--tc-text-muted)", lineHeight: 1.5 }}>
              Run a live scan to see the current SSL status, domain age, blacklist checks, and full trust score report.
            </p>
          </div>
          <a
            href={`/scan/${article.domain}`}
            style={{
              display: "inline-block",
              padding: "0.625rem 1.25rem",
              backgroundColor: "var(--tc-primary)",
              color: "white",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: "0.9375rem",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            Run live scan
          </a>
        </div>

        {/* Disclaimer */}
        <div style={{ borderLeft: "3px solid var(--tc-border)", paddingLeft: "1rem", marginBottom: "2rem" }}>
          <p style={{ margin: 0, fontSize: "0.8125rem", color: "var(--tc-text-muted)", lineHeight: 1.6 }}>
            <strong style={{ color: "var(--tc-text-main)" }}>Editorial note:</strong> This article reflects the state
            of publicly available information at the time of writing. Business practices, ownership, and safety records
            change over time. TrustChekr is not affiliated with any company reviewed here and does not receive payment
            for editorial coverage. Verdicts are based on documented evidence and are subject to revision.
          </p>
        </div>

        <RelatedArticles current={article} all={allArticles} />
      </main>
    </>
  );
}
