import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAllArticles,
  getArticleBySlug,
  getRelatedArticles,
  articleAuthor,
} from "@/lib/data";
import { getCategoryDisplay } from "@/lib/categories";
import type { Article } from "@/lib/types";
import InfiniteArticles from "@/components/article/InfiniteArticles";

// When CMS is on, slugs come from WP at request time — we can't enumerate
// every possible slug at build, so allow on-demand rendering.
export const dynamicParams = true;

export async function generateStaticParams() {
  // Prebuild the most-recent stories from both sources so the articles users
  // are most likely to click are static HTML (instant navigation). Older or
  // niche slugs still render on demand (dynamicParams) with an instant
  // loading skeleton, then get cached by ISR.
  try {
    const recent = await getAllArticles();
    return recent.slice(0, 30).map((a) => ({ slug: a.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Story not found" };

  const author = articleAuthor(article);
  const url = `/article/${article.slug}`;

  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: url },
    authors: [{ name: author.name }],
    keywords: article.tags,
    openGraph: {
      type: "article",
      url,
      title: article.title,
      description: article.excerpt,
      publishedTime: article.publishedAt,
      authors: [author.name],
      section: getCategoryDisplay(article.category).name,
      tags: article.tags,
      images: [{ url: article.image, width: 1200, height: 675, alt: article.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [article.image],
    },
  };
}

/** Build the endless reading queue: current → related → everything else (newest). */
async function buildQueue(current: Article): Promise<Article[]> {
  const [related, all] = await Promise.all([
    getRelatedArticles(current, 4),
    getAllArticles(),
  ]);
  const seen = new Set<string>([current.slug, ...related.map((a) => a.slug)]);
  const rest = all.filter((a) => !seen.has(a.slug));
  return [current, ...related, ...rest].slice(0, 14);
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const queue = await buildQueue(article);

  return (
    <div className="bg-surface pb-4">
      <InfiniteArticles queue={queue} />
    </div>
  );
}
