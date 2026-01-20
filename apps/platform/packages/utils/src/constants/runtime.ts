/**
 * Runtime helpers for environment-dependent constants
 * These functions evaluate at runtime instead of build time,
 * ensuring that environment variables are properly resolved.
 */

// Storage
export const getStorageBaseUrl = () =>
  process.env.STORAGE_BASE_URL || "https://dubassets.com";

// App domains
export const getAppDomain = () => {
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === "production") {
    return `https://app.${process.env.NEXT_PUBLIC_APP_DOMAIN}`;
  }
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === "preview") {
    return `https://preview.${process.env.NEXT_PUBLIC_APP_DOMAIN}`;
  }
  return "http://localhost:8888";
};

export const getAppDomainWithNgrok = () => {
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === "production") {
    return `https://app.${process.env.NEXT_PUBLIC_APP_DOMAIN}`;
  }
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === "preview") {
    return `https://preview.${process.env.NEXT_PUBLIC_APP_DOMAIN}`;
  }
  return process.env.NEXT_PUBLIC_NGROK_URL || "http://localhost:8888";
};

// Partners/Creator domains
export const getPartnersDomain = () => {
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === "production") {
    return `https://creator.${process.env.NEXT_PUBLIC_APP_DOMAIN}`;
  }
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === "preview") {
    return `https://creator-staging.${process.env.NEXT_PUBLIC_APP_DOMAIN}`;
  }
  return "http://creator.localhost:8888";
};

export const getPartnersDomainWithNgrok = () => {
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === "production") {
    return `https://creator.${process.env.NEXT_PUBLIC_APP_DOMAIN}`;
  }
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === "preview") {
    return `https://creator-staging.${process.env.NEXT_PUBLIC_APP_DOMAIN}`;
  }
  return process.env.NEXT_PUBLIC_NGROK_URL || "http://creator.localhost:8888";
};

// API domain
export const getApiDomain = () => {
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === "production") {
    return `https://api.${process.env.NEXT_PUBLIC_APP_DOMAIN}`;
  }
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === "preview") {
    return `https://api-staging.${process.env.NEXT_PUBLIC_APP_DOMAIN}`;
  }
  return "http://api.localhost:8888";
};

// Hostnames
export const getAppHostnames = () =>
  new Set([
    `app.${process.env.NEXT_PUBLIC_APP_DOMAIN}`,
    `preview.${process.env.NEXT_PUBLIC_APP_DOMAIN}`,
    "localhost:8888",
    "localhost",
  ]);

export const getPartnersHostnames = () =>
  new Set([
    `creator.${process.env.NEXT_PUBLIC_APP_DOMAIN}`,
    `creator-staging.${process.env.NEXT_PUBLIC_APP_DOMAIN}`,
    "creator.localhost:8888",
    "creator.localhost",
  ]);

export const getApiHostnames = () => {
  const SHORT_DOMAIN =
    process.env.NEXT_PUBLIC_APP_SHORT_DOMAIN || "dub.sh";
  return new Set([
    `api.${process.env.NEXT_PUBLIC_APP_DOMAIN}`,
    `api-staging.${process.env.NEXT_PUBLIC_APP_DOMAIN}`,
    `api.${SHORT_DOMAIN}`,
    "api.localhost:8888",
    "api.localhost",
  ]);
};

// Marketing domain
export const getMarketingDomain = () => {
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === "production") {
    return `https://www.${process.env.NEXT_PUBLIC_APP_DOMAIN}`;
  }
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === "preview") {
    return `https://www-staging.${process.env.NEXT_PUBLIC_APP_DOMAIN}`;
  }
  return "http://www.localhost:8888";
};

export const getMarketingHostnames = () =>
  new Set([
    // Note: www. is stripped by parse(), so we use domain without www prefix
    process.env.NEXT_PUBLIC_APP_DOMAIN,
    `staging.${process.env.NEXT_PUBLIC_APP_DOMAIN}`,
    "marketing.localhost:8888",
    "marketing.localhost",
  ]);

// Logo URLs
export const getLogoUrl = (filename: string = "logo.svg") => {
  const baseUrl =
    process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
      ? `https://app.${process.env.NEXT_PUBLIC_APP_DOMAIN}`
      : process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
        ? `https://preview.${process.env.NEXT_PUBLIC_APP_DOMAIN}`
        : "http://localhost:8888";
  return `${baseUrl}/${filename}`;
};

export const getLogoUrls = () => ({
  logo: getLogoUrl("logo.svg"),
  logoSquare: getLogoUrl("logo.svg"),
  qrLogo: getLogoUrl("logo.svg"),
  wordmark: getLogoUrl("logo.svg"),
  thumbnail: getLogoUrl("thumbnail.jpg"),
});

// Test/Demo workspace IDs
export const getAcmeWorkspaceId = () =>
  process.env.ACME_WORKSPACE_ID || "clrei1gld0002vs9mzn93p8ik";

export const getAcmeProgramId = () =>
  process.env.ACME_PROGRAM_ID || "prog_CYCu7IMAapjkRpTnr8F1azjN";

export const getLegalWorkspaceId = () =>
  process.env.LEGAL_WORKSPACE_ID || "clrflia0j0000vs7sqfhz9c7q";

export const getLegalUserId = () =>
  process.env.LEGAL_USER_ID || "clqei1lgc0000vsnzi01pbf47";
