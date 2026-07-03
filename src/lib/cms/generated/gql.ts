/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query CmsCategories($first: Int = 20) {\n    categories(first: $first) {\n      nodes {\n        id\n        name\n        slug\n        count\n      }\n    }\n  }\n": typeof types.CmsCategoriesDocument,
    "\n  query CmsPosts($first: Int = 12, $after: String, $tag: String) {\n    posts(\n      first: $first\n      after: $after\n      where: { tag: $tag, status: PUBLISH }\n    ) {\n      pageInfo { endCursor hasNextPage }\n      nodes {\n        id\n        slug\n        title\n        date\n        excerpt\n        isSticky\n        featuredImage { node { sourceUrl altText caption } }\n        categories(first: 5) { nodes { name slug } }\n        author { node { name slug avatar { url } } }\n        tags(first: 8) { nodes { name slug } }\n      }\n    }\n  }\n": typeof types.CmsPostsDocument,
    "\n  query CmsPostsByCategory($slug: ID!, $first: Int = 12, $after: String) {\n    category(id: $slug, idType: SLUG) {\n      id\n      name\n      slug\n      description\n      count\n      posts(first: $first, after: $after) {\n        pageInfo { endCursor hasNextPage }\n        nodes {\n          id\n          slug\n          title\n          date\n          excerpt\n          isSticky\n          featuredImage { node { sourceUrl altText caption } }\n          categories(first: 5) { nodes { name slug } }\n          author { node { name slug avatar { url } } }\n          tags(first: 8) { nodes { name slug } }\n        }\n      }\n    }\n  }\n": typeof types.CmsPostsByCategoryDocument,
    "\n  query CmsPostBySlug($slug: ID!) {\n    post(id: $slug, idType: SLUG) {\n      id\n      slug\n      title\n      date\n      excerpt\n      content\n      isSticky\n      featuredImage { node { sourceUrl altText caption } }\n      categories(first: 5) { nodes { name slug } }\n      author { node { name slug avatar { url } description } }\n      tags(first: 12) { nodes { name slug } }\n    }\n  }\n": typeof types.CmsPostBySlugDocument,
    "\n  query CmsPostsByTag($slug: String!, $first: Int = 12) {\n    posts(first: $first, where: { tag: $slug, status: PUBLISH }) {\n      nodes {\n        id\n        slug\n        title\n        date\n        excerpt\n        isSticky\n        featuredImage { node { sourceUrl altText caption } }\n        categories(first: 5) { nodes { name slug } }\n        author { node { name slug avatar { url } } }\n        tags(first: 8) { nodes { name slug } }\n      }\n    }\n  }\n": typeof types.CmsPostsByTagDocument,
    "\n  query SiteSettings {\n    generalSettings {\n      title\n      description\n      url\n      email\n    }\n  }\n": typeof types.SiteSettingsDocument,
    "\n  mutation UpdateSiteSettings(\n    $title: String\n    $description: String\n    $url: String\n    $email: String\n  ) {\n    updateSettings(\n      input: {\n        generalSettingsTitle: $title\n        generalSettingsDescription: $description\n        generalSettingsUrl: $url\n        generalSettingsEmail: $email\n      }\n    ) {\n      generalSettings {\n        title\n        description\n        url\n        email\n      }\n    }\n  }\n": typeof types.UpdateSiteSettingsDocument,
};
const documents: Documents = {
    "\n  query CmsCategories($first: Int = 20) {\n    categories(first: $first) {\n      nodes {\n        id\n        name\n        slug\n        count\n      }\n    }\n  }\n": types.CmsCategoriesDocument,
    "\n  query CmsPosts($first: Int = 12, $after: String, $tag: String) {\n    posts(\n      first: $first\n      after: $after\n      where: { tag: $tag, status: PUBLISH }\n    ) {\n      pageInfo { endCursor hasNextPage }\n      nodes {\n        id\n        slug\n        title\n        date\n        excerpt\n        isSticky\n        featuredImage { node { sourceUrl altText caption } }\n        categories(first: 5) { nodes { name slug } }\n        author { node { name slug avatar { url } } }\n        tags(first: 8) { nodes { name slug } }\n      }\n    }\n  }\n": types.CmsPostsDocument,
    "\n  query CmsPostsByCategory($slug: ID!, $first: Int = 12, $after: String) {\n    category(id: $slug, idType: SLUG) {\n      id\n      name\n      slug\n      description\n      count\n      posts(first: $first, after: $after) {\n        pageInfo { endCursor hasNextPage }\n        nodes {\n          id\n          slug\n          title\n          date\n          excerpt\n          isSticky\n          featuredImage { node { sourceUrl altText caption } }\n          categories(first: 5) { nodes { name slug } }\n          author { node { name slug avatar { url } } }\n          tags(first: 8) { nodes { name slug } }\n        }\n      }\n    }\n  }\n": types.CmsPostsByCategoryDocument,
    "\n  query CmsPostBySlug($slug: ID!) {\n    post(id: $slug, idType: SLUG) {\n      id\n      slug\n      title\n      date\n      excerpt\n      content\n      isSticky\n      featuredImage { node { sourceUrl altText caption } }\n      categories(first: 5) { nodes { name slug } }\n      author { node { name slug avatar { url } description } }\n      tags(first: 12) { nodes { name slug } }\n    }\n  }\n": types.CmsPostBySlugDocument,
    "\n  query CmsPostsByTag($slug: String!, $first: Int = 12) {\n    posts(first: $first, where: { tag: $slug, status: PUBLISH }) {\n      nodes {\n        id\n        slug\n        title\n        date\n        excerpt\n        isSticky\n        featuredImage { node { sourceUrl altText caption } }\n        categories(first: 5) { nodes { name slug } }\n        author { node { name slug avatar { url } } }\n        tags(first: 8) { nodes { name slug } }\n      }\n    }\n  }\n": types.CmsPostsByTagDocument,
    "\n  query SiteSettings {\n    generalSettings {\n      title\n      description\n      url\n      email\n    }\n  }\n": types.SiteSettingsDocument,
    "\n  mutation UpdateSiteSettings(\n    $title: String\n    $description: String\n    $url: String\n    $email: String\n  ) {\n    updateSettings(\n      input: {\n        generalSettingsTitle: $title\n        generalSettingsDescription: $description\n        generalSettingsUrl: $url\n        generalSettingsEmail: $email\n      }\n    ) {\n      generalSettings {\n        title\n        description\n        url\n        email\n      }\n    }\n  }\n": types.UpdateSiteSettingsDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CmsCategories($first: Int = 20) {\n    categories(first: $first) {\n      nodes {\n        id\n        name\n        slug\n        count\n      }\n    }\n  }\n"): (typeof documents)["\n  query CmsCategories($first: Int = 20) {\n    categories(first: $first) {\n      nodes {\n        id\n        name\n        slug\n        count\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CmsPosts($first: Int = 12, $after: String, $tag: String) {\n    posts(\n      first: $first\n      after: $after\n      where: { tag: $tag, status: PUBLISH }\n    ) {\n      pageInfo { endCursor hasNextPage }\n      nodes {\n        id\n        slug\n        title\n        date\n        excerpt\n        isSticky\n        featuredImage { node { sourceUrl altText caption } }\n        categories(first: 5) { nodes { name slug } }\n        author { node { name slug avatar { url } } }\n        tags(first: 8) { nodes { name slug } }\n      }\n    }\n  }\n"): (typeof documents)["\n  query CmsPosts($first: Int = 12, $after: String, $tag: String) {\n    posts(\n      first: $first\n      after: $after\n      where: { tag: $tag, status: PUBLISH }\n    ) {\n      pageInfo { endCursor hasNextPage }\n      nodes {\n        id\n        slug\n        title\n        date\n        excerpt\n        isSticky\n        featuredImage { node { sourceUrl altText caption } }\n        categories(first: 5) { nodes { name slug } }\n        author { node { name slug avatar { url } } }\n        tags(first: 8) { nodes { name slug } }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CmsPostsByCategory($slug: ID!, $first: Int = 12, $after: String) {\n    category(id: $slug, idType: SLUG) {\n      id\n      name\n      slug\n      description\n      count\n      posts(first: $first, after: $after) {\n        pageInfo { endCursor hasNextPage }\n        nodes {\n          id\n          slug\n          title\n          date\n          excerpt\n          isSticky\n          featuredImage { node { sourceUrl altText caption } }\n          categories(first: 5) { nodes { name slug } }\n          author { node { name slug avatar { url } } }\n          tags(first: 8) { nodes { name slug } }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query CmsPostsByCategory($slug: ID!, $first: Int = 12, $after: String) {\n    category(id: $slug, idType: SLUG) {\n      id\n      name\n      slug\n      description\n      count\n      posts(first: $first, after: $after) {\n        pageInfo { endCursor hasNextPage }\n        nodes {\n          id\n          slug\n          title\n          date\n          excerpt\n          isSticky\n          featuredImage { node { sourceUrl altText caption } }\n          categories(first: 5) { nodes { name slug } }\n          author { node { name slug avatar { url } } }\n          tags(first: 8) { nodes { name slug } }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CmsPostBySlug($slug: ID!) {\n    post(id: $slug, idType: SLUG) {\n      id\n      slug\n      title\n      date\n      excerpt\n      content\n      isSticky\n      featuredImage { node { sourceUrl altText caption } }\n      categories(first: 5) { nodes { name slug } }\n      author { node { name slug avatar { url } description } }\n      tags(first: 12) { nodes { name slug } }\n    }\n  }\n"): (typeof documents)["\n  query CmsPostBySlug($slug: ID!) {\n    post(id: $slug, idType: SLUG) {\n      id\n      slug\n      title\n      date\n      excerpt\n      content\n      isSticky\n      featuredImage { node { sourceUrl altText caption } }\n      categories(first: 5) { nodes { name slug } }\n      author { node { name slug avatar { url } description } }\n      tags(first: 12) { nodes { name slug } }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CmsPostsByTag($slug: String!, $first: Int = 12) {\n    posts(first: $first, where: { tag: $slug, status: PUBLISH }) {\n      nodes {\n        id\n        slug\n        title\n        date\n        excerpt\n        isSticky\n        featuredImage { node { sourceUrl altText caption } }\n        categories(first: 5) { nodes { name slug } }\n        author { node { name slug avatar { url } } }\n        tags(first: 8) { nodes { name slug } }\n      }\n    }\n  }\n"): (typeof documents)["\n  query CmsPostsByTag($slug: String!, $first: Int = 12) {\n    posts(first: $first, where: { tag: $slug, status: PUBLISH }) {\n      nodes {\n        id\n        slug\n        title\n        date\n        excerpt\n        isSticky\n        featuredImage { node { sourceUrl altText caption } }\n        categories(first: 5) { nodes { name slug } }\n        author { node { name slug avatar { url } } }\n        tags(first: 8) { nodes { name slug } }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query SiteSettings {\n    generalSettings {\n      title\n      description\n      url\n      email\n    }\n  }\n"): (typeof documents)["\n  query SiteSettings {\n    generalSettings {\n      title\n      description\n      url\n      email\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateSiteSettings(\n    $title: String\n    $description: String\n    $url: String\n    $email: String\n  ) {\n    updateSettings(\n      input: {\n        generalSettingsTitle: $title\n        generalSettingsDescription: $description\n        generalSettingsUrl: $url\n        generalSettingsEmail: $email\n      }\n    ) {\n      generalSettings {\n        title\n        description\n        url\n        email\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateSiteSettings(\n    $title: String\n    $description: String\n    $url: String\n    $email: String\n  ) {\n    updateSettings(\n      input: {\n        generalSettingsTitle: $title\n        generalSettingsDescription: $description\n        generalSettingsUrl: $url\n        generalSettingsEmail: $email\n      }\n    ) {\n      generalSettings {\n        title\n        description\n        url\n        email\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;