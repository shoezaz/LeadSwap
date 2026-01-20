import { ClientOnly } from "@leadswap/ui";
import { PropsWithChildren, Suspense } from "react";

export const AuthLayout = ({
  showTerms,
  children,
}: PropsWithChildren<{ showTerms?: "app" | "partners" }>) => {
  return (
    <div className="flex min-h-screen w-full bg-[#111111]">
      {/* Left Empty Dark Area - Hidden on mobile */}
      <div className="hidden lg:block lg:w-[60%]" />

      {/* Right Panel with Form - Full width on mobile */}
      <div className="flex min-h-screen w-full p-2 lg:w-[40%]">
        <div className="relative flex min-h-full w-full flex-col overflow-hidden rounded-lg bg-white">
          {/* Form Content Area */}
          <div className="flex flex-1 flex-col items-center justify-center px-8 py-16">
            <ClientOnly fallback={null} className="flex w-full flex-col items-center">
              <Suspense>{children}</Suspense>
            </ClientOnly>
          </div>

          {/* Terms Footer */}
          {showTerms && (
            <div className="px-8 pb-8">
              <p className="text-center text-xs font-medium text-neutral-400">
                By continuing, you agree to Cliqo&rsquo;s{" "}
                <a
                  href={`https://cliqo.com/legal/${showTerms === "app" ? "terms" : "partners"}`}
                  target="_blank"
                  className="font-semibold text-neutral-500 hover:text-neutral-700"
                >
                  {showTerms === "app" ? "Terms of Service" : "Creator Terms"}
                </a>{" "}
                and{" "}
                <a
                  href="https://cliqo.com/legal/privacy"
                  target="_blank"
                  className="font-semibold text-neutral-500 hover:text-neutral-700"
                >
                  Privacy Policy
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
