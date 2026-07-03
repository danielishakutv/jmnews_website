"use client";

import { useContext, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import type { Article } from "@/lib/types";
import { getCategoryDisplay } from "@/lib/categories";
import { NowContext } from "@/components/NowProvider";
import { timeAgo } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Tab = "trending" | "latest" | "video";

export default function TabbedSidebar({
  trending,
  latest,
  video,
  className,
}: {
  trending: Article[];
  latest: Article[];
  video: Article[];
  className?: string;
}) {
  const [tab, setTab] = useState<Tab>("trending");

  const now = useContext(NowContext);
  const nowDate = now ? new Date(now) : undefined;

  const data: Record<Tab, Article[]> = { trending, latest, video };
  const list = data[tab];

  const tabs: { id: Tab; label: string }[] = [
    { id: "trending", label: "Trending" },
    { id: "latest", label: "Latest" },
    { id: "video", label: "Video" },
  ];

  return (
    <div className={cn("rounded-xl border border-line bg-surface", className)}>
      <div className="flex border-b border-line">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "flex-1 border-b-2 px-2 py-3 text-xs font-bold uppercase tracking-wider transition-colors",
              tab === t.id
                ? "border-brand-600 text-brand-700 dark:text-brand-400"
                : "border-transparent text-fg-muted hover:text-fg"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <ul className="divide-y divide-line p-4">
        {list.map((a, i) => {
          const cat = getCategoryDisplay(a.category);
          if (tab === "video") {
            return (
              <li key={a.slug} className="group py-3 first:pt-0 last:pb-0">
                <Link href={`/article/${a.slug}`} className="flex gap-3">
                  <span className="relative aspect-square w-16 shrink-0 overflow-hidden rounded-lg">
                    <Image src={a.image} alt={a.title} fill sizes="64px" className="object-cover" />
                    <span className="absolute inset-0 grid place-items-center bg-black/30">
                      <Play className="h-5 w-5 fill-white text-white" />
                    </span>
                  </span>
                  <span className="min-w-0">
                    <span className="inline-block py-1.5 -my-1.5 text-[10px] font-bold uppercase tracking-wider text-brand-600">
                      Watch · {cat?.name}
                    </span>
                    <h3 className="clamp-2 text-sm font-semibold leading-snug text-fg transition-colors group-hover:text-brand-700">
                      {a.title}
                    </h3>
                  </span>
                </Link>
              </li>
            );
          }
          return (
            <li key={a.slug} className="group flex gap-3 py-3 first:pt-0 last:pb-0">
              <span className="font-display text-xl font-black leading-none text-brand-500/70">
                {i + 1}
              </span>
              <div className="min-w-0">
                <Link
                  href={`/category/${a.category}`}
                  className="inline-block py-1.5 -my-1.5 text-[10px] font-bold uppercase tracking-wider text-brand-600"
                >
                  {cat?.name}
                </Link>
                <h3 className="clamp-2 text-sm font-semibold leading-snug text-fg transition-colors group-hover:text-brand-700">
                  <Link href={`/article/${a.slug}`}>{a.title}</Link>
                </h3>
                <span className="mt-0.5 block text-[11px] text-fg-muted">
                  {timeAgo(a.publishedAt, nowDate)}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
