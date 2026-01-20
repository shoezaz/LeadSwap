import { PageContent } from "@/ui/layout/page-content";
import { SettingsPageClient } from "./page-client";

export const dynamic = "force-dynamic";

export default function SettingsPage() {
  return (
    <PageContent title="General">
      <SettingsPageClient />
    </PageContent>
  );
}
