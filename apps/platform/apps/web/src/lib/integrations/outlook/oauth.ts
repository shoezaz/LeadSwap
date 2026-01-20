import { getAppDomainWithNgrok } from "@leadswap/utils";
import { OAuthProvider, OAuthProviderConfig } from "../oauth-provider";
import { outlookAuthTokenSchema, outlookUserProfileSchema } from "./schema";

// Microsoft OAuth scopes for sending emails
const OUTLOOK_SCOPES = [
  "openid",
  "profile",
  "email",
  "offline_access",
  "Mail.Send",
  "Mail.ReadWrite",
  "User.Read",
].join(" ");

class OutlookOAuthProvider extends OAuthProvider<typeof outlookAuthTokenSchema> {
  constructor(provider: OAuthProviderConfig) {
    super(provider);
  }

  /**
   * Get user profile from Microsoft Graph API
   */
  async getUserProfile(accessToken: string) {
    const response = await fetch("https://graph.microsoft.com/v1.0/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("[Outlook] getUserProfile error:", error);
      throw new Error("Failed to get Outlook user profile");
    }

    const data = await response.json();
    return outlookUserProfileSchema.parse(data);
  }

  /**
   * Revoke access token when disconnecting
   * Note: Microsoft doesn't have a direct token revocation endpoint
   * We can only remove the stored tokens on our side
   */
  async revokeToken(_accessToken: string): Promise<void> {
    // Microsoft OAuth doesn't support direct token revocation
    // The token will remain valid until expiry, but we remove it from our DB
    console.log("[Outlook] Token removal requested - tokens removed from storage");
  }

  /**
   * Check if token is expired and needs refresh
   */
  isTokenExpired(expiresAt: Date | null): boolean {
    if (!expiresAt) return true;
    // Add 5 minute buffer before actual expiry
    return new Date(expiresAt.getTime() - 5 * 60 * 1000) < new Date();
  }

  /**
   * Refresh an expired access token
   */
  async refreshAccessToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken?: string;
    expiresAt: Date;
  }> {
    const response = await fetch("https://login.microsoftonline.com/common/oauth2/v2.0/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.MICROSOFT_CLIENT_ID!,
        client_secret: process.env.MICROSOFT_CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        scope: OUTLOOK_SCOPES,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("[Outlook] Token refresh error:", error);
      throw new Error("Failed to refresh Outlook token");
    }

    const data = await response.json();
    const token = outlookAuthTokenSchema.parse(data);

    return {
      accessToken: token.access_token,
      refreshToken: token.refresh_token,
      expiresAt: new Date(Date.now() + token.expires_in * 1000),
    };
  }
}

export const outlookOAuthProvider = new OutlookOAuthProvider({
  name: "Outlook",
  clientId: process.env.MICROSOFT_CLIENT_ID!,
  clientSecret: process.env.MICROSOFT_CLIENT_SECRET!,
  authUrl: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
  tokenUrl: "https://login.microsoftonline.com/common/oauth2/v2.0/token",
  redirectUri: `${getAppDomainWithNgrok()}/api/integrations/outlook/callback`,
  redisStatePrefix: "outlook:outreach:oauth:state",
  scopes: OUTLOOK_SCOPES,
  tokenSchema: outlookAuthTokenSchema,
  bodyFormat: "form",
  authorizationMethod: "body",
});

// Custom auth URL generator with additional Outlook-specific params
export async function generateOutlookAuthUrl(workspaceId: string) {
  const baseUrl = await outlookOAuthProvider.generateAuthUrl(workspaceId);

  // Add Outlook-specific params
  const url = new URL(baseUrl);
  url.searchParams.set("response_mode", "query");
  url.searchParams.set("prompt", "consent");

  return url.toString();
}


