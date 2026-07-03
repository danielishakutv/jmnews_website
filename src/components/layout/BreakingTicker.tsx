import Link from "next/link";
import { Zap } from "lucide-react";
import { getHeadlines } from "@/lib/data";

export default async function BreakingTicker() {
  const headlines = await getHeadlines(8);
  // Duplicate the list so the marquee can loop seamlessly.
  const loop = [...headlines, ...headlines];

  return (
    <div className="border-b border-line bg-surface">
      <div className="mx-auto flex max-w-[1400px] items-stretch px-0 lg:px-6">
        <div className="z-10 flex shrink-0 items-center gap-1.5 bg-live px-3 py-2 text-xs font-extrabold uppercase tracking-wider text-white sm:px-4">
          <Zap className="h-3.5 w-3.5 fill-white" />
          <span className="hidden xs:inline">Breaking</span>
        </div>
        <div className="marquee-pause relative flex-1 overflow-hidden">
          <div className="flex w-max animate-marquee items-center whitespace-nowrap py-2">
            {loop.map((a, i) => (
              <Link
                key={`${a.slug}-${i}`}
                href={`/article/${a.slug}`}
                className="group flex items-center text-sm text-fg"
              >
                <span className="mx-3 inline-block h-1.5 w-1.5 rounded-full bg-brand-500" />
                <span className="font-medium transition-colors group-hover:text-brand-600">
                  {a.title}
                </span>
              </Link>
            ))}
          </div>
          {/* fade edges */}
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-surface to-transparent" />
        </div>
      </div>
    </div>
  );
}
