import { cn } from "@leadswap/utils";
import { PropsWithChildren } from "react";
import {
  PageContentHeader,
  PageContentHeaderProps,
} from "./page-content-header";

export * from "./page-content-old";

export function PageContent({
  className,
  contentWrapperClassName,
  children,
  ...headerProps
}: PropsWithChildren<
  {
    className?: string;
    contentWrapperClassName?: string;
  } & PageContentHeaderProps
>) {
  return (
    <div
      className={cn(
        "rounded-t-[inherit] bg-bg-subtle md:bg-bg-default",
        className,
      )}
    >
      <PageContentHeader {...headerProps} />
      <div
        className={cn(
          "rounded-t-[inherit] bg-bg-default pt-3 lg:pt-6",
          contentWrapperClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}
