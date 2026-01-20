import { Suspense } from "react";
import { CampaignDetailClient } from "./page-client";

export default function CampaignDetailPage() {
  return (
    <Suspense fallback={<CampaignDetailSkeleton />}>
      <CampaignDetailClient />
    </Suspense>
  );
}

function CampaignDetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 w-64 bg-neutral-200 rounded mb-4" />
      <div className="h-4 w-48 bg-neutral-100 rounded mb-8" />
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-20 bg-neutral-100 rounded-lg" />
        ))}
      </div>
      <div className="h-[600px] bg-neutral-50 rounded-lg" />
    </div>
  );
}

