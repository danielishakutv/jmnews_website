"use server";

import { revalidateTag, revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/guard";
import { wpUploadMedia, wpCreatePost, textToHtml } from "@/lib/cms/wp-write";

export type NewArticleResult =
  | { ok: true; link: string; status: string; title: string }
  | { ok: false; error: string };

export async function createArticleAction(
  _prev: NewArticleResult | undefined,
  formData: FormData
): Promise<NewArticleResult> {
  // Writers and up may create posts.
  await requireRole("author");

  const title = String(formData.get("title") ?? "").trim();
  const contentRaw = String(formData.get("content") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const categoryId = Number(formData.get("category")) || undefined;
  const intent = String(formData.get("intent") ?? "draft");
  const status: "draft" | "publish" = intent === "publish" ? "publish" : "draft";
  const image = formData.get("image");

  if (!title) return { ok: false, error: "Give the story a title." };
  if (!contentRaw) return { ok: false, error: "Write the story body." };

  // Optional featured image.
  let featuredMediaId: number | undefined;
  if (image instanceof File && image.size > 0) {
    if (image.size > 12 * 1024 * 1024) {
      return { ok: false, error: "Featured image is too large (max 12 MB)." };
    }
    const up = await wpUploadMedia(image);
    if (!up.ok) return { ok: false, error: up.error };
    featuredMediaId = up.id;
  }

  const res = await wpCreatePost({
    title,
    content: textToHtml(contentRaw),
    excerpt: excerpt || undefined,
    categoryId,
    status,
    featuredMediaId,
  });

  if (!res.ok) return { ok: false, error: res.error };

  // Make it show up on the public site promptly.
  revalidateTag("cms:posts");
  revalidatePath("/");
  if (categoryId) revalidatePath("/category/[slug]", "page");

  return { ok: true, link: res.link, status: res.status, title };
}
