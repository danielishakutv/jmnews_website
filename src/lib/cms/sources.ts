import "server-only";
import { cache } from "react";
import type { Article } from "@/lib/types";
import { wpcomConfig } from "./flags";
import {
  getCmsAllArticles as primaryAll,
  getCmsArticleBySlug as primaryBySlug,
  getCmsArticlesByCategory as primaryByCategory,
  getCmsArticlesByTag as primaryByTag,
  getCmsFeaturedArticles as primaryFeatured,
} from "./articles";
import {
  getWpcomAllArticles,
  getWpcomArticleBySlug,
  getWpcomArticlesByCategory,
  getWpcomArticlesByTag,
  getWpcomFeaturedArticles,
} from "./wpcom/articles";

/**
 * Source aggregator.
 *
 * Blends the PRIMARY feed — WPGraphQL at menorah.com.ng — with the SECONDARY
 * feed — the WordPress.com REST API at jabbamanews.wordpress.com — into one
 * stream. Each source is fetched independently and any failure is swallowed
 * (logged, treated as empty), so the public site keeps serving stories when
 * one backend is down. That redundancy is the reason for two sources.
 *
 * These exports deliberately match the single-source `cms/articles` API, so
 * `data.ts` swaps one import and nothing else changes.
 */

const byNewest = (a: Article, b: Article) =>
  new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();

/**
 * Hard ceiling on how long a single source may take before we give up on it
 * for THIS render and use the fallback. A backend can occasionally throttle a
 * burst of parallel queries and stall for 20s+; this guarantees a page render
 * is never held hostage by one slow feed. The slow fetch keeps running in the
 * background, so its result still populates the cache for the next request.
 */
const SOURCE_DEADLINE_MS = 4000;

/** Run a source fetch but never let its failure OR slowness break the page. */
async function safe<T>(label: string, thunk: () => Promise<T>, fallback: T): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const deadline = new Promise<T>((resolve) => {
    timer = setTimeout(() => {
      console.warn(`[cms/sources] ${label} exceeded ${SOURCE_DEADLINE_MS}ms; using fallback.`);
      resolve(fallback);
    }, SOURCE_DEADLINE_MS);
  });
  try {
    return await Promise.race([thunk(), deadline]);
  } catch (err) {
    console.warn(`[cms/sources] ${label} unavailable; falling back to other source(s).`, err);
    return fallback;
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/** Merge article lists from all sources: dedupe by slug, newest first. */
function blend(lists: Article[][], limit?: number): Article[] {
  const seen = new Set<string>();
  const out: Article[] = [];
  for (const a of lists.flat()) {
    if (!a.slug || seen.has(a.slug)) continue;
    seen.add(a.slug);
    out.push(a);
  }
  out.sort(byNewest);
  return limit ? out.slice(0, limit) : out;
}

/** Fetch the secondary feed when configured, else resolve to empty. */
function secondary<T>(label: string, thunk: () => Promise<T>, fallback: T): Promise<T> {
  if (!wpcomConfig.enabled) return Promise.resolve(fallback);
  return safe(label, thunk, fallback);
}

// Memoised per request (keyed by limit) so the many helpers that read "all
// articles" on one page — getAllArticles, getMostRead, getTrending, getHeadlines,
// search, tags — collapse into a single round-trip per source instead of 4–5.
export const getCmsAllArticles = cache(async (limit = 24): Promise<Article[]> => {
  const [primary, second] = await Promise.all([
    safe("primary:all", () => primaryAll(limit), [] as Article[]),
    secondary("wpcom:all", () => getWpcomAllArticles(limit), [] as Article[]),
  ]);
  return blend([primary, second], limit);
});

export async function getCmsArticleBySlug(slug: string): Promise<Article | undefined> {
  // Query both feeds in parallel and prefer the primary on the (near-impossible)
  // slug collision. Parallel — not sequential — so a slow/unreachable primary
  // can't stall a story that actually lives in the secondary feed.
  const [primary, second] = await Promise.all([
    safe<Article | undefined>("primary:bySlug", () => primaryBySlug(slug), undefined),
    secondary<Article | undefined>("wpcom:bySlug", () => getWpcomArticleBySlug(slug), undefined),
  ]);
  return primary ?? second;
}

export const getCmsArticlesByCategory = cache(
  async (slug: string, limit = 12): Promise<Article[]> => {
    const [primary, second] = await Promise.all([
      safe("primary:byCategory", () => primaryByCategory(slug, limit), [] as Article[]),
      secondary("wpcom:byCategory", () => getWpcomArticlesByCategory(slug, limit), [] as Article[]),
    ]);
    return blend([primary, second], limit);
  }
);

export async function getCmsArticlesByTag(slug: string, limit = 12): Promise<Article[]> {
  const [primary, second] = await Promise.all([
    safe("primary:byTag", () => primaryByTag(slug, limit), [] as Article[]),
    secondary("wpcom:byTag", () => getWpcomArticlesByTag(slug, limit), [] as Article[]),
  ]);
  return blend([primary, second], limit);
}

export async function getCmsFeaturedArticles(limit = 5): Promise<Article[]> {
  const [primary, second] = await Promise.all([
    safe("primary:featured", () => primaryFeatured(limit), [] as Article[]),
    secondary("wpcom:featured", () => getWpcomFeaturedArticles(limit), [] as Article[]),
  ]);
  return blend([primary, second], limit);
}
