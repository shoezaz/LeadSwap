import { GmailOAuthSection } from "@/ui/workspaces/gmail-oauth-section";

export default function EmailSettingsPage({
    params,
}: {
    params: { slug: string };
}) {
    return (
        <div className="flex flex-col gap-8 p-6">
            <div>
                <h1 className="text-2xl font-bold">Email Settings</h1>
                <p className="mt-1 text-neutral-500">
                    Configure how campaign emails are sent from your workspace.
                </p>
            </div>

            <div className="mx-auto w-full max-w-2xl">
                <GmailOAuthSection workspaceSlug={params.slug} />
            </div>
        </div>
    );
}
