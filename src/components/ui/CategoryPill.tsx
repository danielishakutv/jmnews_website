import Link from "next/link";
import { getCategoryDisplay } from "@/lib/categories";
import { cn } from "@/lib/utils";
import type { CategorySlug } from "@/lib/types";

// brand-700 / azure-700 (not 600) so white pill text clears WCAG AA (4.5:1)
// at 11px — the 600 shades were only ~3.55:1. Theme-independent.
const accentClasses: Record<string, string> = {
  orange: "bg-brand-700 text-white",
  blue: "bg-azure-700 text-white",
  slate: "bg-ink text-white",
};

export default function CategoryPill({
  slug,
  className,
  asLink = true,
}: {
  slug: CategorySlug;
  className?: string;
  asLink?: boolean;
}) {
  const category = getCategoryDisplay(slug);
  if (!category) return null;

  const classes = cn(
    "inline-block rounded-sm px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider transition-opacity hover:opacity-90",
    accentClasses[category.accent],
    className
  );

  if (!asLink) return <span className={classes}>{category.name}</span>;

  return (
    <Link href={`/category/${slug}`} className={classes}>
      {category.name}
    </Link>
  );
}
