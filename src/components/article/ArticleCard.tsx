import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import type { Article } from "@/lib/types";
import { getCategoryDisplay } from "@/lib/categories";
import { timeAgo, cn } from "@/lib/utils";
import CategoryPill from "@/components/ui/CategoryPill";
import LiveBadge from "@/components/ui/LiveBadge";

type Variant = "default" | "horizontal" | "overlay" | "compact" | "thumb";

interface Props {
  article: Article;
  variant?: Variant;
  /** Priority-load the image (for above-the-fold cards). */
  priority?: boolean;
  className?: string;
  sizes?: string;
  now?: string;
}

function Meta({ article, now }: { article: Article; now?: string }) {
  const currentTime = now ? new Date(now) : undefined;
  return (
    <span className="flex items-center gap-1.5 text-xs text-fg-muted">
      <Clock className="h-3 w-3" />
      {timeAgo(article.publishedAt, currentTime)}
      <span aria-hidden>·</span>
      {article.readTime} min read
    </span>
  );
}

export default function ArticleCard({
  article,
  variant = "default",
  priority = false,
  className,
  sizes,
  now,
}: Props) {
  const currentTime = now ? new Date(now) : undefined;
  const href = `/article/${article.slug}`;
  const category = getCategoryDisplay(article.category);

  /* ── Overlay: image-filling card with text over a gradient ── */
  if (variant === "overlay") {
    return (
      <article className={cn("group relative overflow-hidden rounded-2xl", className)}>
        <Link href={href} className="block h-full w-full">
          <Image
            src={article.image}
            alt={article.title}
            fill
            priority={priority}
            sizes={sizes ?? "(max-width: 768px) 100vw, 50vw"}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="gradient-overlay absolute inset-0" />
          <div className="absolute inset-x-0 bottom-0 p-5">
            <div className="mb-2 flex items-center gap-2">
              {/* Non-link label: the whole card is already a link to the story,
                  so a nested category link would be invalid HTML. */}
              <CategoryPill slug={article.category} asLink={false} />
              {article.live && <LiveBadge />}
            </div>
            <h3 className="clamp-3 text-lg font-bold leading-snug text-white drop-shadow-sm sm:text-xl">
              {article.title}
            </h3>
            <div className="mt-2 text-xs text-white/70">
              {timeAgo(article.publishedAt, currentTime)} · {article.readTime} min read
            </div>
          </div>
        </Link>
      </article>
    );
  }

  /* ── Horizontal: thumbnail beside text ── */
  if (variant === "horizontal") {
    return (
      <article className={cn("group flex gap-4", className)}>
        <Link
          href={href}
          className="relative aspect-[4/3] w-28 shrink-0 overflow-hidden rounded-lg sm:w-36"
        >
          <Image
            src={article.image}
            alt={article.title}
            fill
            sizes="144px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-center gap-2">
            <Link
              href={`/category/${article.category}`}
              className="inline-block py-1.5 -my-1.5 text-[11px] font-bold uppercase tracking-wider text-brand-600"
            >
              {category?.name}
            </Link>
            {article.live && <LiveBadge />}
          </div>
          <h3 className="clamp-3 font-bold leading-snug text-fg transition-colors group-hover:text-brand-700">
            <Link href={href}>{article.title}</Link>
          </h3>
          <div className="mt-2">
            <Meta article={article} now={now} />
          </div>
        </div>
      </article>
    );
  }

  /* ── Compact: dense text-led list item, no image ── */
  if (variant === "compact") {
    return (
      <article className={cn("group", className)}>
        <Link href={`/category/${article.category}`} className="inline-block py-1.5 -my-1.5 text-[11px] font-bold uppercase tracking-wider text-brand-600">
          {category?.name}
        </Link>
        <h3 className="clamp-2 mt-1 font-semibold leading-snug text-fg transition-colors group-hover:text-brand-700">
          <Link href={href}>{article.title}</Link>
        </h3>
        <div className="mt-1.5">
          <Meta article={article} now={now} />
        </div>
      </article>
    );
  }

  /* ── Thumb: small stacked card for dense 6-up grids ── */
  if (variant === "thumb") {
    return (
      <article className={cn("group flex flex-col", className)}>
        <Link href={href} className="relative aspect-[16/10] overflow-hidden rounded-lg">
          <Image
            src={article.image}
            alt={article.title}
            fill
            sizes="(max-width: 640px) 50vw, 16vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {article.live && (
            <span className="absolute left-2 top-2">
              <LiveBadge />
            </span>
          )}
        </Link>
        <div className="pt-2">
          <Link
            href={`/category/${article.category}`}
            className="inline-block py-1.5 -my-1.5 text-[10px] font-bold uppercase tracking-wider text-brand-600"
          >
            {category?.name}
          </Link>
          <h3 className="clamp-3 mt-0.5 text-sm font-bold leading-snug text-fg transition-colors group-hover:text-brand-700">
            <Link href={href}>{article.title}</Link>
          </h3>
          <span className="mt-1 block text-[11px] text-fg-muted">
            {timeAgo(article.publishedAt, currentTime)}
          </span>
        </div>
      </article>
    );
  }

  /* ── Default: stacked image-over-text card ── */
  return (
    <article className={cn("group flex flex-col", className)}>
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
        <Link href={href} className="block h-full w-full">
          <Image
            src={article.image}
            alt={article.title}
            fill
            priority={priority}
            sizes={sizes ?? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>
        {/* Sibling of the image link (never nested inside it) so the clickable
            category pill doesn't produce an invalid <a> inside <a>. */}
        <div className="absolute left-3 top-3 z-10 flex items-center gap-2">
          <CategoryPill slug={article.category} />
          {article.live && <LiveBadge />}
        </div>
      </div>
      <div className="flex flex-1 flex-col pt-3.5">
        <h3 className="clamp-3 text-lg font-bold leading-snug text-fg transition-colors group-hover:text-brand-700">
          <Link href={href}>{article.title}</Link>
        </h3>
        <p className="clamp-2 mt-2 text-sm text-fg-muted">{article.excerpt}</p>
        <div className="mt-3 pt-0.5">
          <Meta article={article} now={now} />
        </div>
      </div>
    </article>
  );
}
