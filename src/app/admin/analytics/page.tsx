import type { Metadata } from "next";
import { BarChart3, ExternalLink, CheckCircle2, AlertTriangle, Newspaper, Tags, Radio } from "lucide-react";
import { requireSession } from "@/lib/auth/session";
import AdminHeader from "@/components/admin/AdminHeader";
import { getAllArticles } from "@/lib/data";
import { getCmsAllCategories } from "@/lib/cms/categories";
import { cmsFlags, wpcomConfig } from "@/lib/cms/flags";

export const metadata: Metadata = {
  title: "Analytics",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const MATOMO_URL = process.env.NEXT_PUBLIC_MATOMO_URL;
const SITE_ID = process.env.NEXT_PUBLIC_MATOMO_SITE_ID;

async function safeLen<T>(p: Promise<T[]>): Promise<number> {
  try {
    return (await p).length;
  } catch {
    return 0;
  }
}

export default async function AdminAnalytics() {
  await requireSession();

  const configured = Boolean(MATOMO_URL && SITE_ID);
  const matomoBase = MATOMO_URL?.replace(/\/$/, "");
  const dashUrl = configured
    ? `${matomoBase}/index.php?module=CoreHome&action=index&idSite=${SITE_ID}&period=day&date=today`
    : "https://matomo.org/";

  const [articleCount, categoryCount] = await Promise.all([
    safeLen(getAllArticles()),
    safeLen(getCmsAllCategories()),
  ]);

  return (
    <div className="mx-auto max-w-5xl">
      <AdminHeader
        title="Analytics"
        description="Traffic via Matomo, plus a live snapshot of your content."
        Icon={BarChart3}
        action={
          <a
            href={dashUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-700 px-4 text-sm font-bold text-white transition-colors hover:bg-brand-800"
          >
            Open Matomo <ExternalLink className="h-4 w-4" />
          </a>
        }
      />

      {/* Matomo connection */}
      {configured ? (
        <div className="mb-8 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            Matomo is tracking this site (site&nbsp;#{SITE_ID}). Open the full dashboard for
            visitors, page views, sources, devices and real-time data.
          </span>
        </div>
      ) : (
        <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-900">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p className="font-semibold">Matomo isn&apos;t connected yet</p>
              <ol className="mt-2 list-inside list-decimal space-y-1 text-amber-900/85">
                <li>In your Matomo dashboard, add <strong>jmnews.ng</strong> as a website and note its <strong>Site ID</strong>.</li>
                <li>
                  Set two env vars in Vercel:{" "}
                  <code className="rounded bg-amber-100 px-1 text-xs">NEXT_PUBLIC_MATOMO_URL</code>{" "}
                  (your Matomo URL) and{" "}
                  <code className="rounded bg-amber-100 px-1 text-xs">NEXT_PUBLIC_MATOMO_SITE_ID</code>.
                </li>
                <li>Redeploy — page views then flow into Matomo automatically.</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* Live content snapshot */}
      <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-fg-muted">
        Content snapshot
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Articles available" value={articleCount} Icon={Newspaper} />
        <Stat label="Categories" value={categoryCount} Icon={Tags} />
        <Stat label="Primary source" value={cmsFlags.enabled ? "WordPress" : "Static"} Icon={Radio} />
        <Stat label="Second source" value={wpcomConfig.enabled ? "Active" : "Off"} Icon={Radio} />
      </div>

      <p className="mt-6 text-sm text-fg-muted">
        Real-time visitor analytics — page views, referrers, devices, countries and live
        visitors — live in your Matomo dashboard. Use the button above to open it.
      </p>
    </div>
  );
}

function Stat({
  label,
  value,
  Icon,
}: {
  label: string;
  value: string | number;
  Icon: typeof Newspaper;
}) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-fg-muted">{label}</span>
        <Icon className="h-4 w-4 text-fg-muted" />
      </div>
      <div className="mt-2 font-display text-3xl font-black tracking-tight text-fg">{value}</div>
    </div>
  );
}
