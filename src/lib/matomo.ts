/**
 * Matomo analytics config — shared by the tracker (src/components/analytics)
 * and the admin Analytics page so they always agree.
 *
 * Defaults to the JM News instance; override per-environment with
 * NEXT_PUBLIC_MATOMO_URL / NEXT_PUBLIC_MATOMO_SITE_ID if it ever moves.
 * (These are public tracking values, not secrets.)
 */
export const MATOMO_URL =
  process.env.NEXT_PUBLIC_MATOMO_URL || "https://analytics.aictig.org";
export const MATOMO_SITE_ID = process.env.NEXT_PUBLIC_MATOMO_SITE_ID || "5";

export const matomoConfigured = Boolean(MATOMO_URL && MATOMO_SITE_ID);

/** Deep link to the Matomo dashboard for this site. */
export function matomoDashboardUrl(): string {
  return `${MATOMO_URL.replace(/\/$/, "")}/index.php?module=CoreHome&action=index&idSite=${MATOMO_SITE_ID}&period=day&date=today`;
}
