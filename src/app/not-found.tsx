import Link from "next/link";
import { Home, Newspaper } from "lucide-react";
import { getTrendingArticles } from "@/lib/data";
import ArticleCard from "@/components/article/ArticleCard";

export default async function NotFound() {
  const trending = await getTrendingArticles(3);

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-16 lg:px-6">
      <div className="mx-auto max-w-xl text-center">
        <span className="font-display text-7xl font-black text-brand-600 sm:text-8xl">404</span>
        <h1 className="mt-4 font-display text-2xl font-extrabold text-fg sm:text-3xl">
          This story has moved on
        </h1>
        <p className="mt-3 text-fg-muted">
          The page you&apos;re looking for can&apos;t be found. It may have been removed, renamed,
          or never existed. Let&apos;s get you back to the headlines.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-800"
          >
            <Home className="h-4 w-4" /> Back to Home
          </Link>
          <Link
            href="/category/nigeria"
            className="inline-flex items-center gap-2 rounded-full border border-line-strong px-5 py-2.5 text-sm font-bold text-fg transition-colors hover:border-brand-500 hover:text-brand-600"
          >
            <Newspaper className="h-4 w-4" /> Latest News
          </Link>
        </div>
      </div>

      {trending.length > 0 && (
        <div className="mx-auto mt-14 max-w-5xl">
          <h2 className="mb-5 text-center text-sm font-bold uppercase tracking-wider text-fg-muted">
            Trending while you&apos;re here
          </h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {trending.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
