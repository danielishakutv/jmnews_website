/**
 * A category slug. Originally a narrow union of the nine planned slugs;
 * widened to `string` once the CMS came online so WP-managed slugs
 * (crime, security, agriculture-and-environment, …) flow through the
 * same code paths. The static `categories.ts` set still seeds the visual
 * metadata; `getCategoryDisplay()` auto-derives sensible defaults for any
 * slug that isn't pre-defined.
 */
export type CategorySlug = string;

/** Historically-known slugs — kept for autocomplete where code hardcodes
 *  a brand-style category (e.g. nav pinning). New code should accept any
 *  string and use {@link Category} via `getCategoryDisplay`. */
export type StaticCategorySlug =
  | "nigeria"
  | "politics"
  | "business"
  | "world"
  | "sports"
  | "entertainment"
  | "technology"
  | "health"
  | "opinion";

export interface Category {
  slug: CategorySlug;
  name: string;
  /** Short tagline shown on category landing pages */
  description: string;
  /** Tailwind-friendly accent token, e.g. "orange" | "blue" */
  accent: "orange" | "blue" | "slate";
}

export interface Author {
  slug: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
}

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  /** Body paragraphs in reading order */
  content: string[];
  category: CategorySlug;
  tags: string[];
  authorSlug: string;
  /**
   * Author data inlined at fetch time (CMS-driven articles only).
   * `articleAuthor()` prefers this over the static `getAuthor()` map so
   * WP-authored posts render the real reporter byline + avatar.
   */
  authorOverride?: {
    name: string;
    role: string;
    avatar: string;
    bio?: string;
  };
  image: string;
  imageCaption: string;
  /** ISO 8601 timestamp */
  publishedAt: string;
  /** Estimated reading time in minutes */
  readTime: number;
  featured?: boolean;
  /** Currently a live / developing story */
  live?: boolean;
  trending?: boolean;
  /** Location dateline, e.g. "ABUJA" */
  dateline?: string;
}
