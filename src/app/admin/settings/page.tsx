import type { Metadata } from "next";
import { Settings, ExternalLink } from "lucide-react";
import Link from "next/link";
import { requireRole } from "@/lib/auth/guard";
import { getSiteSettings } from "@/lib/cms/queries/site-settings";
import SettingsForm from "./SettingsForm";

export const metadata: Metadata = {
  title: "Organisation settings",
  robots: { index: false, follow: false },
};

// Always fresh: editors expect to see the very latest values they typed.
export const dynamic = "force-dynamic";

export default async function AdminSettings() {
  await requireRole("administrator");
  const wp = await getSiteSettings();

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-50 text-brand-600">
          <Settings className="h-5 w-5" />
        </span>
        <div>
          <h1 className="font-display text-2xl font-black tracking-tight text-fg sm:text-3xl">
            Organisation
          </h1>
          <p className="text-sm text-fg-muted">
            Brand identity stored in WordPress general settings.
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-line bg-surface p-6 shadow-sm sm:p-8">
        <SettingsForm
          initial={{
            title: wp?.title ?? "",
            description: wp?.description ?? "",
            url: wp?.url ?? "",
            email: wp?.email ?? "",
          }}
        />
      </div>

      <div className="mt-6 rounded-xl border border-azure-200 bg-azure-50 p-4 text-sm text-azure-900">
        <p className="font-semibold">Lands in Phase 3b — extra fields</p>
        <p className="mt-1 text-azure-900/85">
          Contact details, social handles and the WhatsApp channel link will
          appear here once you install <strong>ACF</strong> +{" "}
          <strong>WPGraphQL for ACF</strong> and we expose an Options Page.
          Until then, edit{" "}
          <Link href="/" className="font-semibold underline" target="_blank" rel="noopener noreferrer">
            site.ts <ExternalLink className="ml-0.5 inline h-3 w-3" />
          </Link>{" "}
          in code.
        </p>
      </div>
    </div>
  );
}
