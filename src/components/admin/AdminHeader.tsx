import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export default function AdminHeader({
  title,
  description,
  Icon,
  action,
}: {
  title: string;
  description: string;
  Icon: LucideIcon;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-700 dark:text-brand-400">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <h1 className="font-display text-2xl font-black tracking-tight text-fg sm:text-3xl">
            {title}
          </h1>
          <p className="text-sm text-fg-muted">{description}</p>
        </div>
      </div>
      {action}
    </div>
  );
}
