import Link from "next/link";
import { LogOut, Bell, ChevronDown } from "lucide-react";

/**
 * Sticky topbar shown above every dashboard page.
 *
 * Phase 2 ships with the logged-in user displayed as a placeholder; once
 * the WPGraphQL JWT plugin is installed, the session helper returns the
 * real WP user and the avatar wires up to Gravatar.
 */
export default function Topbar({
  user,
}: {
  user: { name: string; role: string; avatarUrl?: string | null };
}) {
  const initials = user.name
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-line bg-surface/95 px-6 backdrop-blur">
      <div className="flex items-center gap-3">
        <h1 className="text-sm font-bold uppercase tracking-wider text-fg-muted">
          Newsroom Dashboard
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Notifications"
          className="relative grid h-9 w-9 place-items-center rounded-lg text-fg-muted hover:bg-surface-2 hover:text-fg"
        >
          <Bell className="h-5 w-5" />
        </button>

        {/* User menu (server-rendered button; turn into a dropdown when needed) */}
        <div className="flex items-center gap-2.5 rounded-full border border-line bg-surface py-1 pl-1 pr-3 shadow-sm">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-600 text-[11px] font-bold text-white">
            {initials || "JM"}
          </span>
          <div className="leading-tight">
            <div className="text-xs font-semibold text-fg">{user.name}</div>
            <div className="text-[10px] font-medium uppercase tracking-wider text-fg-muted">
              {user.role}
            </div>
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-fg-muted" />
        </div>

        {/* Sign-out is a server action posted via a form (works without JS) */}
        <form action="/api/auth/signout" method="post">
          <button
            type="submit"
            aria-label="Sign out"
            className="grid h-9 w-9 place-items-center rounded-lg text-fg-muted transition-colors hover:bg-live/10 hover:text-live"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </form>
      </div>
    </header>
  );
}

export function MobileTopbarHint() {
  // Stub: dashboard is desktop-first; mobile drawer is Phase 2 polish.
  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-xs font-medium text-amber-900 lg:hidden">
      The newsroom dashboard is optimised for desktop — please use a larger screen for full
      editing. <Link href="/" className="font-semibold underline">Back to public site</Link>
    </div>
  );
}
