import { MaxWidthWrapper } from "@leadswap/ui";
import { cn } from "@leadswap/utils";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { PropsWithChildren, ReactNode } from "react";
import { HelpButton } from "../sidebar/help-button";
import { UserDropdown } from "../sidebar/user-dropdown";
import { NavButton } from "./nav-button";

/**
 * @deprecated Use PageContent instead
 */
export function PageContentOld({
  title,
  titleBackButtonLink,
  titleControls,
  description,
  showControls,
  className,
  contentWrapperClassName,
  children,
}: PropsWithChildren<{
  title?: ReactNode;
  titleBackButtonLink?: string;
  titleControls?: ReactNode;
  description?: ReactNode;
  showControls?: boolean;
  className?: string;
  contentWrapperClassName?: string;
}>) {
  const hasTitle = title !== undefined;
  const hasDescription = description !== undefined;

  return (
    <div
      className={cn(
        "mt-3 bg-bg-subtle md:bg-bg-default",
        (hasTitle || hasDescription) && "md:mt-6 md:py-3",
        className,
      )}
    >
      <MaxWidthWrapper>
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <NavButton />
            {(hasTitle || hasDescription) && (
              <div>
                {hasTitle && (
                  <div className="flex items-center gap-2">
                    {titleBackButtonLink && (
                      <Link
                        href={titleBackButtonLink}
                        className="rounded-lg p-1.5 text-content-subtle transition-colors hover:bg-bg-subtle hover:text-content-emphasis"
                      >
                        <ChevronLeft className="size-5" />
                      </Link>
                    )}
                    <h1 className="text-xl font-semibold leading-7 text-content-emphasis md:text-2xl">
                      {title}
                    </h1>
                  </div>
                )}
                {hasDescription && (
                  <p className="mt-1 hidden text-base text-content-subtle md:block">
                    {description}
                  </p>
                )}
              </div>
            )}
          </div>
          {titleControls && (
            <div className="hidden md:block">{titleControls}</div>
          )}
          {showControls && (
            <div className="flex items-center gap-4 md:hidden">
              <HelpButton />
              <UserDropdown />
            </div>
          )}
        </div>
      </MaxWidthWrapper>
      <div
        className={cn(
          "bg-bg-default pt-2.5 max-md:mt-3 max-md:rounded-t-[16px]",
          contentWrapperClassName,
        )}
      >
        {hasDescription && (
          <MaxWidthWrapper>
            <p className="mb-3 mt-1 text-base text-content-subtle md:hidden">
              {description}
            </p>
          </MaxWidthWrapper>
        )}
        {children}
      </div>
    </div>
  );
}
