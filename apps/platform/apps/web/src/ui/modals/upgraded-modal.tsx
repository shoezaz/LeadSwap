import useWorkspace from "@/lib/swr/use-workspace";
import { useWorkspaceStore } from "@/lib/swr/use-workspace-store";
import { Button, Modal, useRouterStuff, useScrollProgress } from "@leadswap/ui";
import { CLIQO_PLANS, STARTUP_PLAN } from "@leadswap/utils";
import { usePlausible } from "next-plausible";
import { useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ModalHero } from "../shared/modal-hero";

function UpgradedModal({
  showUpgradedModal,
  setShowUpgradedModal,
}: {
  showUpgradedModal: boolean;
  setShowUpgradedModal: Dispatch<SetStateAction<boolean>>;
}) {
  const { queryParams } = useRouterStuff();
  const searchParams = useSearchParams();

  const [_, setDotLinkOfferDismissed, { mutateWorkspace }] =
    useWorkspaceStore<string>("dotLinkOfferDismissed");

  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollProgress, updateScrollProgress } = useScrollProgress(scrollRef);

  const planId = searchParams.get("plan");
  const plausible = usePlausible();

  // Find Cliqo plan by name or tier
  const currentPlan = planId
    ? CLIQO_PLANS.find(
      (p) => p.name.toLowerCase() === planId.replace("+", " ").toLowerCase() || p.tier === planId,
    )
    : undefined;

  const handlePlanUpgrade = async () => {
    if (currentPlan) {
      const period = searchParams.get("period") as "monthly" | "yearly";
      if (period) {
        plausible(`Upgraded to ${currentPlan.name}`);
        posthog.capture("plan_upgraded", {
          plan: currentPlan.name,
          period,
          revenue: currentPlan.price[period],
        });
      }
    }
  };

  useEffect(() => {
    handlePlanUpgrade();
  }, [searchParams, planId]);

  const plan = currentPlan ?? STARTUP_PLAN;

  if (!plan) return null;

  const onClose = async () => {
    queryParams({
      del: ["upgraded", "plan", "period"],
    });
    await setDotLinkOfferDismissed(new Date().toISOString());
    mutateWorkspace();
  };

  return (
    <Modal
      showModal={showUpgradedModal}
      setShowModal={setShowUpgradedModal}
      onClose={onClose}
    >
      <div className="flex flex-col">
        <ModalHero />
        <div className="px-6 py-8 sm:px-8">
          <div className="relative">
            <div
              ref={scrollRef}
              onScroll={updateScrollProgress}
              className="scrollbar-hide max-h-[calc(100vh-400px)] overflow-y-auto pb-6 text-left"
            >
              <h1 className="text-lg font-semibold text-neutral-900">
                Cliqo {plan?.name} looks good on you!
              </h1>
              <p className="mt-2 text-sm text-neutral-600">
                Thank you for upgrading to the {plan?.name} plan. You now have
                access to more powerful features and higher usage limits.
              </p>
            </div>
            {/* Bottom scroll fade */}
            <div
              className="pointer-events-none absolute bottom-0 left-0 hidden h-16 w-full bg-gradient-to-t from-white sm:block"
              style={{ opacity: 1 - Math.pow(scrollProgress, 2) }}
            ></div>
          </div>
          <Button
            type="button"
            variant="primary"
            text="Go to Dashboard"
            onClick={() => {
              onClose();
              setShowUpgradedModal(false);
            }}
          />
        </div>
      </div>
    </Modal>
  );
}

export function useUpgradedModal() {
  const [showUpgradedModal, setShowUpgradedModal] = useState(false);

  const UpgradedModalCallback = useCallback(() => {
    return (
      <UpgradedModal
        showUpgradedModal={showUpgradedModal}
        setShowUpgradedModal={setShowUpgradedModal}
      />
    );
  }, [showUpgradedModal, setShowUpgradedModal]);

  return useMemo(
    () => ({
      setShowUpgradedModal,
      UpgradedModal: UpgradedModalCallback,
    }),
    [setShowUpgradedModal, UpgradedModalCallback],
  );
}
