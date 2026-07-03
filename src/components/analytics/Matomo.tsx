"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Matomo analytics.
 *
 * Env-gated: renders nothing unless BOTH are set —
 *   NEXT_PUBLIC_MATOMO_URL       e.g. https://your-instance.matomo.cloud
 *   NEXT_PUBLIC_MATOMO_SITE_ID   the numeric site id from Matomo
 *
 * Loads the tracker once, then records a page view on every client-side
 * navigation (App Router doesn't do full reloads, so we track route changes).
 */

const MATOMO_URL = process.env.NEXT_PUBLIC_MATOMO_URL;
const SITE_ID = process.env.NEXT_PUBLIC_MATOMO_SITE_ID;

declare global {
  interface Window {
    _paq?: unknown[][];
  }
}

export default function Matomo() {
  const pathname = usePathname();
  const started = useRef(false);
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (!MATOMO_URL || !SITE_ID) return;
    if (pathname.startsWith("/admin")) return; // don't track the dashboard
    window._paq = window._paq || [];

    if (!started.current) {
      started.current = true;
      const base = MATOMO_URL.endsWith("/") ? MATOMO_URL : `${MATOMO_URL}/`;
      window._paq.push(["enableLinkTracking"]);
      window._paq.push(["setTrackerUrl", `${base}matomo.php`]);
      window._paq.push(["setSiteId", SITE_ID]);
      const d = document;
      const g = d.createElement("script");
      const s = d.getElementsByTagName("script")[0];
      g.async = true;
      g.src = `${base}matomo.js`;
      s.parentNode?.insertBefore(g, s);
      lastPath.current = pathname; // first view is tracked by the effect below
    }

    // Record the page view (skip the duplicate on the very first render, which
    // the loader already counts once matomo.js is live).
    if (lastPath.current !== pathname || window._paq.length) {
      window._paq.push(["setCustomUrl", window.location.href]);
      window._paq.push(["setDocumentTitle", document.title]);
      window._paq.push(["trackPageView"]);
      lastPath.current = pathname;
    }
  }, [pathname]);

  return null;
}
