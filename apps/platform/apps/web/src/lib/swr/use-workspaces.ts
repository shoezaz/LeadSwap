import { WorkspaceProps } from "@/lib/types";
import { fetcher } from "@leadswap/utils";
import { useSession } from "next-auth/react";
import useSWR from "swr";

export default function useWorkspaces() {
  const { data: session } = useSession();
  const { data: workspaces, error } = useSWR<WorkspaceProps[]>(
    session?.user && "/api/workspaces",
    fetcher,
    {
      dedupingInterval: 60000,
    },
  );

  return {
    workspaces,
    error,
    loading: !workspaces && !error,
  };
}
