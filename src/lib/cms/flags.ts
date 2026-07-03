/**
 * CMS feature flags.
 *
 * Phase 0 ships with everything off — the public site keeps reading the
 * static data in src/lib/articles.ts, categories.ts, etc. Phase 1 flips
 * these one at a time as each data type is migrated to WordPress.
 *
 * `NEXT_PUBLIC_USE_CMS` is the global kill switch; flip to `true` once any
 * page is migrated. Per-domain flags are added inline as we progress.
 */

const truthy = (v: string | undefined) => v === "true" || v === "1";

export const cmsFlags = {
  /** Global enable. If false, no CMS reads happen on the public site. */
  enabled: truthy(process.env.NEXT_PUBLIC_USE_CMS),
  /**
   * Read site identity (name/tagline/url) from WP General Settings.
   * Off by default: the menorah WPGraphQL schema rejects the `generalSettings`
   * query (it errored on every render), and the static identity in
   * src/lib/site.ts is already correct. Flip to `true` only once a CMS is
   * confirmed to serve that query, to avoid a slow round-trip + console spam.
   */
  siteSettings: truthy(process.env.WP_SITE_SETTINGS),
} as const;

/**
 * Secondary source: a WordPress.com–hosted site read via the public REST API
 * and blended with the primary WPGraphQL feed (see src/lib/cms/sources.ts).
 *
 * `WPCOM_SITE` is the bare host, e.g. "jabbamanews.wordpress.com". Leave it
 * blank to switch the second source off — the site then reads the primary
 * feed only. Gated behind `cmsFlags.enabled` like every other CMS read.
 */
const wpcomSite = process.env.WPCOM_SITE?.trim() ?? "";

export const wpcomConfig = {
  /** WordPress.com host, or "" when the second source is disabled. */
  site: wpcomSite,
  /** True when a site is configured. */
  enabled: Boolean(wpcomSite),
} as const;
