"use client";

import { useContext, useEffect, useRef, useState, Fragment } from "react";
import { Loader2 } from "lucide-react";
import type { Article } from "@/lib/types";
import ArticleCard from "@/components/article/ArticleCard";
import { NowContext } from "@/components/NowProvider";
import AdBanner from "@/components/ui/AdBanner";

const PER_BATCH = 8;
const MAX = 64;
const creatives = ["subscribe", "app", "live", "newsletter"] as const;

export default function MoreNewsFeed({ articles }: { articles: Article[] }) {
  const [count, setCount] = useState(PER_BATCH);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const done = count >= MAX || articles.length === 0;
  const now = useContext(NowContext);

  useEffect(() => {
    if (done) return;
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) setCount((c) => Math.min(c + PER_BATCH, MAX));
      },
      { rootMargin: "700px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [done, count]);

  if (!articles.length) return null;

  const items = Array.from({ length: count }, (_, i) => articles[i % articles.length]);

  return (
    <section className="mx-auto max-w-[1400px] px-4 lg:px-6">
      <h2 className="mb-5 flex items-center gap-3 text-xl font-extrabold tracking-tight text-fg sm:text-2xl">
        <span className="inline-block h-6 w-1.5 rounded-full bg-brand-600" />
        More to Explore
      </h2>

      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((a, i) => (
          <Fragment key={`${a.slug}-${i}`}>
            <ArticleCard article={a} sizes="(max-width: 640px) 100vw, 25vw" now={now ?? undefined} />
            {(i + 1) % 8 === 0 && i + 1 < items.length && (
              <div className="col-span-full my-2">
                <AdBanner
                  format="leaderboard"
                  creative={creatives[Math.floor(i / 8) % creatives.length]}
                  contained={false}
                />
              </div>
            )}
          </Fragment>
        ))}
      </div>

      {!done ? (
        <div ref={sentinelRef} className="flex items-center justify-center gap-2 py-10 text-sm font-semibold text-fg-muted">
          <Loader2 className="h-5 w-5 animate-spin text-brand-600" />
          Loading more stories…
        </div>
      ) : (
        <p className="py-10 text-center text-sm font-semibold text-fg-muted">
          You&apos;ve reached the end of the feed.
        </p>
      )}
    </section>
  );
}
