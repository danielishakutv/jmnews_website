import Link from "next/link";
import { TrendingUp } from "lucide-react";
import type { Article } from "@/lib/types";
import { getCategoryDisplay } from "@/lib/categories";
import { timeAgo } from "@/lib/utils";

export default function TrendingSidebar({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;

  return (
    <aside className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-extrabold text-fg">
        <TrendingUp className="h-5 w-5 text-brand-600" />
        Trending Now
      </h2>
      <ol className="divide-y divide-line">
        {articles.map((a, i) => {
          const cat = getCategoryDisplay(a.category);
          return (
            <li key={a.slug} className="group flex gap-3.5 py-3.5 first:pt-0 last:pb-0">
              <span className="font-display text-2xl font-black leading-none text-brand-500/80">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <Link
                  href={`/category/${a.category}`}
                  className="inline-block py-1.5 -my-1.5 text-[11px] font-bold uppercase tracking-wider text-brand-600"
                >
                  {cat?.name}
                </Link>
                <h3 className="clamp-2 text-sm font-semibold leading-snug text-fg transition-colors group-hover:text-brand-700">
                  <Link href={`/article/${a.slug}`}>{a.title}</Link>
                </h3>
                <span className="mt-1 block text-xs text-fg-muted">
                  {timeAgo(a.publishedAt)}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
