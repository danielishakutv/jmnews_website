import { cmsFetch } from "../client";
import { graphql } from "../generated/gql";

/**
 * WP category taxonomy. Used in Phase 1.2 to back src/lib/categories.ts
 * and in Phase 4 by the dashboard categories module.
 */

const CATEGORIES_QUERY = graphql(`
  query CmsCategories($first: Int = 20) {
    categories(first: $first) {
      nodes {
        id
        name
        slug
        count
      }
    }
  }
`);

export async function getCmsCategories(first = 20) {
  const data = await cmsFetch(CATEGORIES_QUERY, { first }, {
    // Categories change rarely; cache long so the header/footer nav resolves
    // instantly once warm (never re-blocks on the CMS).
    revalidate: 900,
    tags: ["cms:categories"],
  });
  return data.categories?.nodes ?? [];
}
