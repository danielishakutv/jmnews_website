import type { Category } from "./types";

export const categories: Category[] = [
  {
    slug: "nigeria",
    name: "Nigeria",
    description: "Breaking news and in-depth reporting from across the 36 states and the FCT.",
    accent: "orange",
  },
  {
    slug: "politics",
    name: "Politics",
    description: "Power, policy and the people shaping Nigeria's democracy.",
    accent: "orange",
  },
  {
    slug: "business",
    name: "Business",
    description: "Markets, the naira, energy and the entrepreneurs driving Africa's largest economy.",
    accent: "blue",
  },
  {
    slug: "world",
    name: "World",
    description: "International affairs and global stories that matter to Nigeria.",
    accent: "blue",
  },
  {
    slug: "sports",
    name: "Sports",
    description: "Super Eagles, the Premier League, AFCON and grassroots Nigerian sport.",
    accent: "orange",
  },
  {
    slug: "entertainment",
    name: "Entertainment",
    description: "Nollywood, Afrobeats and the culture defining a generation.",
    accent: "orange",
  },
  {
    slug: "technology",
    name: "Technology",
    description: "Startups, fintech and the innovators building Nigeria's digital future.",
    accent: "blue",
  },
  {
    slug: "health",
    name: "Health",
    description: "Public health, medicine and wellbeing across the country.",
    accent: "blue",
  },
  {
    slug: "opinion",
    name: "Opinion",
    description: "Sharp analysis and bold commentary from our columnists.",
    accent: "slate",
  },
];

export const categoryMap = new Map(categories.map((c) => [c.slug, c]));

export function getCategory(slug: string): Category | undefined {
  return categoryMap.get(slug);
}

/**
 * Always returns a renderable Category — even for slugs the static set
 * doesn't know about. WP categories like "crime" or "agriculture-and-
 * environment" come through here too, so we derive a Title-Case name and
 * a default accent when no static entry exists.
 */
export function getCategoryDisplay(slug: string): Category {
  const known = categoryMap.get(slug);
  if (known) return known;
  return {
    slug,
    name: slugToTitle(slug),
    description: "",
    accent: "orange",
  };
}

function slugToTitle(slug: string): string {
  return slug
    .split(/[-_]/)
    .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

/** Categories shown in the primary navigation bar (static fallback;
 *  Phase 1.2.4 overrides this with WP-driven nav). */
export const navCategories = categories;
