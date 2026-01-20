// Configuration for Cliqo affiliate platform
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Cliqo";

export const SHORT_DOMAIN =
  process.env.NEXT_PUBLIC_APP_SHORT_DOMAIN || "cliqo.com";

export const APP_HOSTNAMES = new Set([
  `app.${process.env.NEXT_PUBLIC_APP_DOMAIN}`,
  `preview.${process.env.NEXT_PUBLIC_APP_DOMAIN}`,
  "localhost:8888",
  "localhost",
]);

export const APP_DOMAIN =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
    ? `https://app.${process.env.NEXT_PUBLIC_APP_DOMAIN}`
    : process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
      ? `https://preview.${process.env.NEXT_PUBLIC_APP_DOMAIN}`
      : "http://localhost:8888";

export const APP_DOMAIN_WITH_NGROK =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
    ? `https://app.${process.env.NEXT_PUBLIC_APP_DOMAIN}`
    : process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
      ? `https://preview.${process.env.NEXT_PUBLIC_APP_DOMAIN}`
      : process.env.NEXT_PUBLIC_NGROK_URL || "http://localhost:8888";

export const API_HOSTNAMES = new Set([
  `api.${process.env.NEXT_PUBLIC_APP_DOMAIN}`,
  `api-staging.${process.env.NEXT_PUBLIC_APP_DOMAIN}`,
  `api.${SHORT_DOMAIN}`,
  "api.localhost:8888",
  "api.localhost",
]);

export const API_DOMAIN =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
    ? `https://api.${process.env.NEXT_PUBLIC_APP_DOMAIN}`
    : process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
      ? `https://api-staging.${process.env.NEXT_PUBLIC_APP_DOMAIN}`
      : "http://api.localhost:8888";

export const ADMIN_HOSTNAMES = new Set([
  `admin.${process.env.NEXT_PUBLIC_APP_DOMAIN}`,
  "admin.localhost:8888",
  "admin.localhost",
]);

export const PARTNERS_HOSTNAMES = new Set([
  `creator.${process.env.NEXT_PUBLIC_APP_DOMAIN}`,
  `creator-staging.${process.env.NEXT_PUBLIC_APP_DOMAIN}`,
  "creator.localhost:8888",
  "creator.localhost",
]);

export const PARTNERS_DOMAIN =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
    ? `https://creator.${process.env.NEXT_PUBLIC_APP_DOMAIN}`
    : process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
      ? `https://creator-staging.${process.env.NEXT_PUBLIC_APP_DOMAIN}`
      : "http://creator.localhost:8888";

export const PARTNERS_DOMAIN_WITH_NGROK =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
    ? `https://creator.${process.env.NEXT_PUBLIC_APP_DOMAIN}`
    : process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
      ? `https://creator-staging.${process.env.NEXT_PUBLIC_APP_DOMAIN}`
      : process.env.NEXT_PUBLIC_NGROK_URL || "http://creator.localhost:8888";

// Logo URLs - uses absolute URLs for emails (production: https://app.cliqo.com/logo.svg)
const LOGO_BASE_URL =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
    ? `https://app.${process.env.NEXT_PUBLIC_APP_DOMAIN}`
    : process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
      ? `https://preview.${process.env.NEXT_PUBLIC_APP_DOMAIN}`
      : "http://localhost:8888";

export const DUB_LOGO = `${LOGO_BASE_URL}/logo.svg`;
export const DUB_LOGO_SQUARE = `${LOGO_BASE_URL}/logo.svg`;
export const DUB_QR_LOGO = `${LOGO_BASE_URL}/logo.svg`;
export const DUB_WORDMARK = `${LOGO_BASE_URL}/logo.svg`;
export const DUB_THUMBNAIL = `${LOGO_BASE_URL}/thumbnail.jpg`;

export const CLIQO_LOGO = `${LOGO_BASE_URL}/logo.svg`;
export const CLIQO_LOGO_SQUARE = `${LOGO_BASE_URL}/logo.svg`;
export const CLIQO_QR_LOGO = `${LOGO_BASE_URL}/logo.svg`;
export const CLIQO_WORDMARK = `${LOGO_BASE_URL}/logo.svg`;
export const CLIQO_THUMBNAIL = `${LOGO_BASE_URL}/thumbnail.jpg`;

// TODO: Replace with your actual workspace ID from the database
// Query: SELECT id FROM Project WHERE slug = 'your-workspace-slug';
export const DUB_WORKSPACE_ID = process.env.NEXT_PUBLIC_WORKSPACE_ID || "cl7pj5kq4006835rbjlt2ofka";
export const ACME_WORKSPACE_ID = "clrei1gld0002vs9mzn93p8ik";
export const ACME_PROGRAM_ID = "prog_CYCu7IMAapjkRpTnr8F1azjN";
export const LEGAL_WORKSPACE_ID = "clrflia0j0000vs7sqfhz9c7q";
export const LEGAL_USER_ID = "clqei1lgc0000vsnzi01pbf47";

export const R2_URL = process.env.STORAGE_BASE_URL || "https://dubassets.com";

// Marketing domain (www.cliqo.com)
export const MARKETING_DOMAIN =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
    ? `https://www.${process.env.NEXT_PUBLIC_APP_DOMAIN}`
    : process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
      ? `https://www-staging.${process.env.NEXT_PUBLIC_APP_DOMAIN}`
      : "http://localhost:8888";

// Help and Docs base URLs
export const HELP_BASE_URL = `${MARKETING_DOMAIN}/help`;
export const DOCS_BASE_URL = `${MARKETING_DOMAIN}/docs`;
