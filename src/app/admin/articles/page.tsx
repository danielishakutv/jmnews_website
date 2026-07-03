import type { Metadata } from "next";
import Link from "next/link";
import { Newspaper, Plus, ExternalLink } from "lucide-react";
import { requireSession } from "@/lib/auth/session";
import AdminHeader from "@/components/admin/AdminHeader";
import { getAllArticles } from "@/lib/data";
import { getCategoryDisplay } from "@/lib/categories";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Articles",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminArticles() {
  await requireSession();

  let articles: Awaited<ReturnType<typeof getAllArticles>> = [];
  try {
    articles = (await getAllArticles()).slice(0, 40);
  } catch {
    articles = [];
  }

  return (
    <div className="mx-auto max-w-5xl">
      <AdminHeader
        title="Articles"
        description="Your latest published stories, live from WordPress."
        Icon={Newspaper}
        action={
          <Link
            href="/admin/articles/new"
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-700 px-4 text-sm font-bold text-white transition-colors hover:bg-brand-800"
          >
            <Plus className="h-4 w-4" /> New article
          </Link>
        }
      />

      {articles.length === 0 ? (
        <div className="rounded-2xl border border-line bg-surface p-10 text-center text-fg-muted">
          No articles to show right now.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-surface">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-surface-2 text-xs uppercase tracking-wider text-fg-muted">
              <tr>
                <th className="px-5 py-3 font-bold">Title</th>
                <th className="hidden px-5 py-3 font-bold sm:table-cell">Category</th>
                <th className="hidden px-5 py-3 font-bold md:table-cell">Published</th>
                <th className="px-5 py-3 font-bold" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {articles.map((a) => (
                <tr key={a.slug} className="transition-colors hover:bg-surface-2/50">
                  <td className="px-5 py-3">
                    <span className="line-clamp-2 font-semibold text-fg">{a.title}</span>
                  </td>
                  <td className="hidden px-5 py-3 sm:table-cell">
                    <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-bold text-brand-700 dark:text-brand-400">
                      {getCategoryDisplay(a.category).name}
                    </span>
                  </td>
                  <td className="hidden whitespace-nowrap px-5 py-3 text-fg-muted md:table-cell">
                    {formatDate(a.publishedAt)}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link
                      href={`/article/${a.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
                    >
                      View <ExternalLink className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-4 text-xs text-fg-muted">
        Stories are authored in WordPress and appear here automatically. Editing an existing post?
        Open it in wp-admin, publish, and the change goes live within a minute (ISR).
      </p>
    </div>
  );
}
