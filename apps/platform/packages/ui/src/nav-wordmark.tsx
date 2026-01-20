"use client";

import { cn } from "@leadswap/utils";
import * as Popover from "@radix-ui/react-popover";
import { BoxSelect, Home, LayoutGrid, Type } from "lucide-react";
import { useParams } from "next/navigation";
import { MouseEvent, useCallback, useContext, useState } from "react";
import { toast } from "sonner";
import { Button, ButtonProps } from "./button";
import { useCopyToClipboard } from "./hooks";
import { Logo } from "./logo";
import { NavContext } from "./nav";
import { Wordmark } from "./wordmark";

/**
 * The Cliqo logo with a custom context menu for copying/navigation,
 * for use in the top site nav
 */
export function NavWordmark({
  variant = "full",
  isInApp,
  className,
}: {
  variant?: "full" | "symbol";
  isInApp?: boolean;
  className?: string;
}) {
  const { domain = "cliqo.com" } = useParams() as { domain: string };

  const { theme } = useContext(NavContext);

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleContextMenu = useCallback((e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsPopoverOpen(true);
  }, []);

  const [, copyToClipboard] = useCopyToClipboard();

  async function copySvg(path: string) {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to fetch ${path}`);
    const text = await res.text();
    await copyToClipboard(text, { throwOnError: true });
  }

  function copy(path: string) {
    toast.promise(copySvg(path), {
      success: "Copied to clipboard!",
      error: "Failed to copy to clipboard",
    });
  }

  return (
    <Popover.Root open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <Popover.Anchor asChild>
        <div onContextMenu={handleContextMenu} className="max-w-fit">
          {variant === "full" ? (
            <Wordmark className={className} />
          ) : (
            <Logo
              className={cn(
                "h-8 w-8 transition-all duration-75 active:scale-95",
                className,
              )}
            />
          )}
        </div>
      </Popover.Anchor>
      <Popover.Portal>
        <Popover.Content
          sideOffset={14}
          align="start"
          className={cn(
            "z-50 -mt-1.5",
            !isInApp && "-translate-x-8",
            theme === "dark" && "dark",
          )}
          onClick={(e) => {
            e.stopPropagation();
            setIsPopoverOpen(false);
          }}
        >
          <div className="grid gap-1 rounded-lg border border-neutral-200 bg-white p-2 drop-shadow-sm sm:min-w-[240px] dark:border-white/[0.15] dark:bg-black">
            <ContextMenuButton
              text="Copy Logo as SVG"
              variant="outline"
              onClick={() => copy("/logo.svg")}
              icon={<Logo className="h-4 w-4" />}
            />
            <ContextMenuButton
              text="Copy Wordmark as SVG"
              variant="outline"
              onClick={() => copy("/logo.svg")}
              icon={<Type strokeWidth={2} className="h-4 w-4" />}
            />
            {/* If it's in the app or it's a domain placeholder page (not cliqo.com homepage), show the home button */}
            {isInApp || domain != "cliqo.com" ? (
              <ContextMenuButton
                text="Home Page"
                variant="outline"
                onClick={() =>
                  window.open(
                    `https://cliqo.com${isInApp ? "/home" : ""}`,
                    "_blank",
                  )
                }
                icon={<Home strokeWidth={2} className="h-4 w-4" />}
              />
            ) : (
              <ContextMenuButton
                text="Dashboard"
                variant="outline"
                onClick={() => window.open("https://app.cliqo.com", "_blank")}
                icon={<LayoutGrid strokeWidth={2} className="h-4 w-4" />}
              />
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

function ContextMenuButton({ className, ...rest }: ButtonProps) {
  return (
    <Button
      className={cn(
        "h-9 justify-start px-3 font-medium hover:text-neutral-700 dark:text-white/70 dark:hover:bg-white/[0.15] dark:hover:text-white",
        className,
      )}
      {...rest}
    />
  );
}
