"use client";

import { mutatePrefix } from "@/lib/swr/mutate";
import useWorkspace from "@/lib/swr/use-workspace";
import useWorkspaces from "@/lib/swr/use-workspaces";
import { SimpleLinkProps } from "@/lib/types";
import { useAcceptInviteModal } from "@/ui/modals/accept-invite-modal";
import { useAddWorkspaceModal } from "@/ui/modals/add-workspace-modal";
import { useCookies } from "@leadswap/ui";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  Suspense,
  createContext,
  useEffect,
  useMemo,
} from "react";
import { toast } from "sonner";
import { useAddEditTagModal } from "./add-edit-tag-modal";
import { useImportFirstPromoterModal } from "./import-firstpromoter-modal";
import { useImportPartnerStackModal } from "./import-partnerstack-modal";
import { useImportRewardfulModal } from "./import-rewardful-modal";
import { useImportToltModal } from "./import-tolt-modal";
import { useProgramWelcomeModal } from "./program-welcome-modal";
import { useUpgradedModal } from "./upgraded-modal";
import { useWelcomeModal } from "./welcome-modal";

export const ModalContext = createContext<{
  setShowAddWorkspaceModal: Dispatch<SetStateAction<boolean>>;
  setShowAddEditTagModal: Dispatch<SetStateAction<boolean>>;
  setShowImportPartnerStackModal: Dispatch<SetStateAction<boolean>>;
  setShowImportRewardfulModal: Dispatch<SetStateAction<boolean>>;
  setShowImportToltModal: Dispatch<SetStateAction<boolean>>;
}>({
  setShowAddWorkspaceModal: () => { },
  setShowAddEditTagModal: () => { },
  setShowImportPartnerStackModal: () => { },
  setShowImportRewardfulModal: () => { },
  setShowImportToltModal: () => { },
});

export function ModalProvider({ children }: { children: ReactNode }) {
  return (
    <Suspense>
      <ModalProviderClient>{children}</ModalProviderClient>
    </Suspense>
  );
}

function ModalProviderClient({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();

  const { AddWorkspaceModal, setShowAddWorkspaceModal } =
    useAddWorkspaceModal();
  const { AcceptInviteModal, setShowAcceptInviteModal } =
    useAcceptInviteModal();
  const { setShowAddEditTagModal, AddEditTagModal } = useAddEditTagModal();
  const { setShowWelcomeModal, WelcomeModal } = useWelcomeModal();
  const { setShowUpgradedModal, UpgradedModal } = useUpgradedModal();
  const { setShowProgramWelcomeModal, ProgramWelcomeModal } =
    useProgramWelcomeModal();
  const { setShowImportPartnerStackModal, ImportPartnerStackModal } =
    useImportPartnerStackModal();
  const { setShowImportRewardfulModal, ImportRewardfulModal } =
    useImportRewardfulModal();
  const { setShowImportToltModal, ImportToltModal } = useImportToltModal();

  useEffect(() => {
    setShowProgramWelcomeModal(searchParams.has("onboarded-program"));
    setShowWelcomeModal(searchParams.has("onboarded"));

    if (searchParams.has("upgraded")) {
      setShowUpgradedModal(true);
    }
  }, [searchParams]);

  const [hashes, setHashes] = useCookies<SimpleLinkProps[]>("hashes__dub", [], {
    domain: !!process.env.NEXT_PUBLIC_VERCEL_URL ? ".cliqo.com" : undefined,
  });

  const { id: workspaceId, error } = useWorkspace();
  useEffect(() => {
    if (hashes.length > 0 && workspaceId) {
      toast.promise(
        fetch(`/api/links/sync?workspaceId=${workspaceId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(hashes),
        }).then(async (res) => {
          if (res.status === 200) {
            await mutatePrefix("/api/links");
            setHashes([]);
          }
        }),
        {
          loading: "Importing links...",
          success: "Links imported successfully!",
          error: "Something went wrong while importing links.",
        },
      );
    }
  }, [hashes, workspaceId]);

  // handle invite and oauth modals
  useEffect(() => {
    if (error && (error.status === 409 || error.status === 410)) {
      setShowAcceptInviteModal(true);
    }
  }, [error]);

  // handle ?newWorkspace query param
  useEffect(() => {
    if (searchParams.has("newWorkspace")) {
      setShowAddWorkspaceModal(true);
    }
  }, []);

  const { data: session, update } = useSession();
  const { workspaces } = useWorkspaces();

  // if user has workspaces but no defaultWorkspace, refresh to get defaultWorkspace
  useEffect(() => {
    if (
      workspaces &&
      workspaces.length > 0 &&
      session?.user &&
      !session.user["defaultWorkspace"]
    ) {
      fetch("/api/user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          defaultWorkspace: workspaces[0].slug,
        }),
      }).then(() => update());
    }
  }, [session]);

  return (
    <ModalContext.Provider
      value={{
        setShowAddWorkspaceModal,
        setShowAddEditTagModal,
        setShowImportPartnerStackModal,
        setShowImportRewardfulModal,
        setShowImportToltModal,
      }}
    >
      <AddWorkspaceModal />
      <AcceptInviteModal />
      <AddEditTagModal />
      <ImportPartnerStackModal />
      <ImportRewardfulModal />
      <ImportToltModal />
      <WelcomeModal />
      <UpgradedModal />
      <ProgramWelcomeModal />
      {children}
    </ModalContext.Provider>
  );
}
