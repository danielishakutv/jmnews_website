import { cmsFetch } from "../client";
import { graphql } from "../generated/gql";

/**
 * WP post queries.
 *
 *  - `fetchCmsPosts`           top-level listing (sticky posts come first
 *                              by default; `isSticky` flag is on each node)
 *  - `fetchCmsPostsByCategory` posts inside a category slug
 *  - `fetchCmsPost`            single post by slug (includes body content)
 *  - `fetchCmsPostsByTag`      posts under a tag slug
 *
 * Listing queries deliberately omit `content` (body HTML) — it can be huge.
 * The detail query is the only one that fetches it.
 *
 * Sticky-only filtering isn't exposed via WPGraphQL `where` args, so we
 * rely on WP's default ordering (stickies-first) plus the `isSticky` flag
 * on each node. Phase 1.5 (ACF) will replace this with a proper
 * `is_featured` custom field for finer editorial control.
 */

const POSTS_LIST_QUERY = graphql(`
  query CmsPosts($first: Int = 12, $after: String, $tag: String) {
    posts(
      first: $first
      after: $after
      where: { tag: $tag, status: PUBLISH }
    ) {
      pageInfo { endCursor hasNextPage }
      nodes {
        id
        slug
        title
        date
        excerpt
        isSticky
        featuredImage { node { sourceUrl altText caption } }
        categories(first: 5) { nodes { name slug } }
        author { node { name slug avatar { url } } }
        tags(first: 8) { nodes { name slug } }
      }
    }
  }
`);

const POSTS_BY_CATEGORY_QUERY = graphql(`
  query CmsPostsByCategory($slug: ID!, $first: Int = 12, $after: String) {
    category(id: $slug, idType: SLUG) {
      id
      name
      slug
      description
      count
      posts(first: $first, after: $after) {
        pageInfo { endCursor hasNextPage }
        nodes {
          id
          slug
          title
          date
          excerpt
          isSticky
          featuredImage { node { sourceUrl altText caption } }
          categories(first: 5) { nodes { name slug } }
          author { node { name slug avatar { url } } }
          tags(first: 8) { nodes { name slug } }
        }
      }
    }
  }
`);

const POST_BY_SLUG_QUERY = graphql(`
  query CmsPostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      slug
      title
      date
      excerpt
      content
      isSticky
      featuredImage { node { sourceUrl altText caption } }
      categories(first: 5) { nodes { name slug } }
      author { node { name slug avatar { url } description } }
      tags(first: 12) { nodes { name slug } }
    }
  }
`);

const POSTS_BY_TAG_QUERY = graphql(`
  query CmsPostsByTag($slug: String!, $first: Int = 12) {
    posts(first: $first, where: { tag: $slug, status: PUBLISH }) {
      nodes {
        id
        slug
        title
        date
        excerpt
        isSticky
        featuredImage { node { sourceUrl altText caption } }
        categories(first: 5) { nodes { name slug } }
        author { node { name slug avatar { url } } }
        tags(first: 8) { nodes { name slug } }
      }
    }
  }
`);

// ── Exported fetchers ───────────────────────────────────────────────────────

export interface CmsPostsOptions {
  first?: number;
  after?: string;
  /** Filter by tag slug. */
  tag?: string;
}

export async function fetchCmsPosts(opts: CmsPostsOptions = {}) {
  const data = await cmsFetch(
    POSTS_LIST_QUERY,
    {
      first: opts.first ?? 12,
      after: opts.after ?? null,
      tag: opts.tag ?? null,
    },
    { revalidate: 120, tags: ["cms:posts"] }
  );
  return data.posts;
}

export async function fetchCmsPostsByCategory(
  slug: string,
  first = 12,
  after?: string
) {
  const data = await cmsFetch(
    POSTS_BY_CATEGORY_QUERY,
    { slug, first, after: after ?? null },
    { revalidate: 120, tags: ["cms:posts", `cms:category:${slug}`] }
  );
  return data.category;
}

export async function fetchCmsPost(slug: string) {
  const data = await cmsFetch(
    POST_BY_SLUG_QUERY,
    { slug },
    { revalidate: 120, tags: [`cms:article:${slug}`] }
  );
  return data.post;
}

export async function fetchCmsPostsByTag(slug: string, first = 12) {
  const data = await cmsFetch(
    POSTS_BY_TAG_QUERY,
    { slug, first },
    { revalidate: 120, tags: ["cms:posts", `cms:tag:${slug}`] }
  );
  return data.posts;
}
