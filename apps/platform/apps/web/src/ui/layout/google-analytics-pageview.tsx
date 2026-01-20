"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: any[]) => void;
  }
}

export function GoogleAnalyticsPageview({
  measurementId,
}: {
  measurementId: string;
}) {
  return (
    <Suspense>
      <GoogleAnalyticsPageviewClient measurementId={measurementId} />
    </Suspense>
  );
}

function GoogleAnalyticsPageviewClient({
  measurementId,
}: {
  measurementId: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastPageRef = useRef<string | null>(null);

  useEffect(() => {
    if (!measurementId) return;
    if (!pathname) return;

    const queryString = searchParams?.toString();
    const pagePath = queryString ? `${pathname}?${queryString}` : pathname;

    if (lastPageRef.current === pagePath) return;
    lastPageRef.current = pagePath;

    if (typeof window.gtag !== "function") return;

    window.gtag("event", "page_view", {
      page_location: window.location.href,
      page_path: pagePath,
      page_title: document.title,
    });
  }, [measurementId, pathname, searchParams]);

  return null;
}
