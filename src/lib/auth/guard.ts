import "server-only";
import { redirect } from "next/navigation";
import { requireSession, type DashboardUser } from "./session";

/**
 * Role-based access guards for dashboard pages.
 *
 * WP roles map to dashboard capabilities:
 *   administrator → full access (settings, reporters, all writes)
 *   editor        → publish/edit any article, manage categories
 *   author        → create/edit own articles
 *   contributor   → draft own articles (cannot publish)
 *
 * Phase 5 (Reporters module) introduces custom roles (`senior_reporter`,
 * `reporter`) via a small WP mu-plugin; this allowlist expands accordingly.
 */

type Role = "administrator" | "editor" | "author" | "contributor" | string;

const HIERARCHY: Record<string, number> = {
  administrator: 100,
  editor: 80,
  senior_reporter: 70,
  author: 60,
  reporter: 60,
  contributor: 40,
};

function rank(role: string): number {
  return HIERARCHY[role] ?? 0;
}

/** Require at least the given role. Redirect to /admin if not allowed. */
export async function requireRole(min: Role): Promise<DashboardUser> {
  const user = await requireSession();
  if (rank(user.role) < rank(min)) {
    redirect("/admin?error=forbidden");
  }
  return user;
}

/** Boolean check — handy for conditionally rendering UI without hard-gating. */
export function canAccess(user: DashboardUser | null, min: Role): boolean {
  if (!user) return false;
  return rank(user.role) >= rank(min);
}
