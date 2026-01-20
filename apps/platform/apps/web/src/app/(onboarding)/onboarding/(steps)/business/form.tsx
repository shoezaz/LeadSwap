"use client";

import { OnboardingWizard } from "@/ui/onboarding/onboarding-wizard";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function BusinessScanForm() {
  const router = useRouter();

  const handleComplete = async (data: {
    websiteUrl: string;
    workspaceName: string;
    scanResult: any;
    competitors: string[];
    socialAccounts: Record<string, string>;
  }) => {
    try {
      // Use workspace name from wizard or extract from URL
      const url = new URL(data.websiteUrl);
      const domain = url.hostname.replace("www.", "");
      const workspaceName = data.workspaceName || domain.split(".")[0];
      const slug = workspaceName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

      // Step 1: Create workspace with user-provided name and logo from scan
      const logoUrl = data.scanResult?.website?.favicon;
      
      const workspaceResponse = await fetch("/api/workspaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: workspaceName,
          slug: slug,
          logo: logoUrl || undefined,
        }),
      });

      if (!workspaceResponse.ok) {
        const error = await workspaceResponse.json();
        throw new Error(error.message || "Failed to create workspace");
      }

      const workspace = await workspaceResponse.json();

      // Step 2: Update workspace with scan data, business info, and program onboarding data
      try {
        await fetch(`/api/workspaces/${workspace.slug}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            website: data.websiteUrl,
            industry: data.scanResult?.website?.industry || "Unknown",
            businessDescription: data.scanResult?.website?.description || "",
            store: {
              scanResult: data.scanResult,
              competitors: data.competitors,
              onboardingCompleted: true,
              // Program onboarding data for createProgram function
              programOnboarding: {
                name: `${workspaceName} Creators`,
                domain: domain,
                url: data.websiteUrl,
                paymentModel: "FIXED",
                rewardAmount: 50,
                lastCompletedStep: "create-program",
              },
            },
          }),
        });
      } catch (storeError) {
        console.warn("Could not save scan data:", storeError);
      }

      // Step 3: Auto-create default program (pass data directly to avoid race conditions)
      try {
        const programResponse = await fetch(`/api/programs?workspaceId=${workspace.id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            // Pass program data directly instead of relying on store
            name: `${workspaceName} Creators`,
            slug: `${slug}-creators`,
            domain: domain,
            url: data.websiteUrl,
            paymentModel: "FIXED",
            rewardAmount: 50,
          }),
        });
        if (!programResponse.ok) {
          const err = await programResponse.json();
          console.warn("Program creation failed:", err);
        } else {
          // Clear programOnboarding from store after successful creation
          await fetch(`/api/workspaces/${workspace.slug}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              store: {
                onboardingCompleted: true,
                // Remove programOnboarding by not including it
              },
            }),
          });
        }
      } catch (programError) {
        console.warn("Could not auto-create program:", programError);
      }

      // Store scan results in localStorage as backup
      localStorage.setItem("onboarding_scan_result", JSON.stringify({
        ...data,
        workspaceSlug: workspace.slug,
      }));

      // Redirect to plan selection page
      router.push(`/${workspace.slug}/plan`);
    } catch (error) {
      console.error("Error during onboarding:", error);
      toast.error(error instanceof Error ? error.message : "Failed to complete setup");
    }
  };

  return (
    <div className="flex h-full w-full flex-col">
      <OnboardingWizard onComplete={handleComplete} />
    </div>
  );
}
