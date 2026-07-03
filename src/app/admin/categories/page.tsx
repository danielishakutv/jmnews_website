import type { Metadata } from "next";
import { Tags } from "lucide-react";
import { requireSession } from "@/lib/auth/session";
import ModulePlaceholder from "@/components/admin/ModulePlaceholder";

export const metadata: Metadata = {
  title: "Categories",
  robots: { index: false, follow: false },
};

export default async function AdminCategories() {
  await requireSession();
  return (
    <ModulePlaceholder
      title="Categories"
      description="Create, rename, reorder and retire sections."
      Icon={Tags}
      phase="Phase 4"
      bullets={[
        "Full CRUD on WP categories via GraphQL mutations",
        "Soft delete with affected-post count confirmation",
        "Drag-to-reorder for the public nav ordering",
        "Live preview of the brand accent + description as you edit",
      ]}
    />
  );
}
