# JM News

A fast, modern, SEO-first news website for **JM News** — Nigerian-focused with international, sports, business, tech and more. Built with **Next.js 15 (App Router)**, **TypeScript** and **Tailwind CSS v4**.

Brand palette: **orange + white** with a **touch of blue**. Design inspired by CNN / BBC / Al Jazeera — clean, editorial and sleek.

## Features

- **Live everything** — a live-clock top bar (Africa/Lagos time + greeting), a "LIVE" nav badge, a live-updates timeline on the homepage, and a dedicated `/live` page with a TV player and rolling live blog.
- **Breaking-news ticker** — auto-scrolling marquee of the latest headlines (pauses on hover).
- **Hero carousel** — auto-playing, swipeable featured stories (Embla) with arrows + dots.
- **Moving carousels** — horizontal, drag-to-scroll rails for Latest, Sports and Entertainment.
- **Section fronts** — newspaper-style category blocks (lead story + secondary list) for Nigeria, Business, World, Technology.
- **Trending sidebar**, **Top Stories** column, **Opinion** dark strip, and **newsletter** CTAs.
- **Social icons** in the top bar and footer (Facebook, X, Instagram, YouTube, TikTok).
- **Full pages**: Home, Category (×9), Article (with author bio, share buttons, related stories), Live, custom 404.

## Speed & SEO

- **100% static** — every page (47 of them) is prerendered as static HTML at build time → instant loads, trivially cacheable on a CDN.
- **Optimized images** via `next/image` (AVIF/WebP, responsive `srcset`, lazy-loading, blur-free LCP priority on hero).
- **Optimized fonts** via `next/font` (Inter + Playfair Display, self-hosted, zero layout shift).
- **Metadata** everywhere: titles/templates, descriptions, canonical URLs, Open Graph + Twitter cards (per-article images).
- **Structured data (JSON-LD)**: `NewsMediaOrganization` site-wide and `NewsArticle` on every story.
- `sitemap.xml`, `robots.txt`, and a PWA `manifest.webmanifest` are generated automatically.
- Accessibility: skip-link, ARIA labels, keyboard-friendly controls, `prefers-reduced-motion` support.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

Production:

```bash
npm run build
npm run start
```

## Project structure

```
src/
  app/
    layout.tsx              # Root layout: fonts, metadata, TopBar/Header/Ticker/Footer, org JSON-LD
    page.tsx                # Homepage (hero, live, carousels, sections, opinion)
    globals.css            # Tailwind v4 theme (brand colors), animations, utilities
    article/[slug]/page.tsx # Article page + generateStaticParams + NewsArticle JSON-LD
    category/[slug]/page.tsx# Category landing + generateStaticParams
    live/page.tsx           # Live TV + live blog
    not-found.tsx           # Custom 404
    sitemap.ts robots.ts manifest.ts icon.svg
  components/
    layout/   TopBar, Header, BreakingTicker, Footer
    home/     HeroCarousel, CarouselSection, CategorySection, LiveSection,
              TrendingSidebar, NewsletterBand, OpinionStrip
    article/  ArticleCard (4 variants), ShareButtons
    ui/       LiveBadge, CategoryPill, SectionHeader
  lib/
    types.ts categories.ts authors.ts articles.ts data.ts site.ts utils.ts
```

## Customising

- **Content** lives in `src/lib/articles.ts`, `categories.ts`, `authors.ts`. This is the single
  data layer — swap these functions for a CMS (Sanity, Contentful, WordPress, a DB) without
  touching the components. All read access goes through `src/lib/data.ts`.
- **Brand / site info** (name, tagline, URL, social links): `src/lib/site.ts`.
- **Colors** (orange/blue scales, ink, live red): the `@theme` block in `src/app/globals.css`.
- **Images** currently use deterministic placeholders (`picsum.photos`) via the `img()` helper in
  `utils.ts`. Replace with real image URLs; allowed remote hosts are listed in `next.config.mjs`.

## Notes

- A dynamic Open Graph image route (`@vercel/og`) was omitted because it crashes on local Windows
  builds (a `fileURLToPath` bug in the bundled library). Per-article OG images use the real article
  image and work everywhere. To add a site-wide generated OG image, re-add `app/opengraph-image.tsx`
  when deploying on Linux/Vercel.
