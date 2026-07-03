import Image from "next/image";
import Link from "next/link";
import { Clock, Calendar, ChevronRight, Tag, ArrowDown } from "lucide-react";
import type { Article } from "@/lib/types";
import { getCategoryDisplay } from "@/lib/categories";
import { getAuthor } from "@/lib/authors";
import { formatDate, timeAgo } from "@/lib/utils";
import { site } from "@/lib/site";
import CategoryPill from "@/components/ui/CategoryPill";
import LiveBadge from "@/components/ui/LiveBadge";
import ShareButtons from "@/components/article/ShareButtons";

/**
 * Renders a single complete article. Used both for the canonical article page
 * (primary) and for the subsequent articles streamed in by infinite scroll.
 */
export default function ArticleView({
  article,
  primary = false,
}: {
  article: Article;
  primary?: boolean;
}) {
  const category = getCategoryDisplay(article.category);
  // Prefer the byline inlined at fetch time (the CMS correspondent); fall back
  // to the static author map. Resolved from the Article object so this stays
  // safe to render on both server and client (no server-only imports).
  const author = article.authorOverride
    ? {
        slug: article.authorSlug,
        name: article.authorOverride.name,
        role: article.authorOverride.role,
        avatar: article.authorOverride.avatar,
        bio: article.authorOverride.bio ?? "",
      }
    : getAuthor(article.authorSlug);
  const authorHref = `/reporter/${author.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    image: [article.image],
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    articleSection: category?.name,
    keywords: article.tags.join(", "),
    author: { "@type": "Person", name: author.name },
    publisher: {
      "@type": "Organization",
      name: site.name,
      logo: { "@type": "ImageObject", url: `${site.url}/icon.svg` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${site.url}/article/${article.slug}` },
  };

  return (
    <article data-article-slug={article.slug} data-article-title={article.title} className="scroll-mt-28">
      {primary && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <div className="mx-auto max-w-3xl px-4 lg:px-0">
        {primary ? (
          <nav className="mb-5 flex flex-wrap items-center gap-1 pt-6 text-xs font-medium text-fg-muted">
            <Link href="/" className="hover:text-brand-600">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href={`/category/${article.category}`} className="hover:text-brand-600">
              {category?.name}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="clamp-2 text-fg-muted">{article.title}</span>
          </nav>
        ) : (
          <div className="mb-5 flex items-center gap-2 pt-2 text-xs font-bold uppercase tracking-wider text-brand-600">
            <ArrowDown className="h-4 w-4" /> Continue reading
          </div>
        )}

        {/* Header */}
        <header>
          <div className="mb-3 flex items-center gap-2">
            <CategoryPill slug={article.category} />
            {article.live && <LiveBadge />}
            {article.trending && (
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Trending</span>
            )}
          </div>
          {primary ? (
            <h1 className="font-display text-3xl font-extrabold leading-tight text-fg sm:text-4xl lg:text-[2.7rem]">
              {article.title}
            </h1>
          ) : (
            <h2 className="font-display text-2xl font-extrabold leading-tight text-fg sm:text-3xl lg:text-4xl">
              <Link href={`/article/${article.slug}`}>{article.title}</Link>
            </h2>
          )}

          {/* Byline / date — straight after the title; the featured image and
              body follow. No excerpt standfirst (it just duplicated the body
              for CMS-truncated excerpts). */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-line py-4">
            <Link href={authorHref} className="group flex items-center gap-3">
              <Image
                src={author.avatar}
                alt={author.name}
                width={44}
                height={44}
                className="h-11 w-11 rounded-full object-cover ring-2 ring-brand-100"
              />
              <div className="leading-tight">
                <span className="block text-sm font-bold text-fg group-hover:text-brand-700 dark:group-hover:text-brand-400">
                  {author.name}
                </span>
                <span className="block text-xs text-fg-muted">{author.role}</span>
              </div>
            </Link>
            <div className="flex flex-col gap-1 text-xs text-fg-muted sm:items-end">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(article.publishedAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {timeAgo(article.publishedAt)} · {article.readTime} min read
              </span>
            </div>
          </div>
        </header>
      </div>

      {/* Hero image */}
      <figure className="mx-auto my-7 max-w-4xl px-0 sm:px-4">
        <div className="relative aspect-[16/9] overflow-hidden sm:rounded-2xl">
          <Image
            src={article.image}
            alt={article.title}
            fill
            priority={primary}
            sizes="(max-width: 896px) 100vw, 896px"
            className="object-cover"
          />
        </div>
        <figcaption className="mx-4 mt-2 text-xs italic text-fg-muted sm:mx-0">
          {article.imageCaption}
        </figcaption>
      </figure>

      {/* Body */}
      <div className="mx-auto max-w-3xl px-4 lg:px-0">
        <div className="text-[1.075rem] leading-[1.85] text-fg-muted">
          {article.content.map((para, i) => (
            <p key={i} className="mb-6">
              {i === 0 && article.dateline && (
                <span className="mr-1 font-bold uppercase tracking-wide text-fg">
                  {article.dateline} —
                </span>
              )}
              {para}
            </p>
          ))}
        </div>

        {/* Tags */}
        <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-line pt-6">
          <Tag className="h-4 w-4 text-fg-muted" />
          {article.tags.map((t) => (
            <Link
              key={t}
              href={`/topic/${t.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
              className="rounded-full bg-surface-2 px-3 py-1 text-xs font-medium capitalize text-fg-muted transition-colors hover:bg-brand-50 hover:text-brand-700"
            >
              {t}
            </Link>
          ))}
        </div>

        {/* Share */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-surface-2 px-4 py-4">
          <p className="text-sm font-semibold text-fg">Found this useful? Share it.</p>
          <ShareButtons slug={article.slug} title={article.title} />
        </div>

        {/* Author bio */}
        <div className="mt-8 flex gap-4 rounded-2xl border border-line p-5">
          <Link href={authorHref} className="shrink-0">
            <Image
              src={author.avatar}
              alt={author.name}
              width={64}
              height={64}
              className="h-16 w-16 rounded-full object-cover ring-2 ring-brand-100"
            />
          </Link>
          <div className="min-w-0">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              {author.role}
            </span>
            <h3 className="text-lg font-bold text-fg">
              <Link href={authorHref} className="hover:text-brand-700 dark:hover:text-brand-400">
                {author.name}
              </Link>
            </h3>
            <p className="mt-1 text-sm text-fg-muted">{author.bio}</p>
            <Link
              href={authorHref}
              className="mt-2 inline-block text-xs font-bold uppercase tracking-wider text-brand-600 hover:text-brand-700 dark:text-brand-400"
            >
              View profile →
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
