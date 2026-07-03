import "server-only";
import type { Article } from "@/lib/types";
import { htmlToText, htmlToParagraphs, readTime, tidyExcerpt } from "../html";
import { wpcomFetch, WpcomError } from "./client";
import { defaultReporter } from "@/lib/reporter";

/**
 * Adapt WordPress.com REST posts to the existing `Article` shape so every
 * consumer (ArticleCard, CategorySection, HeroCarousel, …) keeps working
 * unchanged — identical contract to `src/lib/cms/articles.ts`, just a
 * different backend (REST instead of WPGraphQL).
 *
 * Listing endpoints omit `content` to keep payloads small; only the
 * single-post (by-slug) query carries body HTML.
 */

// ── REST post shape (only the fields we read) ───────────────────────────────

interface WpcomAuthor {
  name?: string;
  first_name?: string;
  last_name?: string;
  nice_name?: string;
  login?: string;
  avatar_URL?: string;
  URL?: string;
}

interface WpcomTerm {
  name?: string;
  slug?: string;
}

interface WpcomPost {
  ID?: number;
  slug?: string;
  title?: string;
  date?: string;
  modified?: string;
  excerpt?: string;
  content?: string;
  URL?: string;
  sticky?: boolean;
  featured_image?: string;
  author?: WpcomAuthor;
  /** WP.com returns terms as an object keyed by term name. */
  categories?: Record<string, WpcomTerm>;
  tags?: Record<string, WpcomTerm>;
}

interface WpcomList {
  found?: number;
  posts?: WpcomPost[];
}

// ── Category normalisation ──────────────────────────────────────────────────
// Map jabbamanews' category slugs onto the site's canonical sections so the
// two feeds line up — a wpcom "sport" story then lists under /category/sports
// alongside the primary feed's sports stories.

const CAT_TO_SITE: Record<string, string> = { sport: "sports", tech: "technology" };
const CAT_TO_WPCOM: Record<string, string> = { sports: "sport", technology: "tech" };

function pickCategory(cats?: Record<string, WpcomTerm>): string {
  const first = cats ? Object.values(cats)[0] : undefined;
  const slug = first?.slug ?? "news";
  return CAT_TO_SITE[slug] ?? slug;
}

function postToArticle(p: WpcomPost): Article {
  const title = htmlToText(p.title ?? "");
  const excerpt = tidyExcerpt(htmlToText(p.excerpt ?? ""));
  const content = p.content ? htmlToParagraphs(p.content) : [];
  const tags = p.tags
    ? Object.values(p.tags)
        .map((t) => t.name)
        .filter((n): n is string => Boolean(n))
    : [];
  const allText = excerpt + " " + content.join(" ");
  return {
    slug: p.slug ?? "",
    title,
    excerpt,
    content,
    category: pickCategory(p.categories),
    tags,
    // Bylined to the newsroom correspondent (see src/lib/reporter.ts).
    authorSlug: defaultReporter.slug,
    authorOverride: {
      name: defaultReporter.name,
      role: defaultReporter.role,
      avatar: defaultReporter.avatar,
      bio: defaultReporter.bio,
    },
    image: p.featured_image || "/og.png",
    imageCaption: "",
    publishedAt: p.date ?? new Date().toISOString(),
    readTime: readTime(allText),
    featured: p.sticky ?? false,
    dateline: defaultReporter.dateline,
  };
}

// ── Public accessors (mirror src/lib/cms/articles.ts) ───────────────────────

const LIST_FIELDS = "ID,slug,title,date,excerpt,featured_image,author,categories,tags,sticky";
const DETAIL_FIELDS =
  "ID,slug,title,date,excerpt,content,featured_image,author,categories,tags,sticky";

export async function getWpcomAllArticles(limit = 24): Promise<Article[]> {
  const data = await wpcomFetch<WpcomList>(
    "/posts/",
    { number: limit, fields: LIST_FIELDS },
    { revalidate: 120, tags: ["wpcom:posts"] }
  );
  return (data.posts ?? []).map(postToArticle);
}

export async function getWpcomArticleBySlug(slug: string): Promise<Article | undefined> {
  try {
    const post = await wpcomFetch<WpcomPost>(
      `/posts/slug:${encodeURIComponent(slug)}`,
      { fields: DETAIL_FIELDS },
      { revalidate: 120, tags: [`wpcom:article:${slug}`] }
    );
    return post && post.slug ? postToArticle(post) : undefined;
  } catch (err) {
    // A 404 just means this slug isn't a post on this source — expected in a
    // blended dual-source setup, so treat it as "not found" quietly. Genuine
    // failures (5xx, network) still throw and get logged by the aggregator.
    if (err instanceof WpcomError && / 404\b/.test(err.message)) return undefined;
    throw err;
  }
}

export async function getWpcomArticlesByCategory(slug: string, limit = 12): Promise<Article[]> {
  const wpSlug = CAT_TO_WPCOM[slug] ?? slug;
  const data = await wpcomFetch<WpcomList>(
    "/posts/",
    { category: wpSlug, number: limit, fields: LIST_FIELDS },
    { revalidate: 120, tags: ["wpcom:posts", `wpcom:category:${slug}`] }
  );
  return (data.posts ?? []).map(postToArticle);
}

export async function getWpcomArticlesByTag(slug: string, limit = 12): Promise<Article[]> {
  const data = await wpcomFetch<WpcomList>(
    "/posts/",
    { tag: slug, number: limit, fields: LIST_FIELDS },
    { revalidate: 120, tags: ["wpcom:posts", `wpcom:tag:${slug}`] }
  );
  return (data.posts ?? []).map(postToArticle);
}

/**
 * "Featured" for the hero. WP.com sticky posts sort first by default, so the
 * newest N is the same proxy the GraphQL adapter uses — keeps both feeds
 * consistent until a finer editorial flag exists.
 */
export async function getWpcomFeaturedArticles(limit = 5): Promise<Article[]> {
  return getWpcomAllArticles(limit);
}
