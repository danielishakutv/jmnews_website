import { Newspaper } from "lucide-react";
import type { Article } from "@/lib/types";
import ArticleCard from "@/components/article/ArticleCard";

export default function ReadNextGrid({
  articles,
  heading = "More Stories",
}: {
  articles: Article[];
  heading?: string;
}) {
  if (!articles.length) return null;

  return (
    <section className="my-10 border-y-4 border-double border-line bg-surface-2/60 py-8">
      <div className="mx-auto max-w-[1400px] px-4 lg:px-6">
        <h2 className="mb-5 flex items-center gap-2 text-lg font-extrabold uppercase tracking-wide text-fg">
          <Newspaper className="h-5 w-5 text-brand-600" />
          {heading}
        </h2>
        <div className="grid grid-cols-2 gap-x-5 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
          {articles.slice(0, 6).map((a) => (
            <ArticleCard key={a.slug} article={a} variant="thumb" />
          ))}
        </div>
      </div>
    </section>
  );
}
