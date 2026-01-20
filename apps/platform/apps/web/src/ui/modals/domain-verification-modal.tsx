"use client";

import { Button, Modal } from "@leadswap/ui";
import { Dispatch, SetStateAction, useCallback, useMemo, useState } from "react";

// Stub modal for domain verification - domain registration feature removed
function DomainVerificationModalComponent({
    showDomainVerificationModal,
    setShowDomainVerificationModal,
    domain,
    txtRecord,
}: {
    showDomainVerificationModal: boolean;
    setShowDomainVerificationModal: Dispatch<SetStateAction<boolean>>;
    domain: string;
    txtRecord: string;
}) {
    return (
        <Modal
            showModal={showDomainVerificationModal}
            setShowModal={setShowDomainVerificationModal}
        >
            <div className="p-6">
                <h2 className="text-lg font-semibold text-neutral-900">
                    Domain Verification
                </h2>
                <p className="mt-2 text-sm text-neutral-600">
                    Domain verification is currently not available.
                </p>
                <div className="mt-4">
                    <Button
                        text="Close"
                        variant="secondary"
                        onClick={() => setShowDomainVerificationModal(false)}
                    />
                </div>
            </div>
        </Modal>
    );
}

export function DomainVerificationModal(props: {
    showDomainVerificationModal: boolean;
    setShowDomainVerificationModal: Dispatch<SetStateAction<boolean>> | (() => void);
    domain: string;
    txtRecord: string;
}) {
    return <DomainVerificationModalComponent {...props} setShowDomainVerificationModal={props.setShowDomainVerificationModal as Dispatch<SetStateAction<boolean>>} />;
}

export function useDomainVerificationModal() {
    const [showDomainVerificationModal, setShowDomainVerificationModal] =
        useState(false);

    const DomainVerificationModalCallback = useCallback(() => {
        return (
            <DomainVerificationModalComponent
                showDomainVerificationModal={showDomainVerificationModal}
                setShowDomainVerificationModal={setShowDomainVerificationModal}
                domain=""
                txtRecord=""
            />
        );
    }, [showDomainVerificationModal]);

    return useMemo(
        () => ({
            setShowDomainVerificationModal,
            DomainVerificationModal: DomainVerificationModalCallback,
        }),
        [setShowDomainVerificationModal, DomainVerificationModalCallback],
    );
}
