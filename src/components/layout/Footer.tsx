import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube, Music2, Send, Lock } from "lucide-react";
import { navCategories as staticNavCategories } from "@/lib/categories";
import { getSite } from "@/lib/cms/site";
import { cmsFlags } from "@/lib/cms/flags";
import { getCmsNavCategories } from "@/lib/cms/categories";
import type { Category } from "@/lib/types";

const company = [
  { label: "About JM News", href: "/" },
  { label: "Contact", href: "/" },
  { label: "Careers", href: "/" },
  { label: "Advertise", href: "/" },
  { label: "Editorial Standards", href: "/" },
];

const legal = [
  { label: "Privacy Policy", href: "/" },
  { label: "Terms of Use", href: "/" },
  { label: "Cookie Policy", href: "/" },
  { label: "Corrections", href: "/" },
];

async function getNav(): Promise<Category[]> {
  if (!cmsFlags.enabled) return staticNavCategories;
  // Bounded like the header nav so a slow CMS can't stall the response.
  const fallback = new Promise<Category[]>((r) =>
    setTimeout(() => r(staticNavCategories), 2000)
  );
  try {
    return await Promise.race([getCmsNavCategories(8), fallback]);
  } catch {
    return staticNavCategories;
  }
}

export default async function Footer() {
  const [site, navCategories] = await Promise.all([getSite(), getNav()]);
  const year = new Date().getFullYear();

  // Socials live inside the component so they pick up CMS-driven URLs when
  // ACF Options Page lands in Phase 1.1b.
  const socials = [
    { href: site.socials.facebook, label: "Facebook", Icon: Facebook },
    { href: site.socials.twitter, label: "X (Twitter)", Icon: Twitter },
    { href: site.socials.instagram, label: "Instagram", Icon: Instagram },
    { href: site.socials.youtube, label: "YouTube", Icon: Youtube },
    { href: site.socials.tiktok, label: "TikTok", Icon: Music2 },
  ];

  return (
    <footer className="mt-16 bg-ink text-zinc-300">
      {/* Top: brand + columns */}
      <div className="mx-auto max-w-[1400px] px-4 py-12 lg:px-6">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="grid h-11 w-11 place-items-center rounded-lg bg-brand-700 font-display text-xl font-black text-white"
              >
                JM
              </span>
              <span className="font-display text-2xl font-black text-white">
                JM<span className="text-brand-500"> News</span>
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-400">
              {site.description}
            </p>
            <div className="mt-5 flex items-center gap-2">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-full bg-white/5 text-zinc-300 transition-colors hover:bg-brand-600 hover:text-white"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Sections */}
          <div className="lg:col-span-2">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Sections</h3>
            <ul className="space-y-2.5 text-sm">
              {navCategories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/category/${c.slug}`} className="text-zinc-400 transition-colors hover:text-brand-400">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-2">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Company</h3>
            <ul className="space-y-2.5 text-sm">
              {company.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-zinc-400 transition-colors hover:text-brand-400">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-4">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
              The JM Brief
            </h3>
            <p className="mb-4 text-sm text-zinc-400">
              The day&apos;s most important stories, in your inbox every morning.
            </p>
            <form className="flex overflow-hidden rounded-full bg-white/10 p-1 ring-1 ring-white/10 focus-within:ring-brand-500">
              <input
                type="email"
                required
                placeholder="Enter your email"
                aria-label="Email address"
                className="min-w-0 flex-1 bg-transparent px-4 text-sm text-white placeholder:text-zinc-400 focus:outline-none"
              />
              <button
                type="submit"
                className="flex shrink-0 items-center gap-1.5 rounded-full bg-brand-700 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-800"
              >
                <Send className="h-4 w-4" />
                Subscribe
              </button>
            </form>
            <p className="mt-3 text-xs text-zinc-400">
              By subscribing you agree to our Terms and Privacy Policy.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-zinc-400 sm:flex-row lg:px-6">
          <p>© {year} {site.name}. All rights reserved.</p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {legal.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="transition-colors hover:text-brand-400">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-1.5 font-semibold text-zinc-400 transition-colors hover:text-brand-400"
              >
                <Lock className="h-3.5 w-3.5" />
                Staff Login
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
