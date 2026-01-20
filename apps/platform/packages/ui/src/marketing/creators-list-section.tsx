"use client";

import { cn, OG_AVATAR_URL } from "@leadswap/utils";
import { useState, useEffect } from "react";
import { Instagram, YouTube, TikTok, Twitter } from "../icons";

interface PlatformInfo {
  platform: "instagram" | "tiktok" | "youtube" | "twitter";
  handle: string;
  url: string;
}

interface Creator {
  id: string;
  name: string;
  handle: string;
  image: string | null;
  followers: number;
  platform: "instagram" | "tiktok" | "youtube" | "twitter";
  profileUrl: string;
  platforms: PlatformInfo[];
  categories: string[];
  country: string | null;
  countryCode: string | null;
  profileType: "individual" | "company";
  status: "verified" | "featured" | "default";
  createdAt: string;
}

interface FilterOption {
  value: string;
  label: string;
  count: number;
  code?: string | null;
}

interface FiltersData {
  categories: FilterOption[];
  countries: FilterOption[];
  types: FilterOption[];
  statuses: FilterOption[];
  platforms: FilterOption[];
}

interface CreatorsListSectionProps {
  className?: string;
  apiUrl?: string;
}

interface ApiResponse {
  creators: Creator[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Format number with commas
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toLocaleString();
}

// Format date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  return `${month}.${day}.${year}`;
}

// Flag component using country code (e.g., "BR", "US")
function Flag({ code, name }: { code: string; name?: string }) {
  return (
    <img
      alt={name || code}
      className="size-4 shrink-0"
      src={`https://hatscripts.github.io/circle-flags/flags/${code.toLowerCase()}.svg`}
    />
  );
}

// Platform icon component
function PlatformIcon({ platform }: { platform: string }) {
  const iconClass = "size-3.5";
  switch (platform) {
    case "instagram":
      return <Instagram className={iconClass} />;
    case "youtube":
      return <YouTube className={iconClass} />;
    case "tiktok":
      return <TikTok className={iconClass} />;
    case "twitter":
      return <Twitter className={iconClass} />;
    default:
      return <span className="text-sm">🌐</span>;
  }
}

// Avatar component with fallback
function CreatorAvatar({
  id,
  name,
  image,
}: {
  id: string;
  name: string;
  image: string | null;
}) {
  const fallbackUrl = `${OG_AVATAR_URL}${id}`;
  const [src, setSrc] = useState(image || fallbackUrl);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative size-10 shrink-0 overflow-hidden rounded-full bg-neutral-800">
      {!hasError ? (
        <img
          src={src}
          alt={name}
          className="size-full object-cover"
          onError={() => {
            if (src !== fallbackUrl) {
              setSrc(fallbackUrl);
            } else {
              setHasError(true);
            }
          }}
        />
      ) : (
        <div className="flex size-full items-center justify-center text-lg font-medium text-neutral-400">
          {name.charAt(0)}
        </div>
      )}
    </div>
  );
}

export function CreatorsListSection({
  className,
  apiUrl = "/api/public/creators",
}: CreatorsListSectionProps) {
  // Filter state
  const [type, setType] = useState<string>("all");
  const [category, setCategory] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [platform, setPlatform] = useState<string>("");
  const [search, setSearch] = useState("");

  // Data state
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Filter options from API
  const [filters, setFilters] = useState<FiltersData | null>(null);

  // Fetch filter options on mount
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await fetch(`${apiUrl}/filters`);
        const data = await res.json();
        setFilters(data);
      } catch (error) {
        console.error("Failed to fetch filters:", error);
      }
    };
    fetchFilters();
  }, [apiUrl]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [type, category, country, platform, search]);

  // Fetch creators
  useEffect(() => {
    const fetchCreators = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (type !== "all") params.set("type", type);
        if (category) params.set("category", category);
        if (country) params.set("country", country);
        if (platform) params.set("platform", platform);
        if (search) params.set("search", search);
        params.set("page", page.toString());
        params.set("pageSize", "50");

        const res = await fetch(`${apiUrl}?${params.toString()}`);
        const data: ApiResponse = await res.json();
        setCreators(data.creators || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error("Failed to fetch creators:", error);
        setCreators([]);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchCreators, 300);
    return () => clearTimeout(debounce);
  }, [type, category, country, platform, search, page, apiUrl]);

  // Clear all filters
  const clearFilters = () => {
    setType("all");
    setCategory("");
    setCountry("");
    setPlatform("");
    setSearch("");
  };

  const hasActiveFilters = type !== "all" || category || country || platform || search;

  return (
    <section
      className={cn(
        "min-h-screen bg-neutral-950 px-4 py-20",
        className
      )}
    >
      <div className="mx-auto max-w-[1080px]">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="font-display text-4xl font-medium text-white sm:text-5xl">
            Our Creator Network
          </h1>
          <p className="mt-4 text-lg text-neutral-400">
            Discover top creators and influencers in our network
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Row 1: Type filters + Search */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Type filters */}
            <div className="flex gap-2">
              {(["all", "creator", "company"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                    type === t
                      ? "bg-white text-neutral-900"
                      : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                  )}
                >
                  {t === "all" ? "All" : t === "creator" ? "Creators" : "Companies"}
                </button>
              ))}
            </div>

            {/* Search */}
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="ml-auto w-48 rounded-full bg-neutral-800 px-4 py-1.5 text-sm text-white placeholder-neutral-500 outline-none transition-colors hover:bg-neutral-700 focus:ring-2 focus:ring-neutral-600"
            />
          </div>

          {/* Row 2: Dropdowns */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Niche/Category dropdown */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-full bg-emerald-500/20 px-4 py-1.5 text-sm text-emerald-400 outline-none transition-colors hover:bg-emerald-500/30"
            >
              <option value="">All Niches</option>
              {filters?.categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label} ({cat.count.toLocaleString()})
                </option>
              ))}
            </select>

            {/* Country dropdown */}
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="rounded-full bg-neutral-800 px-4 py-1.5 text-sm text-neutral-400 outline-none transition-colors hover:bg-neutral-700"
            >
              <option value="">All Countries</option>
              {filters?.countries.slice(0, 50).map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label} ({c.count.toLocaleString()})
                </option>
              ))}
            </select>

            {/* Platform dropdown */}
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="rounded-full bg-neutral-800 px-4 py-1.5 text-sm text-neutral-400 outline-none transition-colors hover:bg-neutral-700"
            >
              <option value="">All Platforms</option>
              {filters?.platforms.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label} ({p.count.toLocaleString()})
                </option>
              ))}
            </select>

            {/* Clear filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="rounded-full bg-neutral-700 px-4 py-1.5 text-sm text-white transition-colors hover:bg-neutral-600"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Total count */}
        <div className="mb-4 text-sm text-neutral-500">
          {total.toLocaleString()} creators
        </div>

        {/* Creators List */}
        <div className="divide-y divide-white/10">
          {loading ? (
            // Loading state
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-700 border-t-white" />
            </div>
          ) : creators.length === 0 ? (
            // Empty state
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-lg text-neutral-400">No creators found</p>
              <p className="mt-2 text-sm text-neutral-500">
                Try adjusting your filters
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-4 rounded-full bg-neutral-800 px-4 py-2 text-sm text-white transition-colors hover:bg-neutral-700"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            // Creator rows
            creators.map((creator) => (
              <div
                key={creator.id}
                className="group flex flex-wrap items-center gap-3 py-4 opacity-70 transition-opacity hover:opacity-100 sm:gap-4"
              >
                {/* Avatar */}
                <CreatorAvatar
                  id={creator.id}
                  name={creator.name}
                  image={creator.image}
                />

                {/* Name */}
                <h2 className="text-base font-medium text-white sm:text-lg">
                  {creator.name}
                </h2>

                {/* All platform badges */}
                {creator.platforms?.map((p) => (
                  <a
                    key={p.platform}
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-full bg-neutral-800 px-3 py-1 text-xs text-neutral-400 transition-colors hover:bg-neutral-700"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <PlatformIcon platform={p.platform} />
                    {p.platform}
                  </a>
                ))}

                {/* Badges */}
                {creator.followers > 0 && (
                  <span className="rounded-full bg-neutral-800 px-3 py-1 text-xs text-neutral-400">
                    {formatNumber(creator.followers)} followers
                  </span>
                )}

                {creator.countryCode && (
                  <span className="flex items-center gap-1.5 rounded-full bg-neutral-800 px-3 py-1 text-xs text-neutral-400">
                    <Flag code={creator.countryCode} name={creator.country || undefined} />
                    {creator.country}
                  </span>
                )}

                {creator.categories.slice(0, 3).map((cat) => (
                  <span
                    key={cat}
                    className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-400"
                  >
                    {cat}
                  </span>
                ))}

                {creator.status === "verified" && (
                  <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs text-blue-400">
                    Verified
                  </span>
                )}

                {creator.status === "featured" && (
                  <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs text-purple-400">
                    Featured
                  </span>
                )}

                {/* Date */}
                <span className="ml-auto rounded-full bg-neutral-800 px-3 py-1 text-xs text-neutral-500">
                  {formatDate(creator.createdAt)}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && !loading && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-lg bg-neutral-800 px-4 py-2 text-sm text-white transition-colors hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 text-sm text-neutral-400">
              Page {page} of {totalPages.toLocaleString()}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-lg bg-neutral-800 px-4 py-2 text-sm text-white transition-colors hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
