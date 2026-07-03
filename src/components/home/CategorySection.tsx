import type { Article, CategorySlug } from "@/lib/types";
import { getCategoryDisplay } from "@/lib/categories";
import SectionHeader from "@/components/ui/SectionHeader";
import ArticleCard from "@/components/article/ArticleCard";

/**
 * A category block with one lead story and a column of secondary links —
 * the classic newspaper "section front" layout.
 */
export default function CategorySection({
  category,
  articles,
  bare = false,
}: {
  category: CategorySlug;
  articles: Article[];
  /** When true, drop the centered max-width wrapper so it can nest in a column. */
  bare?: boolean;
}) {
  const cat = getCategoryDisplay(category);
  if (!cat || articles.length === 0) return null;

  const [lead, ...rest] = articles;
  const secondary = rest.slice(0, 4);

  const inner = (
    <>
      <SectionHeader title={cat.name} href={`/category/${category}`} accent={cat.accent} />
      <div className="grid gap-x-8 gap-y-6 md:grid-cols-2">
        <ArticleCard article={lead} priority sizes="(max-width: 768px) 100vw, 40vw" />
        <div className="flex flex-col divide-y divide-line">
          {secondary.map((a) => (
            <ArticleCard key={a.slug} article={a} variant="horizontal" className="py-4 first:pt-0" />
          ))}
        </div>
      </div>
    </>
  );

  if (bare) return <section>{inner}</section>;

  return <section className="mx-auto max-w-[1400px] px-4 lg:px-6">{inner}</section>;
}
