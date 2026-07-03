import { Construction, type LucideIcon } from "lucide-react";

/**
 * Renders a consistent "coming in Phase N" placeholder for dashboard
 * modules that aren't built yet. Keeps the chrome real but signals
 * scope clearly.
 */
export default function ModulePlaceholder({
  title,
  description,
  Icon,
  phase,
  bullets = [],
}: {
  title: string;
  description: string;
  Icon: LucideIcon;
  phase: string;
  bullets?: string[];
}) {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-50 text-brand-600">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <h1 className="font-display text-2xl font-black tracking-tight text-fg sm:text-3xl">
            {title}
          </h1>
          <p className="text-sm text-fg-muted">{description}</p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50/50 p-6">
        <div className="flex items-start gap-3">
          <Construction className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
          <div>
            <div className="text-sm font-bold uppercase tracking-wider text-amber-900">
              Lands in {phase}
            </div>
            <p className="mt-1 text-sm text-amber-900/85">
              This module isn&apos;t built yet. Editorial work still happens in wp-admin in
              the meantime — nothing is broken; you&apos;re seeing the dashboard shell only.
            </p>
            {bullets.length > 0 && (
              <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-amber-900/80">
                {bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
