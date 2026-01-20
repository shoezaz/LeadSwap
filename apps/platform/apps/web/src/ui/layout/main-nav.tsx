"use client";

import { useMediaQuery } from "@leadswap/ui";
import { cn } from "@leadswap/utils";
import { usePathname } from "next/navigation";
import {
  ComponentType,
  createContext,
  Dispatch,
  PropsWithChildren,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";

type SideNavContext = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export const SideNavContext = createContext<SideNavContext>({
  isOpen: false,
  setIsOpen: () => { },
});

export function MainNav({
  children,
  sidebar: Sidebar,
  toolContent,
  newsContent,
}: PropsWithChildren<{
  sidebar: ComponentType<{
    toolContent?: ReactNode;
    newsContent?: ReactNode;
    children?: ReactNode;
  }>;
  toolContent?: ReactNode;
  newsContent?: ReactNode;
}>) {
  const pathname = usePathname();

  const { isMobile } = useMediaQuery();
  const [isOpen, setIsOpen] = useState(false);

  // Prevent body scroll when side nav is open
  useEffect(() => {
    document.body.style.overflow = isOpen && isMobile ? "hidden" : "auto";
  }, [isOpen, isMobile]);

  // Close side nav when pathname changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-bg-muted">
      {/* Mobile backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 transition-[background-color,backdrop-filter] md:hidden",
          isOpen
            ? "bg-black/20 backdrop-blur-sm"
            : "pointer-events-none bg-transparent",
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile sidebar toggle area */}
      <div
        className={cn(
          "fixed left-0 top-0 z-50 h-full transition-transform md:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <SideNavContext.Provider value={{ isOpen, setIsOpen }}>
          <Sidebar toolContent={toolContent} newsContent={newsContent}>
            {children}
          </Sidebar>
        </SideNavContext.Provider>
      </div>

      {/* Desktop layout - Sidebar handles everything including the rounded container */}
      <div className="hidden md:block">
        <SideNavContext.Provider value={{ isOpen, setIsOpen }}>
          <Sidebar toolContent={toolContent} newsContent={newsContent}>
            {children}
          </Sidebar>
        </SideNavContext.Provider>
      </div>
    </div>
  );
}
