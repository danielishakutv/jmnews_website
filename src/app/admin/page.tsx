import type { Metadata } from "next";
import Link from "next/link";
import { Newspaper, Tags, Users, Settings, ArrowRight, Sparkles } from "lucide-react";
import { requireSession } from "@/lib/auth/session";
import { fetchCmsPosts } from "@/lib/cms/queries/posts";
import { getCmsAllCategories } from "@/lib/cms/categories";
import { cmsFlags } from "@/lib/cms/flags";

export const metadata: Metadata = {
  title: "Overview",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const MODULES = [
  {
    href: "/admin/articles",
    label: "Articles",
    Icon: Newspaper,
    desc: "Draft, schedule and publish stories.",
    phase: "Phase 6",
  },
  {
    href: "/admin/categories",
    label: "Categories",
    Icon: Tags,
    desc: "Create, rename and reorder sections.",
    phase: "Phase 4",
  },
  {
    href: "/admin/reporters",
    label: "Reporters",
    Icon: Users,
    desc: "Invite writers, assign roles, manage accounts.",
    phase: "Phase 5",
  },
  {
    href: "/admin/settings",
    label: "Organisation",
    Icon: Settings,
    desc: "Brand, contact, socials and the WhatsApp channel.",
    phase: "Phase 3",
  },
] as const;

async function safeCount<T>(p: Promise<T[] | { nodes?: unknown[] | null } | null | undefined>) {
  try {
    const r = await p;
    if (!r) return 0;
    if (Array.isArray(r)) return r.length;
    return r.nodes?.length ?? 0;
  } catch {
    return 0;
  }
}

export default async function AdminOverview() {
  const user = await requireSession();
  const [posts, categories] = await Promise.all([
    cmsFlags.enabled ? fetchCmsPosts({ first: 1 }) : Promise.resolve(null),
    cmsFlags.enabled ? getCmsAllCategories() : Promise.resolve([]),
  ]);
  const recentCount = await safeCount(Promise.resolve(posts));
  const catCount = categories.length;

  return (
    <div className="mx-auto max-w-6xl">
      {/* Greeting */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-400">
          <Sparkles className="h-3.5 w-3.5" /> {user.role}
        </div>
        <h1 className="mt-3 font-display text-3xl font-black tracking-tight text-fg sm:text-4xl">
          Welcome back, {user.name.split(" ")[0]}.
        </h1>
        <p className="mt-1 text-fg-muted">
          Here&apos;s what&apos;s happening in the newsroom today.
        </p>
      </div>

      {/* Stats strip */}
      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        <StatCard label="Categories" value={catCount} />
        <StatCard label="CMS pipeline" value={cmsFlags.enabled ? "Live" : "Static"} />
        <StatCard label="Latest posts visible" value={recentCount > 0 ? "Yes" : "—"} />
      </div>

      {/* Modules */}
      <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-fg-muted">
        Modules
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {MODULES.map(({ href, label, desc, Icon, phase }) => (
          <Link
            key={href}
            href={href}
            className="group rounded-2xl border border-line bg-surface p-5 transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
          >
            <div className="flex items-start gap-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600">
                <Icon className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-fg">{label}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-fg-muted">
                    {phase}
                  </span>
                </div>
                <p className="mt-1 text-sm text-fg-muted">{desc}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-600 group-hover:text-brand-700">
                  Open
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </div>
          </Link>
        ))}
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
