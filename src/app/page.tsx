import {
  getFeaturedArticles,
  getLiveArticles,
  getTrendingArticles,
  getMostReadArticles,
  getAllArticles,
  getArticlesByCategory,
  getHeadlines,
  getTopStories,
} from "@/lib/data";
import { NowProvider } from "@/components/NowProvider";
import HeroCarousel from "@/components/home/HeroCarousel";
import CarouselSection from "@/components/home/CarouselSection";
import CategorySection from "@/components/home/CategorySection";
import LiveSection from "@/components/home/LiveSection";
import TabbedSidebar from "@/components/home/TabbedSidebar";
import BreakingList from "@/components/home/BreakingList";
import MostRead from "@/components/home/MostRead";
import FollowBox from "@/components/home/FollowBox";
import NewsletterBand from "@/components/home/NewsletterBand";
import OpinionStrip from "@/components/home/OpinionStrip";
import MoreNewsFeed from "@/components/home/MoreNewsFeed";
import WhatsAppCTA from "@/components/home/WhatsAppCTA";
import AdBanner from "@/components/ui/AdBanner";
import AdSlot from "@/components/promo/AdSlot";
import ArticleCard from "@/components/article/ArticleCard";

export default async function HomePage() {
  const now = new Date().toISOString();

  // Fan out all independent reads in parallel — Next dedupes identical
  // GraphQL fetches inside one request, so this stays cheap even when
  // some helpers call getAllArticles() under the hood.
  const [
    featured,
    breaking,
    live,
    trending,
    mostRead,
    allArticles,
    underHero,
    nigeria,
    business,
    world,
    sports,
    entertainment,
    technology,
    politics,
    health,
    opinion,
  ] = await Promise.all([
    getFeaturedArticles(5),
    getHeadlines(4),
    getLiveArticles(5),
    getTrendingArticles(6),
    getMostReadArticles(6),
    getAllArticles(),
    getTopStories(2),
    getArticlesByCategory("nigeria", 5),
    getArticlesByCategory("business", 5),
    getArticlesByCategory("world", 5),
    getArticlesByCategory("sports", 8),
    getArticlesByCategory("entertainment", 8),
    getArticlesByCategory("technology", 5),
    getArticlesByCategory("politics", 5),
    getArticlesByCategory("health", 5),
    getArticlesByCategory("opinion", 3),
  ]);

  const latest = allArticles.slice(0, 8);
  const video = allArticles.slice(2, 8);
  const editorsPicks = allArticles.slice(8, 12);
  const feedPool = allArticles;

  return (
    <NowProvider now={now}>
      <div className="space-y-8 py-5">
        {/* Configurable ad space (off until enabled in src/lib/promotions.ts) */}
        <AdSlot id="home-leaderboard" className="mx-auto max-w-[1400px] px-4 lg:px-6" />

        {/* ───── Hero block: breaking · hero · tabbed sidebar ───── */}
        <section className="mx-auto max-w-[1400px] px-4 lg:px-6">
        <div className="grid gap-5 lg:grid-cols-12">
          <div className="order-2 min-w-0 lg:order-1 lg:col-span-3">
            <BreakingList articles={breaking} />
          </div>
          <div className="order-1 min-w-0 space-y-5 lg:order-2 lg:col-span-6">
            <HeroCarousel articles={featured} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {underHero.map((a) => (
                <ArticleCard
                  key={a.slug}
                  article={a}
                  variant="horizontal"
                  now={now}
                  className="rounded-2xl border border-line bg-surface p-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft"
                />
              ))}
            </div>
          </div>
          <div className="order-3 min-w-0 lg:order-3 lg:col-span-3">
            <TabbedSidebar trending={trending} latest={latest} video={video} />
          </div>
        </div>
      </section>

      <AdBanner format="leaderboard" creative="subscribe" />

      {/* ───── Latest rail ───── */}
      <CarouselSection title="Latest News" href="/category/nigeria" articles={latest} />

      {/* ───── Live updates (full) ───── */}
      <section className="mx-auto max-w-[1400px] px-4 lg:px-6">
        <LiveSection articles={live} />
      </section>

      {/* ───── Join WhatsApp channel CTA ───── */}
      <WhatsAppCTA />

      {/* ───── Main + Sidebar: the dense core ───── */}
      <section className="mx-auto max-w-[1400px] px-4 lg:px-6">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Main column */}
          <div className="space-y-10 lg:col-span-8">
            <CategorySection category="nigeria" articles={nigeria} bare />
            <hr className="border-line" />
            <CategorySection category="politics" articles={politics} bare />
            <AdBanner format="inline" creative="app" contained={false} />
            <CategorySection category="business" articles={business} bare />
            <hr className="border-line" />
            <CategorySection category="world" articles={world} bare />
            <CategorySection category="technology" articles={technology} bare />
            <hr className="border-line" />
            <CategorySection category="health" articles={health} bare />
          </div>

          {/* Sticky sidebar */}
          <aside className="lg:col-span-4">
            <div className="space-y-6 lg:sticky lg:top-24">
              <MostRead articles={mostRead} />
              <AdBanner format="box" creative="newsletter" />

              <div className="rounded-2xl border border-line bg-surface p-5 shadow-soft">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-extrabold text-fg">
                  <span className="inline-block h-5 w-1.5 rounded-full bg-azure-600" />
                  Editor&apos;s Picks
                </h2>
                <div className="space-y-4 divide-y divide-line">
                  {editorsPicks.map((a) => (
                    <ArticleCard key={a.slug} article={a} variant="horizontal" className="pt-4 first:pt-0" />
                  ))}
                </div>
              </div>

              <FollowBox />
              <AdBanner format="box" creative="live" />
            </div>
          </aside>
        </div>
      </section>

      {/* ───── Sports rail ───── */}
      <CarouselSection title="Sports" href="/category/sports" articles={sports} />

      {/* ───── Newsletter band ───── */}
      <NewsletterBand />

      {/* ───── Entertainment rail ───── */}
      <CarouselSection title="Entertainment" href="/category/entertainment" articles={entertainment} />

      {/* ───── Opinion (dark) ───── */}
      <OpinionStrip articles={opinion} />

      {/* ───── Endless "more news" feed ───── */}
      <MoreNewsFeed articles={feedPool} />
    </div>
    </NowProvider>
  );
}
