import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { UserRound, MapPin, ExternalLink, Pencil } from "lucide-react";
import { requireSession } from "@/lib/auth/session";
import AdminHeader from "@/components/admin/AdminHeader";
import { reporters } from "@/lib/reporter";
import { getArticlesByReporter } from "@/lib/data";

export const metadata: Metadata = {
  title: "Reporter",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminReporters() {
  await requireSession();

  // Article counts per reporter (safe — degrades to 0).
  const withCounts = await Promise.all(
    reporters.map(async (r) => {
      let count = 0;
      try {
        count = (await getArticlesByReporter(r.slug)).length;
      } catch {
        count = 0;
      }
      return { reporter: r, count };
    })
  );

  return (
    <div className="mx-auto max-w-3xl">
      <AdminHeader
        title="Reporter profile"
        description="The byline and public profile shown across the site."
        Icon={UserRound}
      />

      {withCounts.map(({ reporter: r, count }) => (
        <div key={r.slug} className="mb-6 rounded-2xl border border-line bg-surface p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row">
            <Image
              src={r.avatar}
              alt={r.name}
              width={112}
              height={112}
              className="h-24 w-24 shrink-0 rounded-2xl object-cover ring-1 ring-line sm:h-28 sm:w-28"
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-2xl font-black tracking-tight text-fg">{r.name}</h2>
                <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-brand-700 dark:text-brand-400">
                  {r.role}
                </span>
              </div>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-fg-muted">
                <MapPin className="h-4 w-4 text-brand-600" /> {r.location}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-fg-muted">{r.bio}</p>

              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
                <Meta label="Dateline" value={r.dateline} />
                <Meta label="Articles" value={String(count)} />
                <Meta label="Email" value={r.email ?? "—"} />
              </dl>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={`/reporter/${r.slug}`}
                  target="_blank"
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-line bg-surface px-3 text-sm font-semibold text-fg transition-colors hover:bg-surface-2"
                >
                  View public profile <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="rounded-xl border border-azure-200 bg-azure-50 p-4 text-sm text-azure-900">
        <p className="flex items-center gap-1.5 font-semibold">
          <Pencil className="h-4 w-4" /> Editing the profile
        </p>
        <p className="mt-1 text-azure-900/85">
          Name, role, location, bio, photo and social links live in{" "}
          <code className="rounded bg-azure-100 px-1 py-0.5 text-xs">src/lib/reporter.ts</code>.
          Update the values (swap <code className="rounded bg-azure-100 px-1 py-0.5 text-xs">avatar</code>{" "}
          for a real headshot URL) and redeploy. In-dashboard editing can be added with a small
          key-value store — see the deploy notes.
        </p>
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-lg border border-line bg-surface-2 px-3 py-2">
      <dt className="text-[10px] font-bold uppercase tracking-wider text-fg-muted">{label}</dt>
      <dd className="truncate text-sm font-semibold text-fg">{value}</dd>
    </div>
  );
}
