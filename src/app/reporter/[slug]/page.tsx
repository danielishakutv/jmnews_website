import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Mail, Twitter, Facebook, Instagram, MessageCircle } from "lucide-react";
import { reporters, getReporter } from "@/lib/reporter";
import { getArticlesByReporter } from "@/lib/data";
import { site } from "@/lib/site";
import ArticleCard from "@/components/article/ArticleCard";

export const dynamicParams = true;

export function generateStaticParams() {
  return reporters.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const r = getReporter(slug);
  if (!r) return { title: "Reporter not found" };
  const title = `${r.name} — ${r.role}`;
  const description = r.bio;
  return {
    title,
    description,
    alternates: { canonical: `/reporter/${r.slug}` },
    openGraph: {
      type: "profile",
      title: `${title} | ${site.name}`,
      description,
      url: `/reporter/${r.slug}`,
      images: [{ url: r.avatar, width: 512, height: 512, alt: r.name }],
    },
    twitter: {
      card: "summary",
      title: `${title} | ${site.name}`,
      description,
      images: [r.avatar],
    },
  };
}

export default async function ReporterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const reporter = getReporter(slug);
  if (!reporter) notFound();

  const articles = await getArticlesByReporter(slug, 12);

  const socialLinks = [
    { href: reporter.socials.twitter, label: "X (Twitter)", Icon: Twitter },
    { href: reporter.socials.facebook, label: "Facebook", Icon: Facebook },
    { href: reporter.socials.instagram, label: "Instagram", Icon: Instagram },
    { href: reporter.socials.whatsapp, label: "WhatsApp", Icon: MessageCircle },
    { href: reporter.socials.email, label: "Email", Icon: Mail },
  ].filter((s): s is { href: string; label: string; Icon: typeof Mail } => Boolean(s.href));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: reporter.name,
      jobTitle: reporter.role,
      description: reporter.longBio,
      image: reporter.avatar,
      address: reporter.location,
      worksFor: { "@type": "NewsMediaOrganization", name: site.name },
      url: `${site.url}/reporter/${reporter.slug}`,
    },
  };

  return (
    <div className="pb-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Profile header */}
      <section className="border-b border-line bg-gradient-to-b from-brand-500/[0.06] to-surface">
        <div className="mx-auto max-w-[1100px] px-4 py-10 lg:px-6 lg:py-14">
          <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:text-left">
            <Image
              src={reporter.avatar}
              alt={reporter.name}
              width={144}
              height={144}
              priority
              className="h-32 w-32 shrink-0 rounded-2xl object-cover shadow-soft ring-1 ring-line sm:h-36 sm:w-36"
            />
            <div className="min-w-0 flex-1">
              <span className="inline-flex items-center rounded-full bg-brand-700 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                {reporter.role}
              </span>
              <h1 className="mt-3 font-display text-3xl font-black tracking-tight text-fg sm:text-4xl">
                {reporter.name}
              </h1>
              <p className="mt-1 flex items-center justify-center gap-1.5 text-sm font-medium text-fg-muted sm:justify-start">
                <MapPin className="h-4 w-4 text-brand-600" />
                {reporter.location}
              </p>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-fg-muted sm:mx-0">
                {reporter.bio}
              </p>

              {/* Connect */}
              {socialLinks.length > 0 && (
                <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <span className="text-xs font-bold uppercase tracking-wider text-fg-muted">
                    Connect
                  </span>
                  {socialLinks.map(({ href, label, Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="grid h-9 w-9 place-items-center rounded-full border border-line bg-surface text-fg-muted transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1100px] px-4 py-10 lg:px-6">
        {/* About */}
        <section className="mb-10">
          <h2 className="mb-3 flex items-center gap-2 font-display text-xl font-black tracking-tight text-fg">
            <span className="inline-block h-5 w-1.5 rounded-full bg-brand-600" />
            About {reporter.name.split(" ")[0]}
          </h2>
          <p className="max-w-3xl text-[1.05rem] leading-relaxed text-fg-muted">
            {reporter.longBio}
          </p>
        </section>

        {/* Articles */}
        <section>
          <h2 className="mb-5 flex items-center gap-2 font-display text-xl font-black tracking-tight text-fg">
            <span className="inline-block h-5 w-1.5 rounded-full bg-azure-600" />
            Latest by {reporter.name.split(" ")[0]}
          </h2>
          {articles.length === 0 ? (
            <p className="text-fg-muted">No stories to show yet. Check back soon.</p>
          ) : (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {articles.map((a) => (
                <ArticleCard key={a.slug} article={a} variant="thumb" />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
