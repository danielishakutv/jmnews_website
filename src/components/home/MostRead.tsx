import Link from "next/link";
import { Flame } from "lucide-react";
import type { Article } from "@/lib/types";
import { getCategoryDisplay } from "@/lib/categories";

export default function MostRead({
  articles,
  title = "Most Read",
}: {
  articles: Article[];
  title?: string;
}) {
  if (!articles.length) return null;

  return (
    <div className="rounded-xl border border-line bg-surface p-5">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-extrabold text-fg">
        <Flame className="h-5 w-5 text-brand-600" />
        {title}
      </h2>
      <ol className="space-y-0">
        {articles.map((a, i) => {
          const cat = getCategoryDisplay(a.category);
          return (
            <li
              key={a.slug}
              className="group flex items-start gap-3 border-b border-line py-3 first:pt-0 last:border-0 last:pb-0"
            >
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-brand-50 font-display text-sm font-black text-brand-600">
                {i + 1}
              </span>
              <div className="min-w-0">
                <Link href={`/category/${a.category}`} className="inline-block py-1.5 -my-1.5 text-[10px] font-bold uppercase tracking-wider text-azure-700 dark:text-azure-400">
                  {cat?.name}
                </Link>
                <h3 className="clamp-2 text-sm font-semibold leading-snug text-fg transition-colors group-hover:text-brand-700">
                  <Link href={`/article/${a.slug}`}>{a.title}</Link>
                </h3>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
