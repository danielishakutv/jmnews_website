import type { Metadata } from "next";
import Link from "next/link";
import {
  Newspaper,
  Tags,
  UserRound,
  Megaphone,
  BarChart3,
  Settings,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { requireSession } from "@/lib/auth/session";
import { getAllArticles } from "@/lib/data";
import { getCmsAllCategories } from "@/lib/cms/categories";
import { getCategoryDisplay } from "@/lib/categories";
import { cmsFlags, wpcomConfig } from "@/lib/cms/flags";
import { timeAgo } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Overview",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const MODULES = [
  { href: "/admin/articles", label: "Articles", Icon: Newspaper, desc: "Your latest published stories." },
  { href: "/admin/categories", label: "Categories", Icon: Tags, desc: "Sections stories are filed under." },
  { href: "/admin/reporters", label: "Reporter", Icon: UserRound, desc: "Byline and public profile." },
  { href: "/admin/promotions", label: "Popups & Ads", Icon: Megaphone, desc: "Popups and ad spaces." },
  { href: "/admin/analytics", label: "Analytics", Icon: BarChart3, desc: "Traffic & content snapshot." },
  { href: "/admin/settings", label: "Organisation", Icon: Settings, desc: "WordPress general settings." },
] as const;

async function safe<T>(p: Promise<T[]>): Promise<T[]> {
  try {
    return await p;
  } catch {
    return [];
  }
}

export default async function AdminOverview() {
  const user = await requireSession();
  const [articles, categories] = await Promise.all([
    safe(getAllArticles()),
    safe(getCmsAllCategories()),
  ]);
  const recent = articles.slice(0, 5);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-400">
          <Sparkles className="h-3.5 w-3.5" /> {user.role}
        </div>
        <h1 className="mt-3 font-display text-3xl font-black tracking-tight text-fg sm:text-4xl">
          Welcome back, {user.name.split(" ")[0]}.
        </h1>
        <p className="mt-1 text-fg-muted">Here&apos;s what&apos;s happening in the newsroom today.</p>
      </div>

      {/* Stats */}
      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Articles" value={articles.length} />
        <StatCard label="Categories" value={categories.length} />
        <StatCard label="Primary source" value={cmsFlags.enabled ? "WordPress" : "Static"} />
        <StatCard label="Second source" value={wpcomConfig.enabled ? "Active" : "Off"} />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Modules */}
        <div className="lg:col-span-2">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-fg-muted">Modules</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {MODULES.map(({ href, label, desc, Icon }) => (
              <Link
                key={href}
                href={href}
                className="group rounded-2xl border border-line bg-surface p-5 transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-700 dark:text-brand-400">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="flex-1">
                    <h3 className="font-bold text-fg">{label}</h3>
                    <p className="mt-1 text-sm text-fg-muted">{desc}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-600 group-hover:text-brand-700 dark:text-brand-400">
                      Open
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent */}
        <div>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-fg-muted">
            Recent stories
          </h2>
          <div className="rounded-2xl border border-line bg-surface p-2">
            {recent.length === 0 ? (
              <p className="p-4 text-sm text-fg-muted">No stories to show.</p>
            ) : (
              <ul className="divide-y divide-line">
                {recent.map((a) => (
                  <li key={a.slug}>
                    <Link
                      href={`/article/${a.slug}`}
                      target="_blank"
                      className="block rounded-lg p-3 transition-colors hover:bg-surface-2"
                    >
                      <span className="line-clamp-2 text-sm font-semibold text-fg">{a.title}</span>
                      <span className="mt-1 block text-xs text-fg-muted">
                        {getCategoryDisplay(a.category).name} · {timeAgo(a.publishedAt)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <div className="text-xs font-bold uppercase tracking-wider text-fg-muted">{label}</div>
      <div className="mt-1 font-display text-2xl font-black tracking-tight text-fg">{value}</div>
    </div>
  );
}
