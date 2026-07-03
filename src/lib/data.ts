import { articles } from "./articles";
import { categories, getCategory, getCategoryDisplay } from "./categories";
import { getAuthor } from "./authors";
import type { Article, CategorySlug } from "./types";
import { cmsFlags } from "./cms/flags";
import {
  getCmsAllArticles,
  getCmsArticleBySlug,
  getCmsArticlesByCategory,
  getCmsArticlesByTag,
  getCmsFeaturedArticles,
} from "./cms/sources";

export { categories, getCategory, getCategoryDisplay, navCategories } from "./categories";
export { authors, getAuthor } from "./authors";
export type { Article, Author, Category, CategorySlug } from "./types";

/**
 * Data accessors used across the site.
 *
 * Each function is async + flag-aware: when `cmsFlags.enabled`, reads come
 * from WordPress via the CMS adapter; otherwise the static fallback in
 * src/lib/articles.ts is returned. Function names match the pre-CMS API so
 * call sites only need to add `await`.
 *
 * Functions without a CMS equivalent yet (live / trending / mostRead) use
 * "newest first" as a sensible fallback until Phase 1.5 brings ACF online
 * with proper editorial flags.
 */

const byNewest = (a: Article, b: Article) =>
  new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();

// ── Articles ────────────────────────────────────────────────────────────────

export async function getAllArticles(): Promise<Article[]> {
  if (cmsFlags.enabled) return getCmsAllArticles(50);
  return [...articles].sort(byNewest);
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  if (cmsFlags.enabled) return getCmsArticleBySlug(slug);
  return articles.find((a) => a.slug === slug);
}

export async function getArticlesByCategory(
  category: CategorySlug,
  limit?: number
): Promise<Article[]> {
  if (cmsFlags.enabled) return getCmsArticlesByCategory(category, limit ?? 12);
  const list = articles.filter((a) => a.category === category).sort(byNewest);
  return limit ? list.slice(0, limit) : list;
}

export async function getFeaturedArticles(limit = 5): Promise<Article[]> {
  if (cmsFlags.enabled) return getCmsFeaturedArticles(limit);
  return articles
    .filter((a) => a.featured)
    .sort(byNewest)
    .slice(0, limit);
}

export async function getLiveArticles(limit = 6): Promise<Article[]> {
  if (cmsFlags.enabled) {
    // No editorial "is_live" flag until Phase 1.5 (ACF). Empty for now —
    // the LiveSection renders nothing rather than mislabel newest stories.
    return [];
  }
  return articles
    .filter((a) => a.live)
    .sort(byNewest)
    .slice(0, limit);
}

export async function getTrendingArticles(limit = 6): Promise<Article[]> {
  if (cmsFlags.enabled) {
    // No analytics or `is_trending` flag yet — newest as proxy. Read the same
    // cached 50-article set the rest of the page uses, then slice, so this
    // costs no extra round-trip.
    return (await getCmsAllArticles(50)).slice(0, limit);
  }
  return articles
    .filter((a) => a.trending)
    .sort(byNewest)
    .slice(0, limit);
}

/**
 * A stable "most read" ranking. With no analytics backend we derive a
 * deterministic order from engagement-like signals (trending, read time,
 * recency). Same approach when flag is on, fed by CMS articles.
 */
export async function getMostReadArticles(limit = 5): Promise<Article[]> {
  const pool = cmsFlags.enabled ? await getCmsAllArticles(50) : articles;
  const score = (a: Article) =>
    (a.trending ? 1000 : 0) +
    (a.featured ? 400 : 0) +
    a.readTime * 50 +
    new Date(a.publishedAt).getTime() / 1e10;
  return [...pool].sort((a, b) => score(b) - score(a)).slice(0, limit);
}

/** Latest headlines used by the breaking-news ticker. */
export async function getHeadlines(limit = 8): Promise<Article[]> {
  return (await getAllArticles()).slice(0, limit);
}

/** Editor's-pick style mix used for the secondary hero column. */
export async function getTopStories(limit = 4): Promise<Article[]> {
  const featured = (await getFeaturedArticles(10)).map((a) => a.slug);
  return (await getAllArticles())
    .filter((a) => !featured.includes(a.slug))
    .slice(0, limit);
}

export async function getRelatedArticles(article: Article, limit = 3): Promise<Article[]> {
  if (cmsFlags.enabled) {
    const inCat = await getCmsArticlesByCategory(article.category, limit + 1);
    return inCat.filter((a) => a.slug !== article.slug).slice(0, limit);
  }
  return articles
    .filter((a) => a.slug !== article.slug && a.category === article.category)
    .sort(byNewest)
    .slice(0, limit);
}

export async function getMostRecentByCategory(
  category: CategorySlug
): Promise<Article | undefined> {
  const list = await getArticlesByCategory(category, 1);
  return list[0];
}

/** Articles bylined to a given reporter (by authorSlug), newest first. */
export async function getArticlesByReporter(
  slug: string,
  limit?: number
): Promise<Article[]> {
  const all = await getAllArticles();
  const list = all.filter((a) => a.authorSlug === slug).sort(byNewest);
  return limit ? list.slice(0, limit) : list;
}

// ── Pure helpers (no I/O — stay synchronous) ────────────────────────────────

/** Resolve the display name + accent for an article's category. */
export function categoryLabel(slug: CategorySlug): string {
  return getCategoryDisplay(slug).name;
}

export function articleAuthor(article: Article) {
  // CMS-driven posts carry the WP author inline so we render the real
  // reporter byline + avatar; static articles fall back to the curated
  // authors map.
  if (article.authorOverride) {
    return {
      slug: article.authorSlug,
      name: article.authorOverride.name,
      role: article.authorOverride.role,
      avatar: article.authorOverride.avatar,
      bio: article.authorOverride.bio ?? "",
    };
  }
  return getAuthor(article.authorSlug);
}

export const allCategorySlugs: CategorySlug[] = categories.map((c) => c.slug);

/** Turn a tag into a URL-safe slug and back into a readable label. */
export function tagToSlug(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ── Search ──────────────────────────────────────────────────────────────────

/**
 * Full-text-ish search across title, excerpt, tags and category.
 *
 * Phase 1.2 uses a client-side filter over the most recent CMS articles —
 * good enough for the small dataset and no extra round-trip. Phase 6
 * (articles dashboard) will swap to WPGraphQL's native `search` arg for
 * server-side full-text search.
 */
export async function searchArticles(query: string, limit?: number): Promise<Article[]> {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  const pool = cmsFlags.enabled ? await getCmsAllArticles(50) : articles;
  const matches = pool.filter((a) => {
    const haystack = `${a.title} ${a.excerpt} ${a.tags.join(" ")} ${a.category}`.toLowerCase();
    return terms.every((t) => haystack.includes(t));
  });
  return limit ? matches.slice(0, limit) : matches;
}

// ── Tags ────────────────────────────────────────────────────────────────────

export async function getArticlesByTag(slug: string, limit?: number): Promise<Article[]> {
  if (cmsFlags.enabled) return getCmsArticlesByTag(slug, limit ?? 12);
  const list = [...articles]
    .sort(byNewest)
    .filter((a) => a.tags.some((t) => tagToSlug(t) === slug));
  return limit ? list.slice(0, limit) : list;
}

/**
 * All tags across the article pool with counts. With CMS enabled, this
 * scans the most recent CMS articles (cap matches the home feed) until
 * Phase 1.5 adds a dedicated `tags` query.
 */
export async function getAllTags(): Promise<{ tag: string; slug: string; count: number }[]> {
  const pool = cmsFlags.enabled ? await getCmsAllArticles(50) : articles;
  const counts = new Map<string, number>();
  for (const a of pool) {
    for (const t of a.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, slug: tagToSlug(tag), count }))
    .sort((a, b) => b.count - a.count);
}

/** A curated strip of topics for the trending-topics bar. */
export async function getTrendingTopics(
  limit = 10
): Promise<{ tag: string; slug: string }[]> {
  const all = await getAllTags();
  return all.slice(0, limit).map(({ tag, slug }) => ({ tag, slug }));
}
