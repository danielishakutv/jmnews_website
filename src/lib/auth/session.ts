import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Dashboard session.
 *
 * Phase 2 ships with a stub reader: any non-empty `jm_session` cookie is
 * accepted and resolves to a placeholder user. Phase 2 final swaps this
 * for real WPGraphQL JWT verification (signature + expiry) — interface
 * stays identical so call sites don't change.
 */

export const SESSION_COOKIE = "jm_session";

export interface DashboardUser {
  /** WP user ID (numeric, exposed as string for GraphQL compatibility) */
  id: string;
  /** WP user_login */
  username: string;
  /** Display name */
  name: string;
  /** WP role: "administrator" | "editor" | "author" | "contributor" | custom */
  role: string;
  /** Gravatar URL if available */
  avatarUrl?: string | null;
}

/**
 * Decode the session cookie into a user. Returns null when missing/invalid.
 * The cookie is read-only here; writes happen in the login server action.
 */
export async function getSession(): Promise<DashboardUser | null> {
  const store = await cookies();
  const raw = store.get(SESSION_COOKIE)?.value;
  if (!raw) return null;

  try {
    // STUB: until JWT lands, the cookie carries a base64 JSON blob with
    // {username, name, role}. The login form sets this; nothing here yet
    // signs/verifies it — that's intentional and replaced in Phase 2 final.
    const decoded = JSON.parse(Buffer.from(raw, "base64").toString("utf8"));
    if (!decoded?.username) return null;
    return {
      id: String(decoded.id ?? ""),
      username: String(decoded.username),
      name: String(decoded.name ?? decoded.username),
      role: String(decoded.role ?? "author"),
      avatarUrl: decoded.avatarUrl ?? null,
    };
  } catch {
    return null;
  }
}

/**
 * Force a logged-in user; redirect to /admin/login otherwise.
 * Returns the user so the caller can use it inline.
 */
export async function requireSession(): Promise<DashboardUser> {
  const user = await getSession();
  if (!user) redirect("/admin/login");
  return user;
}
