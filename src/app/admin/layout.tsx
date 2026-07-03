import type { Metadata } from "next";
import Sidebar from "@/components/admin/Sidebar";
import Topbar, { MobileTopbarHint } from "@/components/admin/Topbar";
import { getSession } from "@/lib/auth/session";

// Keep the whole dashboard out of search engines (belt-and-suspenders with
// the robots.txt disallow — meta noindex is definitive for any linked page).
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/**
 * Dashboard chrome — sidebar on the left, sticky topbar above, content area
 * fills the rest.
 *
 * The public chrome (TopBar/Header/BreakingTicker/Footer) is rendered by
 * the root layout but hidden here via a scoped CSS rule. This layout only
 * mounts on /admin/*, so the rule never leaks to public pages. Also
 * neutralises the public layout's body padding so the dashboard truly
 * fills the viewport.
 *
 * The auth gate lives in middleware.ts; this layout only renders.
 */
const HIDE_PUBLIC_CHROME_CSS = `
  /* Active only while the dashboard layout is mounted (i.e. /admin/*). */
  body > [data-public-chrome] { display: none !important; }
  /* Public main has overflow-x-clip + the page's own padding — we don't
     want either inside the admin. */
  body > main#main { overflow: visible !important; }
`;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSession();

  // Login route shouldn't see the dashboard chrome — it has its own
  // standalone layout. We still hide the public chrome here so the login
  // page doesn't render under the public TopBar/Header either.
  if (!user) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: HIDE_PUBLIC_CHROME_CSS }} />
        {children}
      </>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: HIDE_PUBLIC_CHROME_CSS }} />
      <div className="min-h-[100dvh] bg-surface-2 text-fg">
        <Sidebar />
        <div className="lg:ml-60">
          <Topbar user={{ name: user.name, role: user.role, avatarUrl: user.avatarUrl }} />
          <MobileTopbarHint />
          <div className="px-6 py-8 lg:px-10">{children}</div>
        </div>
      </div>
    </>
  );
}
