import Link from "next/link";
import { TrendingUp } from "lucide-react";
import { getTrendingTopics } from "@/lib/data";

export default async function TopicChips() {
  const topics = await getTrendingTopics(12);
  if (!topics.length) return null;

  return (
    <div className="border-b border-line bg-surface-2">
      <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-2 lg:px-6">
        <span className="hidden shrink-0 items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-fg sm:flex">
          <TrendingUp className="h-3.5 w-3.5 text-brand-600" />
          Trending
        </span>
        <div className="no-scrollbar flex items-center gap-2 overflow-x-auto">
          {topics.map((t) => (
            <Link
              key={t.slug}
              href={`/topic/${t.slug}`}
              className="shrink-0 whitespace-nowrap rounded-full border border-line-strong bg-surface px-3 py-1 text-xs font-semibold capitalize text-fg-muted transition-colors hover:border-brand-500 hover:bg-brand-50 hover:text-brand-700"
            >
              {t.tag}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
