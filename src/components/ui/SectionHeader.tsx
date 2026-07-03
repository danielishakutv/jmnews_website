import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SectionHeader({
  title,
  href,
  accent = "orange",
  className,
}: {
  title: string;
  href?: string;
  accent?: "orange" | "blue" | "slate";
  className?: string;
}) {
  const bar =
    accent === "blue"
      ? "bg-azure-600"
      : accent === "slate"
        ? "bg-ink"
        : "bg-brand-600";

  return (
    <div className={cn("mb-5 flex items-end justify-between gap-4", className)}>
      <h2 className="flex items-center gap-3 text-xl font-extrabold tracking-tight text-fg sm:text-2xl">
        <span className={cn("inline-block h-6 w-1.5 rounded-full", bar)} />
        {title}
      </h2>
      {href && (
        <Link
          href={href}
          className="group inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-fg-muted transition-colors hover:text-brand-600"
        >
          See all
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
