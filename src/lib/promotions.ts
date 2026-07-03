/**
 * Promotions: on-site popups + ad slots.
 *
 * Config-driven so it works on Vercel with no database. Edit these to turn a
 * popup on/off or drop a creative into an ad space. The admin "Popups & Ads"
 * page renders this config; toggling `enabled` here (then a redeploy) is how
 * a promo goes live. Dimensions are standard IAB sizes for desktop + mobile.
 */

export interface PromoPopup {
  id: string;
  enabled: boolean;
  title: string;
  body: string;
  /** Optional image at the top of the popup. */
  imageUrl?: string;
  ctaLabel: string;
  ctaHref: string;
  /** Hours before the popup shows again to a visitor who closed it. */
  cooldownHours: number;
  /** Delay before it appears, in milliseconds. */
  delayMs: number;
}

export interface AdSlot {
  id: string;
  label: string;
  enabled: boolean;
  /** A creative image URL. Empty → a sized, labelled placeholder is shown. */
  imageUrl?: string;
  href?: string;
  alt?: string;
  desktop: { width: number; height: number };
  mobile: { width: number; height: number };
}

/** Popups. Only the first `enabled` one shows. Off by default (non-intrusive). */
export const popups: PromoPopup[] = [
  {
    id: "whatsapp-channel",
    enabled: false,
    title: "Get JM News on WhatsApp",
    body: "Breaking news from Adamawa and across Nigeria, straight to your phone — free.",
    ctaLabel: "Join the channel",
    ctaHref: "https://whatsapp.com/channel/0029VbAvBF50lwgzHxehLm3l",
    cooldownHours: 24,
    delayMs: 6000,
  },
];

/** Ad spaces placed around the site. Off by default until a creative is added. */
export const adSlots: AdSlot[] = [
  {
    id: "home-leaderboard",
    label: "Home — top leaderboard",
    enabled: false,
    desktop: { width: 728, height: 90 },
    mobile: { width: 320, height: 100 },
  },
  {
    id: "article-inline",
    label: "Article — in-content rectangle",
    enabled: false,
    desktop: { width: 300, height: 250 },
    mobile: { width: 300, height: 250 },
  },
  {
    id: "sidebar-mrec",
    label: "Sidebar — medium rectangle",
    enabled: false,
    desktop: { width: 300, height: 250 },
    mobile: { width: 300, height: 250 },
  },
  {
    id: "sidebar-halfpage",
    label: "Sidebar — half page",
    enabled: false,
    desktop: { width: 300, height: 600 },
    mobile: { width: 300, height: 250 },
  },
];

export function activePopup(): PromoPopup | undefined {
  return popups.find((p) => p.enabled);
}

export function getAdSlot(id: string): AdSlot | undefined {
  return adSlots.find((s) => s.id === id);
}
