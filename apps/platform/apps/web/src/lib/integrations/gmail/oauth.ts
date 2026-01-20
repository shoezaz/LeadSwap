import { getAppDomainWithNgrok } from "@leadswap/utils";
import { OAuthProvider, OAuthProviderConfig } from "../oauth-provider";
import { gmailAuthTokenSchema, gmailUserProfileSchema } from "./schema";

// Gmail OAuth scopes for sending emails and managing inbox
const GMAIL_SCOPES = [
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
].join(" ");

class GmailOAuthProvider extends OAuthProvider<typeof gmailAuthTokenSchema> {
  constructor(provider: OAuthProviderConfig) {
    super(provider);
  }

  /**
   * Get user profile from Gmail API
   */
  async getUserProfile(accessToken: string) {
    const response = await fetch(
      "https://www.googleapis.com/gmail/v1/users/me/profile",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("[Gmail] getUserProfile error:", error);
      throw new Error("Failed to get Gmail user profile");
    }

    const data = await response.json();
    return gmailUserProfileSchema.parse(data);
  }

  /**
   * Revoke access token when disconnecting
   */
  async revokeToken(accessToken: string): Promise<void> {
    const response = await fetch(
      `https://oauth2.googleapis.com/revoke?token=${accessToken}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (!response.ok) {
      console.error("[Gmail] Failed to revoke token");
    }
  }

  /**
   * Check if token is expired and needs refresh
   */
  isTokenExpired(expiresAt: Date | null): boolean {
    if (!expiresAt) return true;
    // Add 5 minute buffer before actual expiry
    return new Date(expiresAt.getTime() - 5 * 60 * 1000) < new Date();
  }
}

export const gmailOAuthProvider = new GmailOAuthProvider({
  name: "Gmail",
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenUrl: "https://oauth2.googleapis.com/token",
  redirectUri: `${getAppDomainWithNgrok()}/api/integrations/gmail/callback`,
  redisStatePrefix: "gmail:outreach:oauth:state",
  scopes: GMAIL_SCOPES,
  tokenSchema: gmailAuthTokenSchema,
  bodyFormat: "form",
  authorizationMethod: "body",
});

// Custom auth URL generator with additional Gmail-specific params
export async function generateGmailAuthUrl(workspaceId: string) {
  const baseUrl = await gmailOAuthProvider.generateAuthUrl(workspaceId);
  
  // Add Gmail-specific params for offline access and consent
  const url = new URL(baseUrl);
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("prompt", "consent");
  url.searchParams.set("include_granted_scopes", "true");
  
  return url.toString();
}

