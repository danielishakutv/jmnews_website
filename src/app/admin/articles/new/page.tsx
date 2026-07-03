import type { Metadata } from "next";
import Link from "next/link";
import { PenSquare, ArrowLeft, AlertTriangle } from "lucide-react";
import { requireRole } from "@/lib/auth/guard";
import AdminHeader from "@/components/admin/AdminHeader";
import { wpCategories, writeConfigured } from "@/lib/cms/wp-write";
import NewArticleForm from "./NewArticleForm";

export const metadata: Metadata = {
  title: "New article",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function NewArticlePage() {
  await requireRole("author");
  const [categories, configured] = await Promise.all([
    wpCategories(),
    Promise.resolve(writeConfigured()),
  ]);

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/admin/articles"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-fg-muted hover:text-fg"
      >
        <ArrowLeft className="h-4 w-4" /> Articles
      </Link>

      <AdminHeader
        title="Write a story"
        description="Publish straight to the site — no wp-admin needed."
        Icon={PenSquare}
      />

      {!configured && (
        <div className="mb-6 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            Publishing needs WordPress admin credentials on the server. Add{" "}
            <code className="rounded bg-amber-100 px-1 text-xs">WP_ADMIN_USER</code> and{" "}
            <code className="rounded bg-amber-100 px-1 text-xs">WP_ADMIN_APP_PASSWORD</code>{" "}
            (an administrator Application Password) in Vercel, then redeploy.
          </span>
        </div>
      )}

      <div className="rounded-2xl border border-line bg-surface p-6 shadow-sm sm:p-8">
        <NewArticleForm categories={categories} />
      </div>
    </div>
  );
}
