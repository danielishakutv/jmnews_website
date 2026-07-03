"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { MATOMO_URL, MATOMO_SITE_ID } from "@/lib/matomo";

/**
 * Matomo analytics. Loads the tracker once, then records a page view on every
 * client-side navigation (App Router doesn't do full reloads). Skips the admin
 * dashboard and localhost so those don't pollute the stats.
 */

declare global {
  interface Window {
    _paq?: unknown[][];
  }
}

function isLocal(host: string): boolean {
  return host === "localhost" || host === "127.0.0.1" || host.endsWith(".local");
}

export default function Matomo() {
  const pathname = usePathname();
  const started = useRef(false);

  useEffect(() => {
    if (!MATOMO_URL || !MATOMO_SITE_ID) return;
    if (pathname.startsWith("/admin")) return;
    if (isLocal(window.location.hostname)) return;

    window._paq = window._paq || [];

    if (!started.current) {
      started.current = true;
      const base = MATOMO_URL.endsWith("/") ? MATOMO_URL : `${MATOMO_URL}/`;
      window._paq.push(["enableLinkTracking"]);
      window._paq.push(["setTrackerUrl", `${base}matomo.php`]);
      window._paq.push(["setSiteId", MATOMO_SITE_ID]);
      const d = document;
      const g = d.createElement("script");
      const s = d.getElementsByTagName("script")[0];
      g.async = true;
      g.src = `${base}matomo.js`;
      s.parentNode?.insertBefore(g, s);
    }

    // Record this page view (works for the first load and every SPA navigation).
    window._paq.push(["setCustomUrl", window.location.href]);
    window._paq.push(["setDocumentTitle", document.title]);
    window._paq.push(["trackPageView"]);
  }, [pathname]);

  return null;
}
