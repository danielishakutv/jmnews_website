import Image from "next/image";
import Link from "next/link";
import { Quote } from "lucide-react";
import type { Article } from "@/lib/types";
import { getAuthor } from "@/lib/authors";

export default function OpinionStrip({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;

  return (
    <section className="bg-ink py-12">
      <div className="mx-auto max-w-[1400px] px-4 lg:px-6">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="flex items-center gap-3 text-xl font-extrabold tracking-tight text-white sm:text-2xl">
            <Quote className="h-6 w-6 text-brand-500" />
            Opinion &amp; Analysis
          </h2>
          <Link
            href="/category/opinion"
            className="text-sm font-semibold text-zinc-400 transition-colors hover:text-brand-400"
          >
            All columns
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => {
            const author = getAuthor(a.authorSlug);
            return (
              <article
                key={a.slug}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-brand-500/40 hover:bg-white/[0.06]"
              >
                <Link href={`/article/${a.slug}`}>
                  <h3 className="clamp-3 font-display text-lg font-bold leading-snug text-white transition-colors group-hover:text-brand-400">
                    {a.title}
                  </h3>
                  <p className="clamp-2 mt-2 text-sm text-zinc-400">{a.excerpt}</p>
                </Link>
                <div className="mt-4 flex items-center gap-3 border-t border-white/10 pt-4">
                  <Image
                    src={author.avatar}
                    alt={author.name}
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-brand-500/40"
                  />
                  <div className="leading-tight">
                    <span className="block text-sm font-semibold text-white">{author.name}</span>
                    <span className="block text-xs text-zinc-400">{author.role}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
