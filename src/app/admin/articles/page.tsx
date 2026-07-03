import type { Metadata } from "next";
import { Newspaper } from "lucide-react";
import { requireSession } from "@/lib/auth/session";
import ModulePlaceholder from "@/components/admin/ModulePlaceholder";

export const metadata: Metadata = {
  title: "Articles",
  robots: { index: false, follow: false },
};

export default async function AdminArticles() {
  await requireSession();
  return (
    <ModulePlaceholder
      title="Articles"
      description="Draft, schedule and publish stories."
      Icon={Newspaper}
      phase="Phase 6"
      bullets={[
        "Filterable list by status (draft / scheduled / published) + category + author",
        "Tiptap editor writing back to WP, featured image picker hits the media library",
        "Save draft → schedule → publish lifecycle; WP handles revisions",
        "One-shot signed preview links so writers see the article in the live site's layout",
      ]}
    />
  );
}
