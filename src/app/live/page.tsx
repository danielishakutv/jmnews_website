import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Play, Radio } from "lucide-react";
import { getLiveArticles, getAllArticles, getTrendingArticles } from "@/lib/data";
import { getCategoryDisplay } from "@/lib/categories";
import { timeAgo } from "@/lib/utils";
import { img } from "@/lib/utils";
import TrendingSidebar from "@/components/home/TrendingSidebar";

export const metadata: Metadata = {
  title: "Live TV & Breaking Updates",
  description:
    "Watch JM News live and follow our rolling coverage of the biggest stories in Nigeria and around the world.",
  alternates: { canonical: "/live" },
};

export default async function LivePage() {
  const [live, allArticles, trending] = await Promise.all([
    getLiveArticles(8),
    getAllArticles(),
    getTrendingArticles(6),
  ]);
  const feed = live.length ? live : allArticles.slice(0, 8);

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 lg:px-6">
      <div className="mb-6 flex items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-live px-3 py-1.5 text-sm font-bold uppercase tracking-wider text-white">
          <span className="h-2 w-2 animate-live-dot rounded-full bg-surface" />
          On Air Now
        </span>
        <h1 className="font-display text-2xl font-black text-fg sm:text-3xl">JM News Live</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* Player */}
          <div className="group relative aspect-video overflow-hidden rounded-2xl bg-ink shadow-lg">
            <Image
              src={img("jm-live-studio", 1280, 720)}
              alt="JM News live studio broadcast"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-ink/30" />
            <button
              type="button"
              className="absolute inset-0 grid place-items-center"
              aria-label="Play live stream"
            >
              <span className="grid h-20 w-20 place-items-center rounded-full bg-brand-600 text-white shadow-xl transition-transform group-hover:scale-110">
                <Play className="h-9 w-9 translate-x-0.5 fill-white" />
              </span>
            </button>
            <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-sm bg-live px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white">
              ● Live
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-5">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
                JM News 24
              </span>
              <h2 className="text-lg font-bold text-white sm:text-xl">
                Rolling Coverage: The Day&apos;s Biggest Stories
              </h2>
            </div>
          </div>

          {/* Live blog */}
          <div className="mt-8">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-extrabold text-fg">
              <Radio className="h-5 w-5 text-live dark:text-red-400" /> Live Updates
            </h2>
            <ul className="relative">
              {feed.map((a) => {
                const cat = getCategoryDisplay(a.category);
                return (
                  <li
                    key={a.slug}
                    className="group relative border-l-2 border-live/30 pb-6 pl-6 last:border-transparent last:pb-0"
                  >
                    <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-4 border-white bg-live" />
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                      <span className="text-live dark:text-red-400">{timeAgo(a.publishedAt)}</span>
                      <span className="text-fg-muted">·</span>
                      <Link href={`/category/${a.category}`} className="text-fg-muted hover:text-brand-600">
                        {cat.name}
                      </Link>
                    </div>
                    <h3 className="mt-1.5 text-lg font-bold leading-snug text-fg transition-colors group-hover:text-live">
                      <Link href={`/article/${a.slug}`}>{a.title}</Link>
                    </h3>
                    <p className="clamp-2 mt-1 text-sm text-fg-muted">{a.excerpt}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <aside className="lg:col-span-1">
          <TrendingSidebar articles={trending} />
        </aside>
      </div>
    </div>
  );
}
