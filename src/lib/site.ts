export const site = {
  name: "JM News",
  tagline: "Nigeria & The World, As It Happens",
  description:
    "JM News delivers fast, accurate and fearless reporting on Nigeria and the world — politics, business, sports, entertainment, technology and more.",
  /**
   * Used for canonical URLs, sitemap and Open Graph. Set NEXT_PUBLIC_SITE_URL
   * in production (e.g. https://jmnews.ng) — falls back to the placeholder.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.jmnews.ng",
  locale: "en_NG",
  twitter: "@jmnews",
  socials: {
    facebook: "https://facebook.com/jmnews",
    twitter: "https://twitter.com/jmnews",
    instagram: "https://instagram.com/jmnews",
    youtube: "https://youtube.com/@jmnews",
    whatsapp: "https://wa.me/2348000000000",
    tiktok: "https://tiktok.com/@jmnews",
  },
  /** WhatsApp Channel invite link — update with the real channel URL. */
  whatsappChannel: "https://whatsapp.com/channel/0029VbAvBF50lwgzHxehLm3l",
} as const;

export type SiteConfig = typeof site;
