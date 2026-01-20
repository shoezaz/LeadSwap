import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import {
  type ReadonlyURLSearchParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useCallback } from "react";

export function useRouterStuff() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const safeSearchParams = searchParams ?? new URLSearchParams();
  const searchParamsObj = Object.fromEntries(safeSearchParams);

  const getQueryString = (
    kv?: Record<string, any>,
    opts?: {
      include?: string[];
      exclude?: string[];
    },
  ) => {
    let newParams = new URLSearchParams(safeSearchParams);
    if (opts?.include && Array.isArray(opts.include)) {
      const filteredParams = new URLSearchParams();
      safeSearchParams.forEach((value, key) => {
        if (opts.include?.includes(key)) {
          filteredParams.set(key, value);
        }
      });
      newParams = filteredParams;
    }
    if (opts?.exclude && Array.isArray(opts.exclude)) {
      opts.exclude.forEach((k) => newParams.delete(k));
    }
    if (kv) {
      Object.entries(kv).forEach(([k, v]) => newParams.set(k, v));
    }
    const queryString = newParams.toString();
    return queryString.length > 0 ? `?${queryString}` : "";
  };

  const queryParams = useCallback(
    ({
      set,
      del,
      replace,
      scroll = true,
      getNewPath,
      arrayDelimiter = ",",
    }: {
      set?: Record<string, string | string[]>;
      del?: string | string[];
      replace?: boolean;
      scroll?: boolean;
      getNewPath?: boolean;
      arrayDelimiter?: string;
    }) => {
      const newParams = new URLSearchParams(safeSearchParams);
      if (set) {
        Object.entries(set).forEach(([k, v]) =>
          newParams.set(k, Array.isArray(v) ? v.join(arrayDelimiter) : v),
        );
      }
      if (del) {
        if (Array.isArray(del)) {
          del.forEach((k) => newParams.delete(k));
        } else {
          newParams.delete(del);
        }
      }
      const queryString = newParams.toString();
      const newPath = `${pathname}${
        queryString.length > 0 ? `?${queryString}` : ""
      }`;
      if (getNewPath) return newPath;
      if (replace) {
        router.replace(newPath, { scroll: false });
      } else {
        router.push(newPath, { scroll });
      }
    },
    [safeSearchParams, pathname, router],
  );

  return {
    pathname: pathname as string,
    router: router as AppRouterInstance,
    searchParams: safeSearchParams as ReadonlyURLSearchParams,
    searchParamsObj,
    queryParams,
    getQueryString,
  };
}
