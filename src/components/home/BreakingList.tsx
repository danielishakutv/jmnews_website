import Image from "next/image";
import Link from "next/link";
import { Zap } from "lucide-react";
import type { Article } from "@/lib/types";
import { getCategoryDisplay } from "@/lib/categories";
import { timeAgo } from "@/lib/utils";

export default function BreakingList({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;

  return (
    <div className="rounded-xl border border-line bg-surface p-4">
      <h2 className="mb-3 flex items-center gap-1.5 text-sm font-extrabold uppercase tracking-wider text-live dark:text-red-400">
        <Zap className="h-4 w-4 fill-live" />
        Breaking News
      </h2>
      <ul className="divide-y divide-line">
        {articles.map((a) => {
          const cat = getCategoryDisplay(a.category);
          return (
            <li key={a.slug} className="group py-3 first:pt-0 last:pb-0">
              <Link href={`/article/${a.slug}`} className="flex gap-3">
                <span className="relative aspect-[4/3] w-20 shrink-0 overflow-hidden rounded-lg">
                  <Image src={a.image} alt={a.title} fill sizes="80px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                </span>
                <span className="min-w-0">
                  <span className="inline-block py-1.5 -my-1.5 text-[10px] font-bold uppercase tracking-wider text-brand-600">
                    {cat?.name}
                  </span>
                  <h3 className="clamp-3 text-sm font-bold leading-snug text-fg transition-colors group-hover:text-brand-700">
                    {a.title}
                  </h3>
                  <span className="mt-0.5 block text-[11px] text-fg-muted">{timeAgo(a.publishedAt)}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
