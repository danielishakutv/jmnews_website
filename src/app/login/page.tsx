import { redirect } from "next/navigation";

/**
 * Legacy /login route — moved to /admin/login as part of Phase 2.
 * Kept here as a permanent redirect so any bookmarks / external links
 * still land in the right place.
 */
export default function LegacyLoginRedirect() {
  redirect("/admin/login");
}
