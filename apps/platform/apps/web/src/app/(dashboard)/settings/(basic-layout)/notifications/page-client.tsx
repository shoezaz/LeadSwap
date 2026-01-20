"use client";

import { updateNotificationPreference } from "@/lib/actions/update-notification-preference";
import useWorkspace from "@/lib/swr/use-workspace";
import { notificationTypes } from "@/lib/zod/schemas/workspaces";
import { Switch, useOptimisticUpdate } from "@leadswap/ui";
import { Globe, Hyperlink, MediaPlay, Msgs, UserPlus } from "@leadswap/ui/icons";
import { Eye, Trophy } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { z } from "zod";

type PreferenceType = z.infer<typeof notificationTypes>;
type Preferences = Record<PreferenceType, boolean>;

export default function NotificationsSettingsPageClient() {
  const { id: workspaceId } = useWorkspace();
  const { executeAsync } = useAction(updateNotificationPreference);

  const notifications = [
    {
      type: "domainConfigurationUpdates",
      icon: Globe,
      title: "Domain configuration updates",
      description: "Updates to your custom domain configuration.",
    },
    {
      type: "linkUsageSummary",
      icon: Hyperlink,
      title: "Monthly content summary",
      description:
        "Monthly summary email of your top content performance & total views generated.",
    },
    {
      type: "newPartnerApplication",
      icon: UserPlus,
      title: "New creator application",
      description:
        "Alert when a new creator applies to join your UGC program.",
    },
    {
      type: "newPartnerSale",
      icon: Eye,
      title: "Content milestone reached",
      description: "Alert when content reaches significant view milestones (10K, 100K, 1M views).",
    },
    {
      type: "newBountySubmitted",
      icon: MediaPlay,
      title: "New content submitted",
      description:
        "Alert when a creator submits new UGC content for review.",
    },
    {
      type: "newMessageFromPartner",
      icon: Msgs,
      title: "New message from creator",
      description:
        "Alert when you receive a new message from a creator.",
    },
  ];

  const {
    data: preferences,
    isLoading,
    update,
  } = useOptimisticUpdate<Preferences>(
    `/api/workspaces/${workspaceId}/notification-preferences`,
    {
      loading: "Updating notification preference...",
      success: "Notification preference updated.",
      error: "Failed to update notification preference.",
    },
  );

  const handleUpdate = async ({
    type,
    value,
    currentPreferences,
  }: {
    type: string;
    value: boolean;
    currentPreferences: Preferences;
  }) => {
    await executeAsync({
      workspaceId: workspaceId!,
      type: type as PreferenceType,
      value,
    });

    return {
      ...currentPreferences,
      [type]: value,
    };
  };

  return (
    <div>
      <div className="max-w-screen-sm pb-8">
        <h2 className="text-xl font-semibold tracking-tight text-black">
          Workspace Notifications
        </h2>
        <p className="mt-3 text-sm text-neutral-500">
          Adjust your personal notification preferences and choose which updates
          you want to receive. These settings will only be applied to your
          personal account.
        </p>
      </div>
      <div className="mt-2 grid grid-cols-1 gap-3">
        {notifications.map(({ type, icon: Icon, title, description }) => (
          <div
            key={type}
            className="flex items-center justify-between gap-4 rounded-xl border border-neutral-200 bg-white p-5"
          >
            <div className="flex min-w-0 items-center gap-4">
              <div className="hidden rounded-full border border-neutral-200 sm:block">
                <div className="rounded-full border border-white bg-gradient-to-t from-neutral-100 p-1 md:p-3">
                  <Icon className="size-5" />
                </div>
              </div>
              <div className="overflow-hidden">
                <div className="flex items-center gap-1.5 sm:gap-2.5">
                  <div className="truncate text-sm font-medium">{title}</div>
                </div>
                <div className="mt-1 flex items-center gap-1 text-xs">
                  <span className="whitespace-pre-wrap text-neutral-500">
                    {description}
                  </span>
                </div>
              </div>
            </div>
            <Switch
              checked={preferences?.[type] ?? false}
              disabled={isLoading}
              fn={(checked: boolean) => {
                if (!preferences) return;

                update(
                  () =>
                    handleUpdate({
                      type,
                      value: checked,
                      currentPreferences: preferences,
                    }),
                  {
                    ...preferences,
                    [type]: checked,
                  },
                );
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
