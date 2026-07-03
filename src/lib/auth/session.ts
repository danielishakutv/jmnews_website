import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "./crypto";

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
    // The cookie is `base64(JSON).hmac`. Verify the signature first — an
    // unsigned/forged cookie (e.g. one hand-crafted from the public source)
    // fails here and is rejected. The login action mints the signed value.
    const payloadB64 = verifyToken(raw);
    if (!payloadB64) return null;

    const decoded = JSON.parse(Buffer.from(payloadB64, "base64").toString("utf8"));
    if (!decoded?.username) return null;
    // Reject expired sessions.
    if (typeof decoded.exp === "number" && Date.now() > decoded.exp) return null;

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
