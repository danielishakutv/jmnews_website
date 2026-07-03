"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE } from "./session";

/**
 * Login server action.
 *
 * Verifies the entered credentials against WP's built-in REST endpoint
 * `/wp-json/wp/v2/users/me` using HTTP Basic Auth — works with any
 * Application Password the user creates in wp-admin → Users → Profile.
 *
 * No WPGraphQL plugin is required for Phase 2; once JWT lands we'll add
 * a token to the cookie payload so authenticated mutations can flow.
 *
 * Returns `{ error }` on failure for `useActionState`; throws redirect
 * on success.
 */

interface LoginResult {
  error?: string;
}

const SESSION_TTL_SECONDS = 12 * 60 * 60; // 12h

export async function loginAction(
  _prev: LoginResult | undefined,
  formData: FormData
): Promise<LoginResult> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  if (!username || !password) {
    return { error: "Enter your wp-admin username and an Application Password." };
  }

  const endpoint = process.env.WP_GRAPHQL_URL?.replace(/\/graphql\/?$/, "") ?? "";
  if (!endpoint) {
    return { error: "Server misconfigured: WP_GRAPHQL_URL is not set." };
  }

  // WP Application Passwords are shown with spaces — strip before encoding.
  const cred = Buffer.from(`${username}:${password.replace(/\s+/g, "")}`).toString("base64");

  let res: Response;
  try {
    res = await fetch(`${endpoint}/wp-json/wp/v2/users/me?context=edit`, {
      method: "GET",
      headers: { Authorization: `Basic ${cred}` },
      cache: "no-store",
    });
  } catch {
    return { error: "Couldn't reach WordPress. Check your connection and try again." };
  }

  if (res.status === 401 || res.status === 403) {
    return {
      error:
        "Invalid credentials. Use your wp-admin username + a WP Application Password " +
        "(Users → Profile → Application Passwords).",
    };
  }
  if (!res.ok) {
    return { error: `WordPress returned ${res.status}. Try again or contact an administrator.` };
  }

  type WpUser = {
    id: number;
    name: string;
    slug: string;
    roles?: string[];
    avatar_urls?: Record<string, string>;
  };
  const wpUser = (await res.json()) as WpUser;

  const payload = {
    id: wpUser.id,
    username: wpUser.slug,
    name: wpUser.name,
    role: wpUser.roles?.[0] ?? "author",
    avatarUrl: wpUser.avatar_urls?.["96"] ?? null,
    exp: Date.now() + SESSION_TTL_SECONDS * 1000,
  };
  const cookieValue = Buffer.from(JSON.stringify(payload)).toString("base64");

  const store = await cookies();
  store.set(SESSION_COOKIE, cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });

  // Safe-redirect — only allow relative paths so a hostile `?next=` can't
  // bounce the user off-site.
  const target = next.startsWith("/") && !next.startsWith("//") ? next : "/admin";
  redirect(target);
}

export async function signoutAction() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect("/admin/login");
}
