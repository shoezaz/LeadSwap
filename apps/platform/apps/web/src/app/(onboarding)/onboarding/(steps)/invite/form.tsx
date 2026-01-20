"use client";

import { InviteTeammatesForm } from "@/ui/workspaces/invite-teammates-form";
import { LaterButton } from "../../later-button";
import { useOnboardingProgress } from "../../use-onboarding-progress";

export function Form() {
  const { finish } = useOnboardingProgress();

  return (
    <div>
      <InviteTeammatesForm
        onSuccess={() => {
          finish();
        }}
      />
      <LaterButton next="finish" className="mt-4" />
    </div>
  );
}
