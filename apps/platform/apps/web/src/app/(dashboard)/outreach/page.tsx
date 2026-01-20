import { Suspense } from "react";
import { OutreachPageClient } from "./page-client";

export default function OutreachPage() {
  return (
    <Suspense fallback={<OutreachPageSkeleton />}>
      <OutreachPageClient />
    </Suspense>
  );
}

function OutreachPageSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 w-48 bg-neutral-200 rounded mb-4" />
      <div className="h-4 w-96 bg-neutral-100 rounded mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-neutral-100 rounded-lg" />
        ))}
      </div>
      <div className="h-96 bg-neutral-50 rounded-lg" />
    </div>
  );
}

