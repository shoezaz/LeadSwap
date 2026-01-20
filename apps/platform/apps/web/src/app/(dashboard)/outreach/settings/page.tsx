import { Suspense } from "react";
import { EmailSettingsClient } from "./page-client";

export default function EmailSettingsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <EmailSettingsClient />
    </Suspense>
  );
}


