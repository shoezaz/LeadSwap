"use client";

import { cn } from "@leadswap/utils";
import {
  TikTokIcon,
  InstagramIcon,
  RedditIcon,
  TwitterIcon,
  YouTubeIcon,
  LinkedInIcon,
  PinterestIcon,
} from "@/ui/shared/platform-icons";

const PLATFORM_CONFIGS = {
  tiktok: {
    name: "TikTok",
    icon: TikTokIcon,
    color: "bg-black",
  },
  instagram: {
    name: "Instagram",
    icon: InstagramIcon,
    color: "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500",
  },
  reddit: {
    name: "Reddit",
    icon: RedditIcon,
    color: "bg-orange-600",
  },
  twitter: {
    name: "X",
    icon: TwitterIcon,
    color: "bg-black",
  },
  youtube: {
    name: "YouTube",
    icon: YouTubeIcon,
    color: "bg-red-600",
  },
  linkedin: {
    name: "LinkedIn",
    icon: LinkedInIcon,
    color: "bg-blue-700",
  },
  pinterest: {
    name: "Pinterest",
    icon: PinterestIcon,
    color: "bg-red-600",
  },
};

export type Platform = keyof typeof PLATFORM_CONFIGS;

interface PlatformAvatarGroupProps {
  platforms: Platform[];
  size?: "sm" | "md" | "lg";
}

export function PlatformAvatarGroup({
  platforms,
  size = "md",
}: PlatformAvatarGroupProps) {
  const sizeClasses = {
    sm: "size-6",
    md: "size-8",
    lg: "size-10",
  };

  return (
    <div className="flex -space-x-2">
      {platforms.map((platform, index) => {
        const config = PLATFORM_CONFIGS[platform];
        if (!config) return null;

        const Icon = config.icon;

        return (
          <div
            key={platform}
            className={cn(
              "relative rounded-full border-2 border-white p-1.5 dark:border-neutral-800",
              config.color,
              sizeClasses[size]
            )}
            style={{ zIndex: platforms.length - index }}
            title={config.name}
          >
            <Icon />
          </div>
        );
      })}
    </div>
  );
}

// Individual platform avatar (for single use)
interface PlatformAvatarProps {
  platform: Platform;
  size?: "sm" | "md" | "lg";
}

export function PlatformAvatar({ platform, size = "md" }: PlatformAvatarProps) {
  const config = PLATFORM_CONFIGS[platform];
  if (!config) return null;

  const Icon = config.icon;

  const sizeClasses = {
    sm: "size-6",
    md: "size-8",
    lg: "size-10",
  };

  return (
    <div
      className={cn(
        "rounded-full border-2 border-white p-1.5 dark:border-neutral-800",
        config.color,
        sizeClasses[size]
      )}
      title={config.name}
    >
      <Icon />
    </div>
  );
}
