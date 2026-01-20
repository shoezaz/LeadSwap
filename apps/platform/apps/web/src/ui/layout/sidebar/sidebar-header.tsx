"use client";

import useWorkspaces from "@/lib/swr/use-workspaces";
import { PlanProps, WorkspaceProps } from "@/lib/types";
import { ModalContext } from "@/ui/modals/modal-provider";
import {
  BlurImage,
  Popover,
  useScrollProgress,
} from "@leadswap/ui";
import { Check2, Gear, Plus, UserPlus } from "@leadswap/ui/icons";
import { cn } from "@leadswap/utils";
import { isLegacyBusinessPlan } from "@leadswap/utils/src/constants/pricing";
import { ChevronDown } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export function SidebarHeader() {
  const { workspaces } = useWorkspaces();
  const { data: session, status } = useSession();
  const { slug: currentSlug } = useParams() as { slug?: string };
  const { setShowAddWorkspaceModal } = useContext(ModalContext);

  // Prevent slug from changing to empty to avoid UI switching during nav animation
  const [slug, setSlug] = useState(currentSlug);
  useEffect(() => {
    if (currentSlug) setSlug(currentSlug);
  }, [currentSlug]);

  const selected = useMemo(() => {
    const selectedWorkspace = workspaces?.find(
      (workspace) => workspace.slug === slug,
    );

    if (slug && workspaces && selectedWorkspace) {
      return {
        ...selectedWorkspace,
        plan: isLegacyBusinessPlan({
          plan: selectedWorkspace.plan,
          payoutsLimit: selectedWorkspace.payoutsLimit,
        })
          ? "business (legacy)"
          : selectedWorkspace.plan,
        image:
          selectedWorkspace.logo ||
          `https://avatar.vercel.sh/${selectedWorkspace.id}`,
      };
    } else {
      return {
        name: session?.user?.name || session?.user?.email || "User",
        slug: "/",
        image: session?.user?.image || `https://avatar.vercel.sh/user`,
        plan: "free",
      };
    }
  }, [slug, workspaces, session]) as {
    id?: string;
    name: string;
    slug: string;
    image: string;
    plan: PlanProps;
  };

  const [openPopover, setOpenPopover] = useState(false);

  if (!workspaces || status === "loading") {
    return <SidebarHeaderPlaceholder />;
  }

  return (
    <div className="flex h-12 shrink-0 items-center justify-between border-b border-black/[0.08] px-3 dark:border-white/10">
      {/* Workspace Selector */}
      <Popover
        content={
          <WorkspaceList
            selected={selected}
            workspaces={workspaces}
            setOpenPopover={setOpenPopover}
          />
        }
        side="bottom"
        align="start"
        openPopover={openPopover}
        setOpenPopover={setOpenPopover}
      >
        <button
          onClick={() => setOpenPopover(!openPopover)}
          className={cn(
            "flex h-[38px] max-w-[160px] items-center gap-2 rounded-xl px-2 transition-colors",
            "hover:bg-bg-inverted/5 active:bg-bg-inverted/10 data-[state=open]:bg-bg-inverted/10",
            "outline-none focus-visible:ring-2 focus-visible:ring-black/50",
          )}
        >
          <BlurImage
            src={selected.image}
            referrerPolicy="no-referrer"
            width={24}
            height={24}
            alt={selected.id || selected.name}
            className="size-6 shrink-0 overflow-hidden rounded-full"
            draggable={false}
          />
          <span className="truncate text-[15px] font-semibold text-content-emphasis">
            {selected.name}
          </span>
          <ChevronDown className="size-3 shrink-0 text-content-muted" />
        </button>
      </Popover>

      {/* Create Workspace Button */}
      <button
        onClick={() => setShowAddWorkspaceModal(true)}
        className={cn(
          "flex size-6 items-center justify-center rounded-lg bg-neutral-900 transition-colors dark:bg-white",
          "hover:bg-neutral-800 active:bg-neutral-700 dark:hover:bg-neutral-100 dark:active:bg-neutral-200",
          "outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/50 dark:focus-visible:ring-white/50",
        )}
      >
        <Plus className="size-3 text-white dark:text-neutral-900" />
      </button>
    </div>
  );
}

function SidebarHeaderPlaceholder() {
  return (
    <div className="flex h-12 shrink-0 items-center justify-between border-b border-black/[0.08] px-3 dark:border-white/10">
      <div className="flex h-[38px] animate-pulse items-center gap-2 rounded-xl bg-neutral-200 px-2 dark:bg-neutral-700">
        <div className="size-6 rounded-full bg-neutral-300 dark:bg-neutral-600" />
        <div className="h-4 w-20 rounded bg-neutral-300 dark:bg-neutral-600" />
      </div>
      <div className="size-6 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-700" />
    </div>
  );
}

function WorkspaceList({
  selected,
  workspaces,
  setOpenPopover,
}: {
  selected: {
    name: string;
    slug: string;
    image: string;
    plan: PlanProps;
  };
  workspaces: WorkspaceProps[];
  setOpenPopover: (open: boolean) => void;
}) {
  const { setShowAddWorkspaceModal } = useContext(ModalContext);
  const { link } = useParams() as { link: string | string[] };
  const pathname = usePathname();

  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollProgress, updateScrollProgress } = useScrollProgress(scrollRef);

  const href = useCallback(
    (slug: string) => {
      if (link) {
        return `/${slug}/campaigns`;
      } else {
        return pathname.replace(selected.slug, slug).split("?")[0] || "/";
      }
    },
    [link, pathname, selected.slug],
  );

  return (
    <div className="relative w-full">
      <div
        ref={scrollRef}
        onScroll={updateScrollProgress}
        className="relative max-h-80 w-full space-y-0.5 overflow-auto rounded-lg bg-white text-base dark:bg-neutral-900 sm:w-64 sm:text-sm"
      >
        {/* Current workspace section */}
        <div className="border-b border-neutral-200 p-2 dark:border-neutral-700">
          <div className="flex items-center gap-x-2.5 rounded-md p-2">
            <BlurImage
              src={selected.image}
              width={28}
              height={28}
              alt={selected.name}
              className="size-8 shrink-0 overflow-hidden rounded-full"
              draggable={false}
            />
            <div className="min-w-0">
              <div className="truncate text-sm font-medium leading-5 text-neutral-900 dark:text-neutral-100">
                {selected.name}
              </div>
              {selected.slug !== "/" && (
                <div
                  className={cn(
                    "truncate text-xs capitalize leading-tight",
                    getPlanColor(selected.plan),
                  )}
                >
                  {selected.plan}
                </div>
              )}
            </div>
          </div>

          {/* Settings and Invite members options */}
          <div className="mt-2 flex flex-col gap-0.5">
            <Link
              href={`/${selected.slug}/settings`}
              className="flex w-full items-center gap-x-2 rounded-md px-2 py-1.5 text-neutral-700 outline-none transition-all duration-75 hover:bg-neutral-200/50 focus-visible:ring-2 focus-visible:ring-black/50 active:bg-neutral-200/80 dark:text-neutral-300 dark:hover:bg-neutral-700/50 dark:active:bg-neutral-700/80"
              onClick={() => setOpenPopover(false)}
            >
              <Gear className="size-4 text-neutral-500 dark:text-neutral-400" />
              <span className="block truncate text-sm">Settings</span>
            </Link>
            <Link
              href={`/${selected.slug}/settings/people`}
              className="flex w-full items-center gap-x-2 rounded-md px-2 py-1.5 text-neutral-700 outline-none transition-all duration-75 hover:bg-neutral-200/50 focus-visible:ring-2 focus-visible:ring-black/50 active:bg-neutral-200/80 dark:text-neutral-300 dark:hover:bg-neutral-700/50 dark:active:bg-neutral-700/80"
              onClick={() => setOpenPopover(false)}
            >
              <UserPlus className="size-4 text-neutral-500 dark:text-neutral-400" />
              <span className="block truncate text-sm">Invite members</span>
            </Link>
          </div>
        </div>

        {/* Workspaces section */}
        <div className="p-2">
          <p className="p-1 text-xs font-medium text-neutral-500 dark:text-neutral-400">
            Workspaces
          </p>
          <div className="flex flex-col gap-0.5">
            {workspaces.map(({ id, name, slug, logo }) => {
              const isActive = selected.slug === slug;
              return (
                <Link
                  key={slug}
                  className={cn(
                    "relative flex w-full items-center gap-x-2 rounded-md px-2 py-1.5 transition-all duration-75",
                    "hover:bg-neutral-200/50 active:bg-neutral-200/80 dark:hover:bg-neutral-700/50 dark:active:bg-neutral-700/80",
                    "outline-none focus-visible:ring-2 focus-visible:ring-black/50",
                    isActive && "bg-neutral-200/50 dark:bg-neutral-700/50",
                  )}
                  href={href(slug)}
                  shallow={false}
                  onClick={() => setOpenPopover(false)}
                >
                  <BlurImage
                    src={logo || `https://avatar.vercel.sh/${id}`}
                    width={28}
                    height={28}
                    alt={id}
                    className="size-6 shrink-0 overflow-hidden rounded-full"
                    draggable={false}
                  />
                  <span className="block truncate text-sm leading-5 text-neutral-900 dark:text-neutral-100 sm:max-w-[140px]">
                    {name}
                  </span>
                  {selected.slug === slug ? (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-black dark:text-white">
                      <Check2 className="size-4" aria-hidden="true" />
                    </span>
                  ) : null}
                </Link>
              );
            })}
            <button
              key="add"
              onClick={() => {
                setOpenPopover(false);
                setShowAddWorkspaceModal(true);
              }}
              className="group flex w-full cursor-pointer items-center gap-x-2 rounded-md p-2 text-neutral-700 transition-all duration-75 hover:bg-neutral-200/50 active:bg-neutral-200/80 dark:text-neutral-300 dark:hover:bg-neutral-700/50 dark:active:bg-neutral-700/80"
            >
              <Plus className="ml-1.5 size-4 text-neutral-500 dark:text-neutral-400" />
              <span className="block truncate">Create new workspace</span>
            </button>
          </div>
        </div>
      </div>
      {/* Bottom scroll fade */}
      <div
        className="pointer-events-none absolute -bottom-px left-0 h-16 w-full rounded-b-lg bg-gradient-to-t from-white dark:from-neutral-900 sm:bottom-0"
        style={{ opacity: 1 - Math.pow(scrollProgress, 2) }}
      />
    </div>
  );
}

const getPlanColor = (plan: string) =>
  plan === "enterprise"
    ? "text-purple-700 dark:text-purple-400"
    : plan === "advanced"
      ? "text-amber-800 dark:text-amber-400"
      : plan.startsWith("business")
        ? "text-blue-900 dark:text-blue-400"
        : plan === "pro"
          ? "text-cyan-900 dark:text-cyan-400"
          : "text-neutral-500 dark:text-neutral-400";
