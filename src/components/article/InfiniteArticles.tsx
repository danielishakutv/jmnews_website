"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Loader2, ArrowUp } from "lucide-react";
import type { Article } from "@/lib/types";
import { site } from "@/lib/site";
import ArticleView from "@/components/article/ArticleView";
import ReadNextGrid from "@/components/article/ReadNextGrid";
import AdBanner from "@/components/ui/AdBanner";

/** Hard cap on how many full articles to render, to protect the browser. */
const MAX_ARTICLES = 24;

function windowFrom(arr: Article[], start: number, n: number, excludeSlug: string): Article[] {
  const res: Article[] = [];
  const len = arr.length;
  if (!len) return res;
  let i = start % len;
  let guard = 0;
  while (res.length < n && res.length < len && guard < len * 2) {
    const a = arr[((i % len) + len) % len];
    if (a.slug !== excludeSlug && !res.some((r) => r.slug === a.slug)) res.push(a);
    i++;
    guard++;
  }
  return res;
}

export default function InfiniteArticles({ queue }: { queue: Article[] }) {
  const len = queue.length;
  const [loaded, setLoaded] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const reachedEnd = loaded >= MAX_ARTICLES || len <= 1;

  // Load the next article when the sentinel scrolls into view.
  useEffect(() => {
    if (reachedEnd) return;
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setLoaded((n) => Math.min(n + 1, MAX_ARTICLES));
        }
      },
      { rootMargin: "600px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reachedEnd, loaded]);

  // Update the URL + document title as each article scrolls past the top.
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-article-slug]"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const slug = e.target.getAttribute("data-article-slug");
            const title = e.target.getAttribute("data-article-title");
            if (slug) {
              window.history.replaceState(null, "", `/article/${slug}`);
              if (title) document.title = `${title} | ${site.name}`;
            }
          }
        }
      },
      // Trigger when an article's top reaches ~the top third of the viewport.
      { rootMargin: "-20% 0px -75% 0px" }
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [loaded]);

  const scrollTop = useCallback(() => window.scrollTo({ top: 0, behavior: "smooth" }), []);

  return (
    <div ref={containerRef}>
      {Array.from({ length: loaded }).map((_, p) => {
        const article = queue[p % len];
        const readNext = windowFrom(queue, p * 2 + 1, 6, article.slug);
        const isLast = p === loaded - 1;
        return (
          <div key={`${article.slug}-${p}`}>
            <ArticleView article={article} primary={p === 0} />

            {/* Inline ad after the first article */}
            {p === 0 && <AdBanner format="leaderboard" creative="newsletter" className="mt-10" />}

            {/* 6-up "more stories" block, then the next article continues below */}
            {(!isLast || !reachedEnd) && (
              <ReadNextGrid
                articles={readNext}
                heading={p === 0 ? "More Stories" : "Read Next"}
              />
            )}
          </div>
        );
      })}

      {/* Sentinel / loader */}
      {!reachedEnd ? (
        <div ref={sentinelRef} className="flex items-center justify-center gap-2 py-10 text-sm font-semibold text-fg-muted">
          <Loader2 className="h-5 w-5 animate-spin text-brand-600" />
          Loading more stories…
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <p className="text-sm font-semibold text-fg-muted">You&apos;re all caught up.</p>
          <button
            type="button"
            onClick={scrollTop}
            className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-800"
          >
            <ArrowUp className="h-4 w-4" /> Back to top
          </button>
        </div>
      )}
    </div>
  );
}
