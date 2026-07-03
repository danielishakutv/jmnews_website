import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Fragment } from "react";
import {
  getArticlesByCategory,
  getTrendingArticles,
  getMostReadArticles,
  getAllArticles,
  allCategorySlugs,
} from "@/lib/data";
import { getCategoryDisplay } from "@/lib/categories";
import type { CategorySlug } from "@/lib/types";
import { site } from "@/lib/site";
import ArticleCard from "@/components/article/ArticleCard";
import TabbedSidebar from "@/components/home/TabbedSidebar";
import MostRead from "@/components/home/MostRead";
import FollowBox from "@/components/home/FollowBox";
import AdBanner from "@/components/ui/AdBanner";

// CMS-driven slugs are determined at request time; allow on-demand rendering.
export const dynamicParams = true;

export function generateStaticParams() {
  // Pre-render only the static fallback slugs at build. WP-only slugs
  // (crime, security, etc.) render on-demand the first time they're hit.
  return allCategorySlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryDisplay(slug);

  return {
    title: `${category.name} News`,
    description: category.description,
    alternates: { canonical: `/category/${category.slug}` },
    openGraph: {
      type: "website",
      title: `${category.name} News | ${site.name}`,
      description: category.description,
      url: `/category/${category.slug}`,
      images: [{ url: "/og.png", width: 1200, height: 630, alt: `${category.name} News` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.name} News | ${site.name}`,
      description: category.description,
      images: ["/og.png"],
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // getCategoryDisplay always returns a renderable category (auto-derives
  // name + accent for WP-only slugs); notFound() is reserved for slugs
  // that exist in neither the static set nor WP (checked via articles).
  const category = getCategoryDisplay(slug);

  const [articles, trending, mostRead, allArticles] = await Promise.all([
    getArticlesByCategory(category.slug as CategorySlug, 30),
    getTrendingArticles(6),
    getMostReadArticles(5),
    getAllArticles(),
  ]);
  const latest = allArticles.slice(0, 6);
  const video = allArticles.slice(3, 9);

  if (articles.length === 0) {
    // No articles AND not a known static category → treat as 404.
    if (!allCategorySlugs.includes(slug)) notFound();
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-extrabold">{category.name}</h1>
        <p className="mt-3 text-fg-muted">No stories in this section yet. Check back soon.</p>
      </div>
    );
  }

  const [lead, second, ...rest] = articles;

  const accentBar =
    category.accent === "blue"
      ? "bg-azure-600"
      : category.accent === "slate"
        ? "bg-ink"
        : "bg-brand-600";

  return (
    <div className="pb-8">
      {/* Section header */}
      <div className="border-b border-line bg-gradient-to-b from-brand-50/60 to-surface">
        <div className="mx-auto max-w-[1400px] px-4 py-7 lg:px-6">
          <div className="flex items-center gap-3">
            <span className={`inline-block h-8 w-2 rounded-full ${accentBar}`} />
            <h1 className="font-display text-3xl font-black tracking-tight text-fg sm:text-4xl">
              {category.name}
            </h1>
          </div>
          <p className="mt-2 max-w-2xl text-fg-muted">{category.description}</p>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 py-8 lg:px-6">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Main column */}
          <div className="lg:col-span-8">
            <div className="grid gap-8 sm:grid-cols-2">
              <ArticleCard article={lead} priority sizes="(max-width: 640px) 100vw, 40vw" />
              {second && <ArticleCard article={second} sizes="(max-width: 640px) 100vw, 40vw" />}
            </div>

            <hr className="my-8 border-line" />

            <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
              {rest.map((a, i) => (
                <Fragment key={a.slug}>
                  <ArticleCard article={a} variant="horizontal" />
                  {(i + 1) % 4 === 0 && i + 1 < rest.length && (
                    <div className="sm:col-span-2">
                      <AdBanner format="inline" creative="subscribe" contained={false} />
                    </div>
                  )}
                </Fragment>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="space-y-6 lg:sticky lg:top-24">
              <TabbedSidebar trending={trending} latest={latest} video={video} />
              <AdBanner format="box" creative="app" />
              <MostRead articles={mostRead} />
              <FollowBox />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
