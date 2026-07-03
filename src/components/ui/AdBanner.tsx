import Link from "next/link";
import { Megaphone, Smartphone, Mail, Radio } from "lucide-react";
import { cn } from "@/lib/utils";

type Format = "leaderboard" | "box" | "inline";
type Creative = "subscribe" | "app" | "newsletter" | "live";

const creatives: Record<
  Creative,
  { eyebrow: string; title: string; cta: string; href: string; Icon: typeof Mail; from: string; to: string }
> = {
  subscribe: {
    eyebrow: "JM News Premium",
    title: "Unlimited stories, zero clutter.",
    cta: "Subscribe",
    href: "/category/opinion",
    Icon: Megaphone,
    from: "from-brand-600",
    to: "to-brand-700",
  },
  app: {
    eyebrow: "Get the app",
    title: "JM News in your pocket. Anytime, anywhere.",
    cta: "Download",
    href: "/",
    Icon: Smartphone,
    from: "from-azure-700",
    to: "to-azure-900",
  },
  newsletter: {
    eyebrow: "The JM Brief",
    title: "The day's biggest stories, every morning.",
    cta: "Sign up free",
    href: "/",
    Icon: Mail,
    from: "from-ink",
    to: "to-ink-soft",
  },
  live: {
    eyebrow: "JM News 24",
    title: "Watch our rolling live coverage now.",
    cta: "Watch live",
    href: "/live",
    Icon: Radio,
    from: "from-live",
    to: "to-brand-700",
  },
};

export default function AdBanner({
  format = "leaderboard",
  creative = "subscribe",
  contained = true,
  className,
}: {
  format?: Format;
  creative?: Creative;
  /** Wrap in the centered max-width container (for full-width placement). */
  contained?: boolean;
  className?: string;
}) {
  const c = creatives[creative];

  if (format === "box") {
    return (
      <div className={cn("w-full", className)}>
        <p className="mb-1 text-center text-[10px] uppercase tracking-widest text-fg-muted">
          Advertisement
        </p>
        <Link
          href={c.href}
          className={cn(
            "flex aspect-[4/3] flex-col justify-between rounded-xl bg-gradient-to-br p-5 text-white shadow-sm transition-transform hover:-translate-y-0.5",
            c.from,
            c.to
          )}
        >
          <c.Icon className="h-7 w-7 opacity-90" />
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/80">
              {c.eyebrow}
            </span>
            <p className="mt-1 font-display text-lg font-extrabold leading-snug">{c.title}</p>
            <span className="mt-3 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-bold">
              {c.cta} →
            </span>
          </div>
        </Link>
      </div>
    );
  }

  // leaderboard / inline (wide)
  return (
    <div
      className={cn(
        "w-full",
        contained && "mx-auto max-w-[1400px] px-4 lg:px-6",
        className
      )}
    >
      <p className="mb-1 text-center text-[10px] uppercase tracking-widest text-fg-muted">
        Advertisement
      </p>
      <Link
        href={c.href}
        className={cn(
          "flex items-center justify-between gap-4 overflow-hidden rounded-xl bg-gradient-to-r px-6 py-5 text-white shadow-sm transition-shadow hover:shadow-md sm:px-10",
          c.from,
          c.to
        )}
      >
        <div className="flex items-center gap-4">
          <span className="hidden h-12 w-12 shrink-0 place-items-center rounded-full bg-white/15 sm:grid">
            <c.Icon className="h-6 w-6" />
          </span>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/80">
              {c.eyebrow}
            </span>
            <p className="font-display text-lg font-extrabold leading-snug sm:text-xl">{c.title}</p>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-surface px-4 py-2 text-sm font-bold text-fg">
          {c.cta}
        </span>
      </Link>
    </div>
  );
}
