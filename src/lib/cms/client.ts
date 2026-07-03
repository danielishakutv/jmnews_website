import "server-only";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { print } from "graphql";

/**
 * Server-only GraphQL client for the WordPress CMS.
 *
 * Accepts a TypedDocumentNode (from `src/lib/cms/generated/`) or a raw string.
 * When passed a typed document, both the return type and the variables are
 * fully inferred — no manual generics needed at call sites.
 *
 * Uses native fetch so we get Next.js cache features (revalidate + tags)
 * for free. Tags wire up to /api/revalidate in Phase 1.5 so a WP save
 * instantly invalidates only the affected pages.
 */

const endpoint = process.env.WP_GRAPHQL_URL;

/**
 * Hard cap on a single CMS request. If the WordPress host is unreachable,
 * undici otherwise hangs ~10s on connect before failing — which stacks up
 * into multi-second page renders. Aborting at 8s lets the source aggregator
 * fall back to the other feed quickly. Generous enough never to drop a
 * healthy-but-slow response.
 */
const CMS_TIMEOUT_MS = 8000;

export class CmsError extends Error {
  constructor(message: string, public readonly info?: unknown) {
    super(message);
    this.name = "CmsError";
  }
}

export interface CmsFetchOptions {
  /** Seconds to cache. Default 60. Pass 0 to disable caching. */
  revalidate?: number;
  /** Cache tags for on-demand revalidation (Phase 1.5). */
  tags?: string[];
}

// Overloads: typed documents return inferred types; strings return whatever
// the caller asserts (used for one-off raw queries).
export async function cmsFetch<TData, TVars>(
  document: TypedDocumentNode<TData, TVars>,
  variables?: TVars,
  options?: CmsFetchOptions
): Promise<TData>;
export async function cmsFetch<TData>(
  query: string,
  variables?: Record<string, unknown>,
  options?: CmsFetchOptions
): Promise<TData>;
export async function cmsFetch<TData>(
  document: TypedDocumentNode<TData, unknown> | string,
  variables?: unknown,
  options?: CmsFetchOptions
): Promise<TData> {
  if (!endpoint) {
    throw new CmsError(
      "WP_GRAPHQL_URL is not set. Add it to .env.local (see .env.example)."
    );
  }

  const query = typeof document === "string" ? document : print(document);
  const revalidate = options?.revalidate ?? 60;
  const fetchOpts: RequestInit & { next?: { revalidate: number; tags: string[] } } =
    revalidate === 0
      ? { cache: "no-store" }
      : { next: { revalidate, tags: options?.tags ?? [] } };

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    signal: AbortSignal.timeout(CMS_TIMEOUT_MS),
    ...fetchOpts,
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new CmsError(`CMS HTTP ${res.status} ${res.statusText}`, body);
  }

  const json = (await res.json()) as { data?: TData; errors?: unknown };
  if (json.errors) {
    throw new CmsError("CMS returned GraphQL errors", json.errors);
  }
  if (json.data === undefined || json.data === null) {
    throw new CmsError("CMS response had no data field", json);
  }
  return json.data;
}
