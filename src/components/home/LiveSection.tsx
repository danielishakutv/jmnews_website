import Image from "next/image";
import Link from "next/link";
import { Radio } from "lucide-react";
import type { Article } from "@/lib/types";
import { getCategoryDisplay } from "@/lib/categories";
import { timeAgo } from "@/lib/utils";

export default function LiveSection({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;
  const [lead, ...updates] = articles;

  return (
    <section className="overflow-hidden rounded-2xl border border-live/20 bg-gradient-to-br from-surface to-live/[0.04] shadow-sm">
      <div className="flex items-center justify-between border-b border-live/15 bg-live/[0.06] px-5 py-3">
        <h2 className="flex items-center gap-2 text-lg font-extrabold text-fg">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-live" />
          </span>
          Live Updates
        </h2>
        <Link
          href="/live"
          className="flex items-center gap-1.5 text-sm font-bold text-live dark:text-red-400 transition-opacity hover:opacity-80"
        >
          <Radio className="h-4 w-4" /> Watch Live TV
        </Link>
      </div>

      <div className="grid gap-6 p-5 lg:grid-cols-2">
        {/* Lead live story */}
        <Link href={`/article/${lead.slug}`} className="group block">
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
            <Image
              src={lead.image}
              alt={lead.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-sm bg-live px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white">
              ● Live
            </span>
          </div>
          <h3 className="mt-3 text-lg font-bold leading-snug text-fg transition-colors group-hover:text-live sm:text-xl">
            {lead.title}
          </h3>
          <p className="clamp-2 mt-1.5 text-sm text-fg-muted">{lead.excerpt}</p>
        </Link>

        {/* Live timeline */}
        <ul className="relative flex flex-col">
          {updates.map((a) => {
            const cat = getCategoryDisplay(a.category);
            return (
              <li key={a.slug} className="group relative border-l-2 border-live/30 pb-5 pl-5 last:pb-0">
                <span className="absolute -left-[7px] top-1 h-3 w-3 rounded-full border-2 border-white bg-live" />
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider">
                  <span className="text-live dark:text-red-400">{timeAgo(a.publishedAt)}</span>
                  <span className="text-fg-muted">·</span>
                  <span className="text-fg-muted">{cat?.name}</span>
                </div>
                <h4 className="clamp-2 mt-1 font-semibold leading-snug text-fg transition-colors group-hover:text-live">
                  <Link href={`/article/${a.slug}`}>{a.title}</Link>
                </h4>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
