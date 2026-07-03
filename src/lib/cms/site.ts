import "server-only";
import { cache } from "react";
import { site as staticSite } from "@/lib/site";
import { cmsFlags } from "./flags";
import { getSiteSettings } from "./queries/site-settings";
import { htmlToText } from "./html";

/**
 * Site identity — resolved at request time from WP when the feature flag is on,
 * otherwise served from the static fallback in src/lib/site.ts.
 *
 * Field mapping (WP "General Settings" → our shape):
 *   WP title       →  site.name
 *   WP description →  site.tagline  (WP calls this "Tagline")
 *   WP url         →  site.url
 *
 * Everything else (description, socials, whatsappChannel…) stays static
 * until Phase 1.1b brings ACF Options Page online.
 */

export interface Site {
  name: string;
  tagline: string;
  description: string;
  url: string;
  locale: string;
  twitter: string;
  socials: typeof staticSite.socials;
  whatsappChannel: string;
}

/**
 * Wrapped in React `cache()` so the layout, footer and generateMetadata
 * resolve site identity from a single computation per request instead of
 * three (previously three separate round-trips + three error logs).
 */
export const getSite = cache(async (): Promise<Site> => {
  // Fast path: site-settings read disabled → no fetch, no try/catch overhead.
  // This is the default; the static identity in src/lib/site.ts is correct.
  if (!cmsFlags.enabled || !cmsFlags.siteSettings) {
    return { ...staticSite };
  }

  try {
    const wp = await getSiteSettings();
    return {
      ...staticSite,
      // Per-field fallback to static — never crash a page on a partial WP response.
      // WPGraphQL returns these strings HTML-encoded ("Nigeria &amp; The World"),
      // so we decode before they hit React (which would otherwise re-encode the
      // `&` and produce `&amp;amp;` in the rendered page <title>).
      name: wp?.title ? htmlToText(wp.title) : staticSite.name,
      tagline: wp?.description ? htmlToText(wp.description) : staticSite.tagline,
      url: wp?.url ?? staticSite.url,
    };
  } catch (err) {
    // Log once on the server, never let the failure surface to readers.
    console.warn("[cms/site] settings read failed, using static fallback:", err);
    return { ...staticSite };
  }
});
