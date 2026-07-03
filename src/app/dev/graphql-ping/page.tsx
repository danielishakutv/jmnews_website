import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, XCircle, Database, ExternalLink } from "lucide-react";
import { getSiteSettings } from "@/lib/cms/queries/site-settings";
import { getCmsCategories } from "@/lib/cms/queries/categories";
import { cmsFlags } from "@/lib/cms/flags";

export const metadata: Metadata = {
  title: "CMS Diagnostic",
  robots: { index: false, follow: false },
};

// Always fetch fresh — this page exists to verify the live connection.
export const dynamic = "force-dynamic";

type Result<T> = { ok: true; data: T } | { ok: false; error: string };

async function safe<T>(fn: () => Promise<T>): Promise<Result<T>> {
  try {
    return { ok: true, data: await fn() };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

function StatusBadge({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={
        ok
          ? "inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200"
          : "inline-flex items-center gap-1.5 rounded-full bg-live/10 px-3 py-1 text-xs font-bold text-live dark:text-red-400 ring-1 ring-live/30"
      }
    >
      {ok ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
      {label}
    </span>
  );
}

export default async function GraphQLPingPage() {
  const endpoint = process.env.WP_GRAPHQL_URL ?? "(not set)";
  const settings = await safe(getSiteSettings);
  const categories = await safe(() => getCmsCategories(8));
  const allOk = settings.ok && categories.ok;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 lg:px-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-lg bg-ink text-white">
          <Database className="h-5 w-5" />
        </span>
        <div>
          <h1 className="font-display text-2xl font-black tracking-tight text-fg sm:text-3xl">
            CMS Pipeline Diagnostic
          </h1>
          <p className="text-sm text-fg-muted">
            Phase 0 smoke check — verifies the public site can read from WordPress.
          </p>
        </div>
        <div className="ml-auto">
          <StatusBadge ok={allOk} label={allOk ? "All systems go" : "Errors"} />
        </div>
      </div>

      {/* Environment */}
      <section className="mt-8 rounded-xl border border-line bg-surface p-5 shadow-sm">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-fg-muted">
          Environment
        </h2>
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-semibold text-fg-muted">WP_GRAPHQL_URL</dt>
            <dd className="mt-0.5 break-all font-mono text-xs text-fg">{endpoint}</dd>
          </div>
          <div>
            <dt className="font-semibold text-fg-muted">NEXT_PUBLIC_USE_CMS</dt>
            <dd className="mt-0.5">
              <StatusBadge
                ok={cmsFlags.enabled}
                label={cmsFlags.enabled ? "true (CMS on)" : "false (static)"}
              />
            </dd>
          </div>
        </dl>
      </section>

      {/* Site settings check */}
      <section className="mt-6 rounded-xl border border-line bg-surface p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-fg-muted">
            Check 1 · <code className="font-mono">generalSettings</code>
          </h2>
          <StatusBadge ok={settings.ok} label={settings.ok ? "200 OK" : "Failed"} />
        </div>
        {settings.ok ? (
          <dl className="grid gap-3 text-sm sm:grid-cols-3">
            <div>
              <dt className="font-semibold text-fg-muted">title</dt>
              <dd className="mt-0.5 font-medium text-fg">
                {settings.data?.title ?? <em className="text-fg-muted">null</em>}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-fg-muted">description</dt>
              <dd className="mt-0.5 font-medium text-fg">
                {settings.data?.description ?? <em className="text-fg-muted">null</em>}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-fg-muted">url</dt>
              <dd className="mt-0.5 truncate font-medium text-fg">
                {settings.data?.url ? (
                  <a
                    href={settings.data.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-700"
                  >
                    {settings.data.url}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <em className="text-fg-muted">null</em>
                )}
              </dd>
            </div>
          </dl>
        ) : (
          <pre className="overflow-x-auto rounded-lg bg-live/5 p-3 text-xs text-live dark:text-red-400 ring-1 ring-live/20">
            {settings.error}
          </pre>
        )}
      </section>

      {/* Categories check */}
      <section className="mt-6 rounded-xl border border-line bg-surface p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-fg-muted">
            Check 2 · <code className="font-mono">categories</code>
          </h2>
          <StatusBadge
            ok={categories.ok}
            label={categories.ok ? `${categories.data.length} returned` : "Failed"}
          />
        </div>
        {categories.ok ? (
          <ul className="divide-y divide-line text-sm">
            {categories.data.map((c) => (
              <li key={c.id} className="flex items-center justify-between py-2.5">
                <div>
                  <span className="font-semibold text-fg">{c.name ?? "(unnamed)"}</span>
                  <span className="ml-2 font-mono text-xs text-fg-muted">/{c.slug ?? ""}</span>
                </div>
                <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-xs font-bold text-fg-muted">
                  {c.count ?? 0} posts
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <pre className="overflow-x-auto rounded-lg bg-live/5 p-3 text-xs text-live dark:text-red-400 ring-1 ring-live/20">
            {categories.error}
          </pre>
        )}
      </section>

      {/* Next steps */}
      <section className="mt-8 rounded-xl border border-azure-200 bg-azure-50 p-5">
        <h2 className="mb-2 text-sm font-bold uppercase tracking-wider text-azure-900">
          Next steps
        </h2>
        <ol className="list-inside list-decimal space-y-1.5 text-sm text-azure-900">
          <li>
            Add a WordPress Application Password to <code className="font-mono">.env.local</code>{" "}
            (see <code className="font-mono">.env.example</code>).
          </li>
          <li>
            Run <code className="rounded bg-surface/70 px-1.5 py-0.5 font-mono">npm run codegen</code>{" "}
            to introspect the live schema and generate typed queries.
          </li>
          <li>
            Begin Phase 1: replace one entry in <code className="font-mono">src/lib/site.ts</code>{" "}
            with a CMS read, behind the <code className="font-mono">NEXT_PUBLIC_USE_CMS</code> flag.
          </li>
        </ol>
        <p className="mt-3 text-xs text-azure-900/70">
          This page is{" "}
          <code className="font-mono">noindex</code> — search engines will not crawl it.
        </p>
      </section>

      <div className="mt-6">
        <Link href="/" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
