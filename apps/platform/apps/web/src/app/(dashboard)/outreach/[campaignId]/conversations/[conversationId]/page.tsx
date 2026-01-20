import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ConversationThreadClient } from "./page-client";

export default async function ConversationPage() {
  const session = await getSession();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return <ConversationThreadClient />;
}

