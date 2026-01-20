import { Wordmark } from "@leadswap/ui";
import Link from "next/link";
import { NextButton } from "../next-button";
import TrackSignup from "./track-signup";

export default function Welcome() {
  return (
    <>
      <TrackSignup />
      <div className="flex min-h-screen w-full bg-[#111111]">
        {/* Left Empty Dark Area - Hidden on mobile */}
        <div className="hidden lg:block lg:w-[60%]" />

        {/* Right Panel with Content - Full width on mobile */}
        <div className="flex min-h-screen w-full p-2 lg:w-[40%]">
          <div className="relative flex min-h-full w-full flex-col overflow-hidden rounded-lg bg-white">
            {/* Header with Logo */}
            <div className="px-8 pt-6">
              <Link href="https://cliqo.com/home" target="_blank" className="block">
                <Wordmark className="h-8" />
              </Link>
            </div>

            {/* Content Area */}
            <div className="flex flex-1 flex-col items-center justify-center px-8 py-16">
              <div className="flex max-w-sm flex-col items-center text-center">
                <Wordmark className="h-20 animate-slide-up-fade [--offset:20px] [animation-duration:1.3s] [animation-fill-mode:both]" />
                <h1 className="mt-10 animate-slide-up-fade text-xl font-semibold text-neutral-900 [--offset:10px] [animation-delay:250ms] [animation-duration:1s] [animation-fill-mode:both]">
                  Welcome to Cliqo
                </h1>
                <p className="mt-2 animate-slide-up-fade text-balance text-base text-neutral-500 [--offset:10px] [animation-delay:500ms] [animation-duration:1s] [animation-fill-mode:both]">
                  The UGC creator marketplace. Connect with creators and pay for
                  real views on your content.
                </p>
                <div className="mt-8 w-full animate-slide-up-fade [--offset:10px] [animation-delay:750ms] [animation-duration:1s] [animation-fill-mode:both]">
                  <NextButton text="Get started" step="workspace" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
