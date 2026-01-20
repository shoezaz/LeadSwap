import { StepPage } from "../step-page";
import { EnterpriseLink } from "./enterprise-link";
import { PlanSelector } from "./plan-selector";

export default function Plan() {
  return (
    <StepPage
      title="Choose your plan"
      description="Start with a 14-day free trial, or select a paid plan to get started."
      className="max-w-screen-lg"
    >
      <PlanSelector />
      <div className="mx-auto mt-8 flex w-fit flex-col items-center justify-center gap-6 text-sm md:flex-row">
        <EnterpriseLink />
        <a
          href="https://cliqo.com/pricing"
          target="_blank"
          className="flex items-center text-neutral-500 underline-offset-4 transition-colors hover:text-neutral-800 hover:underline"
        >
          Compare all plans ↗
        </a>
      </div>
    </StepPage>
  );
}
