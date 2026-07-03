"use server";

import { revalidateTag } from "next/cache";
import { requireRole } from "@/lib/auth/guard";
import {
  updateSiteSettings,
  type SiteSettingsInput,
} from "@/lib/cms/queries/site-settings";
import { CmsError } from "@/lib/cms/client";

export type SettingsActionResult =
  | { ok: true; updatedAt: number }
  | { ok: false; error: string };

/**
 * Save organisation settings.
 *
 * - Requires the `administrator` role (matches WP's `manage_options` cap).
 * - Writes via the auth'd mutation client.
 * - On success, invalidates the `cms:site-settings` cache tag so the public
 *   site picks up the change on the next request.
 *
 * Designed for `useActionState`; throws are caught and surfaced as `error`
 * so the form re-renders with the message instead of crashing.
 */
export async function updateSettingsAction(
  _prev: SettingsActionResult | undefined,
  formData: FormData
): Promise<SettingsActionResult> {
  // Defence-in-depth: middleware redirects unauthed users, but writes must
  // re-check role inside the action since FormData can be replayed.
  await requireRole("administrator");

  const input: SiteSettingsInput = {
    title: cleanString(formData.get("title")),
    description: cleanString(formData.get("description")),
    url: cleanString(formData.get("url")),
    email: cleanString(formData.get("email")),
  };

  // Server-side validation — the form does HTML5 validation too, but we
  // can't trust the client.
  if (input.title !== undefined && input.title.length === 0) {
    return { ok: false, error: "Site title can't be empty." };
  }
  if (input.url !== undefined && input.url.length > 0 && !isHttpUrl(input.url)) {
    return { ok: false, error: "Public URL must start with http:// or https://." };
  }
  if (input.email !== undefined && input.email.length > 0 && !isEmail(input.email)) {
    return { ok: false, error: "Admin email looks invalid." };
  }

  try {
    await updateSiteSettings(input);
    revalidateTag("cms:site-settings");
    return { ok: true, updatedAt: Date.now() };
  } catch (e) {
    const msg =
      e instanceof CmsError
        ? e.message
        : e instanceof Error
          ? e.message
          : "Couldn't save settings.";
    return { ok: false, error: msg };
  }
}

function cleanString(v: FormDataEntryValue | null): string | undefined {
  if (v === null) return undefined;
  const s = String(v).trim();
  return s; // empty string allowed; server checks per-field
}

function isHttpUrl(s: string): boolean {
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function isEmail(s: string): boolean {
  return /^\S+@\S+\.\S+$/.test(s);
}
