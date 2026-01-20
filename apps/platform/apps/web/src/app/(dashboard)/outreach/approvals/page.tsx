import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ApprovalQueueClient } from "./page-client";

export default async function ApprovalsPage() {
  const session = await getSession();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return <ApprovalQueueClient />;
}

