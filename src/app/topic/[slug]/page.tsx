import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Tag } from "lucide-react";
import {
  getArticlesByTag,
  getAllTags,
  getTrendingArticles,
  getMostReadArticles,
} from "@/lib/data";
import { site } from "@/lib/site";
import { cmsFlags } from "@/lib/cms/flags";
import ArticleCard from "@/components/article/ArticleCard";
import TabbedSidebarServer from "@/components/home/TabbedSidebar";
import MostRead from "@/components/home/MostRead";
import AdBanner from "@/components/ui/AdBanner";

export const dynamicParams = true;

export async function generateStaticParams() {
  // With CMS on, tag set is dynamic; render on demand.
  if (cmsFlags.enabled) return [];
  return (await getAllTags()).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tags = await getAllTags();
  const tag = tags.find((t) => t.slug === slug);
  if (!tag) return { title: "Topic not found" };

  return {
    title: `${tag.tag} — News & Updates`,
    description: `The latest ${tag.tag} news, analysis and updates from ${site.name}.`,
    alternates: { canonical: `/topic/${slug}` },
  };
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [articles, tags, trending, mostRead] = await Promise.all([
    getArticlesByTag(slug, 30),
    getAllTags(),
    getTrendingArticles(6),
    getMostReadArticles(5),
  ]);

  const meta = tags.find((t) => t.slug === slug);
  if (!meta || !articles.length) notFound();

  const [lead, ...rest] = articles;

  return (
    <div className="pb-8">
      <div className="border-b border-line bg-gradient-to-b from-brand-50/60 to-surface">
        <div className="mx-auto max-w-[1400px] px-4 py-7 lg:px-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-400">
            <Tag className="h-3.5 w-3.5" /> Topic
          </span>
          <h1 className="mt-2 font-display text-3xl font-black capitalize tracking-tight text-fg sm:text-4xl">
            {meta.tag}
          </h1>
          <p className="mt-1 text-fg-muted">{meta.count} stories</p>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 py-8 lg:px-6">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ArticleCard article={lead} priority sizes="(max-width: 1024px) 100vw, 66vw" />
            <hr className="my-7 border-line" />
            <div className="grid gap-x-6 gap-y-7 sm:grid-cols-2">
              {rest.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          </div>
          <aside className="space-y-6 lg:col-span-1">
            <TabbedSidebarServer trending={trending} latest={articles.slice(0, 6)} video={mostRead} />
            <AdBanner format="box" creative="app" />
            <MostRead articles={mostRead} />
          </aside>
        </div>
      </div>
    </div>
  );
}
