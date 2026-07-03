import type { MetadataRoute } from "next";
import { getAllArticles, allCategorySlugs } from "@/lib/data";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = site.url;
  const all = await getAllArticles();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "hourly", priority: 1 },
    { url: `${base}/live`, changeFrequency: "always", priority: 0.9 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = allCategorySlugs.map((slug) => ({
    url: `${base}/category/${slug}`,
    changeFrequency: "hourly",
    priority: 0.8,
  }));

  const articleRoutes: MetadataRoute.Sitemap = all.map((a) => ({
    url: `${base}/article/${a.slug}`,
    lastModified: new Date(a.publishedAt),
    changeFrequency: "daily",
    priority: 0.7,
  }));

  return [...staticRoutes, ...categoryRoutes, ...articleRoutes];
}
