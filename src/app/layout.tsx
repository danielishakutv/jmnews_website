import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import BreakingTicker from "@/components/layout/BreakingTicker";
import TopicChips from "@/components/ui/TopicChips";
import Footer from "@/components/layout/Footer";
import PromoPopup from "@/components/promo/PromoPopup";
import Matomo from "@/components/analytics/Matomo";
import { getSite } from "@/lib/cms/site";
import { cmsFlags } from "@/lib/cms/flags";
import { getCmsNavCategories } from "@/lib/cms/categories";
import { navCategories as staticNavCategories } from "@/lib/categories";
import type { Category } from "@/lib/types";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Modern, clean sans display face for the logo + headlines (replaces the
// old Playfair serif). Self-hosted, zero layout shift, variable weight.
const display = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display-face",
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

// No-FOUC theme init: apply the stored (or system) preference to <html>
// before first paint, so there's no flash of the wrong theme.
const themeInit = `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches;var r=document.documentElement;if(d)r.classList.add('dark');r.style.colorScheme=d?'dark':'light';}catch(e){}})();`;

/**
 * Metadata is resolved per request. When NEXT_PUBLIC_USE_CMS is off this
 * costs nothing (getSite returns the static fallback synchronously inside the
 * promise). When it's on, the underlying fetch is request-memoised by Next,
 * so a layout + page rendering on the same request share a single round-trip.
 */
export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  return {
    metadataBase: new URL(site.url),
    title: {
      default: `${site.name} — ${site.tagline}`,
      template: `%s | ${site.name}`,
    },
    description: site.description,
    applicationName: site.name,
    keywords: [
      "Nigeria news",
      "Naija news",
      "breaking news",
      "Nigerian politics",
      "Super Eagles",
      "Nollywood",
      "African news",
      "world news",
      "business",
      "technology",
    ],
    authors: [{ name: site.name }],
    creator: site.name,
    publisher: site.name,
    formatDetection: { telephone: false },
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: site.locale,
      url: site.url,
      siteName: site.name,
      title: `${site.name} — ${site.tagline}`,
      description: site.description,
      // Default social/link-preview thumbnail. Article pages override this
      // with their own image; every other page inherits this branded card.
      images: [
        {
          url: "/og.png",
          width: 1200,
          height: 630,
          alt: `${site.name} — ${site.tagline}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: site.twitter,
      creator: site.twitter,
      title: `${site.name} — ${site.tagline}`,
      description: site.description,
      images: ["/og.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
    category: "news",
  };
}

/**
 * Nav source of truth — WP categories (top N by post count, "news" hidden)
 * when CMS is on; the curated static set otherwise. Wrapped in try/catch so
 * a CMS hiccup never breaks the layout.
 */
async function resolveNavCategories(): Promise<Category[]> {
  if (!cmsFlags.enabled) return staticNavCategories;
  // Bound this: the layout is OUTSIDE every Suspense boundary, so a slow CMS
  // here blocks the whole shell — including the loading skeleton — from
  // painting. Fall back to the curated static nav after 2s. The CMS nav is
  // cached for minutes, so once warm it resolves instantly anyway.
  const fallback = new Promise<Category[]>((r) =>
    setTimeout(() => r(staticNavCategories), 2000)
  );
  try {
    return await Promise.race([getCmsNavCategories(8), fallback]);
  } catch {
    return staticNavCategories;
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0c11" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Chrome is always rendered; the dashboard layout's CSS hides it when
  // present (only mounts on /admin/*). This avoids brittle pathname
  // propagation from middleware into RSC headers().
  const [site, navCategories] = await Promise.all([
    getSite(),
    resolveNavCategories(),
  ]);

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: site.name,
    url: site.url,
    description: site.description,
    sameAs: Object.values(site.socials),
  };

  return (
    <html
      lang="en-NG"
      className={`${inter.variable} ${display.variable}`}
      suppressHydrationWarning
    >
      {/* suppressHydrationWarning: some browser extensions inject attributes
          onto <body> (e.g. cz-shortcut-listen) before React hydrates, which
          would otherwise log a benign hydration mismatch. */}
      <body className="min-h-screen bg-bg text-fg antialiased" suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        {/* Grouped so the dashboard layout can hide all public chrome with
            a single CSS selector. */}
        <div data-public-chrome>
          <TopBar />
          <Header navCategories={navCategories} />
          <BreakingTicker />
          <TopicChips />
        </div>
        {/* overflow-x-clip contains any stray horizontal overflow from page
            content without creating a scroll container (keeps sticky working)
            and without affecting the fixed mobile drawer in <header>. */}
        <main id="main" className="overflow-x-clip">
          {children}
        </main>
        <div data-public-chrome>
          <Footer />
          <PromoPopup />
        </div>
        <Matomo />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </body>
    </html>
  );
}
