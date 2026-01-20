import { Metadata } from "next";

export function constructMetadata({
  title,
  fullTitle,
  description = "Cliqo is the modern platform for managing UGC campaigns and collaborating with content creators.",
  image = "/assets/og/cliqo-thumbnail.jpg",
  video,
  icons = [
    {
      rel: "icon",
      type: "image/png",
      sizes: "192x192",
      url: "/icon-192.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "512x512",
      url: "/icon-512.png",
    },
    {
      rel: "icon",
      type: "image/svg+xml",
      url: "/logo.svg",
    },
    {
      rel: "apple-touch-icon",
      sizes: "192x192",
      url: "/icon-192.png",
    },
  ],
  url,
  canonicalUrl,
  noIndex = false,
  manifest = "/manifest.webmanifest",
}: {
  title?: string;
  fullTitle?: string;
  description?: string;
  image?: string | null;
  video?: string | null;
  icons?: Metadata["icons"];
  url?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  manifest?: string | URL | null;
} = {}): Metadata {
  return {
    title:
      fullTitle ||
      (title ? `${title} | Cliqo` : "Cliqo - The Modern UGC Campaign Platform"),
    description,
    openGraph: {
      title,
      description,
      ...(image && {
        images: image,
      }),
      url,
      ...(video && {
        videos: video,
      }),
    },
    twitter: {
      title,
      description,
      ...(image && {
        card: "summary_large_image",
        images: [image],
      }),
      ...(video && {
        player: video,
      }),
      creator: "@cliqoeu",
    },
    icons,
    metadataBase: new URL("https://cliqo.com"),
    ...((url || canonicalUrl) && {
      alternates: {
        canonical: url || canonicalUrl,
      },
    }),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
    ...(manifest && {
      manifest,
    }),
  };
}
