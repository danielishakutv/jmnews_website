import { cn } from "@/lib/utils";

export default function LiveBadge({
  className,
  label = "LIVE",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm bg-live px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white",
        className
      )}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-live-dot rounded-full bg-surface" />
      </span>
      {label}
    </span>
  );
}
