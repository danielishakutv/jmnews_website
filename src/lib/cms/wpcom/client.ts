import "server-only";
import { wpcomConfig } from "../flags";

/**
 * Server-only REST client for a WordPress.com–hosted site.
 *
 * The secondary news source (jabbamanews.wordpress.com) runs on
 * wordpress.com, which — on non-Business plans — has no WPGraphQL plugin,
 * so it can't go through `src/lib/cms/client.ts`. Instead we read the public
 * WordPress.com REST API (v1.1), which needs no auth for published posts.
 *
 * This feed is blended with the primary WPGraphQL feed in
 * `src/lib/cms/sources.ts`, so the site keeps serving stories even when one
 * backend is down — the whole point of having two sources.
 *
 * Uses native fetch so we get Next.js cache features (revalidate + tags)
 * for free, exactly like the GraphQL client.
 */

const API_ROOT = "https://public-api.wordpress.com/rest/v1.1/sites";

/** Hard cap on a single request so a hung backend can't stall a render;
 *  the aggregator falls back to the other feed on abort. */
const WPCOM_TIMEOUT_MS = 8000;

export class WpcomError extends Error {
  constructor(message: string, public readonly info?: unknown) {
    super(message);
    this.name = "WpcomError";
  }
}

export interface WpcomFetchOptions {
  /** Seconds to cache. Default 60. Pass 0 to disable caching. */
  revalidate?: number;
  /** Cache tags for on-demand revalidation. */
  tags?: string[];
}

/**
 * GET a path under the configured site, e.g. `/posts/` or `/posts/slug:foo`.
 * Query params with empty / undefined values are dropped.
 */
export async function wpcomFetch<T>(
  path: string,
  params: Record<string, string | number | undefined> = {},
  options: WpcomFetchOptions = {}
): Promise<T> {
  const site = wpcomConfig.site;
  if (!site) {
    throw new WpcomError(
      "WPCOM_SITE is not set. Add it to .env.local (see .env.example) to enable the second source."
    );
  }

  const url = new URL(`${API_ROOT}/${site}${path}`);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  const revalidate = options.revalidate ?? 60;
  const fetchOpts: RequestInit & { next?: { revalidate: number; tags: string[] } } =
    revalidate === 0
      ? { cache: "no-store" }
      : { next: { revalidate, tags: options.tags ?? [] } };

  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(WPCOM_TIMEOUT_MS),
    ...fetchOpts,
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new WpcomError(`WPCOM HTTP ${res.status} ${res.statusText}`, body);
  }

  return (await res.json()) as T;
}
