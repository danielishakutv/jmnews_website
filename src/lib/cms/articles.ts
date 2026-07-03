import "server-only";
import type { Article } from "@/lib/types";
import {
  fetchCmsPost,
  fetchCmsPosts,
  fetchCmsPostsByCategory,
  fetchCmsPostsByTag,
} from "./queries/posts";
import { htmlToText, htmlToParagraphs, readTime, tidyExcerpt } from "./html";
import { defaultReporter } from "@/lib/reporter";

/**
 * Adapt WP posts to the existing `Article` shape so consumers (ArticleCard,
 * CategorySection, HeroCarousel, …) keep working unchanged.
 *
 * Listing endpoints omit `content` to keep payloads small; only the
 * single-post detail query carries body HTML, which `getCmsArticleBySlug`
 * passes through to `postToArticle`.
 *
 * Transport note: we read the primary site over WPGraphQL (not the WP REST
 * API). Benchmarked on this host, a single GraphQL query returns posts +
 * author + image + terms in ~0.9s, whereas the REST `_embed` equivalent is
 * ~2.3s (and ~2× slower under a parallel page burst) because `_embed` fans
 * out server-side sub-requests. Without a CDN in front of the origin, REST's
 * GET-cacheability doesn't pay off here, so GraphQL is the faster choice.
 */

// ── Loose post shape ────────────────────────────────────────────────────────
// We type the input as the minimum we read, so this adapter accepts both
// the listing-query node and the detail-query node without complaint.

interface PostLike {
  id?: string | null;
  slug?: string | null;
  title?: string | null;
  date?: string | null;
  excerpt?: string | null;
  content?: string | null;
  isSticky?: boolean | null;
  featuredImage?: {
    node?: {
      sourceUrl?: string | null;
      altText?: string | null;
      caption?: string | null;
    } | null;
  } | null;
  categories?: {
    nodes?: ReadonlyArray<{ name?: string | null; slug?: string | null } | null> | null;
  } | null;
  author?: {
    node?: {
      name?: string | null;
      slug?: string | null;
      avatar?: { url?: string | null } | null;
      /** Only present on the single-post detail query. */
      description?: string | null;
    } | null;
  } | null;
  tags?: {
    nodes?: ReadonlyArray<{ name?: string | null; slug?: string | null } | null> | null;
  } | null;
}

function postToArticle(p: PostLike): Article {
  const title = htmlToText(p.title ?? "");
  const excerpt = tidyExcerpt(htmlToText(p.excerpt ?? ""));
  const contentHtml = p.content ?? "";
  const content = contentHtml ? htmlToParagraphs(contentHtml) : [];
  const cat = p.categories?.nodes?.[0];
  const tags = (p.tags?.nodes ?? [])
    .map((t) => t?.name)
    .filter((n): n is string => Boolean(n));
  const allText = excerpt + " " + content.join(" ");
  const featuredImg = p.featuredImage?.node;
  return {
    slug: p.slug ?? "",
    title,
    excerpt,
    content,
    category: cat?.slug ?? "news",
    tags,
    // Every article is bylined to the newsroom's correspondent (see
    // src/lib/reporter.ts). Edit that config to change the byline everywhere.
    authorSlug: defaultReporter.slug,
    authorOverride: {
      name: defaultReporter.name,
      role: defaultReporter.role,
      avatar: defaultReporter.avatar,
      bio: defaultReporter.bio,
    },
    image: featuredImg?.sourceUrl ?? "/og.png",
    imageCaption:
      htmlToText(featuredImg?.caption ?? "") ||
      htmlToText(featuredImg?.altText ?? ""),
    publishedAt: p.date ?? new Date().toISOString(),
    readTime: readTime(allText),
    featured: p.isSticky ?? false,
    dateline: defaultReporter.dateline,
  };
}

// ── Public accessors (mirror src/lib/data.ts) ───────────────────────────────

export async function getCmsAllArticles(limit = 24): Promise<Article[]> {
  const posts = await fetchCmsPosts({ first: limit });
  return (posts?.nodes ?? []).map((p) => postToArticle(p as PostLike));
}

export async function getCmsArticleBySlug(slug: string): Promise<Article | undefined> {
  const post = await fetchCmsPost(slug);
  return post ? postToArticle(post as PostLike) : undefined;
}

export async function getCmsArticlesByCategory(slug: string, limit = 12): Promise<Article[]> {
  const cat = await fetchCmsPostsByCategory(slug, limit);
  return (cat?.posts?.nodes ?? []).map((p) => postToArticle(p as PostLike));
}

export async function getCmsArticlesByTag(slug: string, limit = 12): Promise<Article[]> {
  const posts = await fetchCmsPostsByTag(slug, limit);
  return (posts?.nodes ?? []).map((p) => postToArticle(p as PostLike));
}

/**
 * "Featured" articles for the hero.
 *
 * WP returns sticky posts first by default, then the most recent. We take
 * the top N — this gives editors the standard WP "stick to front page"
 * lever in wp-admin to control the hero, and pads with newest otherwise.
 */
export async function getCmsFeaturedArticles(limit = 5): Promise<Article[]> {
  const posts = await fetchCmsPosts({ first: limit });
  return (posts?.nodes ?? []).map((p) => postToArticle(p as PostLike));
}
