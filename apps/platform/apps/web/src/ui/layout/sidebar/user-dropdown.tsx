"use client";

import usePartnerProfile from "@/lib/swr/use-partner-profile";
import {
  ArrowsOppositeDirectionX,
  Avatar,
  Gift,
  Icon,
  Popover,
  useCurrentSubdomain,
  User,
} from "@leadswap/ui";
import { APP_DOMAIN, cn, PARTNERS_DOMAIN } from "@leadswap/utils";
import { LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import {
  ComponentPropsWithoutRef,
  ElementType,
  useMemo,
  useState,
} from "react";

export function UserDropdown() {
  const { data: session } = useSession();
  const { partner } = usePartnerProfile();
  const [openPopover, setOpenPopover] = useState(false);
  const { subdomain } = useCurrentSubdomain();

  const menuOptions = useMemo(() => {
    const options: Array<{
      label: string;
      icon: any;
      href?: string;
      type?: string;
      onClick?: () => void;
    }> = [
        {
          label: "Account settings",
          icon: User,
          href: "/account/settings",
          onClick: () => setOpenPopover(false),
        },
      ];

    // Add subdomain-specific options
    if (subdomain === "partners") {
      options.push({
        label: "Switch to workspace",
        icon: ArrowsOppositeDirectionX,
        href: APP_DOMAIN,
      });
    }

    if (subdomain === "app") {
      if (partner) {
        options.push({
          label: "Switch to partner account",
          icon: ArrowsOppositeDirectionX,
          href: PARTNERS_DOMAIN,
        });
      }
    }

    // Add logout option
    options.push({
      type: "button",
      label: "Log out",
      icon: LogOut,
      onClick: () =>
        signOut({
          callbackUrl: "/login",
        }),
    });

    return options;
  }, [subdomain, partner, setOpenPopover]);

  return (
    <Popover
      content={
        <div className="flex w-full flex-col space-y-px rounded-md bg-bg-default p-2 sm:min-w-56">
          {session?.user ? (
            <div className="p-2">
              <p className="truncate text-sm font-medium text-content-emphasis">
                {session.user.name || session.user.email?.split("@")[0]}
              </p>
              <p className="truncate text-sm text-content-subtle">
                {session.user.email}
              </p>
            </div>
          ) : (
            <div className="grid gap-2 px-2 py-3">
              <div className="h-3 w-12 animate-pulse rounded-full bg-bg-subtle" />
              <div className="h-3 w-20 animate-pulse rounded-full bg-bg-subtle" />
            </div>
          )}
          {menuOptions.map((menuOption, idx) => (
            <UserOption
              key={idx}
              as={menuOption.href ? Link : "button"}
              {...menuOption}
            />
          ))}
        </div>
      }
      align="start"
      openPopover={openPopover}
      setOpenPopover={setOpenPopover}
    >
      <button
        onClick={() => setOpenPopover(!openPopover)}
        className={cn(
          "group relative flex size-11 items-center justify-center rounded-lg transition-all",
          "hover:bg-bg-inverted/5 active:bg-bg-inverted/10 data-[state=open]:bg-bg-inverted/10 transition-colors duration-150",
          "outline-none focus-visible:ring-2 focus-visible:ring-black/50 dark:focus-visible:ring-white/50",
        )}
      >
        {session?.user ? (
          <Avatar
            user={session.user}
            className="size-7 border-none duration-75 sm:size-7"
          />
        ) : (
          <div className="size-7 animate-pulse rounded-full bg-bg-subtle" />
        )}
      </button>
    </Popover>
  );
}

type UserOptionProps<T extends ElementType> = {
  as?: T;
  label: string;
  icon: Icon;
};

function UserOption<T extends ElementType = "button">({
  as,
  label,
  icon: Icon,
  children,
  ...rest
}: UserOptionProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof UserOptionProps<T>>) {
  const Component = as ?? "button";

  return (
    <Component
      className="flex items-center gap-x-4 rounded-md px-2.5 py-1.5 text-sm transition-all duration-75 hover:bg-bg-subtle active:bg-bg-emphasis"
      {...rest}
    >
      <Icon className="size-4 text-content-subtle" />
      <span className="block truncate text-content-default">{label}</span>
      {children}
    </Component>
  );
}
