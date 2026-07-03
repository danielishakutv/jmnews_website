import type { Metadata } from "next";
import { Megaphone, Monitor, Smartphone, Check, X } from "lucide-react";
import { requireSession } from "@/lib/auth/session";
import AdminHeader from "@/components/admin/AdminHeader";
import { popups, adSlots } from "@/lib/promotions";

export const metadata: Metadata = {
  title: "Popups & Ads",
  robots: { index: false, follow: false },
};

export default async function AdminPromotions() {
  await requireSession();

  return (
    <div className="mx-auto max-w-5xl">
      <AdminHeader
        title="Popups & Ads"
        description="On-site popups and ad spaces, with desktop + mobile dimensions."
        Icon={Megaphone}
      />

      <div className="mb-8 rounded-xl border border-azure-200 bg-azure-50 p-4 text-sm text-azure-900">
        These are defined in{" "}
        <code className="rounded bg-azure-100 px-1 py-0.5 text-xs">src/lib/promotions.ts</code>.
        Set <code className="rounded bg-azure-100 px-1 py-0.5 text-xs">enabled: true</code>, add a
        creative image / link, then redeploy to publish. (Live in-dashboard editing can be added
        with a small key-value store — see the deploy notes.)
      </div>

      {/* Popups */}
      <section className="mb-10">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-fg-muted">Popups</h2>
        <div className="space-y-3">
          {popups.map((p) => (
            <div
              key={p.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-5"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-fg">{p.title}</h3>
                  <StatusPill on={p.enabled} />
                </div>
                <p className="mt-1 max-w-xl text-sm text-fg-muted">{p.body}</p>
                <p className="mt-1 text-xs text-fg-muted">
                  CTA: <span className="font-semibold">{p.ctaLabel}</span> · appears after{" "}
                  {p.delayMs / 1000}s · reappears after {p.cooldownHours}h
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Ad slots */}
      <section>
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-fg-muted">Ad spaces</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {adSlots.map((s) => (
            <div key={s.id} className="rounded-2xl border border-line bg-surface p-5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-bold text-fg">{s.label}</h3>
                <StatusPill on={s.enabled} />
              </div>
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-fg-muted">
                <span className="inline-flex items-center gap-1.5">
                  <Monitor className="h-4 w-4" /> {s.desktop.width}×{s.desktop.height}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Smartphone className="h-4 w-4" /> {s.mobile.width}×{s.mobile.height}
                </span>
              </div>
              <p className="mt-2 text-xs text-fg-muted">
                {s.imageUrl ? "Creative set." : "No creative — shows a sized placeholder."} Slot id:{" "}
                <code className="rounded bg-surface-2 px-1 text-[11px]">{s.id}</code>
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatusPill({ on }: { on: boolean }) {
  return on ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-emerald-700">
      <Check className="h-3 w-3" /> Live
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-surface-2 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-fg-muted">
      <X className="h-3 w-3" /> Off
    </span>
  );
}
