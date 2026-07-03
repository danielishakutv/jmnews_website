"use server";

import { requireRole } from "@/lib/auth/guard";
import { writeWpSettings } from "@/lib/cms/wp-settings";

export type SettingsActionResult =
  | { ok: true; updatedAt: number }
  | { ok: false; error: string };

/**
 * Save WordPress general settings via the native REST API.
 *
 * - Requires the `administrator` role (matches WP's `manage_options` cap).
 * - Writes never throw — `writeWpSettings` returns a plain result — so the
 *   form re-renders with a message instead of crashing the page.
 */
export async function updateSettingsAction(
  _prev: SettingsActionResult | undefined,
  formData: FormData
): Promise<SettingsActionResult> {
  await requireRole("administrator");

  const title = cleanString(formData.get("title"));
  const description = cleanString(formData.get("description"));
  const url = cleanString(formData.get("url"));
  const email = cleanString(formData.get("email"));

  if (title !== undefined && title.length === 0) {
    return { ok: false, error: "Site title can't be empty." };
  }
  if (url && !isHttpUrl(url)) {
    return { ok: false, error: "Public URL must start with http:// or https://." };
  }
  if (email && !isEmail(email)) {
    return { ok: false, error: "Admin email looks invalid." };
  }

  const res = await writeWpSettings({ title, description, url, email });
  if (!res.ok) return { ok: false, error: res.error ?? "Couldn't save settings." };
  return { ok: true, updatedAt: Date.now() };
}

function cleanString(v: FormDataEntryValue | null): string | undefined {
  if (v === null) return undefined;
  return String(v).trim();
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
