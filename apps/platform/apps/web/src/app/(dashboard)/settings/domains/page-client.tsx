"use client";

import { clientAccessCheck } from "@/lib/api/tokens/permissions";
import useWorkspace from "@/lib/swr/use-workspace";
import { fetcher } from "@leadswap/utils";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

type DomainsApiResponse = Array<{
  id: string;
  slug: string;
  verified: boolean;
  primary: boolean;
  archived: boolean;
  placeholder: string | null;
  expiredUrl: string | null;
  notFoundUrl: string | null;
  logo: string | null;
  assetLinks: string | null;
  appleAppSiteAssociation: string | null;
  deepviewData: string;
  createdAt: string;
  updatedAt: string;
  registeredDomain: unknown | null;
}>;

export default function WorkspaceDomainsPageClient() {
  const { id: workspaceId, role } = useWorkspace();
  const [newDomain, setNewDomain] = useState("");

  const writeDisabledTooltip = useMemo(() => {
    const { error } = clientAccessCheck({ action: "domains.write", role });
    return typeof error === "string" ? error : undefined;
  }, [role]);

  const {
    data: domains,
    error,
    isLoading,
    mutate,
  } = useSWR<DomainsApiResponse>(
    workspaceId ? `/api/domains?workspaceId=${workspaceId}` : null,
    fetcher,
  );

  const createDomain = async () => {
    const slug = newDomain.trim().toLowerCase();
    if (!slug) return;

    const res = await fetch(`/api/domains?workspaceId=${workspaceId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      toast.error(data?.error?.message || "Failed to create domain.");
      return;
    }

    setNewDomain("");
    toast.success("Domain added.");
    await mutate();
  };

  const setPrimary = async (slug: string) => {
    const res = await fetch(
      `/api/domains/${encodeURIComponent(slug)}/primary?workspaceId=${workspaceId}`,
      { method: "POST" },
    );

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      toast.error(data?.error?.message || "Failed to update primary domain.");
      return;
    }

    toast.success("Primary domain updated.");
    await mutate();
  };

  if (isLoading) {
    return <div className="text-sm text-neutral-500">Loading domains…</div>;
  }

  if (error) {
    return (
      <div className="text-sm text-red-600">
        Failed to load domains. Try refreshing.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex w-full max-w-md items-end gap-2">
          <div className="flex-1">
            <label className="text-content-emphasis mb-1 block text-sm font-medium">
              Add a domain
            </label>
            <input
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              placeholder="example.com"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 shadow-sm outline-none placeholder:text-neutral-400 focus:border-neutral-400"
            />
          </div>
          <button
            type="button"
            className="h-10 rounded-lg bg-neutral-900 px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={createDomain}
            disabled={!newDomain.trim() || Boolean(writeDisabledTooltip)}
            title={writeDisabledTooltip}
          >
            Add
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
        <div className="divide-y divide-neutral-200">
          {(domains || []).length === 0 ? (
            <div className="p-4 text-sm text-neutral-500">
              No custom domains yet.
            </div>
          ) : (
            domains?.map((domain) => (
              <div
                key={domain.id}
                className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="truncate text-sm font-medium text-neutral-900">
                      {domain.slug}
                    </div>
                    {domain.primary && (
                      <span className="rounded bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-700">
                        Primary
                      </span>
                    )}
                    <span className="rounded bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-700">
                      {domain.verified ? "Verified" : "Unverified"}
                    </span>
                    {domain.archived && (
                      <span className="rounded bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-700">
                        Archived
                      </span>
                    )}
                  </div>
                  {(domain.placeholder || domain.notFoundUrl || domain.expiredUrl) && (
                    <div className="mt-1 space-y-0.5 text-xs text-neutral-500">
                      {domain.placeholder && (
                        <div className="truncate">
                          Placeholder: {domain.placeholder}
                        </div>
                      )}
                      {domain.notFoundUrl && (
                        <div className="truncate">
                          Not found URL: {domain.notFoundUrl}
                        </div>
                      )}
                      {domain.expiredUrl && (
                        <div className="truncate">
                          Expired URL: {domain.expiredUrl}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {!domain.primary && (
                    <button
                      type="button"
                      className="h-9 rounded-lg border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-900 shadow-sm transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
                      onClick={() => setPrimary(domain.slug)}
                      disabled={Boolean(writeDisabledTooltip)}
                      title={writeDisabledTooltip}
                    >
                      Make primary
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
