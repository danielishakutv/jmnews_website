import "server-only";

/**
 * WordPress write helpers (native REST API), authenticated with the service
 * account (WP_ADMIN_USER + WP_ADMIN_APP_PASSWORD — an administrator Application
 * Password). Used by the in-dashboard article editor to publish/draft posts,
 * upload featured images and list categories.
 *
 * All functions return plain results (never throw) so server actions can
 * surface a message instead of crashing.
 */

function restBase(): string {
  return process.env.WP_GRAPHQL_URL?.trim().replace(/\/graphql\/?$/i, "") ?? "";
}

function auth(): string | null {
  const user = process.env.WP_ADMIN_USER?.trim();
  const pass = process.env.WP_ADMIN_APP_PASSWORD?.replace(/\s+/g, "");
  if (!user || !pass) return null;
  return "Basic " + Buffer.from(`${user}:${pass}`).toString("base64");
}

export function writeConfigured(): boolean {
  return Boolean(restBase() && auth());
}

export interface WpCategory {
  id: number;
  name: string;
  slug: string;
}

/** Categories for the editor dropdown (empty array on any failure). */
export async function wpCategories(): Promise<WpCategory[]> {
  const base = restBase();
  if (!base) return [];
  try {
    const res = await fetch(`${base}/wp-json/wp/v2/categories?per_page=100&orderby=name&order=asc&_fields=id,name,slug`, {
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    return (await res.json()) as WpCategory[];
  } catch {
    return [];
  }
}

/** Upload an image and return its media id + url, or an error. */
export async function wpUploadMedia(
  file: File
): Promise<{ ok: true; id: number; url: string } | { ok: false; error: string }> {
  const base = restBase();
  const a = auth();
  if (!base || !a) return { ok: false, error: "WordPress admin credentials aren't configured." };
  try {
    const buf = Buffer.from(await file.arrayBuffer());
    const name = (file.name || "upload.jpg").replace(/[^\w.-]+/g, "-");
    const res = await fetch(`${base}/wp-json/wp/v2/media`, {
      method: "POST",
      headers: {
        Authorization: a,
        "Content-Disposition": `attachment; filename="${name}"`,
        "Content-Type": file.type || "application/octet-stream",
      },
      body: buf,
      cache: "no-store",
      signal: AbortSignal.timeout(30000),
    });
    if (!res.ok) {
      return { ok: false, error: `Image upload failed (WordPress ${res.status}).` };
    }
    const m = (await res.json()) as { id: number; source_url: string };
    return { ok: true, id: m.id, url: m.source_url };
  } catch {
    return { ok: false, error: "Couldn't upload the image (network/timeout)." };
  }
}

export interface CreatePostInput {
  title: string;
  /** Body as HTML. */
  content: string;
  excerpt?: string;
  categoryId?: number;
  status: "draft" | "publish";
  featuredMediaId?: number;
}

/** Create a post. Returns the new post's id + permalink on success. */
export async function wpCreatePost(
  input: CreatePostInput
): Promise<{ ok: true; id: number; link: string; status: string } | { ok: false; error: string }> {
  const base = restBase();
  const a = auth();
  if (!base || !a) {
    return {
      ok: false,
      error:
        "WordPress admin credentials aren't set on the server. Add WP_ADMIN_USER + " +
        "WP_ADMIN_APP_PASSWORD (an administrator Application Password) in Vercel.",
    };
  }
  const body: Record<string, unknown> = {
    title: input.title,
    content: input.content,
    status: input.status,
  };
  if (input.excerpt) body.excerpt = input.excerpt;
  if (input.categoryId) body.categories = [input.categoryId];
  if (input.featuredMediaId) body.featured_media = input.featuredMediaId;

  try {
    const res = await fetch(`${base}/wp-json/wp/v2/posts`, {
      method: "POST",
      headers: { Authorization: a, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(20000),
    });
    if (res.status === 401 || res.status === 403) {
      return { ok: false, error: "That account can't publish posts (needs author+ capabilities)." };
    }
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      return { ok: false, error: `WordPress rejected the post (${res.status}). ${t.slice(0, 120)}` };
    }
    const p = (await res.json()) as { id: number; link: string; status: string };
    return { ok: true, id: p.id, link: p.link, status: p.status };
  } catch {
    return { ok: false, error: "Couldn't reach WordPress to save the post." };
  }
}

/** Plain text → paragraph HTML (blank line = new paragraph, single newline = <br>). */
export function textToHtml(text: string): string {
  return text
    .trim()
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${p.replace(/\n/g, "<br />")}</p>`)
    .join("\n");
}
