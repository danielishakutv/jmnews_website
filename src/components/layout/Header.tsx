"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Search, Radio } from "lucide-react";
import type { Category } from "@/lib/types";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/ui/ThemeToggle";

function Logo({ compact = false, onNavigate }: { compact?: boolean; onNavigate?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onNavigate}
      className="flex shrink-0 items-center gap-2.5"
    >
      {/* Decorative mark; the visible "JM News" wordmark is the link's name. */}
      <span
        aria-hidden="true"
        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-700 font-display text-lg font-extrabold text-white shadow-soft"
      >
        JM
      </span>
      {!compact && (
        <span className="leading-none">
          <span className="block font-display text-xl font-extrabold tracking-tight text-fg sm:text-2xl">
            JM<span className="text-brand-600"> News</span>
          </span>
          {/* Tagline is wide — hide it on phones so the logo isn't cramped */}
          <span className="mt-1 hidden text-[10px] font-semibold uppercase tracking-[0.18em] text-fg-muted sm:block">
            {site.tagline}
          </span>
        </span>
      )}
    </Link>
  );
}

export default function Header({ navCategories }: { navCategories: Category[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [stuck, setStuck] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Focus the search field as soon as the search bar opens.
  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  // Close any open overlay after navigating.
  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  // Esc closes the search bar.
  useEffect(() => {
    if (!searchOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen]);

  const isActive = (slug: string) => pathname === `/category/${slug}`;

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) {
      searchInputRef.current?.focus();
      return;
    }
    setSearchOpen(false);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 bg-surface/80 backdrop-blur-xl transition-shadow",
        stuck ? "shadow-soft-lg border-b border-line/60" : "border-b border-line"
      )}
    >
      {/* Masthead row */}
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-3 px-4 lg:h-[72px] lg:px-6">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-fg hover:bg-surface-2 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          <Logo />
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
          <Link
            href="/live"
            className="hidden items-center gap-1.5 rounded-full bg-live/10 px-3 py-1.5 text-sm font-bold text-live dark:text-red-400 transition-colors hover:bg-live/15 sm:flex"
          >
            <Radio className="h-4 w-4" />
            LIVE
          </Link>
          <button
            type="button"
            onClick={() => setSearchOpen((v) => !v)}
            className={cn(
              "grid h-10 w-10 place-items-center rounded-lg transition-colors",
              searchOpen ? "bg-brand-500/10 text-brand-600" : "text-fg hover:bg-surface-2"
            )}
            aria-label={searchOpen ? "Close search" : "Search"}
            aria-expanded={searchOpen}
          >
            {searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
          </button>
          <ThemeToggle />
          <Link
            href="/category/opinion"
            className="ml-1 hidden rounded-full bg-brand-700 px-4 py-2 text-sm font-bold text-white shadow-soft transition-colors hover:bg-brand-800 sm:inline-block"
          >
            Subscribe
          </Link>
        </div>
      </div>

      {/* Search bar */}
      {searchOpen && (
        <div className="border-t border-line bg-surface">
          <form
            onSubmit={submitSearch}
            className="mx-auto flex max-w-[1400px] items-center gap-2 px-4 py-3 lg:px-6"
            role="search"
          >
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-fg-muted" />
              <input
                ref={searchInputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search JM News…"
                aria-label="Search JM News"
                enterKeyHint="search"
                className="h-11 w-full rounded-full border border-line-strong bg-surface-2 pl-11 pr-4 text-sm text-fg shadow-sm outline-none transition-colors placeholder:text-fg-muted focus:border-brand-500 focus:bg-surface focus:ring-2 focus:ring-brand-500/30"
              />
            </div>
            <button
              type="submit"
              className="grid h-11 shrink-0 place-items-center rounded-full bg-brand-700 px-4 text-sm font-bold text-white transition-colors hover:bg-brand-800 sm:px-6"
            >
              <Search className="h-5 w-5 sm:hidden" />
              <span className="hidden sm:inline">Search</span>
            </button>
          </form>
        </div>
      )}

      {/* Desktop nav row */}
      <nav className="hidden border-t border-line bg-surface lg:block">
        <ul className="mx-auto flex max-w-[1400px] items-center gap-1 px-6">
          <li>
            <Link
              href="/"
              className={cn(
                "inline-block border-b-2 px-3 py-2.5 text-sm font-bold transition-colors",
                pathname === "/"
                  ? "border-brand-600 text-brand-700 dark:text-brand-400"
                  : "border-transparent text-fg hover:border-brand-300 hover:text-brand-700"
              )}
            >
              Home
            </Link>
          </li>
          {navCategories.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/category/${c.slug}`}
                className={cn(
                  "inline-block border-b-2 px-3 py-2.5 text-sm font-bold transition-colors",
                  isActive(c.slug)
                    ? "border-brand-600 text-brand-700 dark:text-brand-400"
                    : "border-transparent text-fg hover:border-brand-300 hover:text-brand-700"
                )}
              >
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-[60] h-[100dvh] lg:hidden">
          <div
            className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute inset-y-0 left-0 flex w-[82%] max-w-sm flex-col bg-surface shadow-2xl animate-slide-in-left">
            <div className="flex items-center justify-between border-b border-line px-4 py-4">
              <Logo onNavigate={() => setOpen(false)} />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-lg text-fg hover:bg-surface-2"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-2 py-3">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="block rounded-lg px-4 py-3 text-base font-bold text-fg hover:bg-brand-50 hover:text-brand-700"
              >
                Home
              </Link>
              {navCategories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/category/${c.slug}`}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-4 py-3 text-base font-bold text-fg hover:bg-brand-50 hover:text-brand-700"
                >
                  {c.name}
                </Link>
              ))}
              <Link
                href="/live"
                onClick={() => setOpen(false)}
                className="mt-2 flex items-center gap-2 rounded-lg px-4 py-3 text-base font-bold text-live dark:text-red-400 hover:bg-live/5"
              >
                <Radio className="h-5 w-5" /> Live TV
              </Link>
            </nav>
            <div className="border-t border-line p-4">
              <Link
                href="/category/opinion"
                onClick={() => setOpen(false)}
                className="block rounded-full bg-brand-600 px-4 py-3 text-center text-sm font-bold text-white"
              >
                Subscribe to JM News
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
