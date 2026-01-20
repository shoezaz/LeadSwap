import { PageContent } from "@/ui/layout/page-content";
import { MaxWidthWrapper } from "@leadswap/ui";
import { IntegrationsPageClient } from "./page-client";

export default function IntegrationsPage() {
  return (
    <PageContent title="Integrations">
      <MaxWidthWrapper>
        <IntegrationsPageClient />
      </MaxWidthWrapper>
    </PageContent>
  );
}

