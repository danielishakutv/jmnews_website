import type { Metadata } from "next";
import Link from "next/link";
import { Tags, ExternalLink, Plus } from "lucide-react";
import { requireSession } from "@/lib/auth/session";
import AdminHeader from "@/components/admin/AdminHeader";
import { getCmsAllCategories } from "@/lib/cms/categories";

export const metadata: Metadata = {
  title: "Categories",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const wpBase = process.env.WP_GRAPHQL_URL?.trim().replace(/\/graphql\/?$/i, "") ?? "";

export default async function AdminCategories() {
  await requireSession();

  let categories: Awaited<ReturnType<typeof getCmsAllCategories>> = [];
  try {
    categories = await getCmsAllCategories();
  } catch {
    categories = [];
  }

  return (
    <div className="mx-auto max-w-4xl">
      <AdminHeader
        title="Categories"
        description="Sections your stories are filed under, live from WordPress."
        Icon={Tags}
        action={
          wpBase ? (
            <a
              href={`${wpBase}/wp-admin/edit-tags.php?taxonomy=category`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-700 px-4 text-sm font-bold text-white transition-colors hover:bg-brand-800"
            >
              <Plus className="h-4 w-4" /> Manage in WordPress
            </a>
          ) : undefined
        }
      />

      {categories.length === 0 ? (
        <div className="rounded-2xl border border-line bg-surface p-10 text-center text-fg-muted">
          No categories to show right now.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {categories.map((c) => (
            <div
              key={c.slug}
              className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4"
            >
              <div className="min-w-0">
                <h3 className="truncate font-bold text-fg">{c.name}</h3>
                <p className="text-xs text-fg-muted">
                  <span className="font-mono">{c.slug}</span> · {c.count} article
                  {c.count === 1 ? "" : "s"}
                </p>
              </div>
              <Link
                href={`/category/${c.slug}`}
                target="_blank"
                aria-label={`View ${c.name}`}
                className="shrink-0 rounded-lg p-2 text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg"
              >
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
