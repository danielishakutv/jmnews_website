import "server-only";
import { site as staticSite } from "@/lib/site";

/**
 * WordPress "General Settings" via the native REST API (wp/v2/settings).
 *
 * Reads NEVER throw — they fall back to the static identity, so the admin
 * settings page can never 500 (the previous GraphQL `generalSettings` read
 * did exactly that in production). Writes need an administrator Application
 * Password (WP_ADMIN_USER / WP_ADMIN_APP_PASSWORD) and degrade gracefully.
 */

function restBase(): string {
  return process.env.WP_GRAPHQL_URL?.trim().replace(/\/graphql\/?$/i, "") ?? "";
}

function adminAuthHeader(): string | null {
  const user = process.env.WP_ADMIN_USER?.trim();
  const pass = process.env.WP_ADMIN_APP_PASSWORD?.replace(/\s+/g, "");
  if (!user || !pass) return null;
  return "Basic " + Buffer.from(`${user}:${pass}`).toString("base64");
}

export interface WpSettings {
  title: string;
  description: string;
  url: string;
  email: string;
}

/** WordPress connectivity for the settings page health indicator. */
export type WpConnection =
  | { ok: true }
  | { ok: false; reason: "no-credentials" | "unreachable" | "unauthorized" | "error" };

const staticFallback = (): WpSettings => ({
  title: staticSite.name,
  description: staticSite.tagline,
  url: staticSite.url,
  email: "",
});

/** Read WP general settings. Returns the static identity on ANY failure. */
export async function readWpSettings(): Promise<{ settings: WpSettings; connection: WpConnection }> {
  const base = restBase();
  const auth = adminAuthHeader();
  const fallback = staticFallback();
  if (!base) return { settings: fallback, connection: { ok: false, reason: "error" } };
  if (!auth) return { settings: fallback, connection: { ok: false, reason: "no-credentials" } };

  try {
    const res = await fetch(`${base}/wp-json/wp/v2/settings`, {
      headers: { Authorization: auth, Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(7000),
    });
    if (res.status === 401 || res.status === 403) {
      return { settings: fallback, connection: { ok: false, reason: "unauthorized" } };
    }
    if (!res.ok) return { settings: fallback, connection: { ok: false, reason: "error" } };
    const s = (await res.json()) as Partial<WpSettings>;
    return {
      settings: {
        title: s.title || fallback.title,
        description: s.description || fallback.description,
        url: s.url || fallback.url,
        email: s.email || "",
      },
      connection: { ok: true },
    };
  } catch {
    return { settings: fallback, connection: { ok: false, reason: "unreachable" } };
  }
}

/** Write WP general settings. Returns a plain result — never throws. */
export async function writeWpSettings(
  input: Partial<WpSettings>
): Promise<{ ok: boolean; error?: string }> {
  const base = restBase();
  const auth = adminAuthHeader();
  if (!base) return { ok: false, error: "Server misconfigured: WP_GRAPHQL_URL is not set." };
  if (!auth) {
    return {
      ok: false,
      error:
        "WordPress admin credentials aren't configured on the server. Add WP_ADMIN_USER + " +
        "WP_ADMIN_APP_PASSWORD (an administrator Application Password) to the environment.",
    };
  }
  try {
    const res = await fetch(`${base}/wp-json/wp/v2/settings`, {
      method: "POST",
      headers: { Authorization: auth, "Content-Type": "application/json" },
      body: JSON.stringify(input),
      cache: "no-store",
      signal: AbortSignal.timeout(9000),
    });
    if (res.status === 401 || res.status === 403) {
      return { ok: false, error: "That account can't change site settings (needs an administrator role)." };
    }
    if (!res.ok) return { ok: false, error: `WordPress returned ${res.status}.` };
    return { ok: true };
  } catch {
    return { ok: false, error: "Couldn't reach WordPress. Check the connection and try again." };
  }
}
