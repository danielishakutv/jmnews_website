import type { Metadata } from "next";
import { Settings, CheckCircle2, AlertTriangle } from "lucide-react";
import { requireRole } from "@/lib/auth/guard";
import { readWpSettings, type WpConnection } from "@/lib/cms/wp-settings";
import SettingsForm from "./SettingsForm";

export const metadata: Metadata = {
  title: "Organisation settings",
  robots: { index: false, follow: false },
};

// Always fresh: editors expect to see the very latest values.
export const dynamic = "force-dynamic";

function ConnectionBanner({ connection }: { connection: WpConnection }) {
  if (connection.ok) {
    return (
      <div className="mb-6 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
        <span>Connected to WordPress. Changes save to your site&apos;s general settings.</span>
      </div>
    );
  }
  const message: Record<Exclude<WpConnection, { ok: true }>["reason"], string> = {
    "no-credentials":
      "WordPress admin credentials aren't set on the server (WP_ADMIN_USER / WP_ADMIN_APP_PASSWORD). The values below are read-only until you add an administrator Application Password.",
    unauthorized:
      "The configured account can't manage WordPress settings — it needs an administrator Application Password.",
    unreachable:
      "Couldn't reach WordPress right now. Showing the site's configured identity; try saving again shortly.",
    error: "WordPress settings are unavailable right now. Showing the site's configured identity.",
  };
  return (
    <div className="mb-6 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{message[connection.reason]}</span>
    </div>
  );
}

export default async function AdminSettings() {
  await requireRole("administrator");
  // Safe read — never throws, so this page can't 500 (it used to).
  const { settings, connection } = await readWpSettings();

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-50 text-brand-700 dark:text-brand-400">
          <Settings className="h-5 w-5" />
        </span>
        <div>
          <h1 className="font-display text-2xl font-black tracking-tight text-fg sm:text-3xl">
            Organisation
          </h1>
          <p className="text-sm text-fg-muted">Your newsroom&apos;s WordPress general settings.</p>
        </div>
      </div>

      <div className="mt-8">
        <ConnectionBanner connection={connection} />

        <div className="rounded-2xl border border-line bg-surface p-6 shadow-sm sm:p-8">
          <SettingsForm initial={settings} />
        </div>

        <div className="mt-6 rounded-xl border border-azure-200 bg-azure-50 p-4 text-sm text-azure-900">
          <p className="font-semibold">About these fields</p>
          <p className="mt-1 text-azure-900/85">
            The public site&apos;s canonical domain and brand name come from the{" "}
            <code className="rounded bg-azure-100 px-1 py-0.5 text-xs">NEXT_PUBLIC_SITE_URL</code>{" "}
            environment variable and{" "}
            <code className="rounded bg-azure-100 px-1 py-0.5 text-xs">src/lib/site.ts</code>. Editing
            here updates your <strong>WordPress</strong> title/tagline (used by wp-admin and RSS).
          </p>
        </div>
      </div>
    </div>
  );
}
