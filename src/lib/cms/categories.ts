import "server-only";
import { cache } from "react";
import type { Category } from "@/lib/types";
import { categoryMap, getCategoryDisplay } from "@/lib/categories";
import { getCmsCategories } from "./queries/categories";

/**
 * CMS-aware category accessors.
 *
 * WP categories merge with the static visual metadata in src/lib/categories.ts:
 *   - if a WP slug matches a static one (e.g. "politics"), use the static
 *     entry verbatim (preserves the brand accent & curated description)
 *   - otherwise auto-derive name + default accent via `getCategoryDisplay`
 *
 * Categories the nav hides by default (catch-all bucket, defaults).
 */
const HIDDEN_FROM_NAV = new Set(["news", "uncategorized"]);

export type CategoryWithCount = Category & { count: number };

function mergeWithStatic(wp: {
  name?: string | null;
  slug?: string | null;
  count?: number | null;
}): CategoryWithCount {
  const slug = wp.slug ?? "";
  const known = categoryMap.get(slug);
  const display = known ?? getCategoryDisplay(slug);
  return {
    ...display,
    // WP `name` wins over auto-derived title-case so editors can rename
    // a category in wp-admin and have it propagate to the public site.
    name: wp.name ?? display.name,
    count: wp.count ?? 0,
  };
}

/** Every public WP category, newest-content-first. Memoised per request so
 *  the layout + footer share one fetch+compute instead of two. */
export const getCmsAllCategories = cache(async (): Promise<CategoryWithCount[]> => {
  const wp = await getCmsCategories(100);
  return wp
    .filter((c) => c.slug && c.name)
    .map(mergeWithStatic)
    .sort((a, b) => b.count - a.count);
});

/** Categories pinned to the main nav — top N by post count, "news" hidden. */
export async function getCmsNavCategories(limit = 8): Promise<Category[]> {
  const all = await getCmsAllCategories();
  return all
    .filter((c) => !HIDDEN_FROM_NAV.has(c.slug))
    .slice(0, limit);
}

/** Single category lookup, returns a renderable Category even if WP has
 *  no entry (falls back to static / auto-derived). */
export async function getCmsCategoryBySlug(slug: string): Promise<CategoryWithCount | undefined> {
  const all = await getCmsAllCategories();
  return all.find((c) => c.slug === slug);
}
