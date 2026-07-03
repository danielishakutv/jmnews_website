import type { Metadata } from "next";
import Link from "next/link";
import { Search as SearchIcon } from "lucide-react";
import { searchArticles, getTrendingArticles } from "@/lib/data";
import { site } from "@/lib/site";
import ArticleCard from "@/components/article/ArticleCard";

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false, follow: true },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const [results, suggestions] = await Promise.all([
    query ? searchArticles(query) : Promise.resolve([]),
    getTrendingArticles(6),
  ]);

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 lg:px-6">
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600">
          <SearchIcon className="h-5 w-5" />
        </span>
        <h1 className="font-display text-2xl font-black tracking-tight text-fg sm:text-3xl">
          {query ? <>Results for &ldquo;{query}&rdquo;</> : "Search"}
        </h1>
      </div>

      {query && (
        <p className="mt-2 text-sm text-fg-muted">
          {results.length} {results.length === 1 ? "story" : "stories"} found
        </p>
      )}

      {/* No query yet */}
      {!query && (
        <p className="mt-4 max-w-2xl text-fg-muted">
          Type a keyword in the search bar above to find stories across {site.name}.
        </p>
      )}

      {/* Results */}
      {query && results.length > 0 && (
        <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {results.map((a) => (
            <ArticleCard key={a.slug} article={a} sizes="(max-width: 640px) 100vw, 25vw" />
          ))}
        </div>
      )}

      {/* No matches */}
      {query && results.length === 0 && (
        <div className="mt-10 rounded-2xl border border-line bg-surface-2 p-8 text-center">
          <p className="font-semibold text-fg">No stories matched &ldquo;{query}&rdquo;.</p>
          <p className="mt-1 text-sm text-fg-muted">
            Try a different keyword, or browse the latest headlines below.
          </p>
        </div>
      )}

      {/* Suggestions when nothing to show */}
      {(!query || results.length === 0) && suggestions.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-5 flex items-center gap-3 text-lg font-extrabold tracking-tight text-fg">
            <span className="inline-block h-5 w-1.5 rounded-full bg-brand-600" />
            Trending now
          </h2>
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {suggestions.map((a) => (
              <ArticleCard key={a.slug} article={a} sizes="(max-width: 640px) 100vw, 33vw" />
            ))}
          </div>
        </div>
      )}

      <div className="mt-10">
        <Link href="/" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
