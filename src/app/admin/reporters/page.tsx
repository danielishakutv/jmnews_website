import type { Metadata } from "next";
import { Users } from "lucide-react";
import { requireRole } from "@/lib/auth/guard";
import ModulePlaceholder from "@/components/admin/ModulePlaceholder";

export const metadata: Metadata = {
  title: "Reporters",
  robots: { index: false, follow: false },
};

export default async function AdminReporters() {
  // Reporter management is an editor+ capability.
  await requireRole("editor");
  return (
    <ModulePlaceholder
      title="Reporters"
      description="Invite writers, assign roles, manage accounts."
      Icon={Users}
      phase="Phase 5"
      bullets={[
        "List all WP users with reporter / editor / admin roles",
        "Invite by email (sends WP user-registration email + role)",
        "Custom roles installed via a small WP mu-plugin (senior_reporter, reporter)",
        "Activate / deactivate accounts; audit-logged",
      ]}
    />
  );
}
