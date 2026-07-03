"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Newspaper,
  Tags,
  UserRound,
  Megaphone,
  BarChart3,
  Settings,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Overview", Icon: LayoutDashboard, exact: true },
  { href: "/admin/articles", label: "Articles", Icon: Newspaper, exact: false },
  { href: "/admin/categories", label: "Categories", Icon: Tags, exact: false },
  { href: "/admin/reporters", label: "Reporter", Icon: UserRound, exact: false },
  { href: "/admin/promotions", label: "Popups & Ads", Icon: Megaphone, exact: false },
  { href: "/admin/analytics", label: "Analytics", Icon: BarChart3, exact: false },
  { href: "/admin/settings", label: "Settings", Icon: Settings, exact: false },
] as const;

export default function Sidebar() {
  const pathname = usePathname();
  const active = (href: string, exact = false) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-line bg-surface lg:flex">
      {/* Brand */}
      <Link href="/admin" className="flex h-16 items-center gap-2.5 border-b border-line px-5">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-700 font-display text-lg font-black text-white shadow-sm">
          JM
        </span>
        <div className="leading-none">
          <div className="font-display text-base font-black tracking-tight text-fg">
            JM<span className="text-brand-600"> News</span>
          </div>
          <div className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-fg-muted">
            Newsroom
          </div>
        </div>
      </Link>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {NAV.map(({ href, label, Icon, exact }) => {
            const isActive = active(href, exact ?? false);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
                    isActive
                      ? "bg-brand-50 text-brand-700 dark:text-brand-400"
                      : "text-fg-muted hover:bg-surface-2 hover:text-fg"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0",
                      isActive ? "text-brand-600" : "text-fg-muted group-hover:text-fg-muted"
                    )}
                  />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-line p-3">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          View public site
        </Link>
      </div>
    </aside>
  );
}
