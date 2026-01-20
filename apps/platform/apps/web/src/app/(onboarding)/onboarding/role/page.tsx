import { constructMetadata } from "@leadswap/utils";
import RoleSelectionClient from "./page-client";
import { Wordmark } from "@leadswap/ui";

export const metadata = constructMetadata({
    title: "Choose your role - Cliqo",
});

export default function RoleSelectionPage() {
    return (
        <>
            <div className="relative flex min-h-screen flex-col items-center justify-center bg-white">
                <div className="flex w-full max-w-4xl flex-col items-center px-4 py-16 text-center">
                    <div className="animate-slide-up-fade relative flex w-auto items-center justify-center px-6 py-2 [--offset:20px] [animation-duration:1.3s] [animation-fill-mode:both]">
                        <Wordmark className="relative h-12" />
                    </div>
                    <div className="animate-slide-up-fade mt-10 w-full [--offset:10px] [animation-delay:250ms] [animation-duration:1s] [animation-fill-mode:both]">
                        <RoleSelectionClient />
                    </div>
                </div>
            </div>
        </>
    );
}
