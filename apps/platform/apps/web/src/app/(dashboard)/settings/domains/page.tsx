import { PageContent } from "@/ui/layout/page-content";
import { PageWidthWrapper } from "@/ui/layout/page-width-wrapper";
import WorkspaceDomainsPageClient from "./page-client";

export default function WorkspaceDomainsPage() {
  return (
    <PageContent
      title="Domains"
      titleInfo={{
        title: "Manage the domains used for your short links.",
      }}
    >
      <PageWidthWrapper className="max-w-[900px] pb-20">
        <WorkspaceDomainsPageClient />
      </PageWidthWrapper>
    </PageContent>
  );
}

