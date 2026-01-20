"use client";

import { createPartnerAccount } from "@/lib/actions/partners/create-partner-account";
import { LoadingSpinner, useRouterStuff } from "@leadswap/ui";
import { Building2, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function RoleSelectionClient() {
    const router = useRouter();
    const { queryParams } = useRouterStuff();
    const [loading, setLoading] = useState<"brand" | "creator" | null>(null);

    const handleBrandSelect = async () => {
        setLoading("brand");
        // Redirect to business onboarding (new flow)
        router.push("/onboarding/business");
    };

    const handleCreatorSelect = async () => {
        setLoading("creator");
        try {
            // PROPOSE: Create partner account
            const { redirectUrl } = await createPartnerAccount();
            if (redirectUrl) {
                window.location.href = redirectUrl;
            } else {
                toast.error("Failed to redirect to dashboard");
                setLoading(null);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to create creator account");
            setLoading(null);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-6"
        >
            <div className="text-center">
                <h1 className="bg-gradient-to-r from-gray-600 to-gray-900 bg-clip-text text-2xl font-bold text-transparent md:text-3xl">
                    Getting started with Cliqo
                </h1>
                <p className="mt-2 text-gray-500">
                    How do you plan to use the platform?
                </p>
            </div>

            <div className="grid w-full gap-4 sm:grid-cols-2">
                <button
                    onClick={handleBrandSelect}
                    disabled={loading !== null}
                    className="group relative flex flex-col items-center justify-center gap-4 rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm transition-all hover:border-gray-300 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100">
                        {loading === "brand" ? (
                            <LoadingSpinner className="h-6 w-6" />
                        ) : (
                            <Building2 className="h-6 w-6" />
                        )}
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">I'm a Brand</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            I want to create campaigns and hire creators.
                        </p>
                    </div>
                </button>

                <button
                    onClick={handleCreatorSelect}
                    disabled={loading !== null}
                    className="group relative flex flex-col items-center justify-center gap-4 rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm transition-all hover:border-gray-300 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-50 text-violet-600 transition-colors group-hover:bg-violet-100">
                        {loading === "creator" ? (
                            <LoadingSpinner className="h-6 w-6" />
                        ) : (
                            <User className="h-6 w-6" />
                        )}
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">I'm a Creator</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            I want to find campaigns and monetize my content.
                        </p>
                    </div>
                </button>
            </div>
        </motion.div>
    );
}
