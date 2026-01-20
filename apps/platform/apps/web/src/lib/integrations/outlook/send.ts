import { prisma } from "@leadswap/prisma";
import { outlookOAuthProvider } from "./oauth";
import type { OutlookEmailMessage } from "./schema";

interface SendOutlookEmailOptions {
  to: string;
  toName?: string;
  subject: string;
  body: string;
  isHtml?: boolean;
  cc?: Array<{ address: string; name?: string }>;
  bcc?: Array<{ address: string; name?: string }>;
  replyTo?: string;
}

/**
 * Get valid access token for an Outlook account, refreshing if needed
 */
async function getValidAccessToken(accountId: string): Promise<string> {
  const account = await prisma.workspaceEmailAccount.findUnique({
    where: { id: accountId },
    select: {
      accessToken: true,
      refreshToken: true,
      tokenExpiresAt: true,
    },
  });

  if (!account) {
    throw new Error("Email account not found");
  }

  // Check if token is expired
  if (outlookOAuthProvider.isTokenExpired(account.tokenExpiresAt)) {
    if (!account.refreshToken) {
      throw new Error("Token expired and no refresh token available");
    }

    // Refresh the token
    const refreshed = await outlookOAuthProvider.refreshAccessToken(
      account.refreshToken
    );

    // Update stored tokens
    await prisma.workspaceEmailAccount.update({
      where: { id: accountId },
      data: {
        accessToken: refreshed.accessToken,
        refreshToken: refreshed.refreshToken || account.refreshToken,
        tokenExpiresAt: refreshed.expiresAt,
      },
    });

    return refreshed.accessToken;
  }

  return account.accessToken;
}

/**
 * Send an email via Microsoft Graph API
 */
export async function sendOutlookEmail(
  accountId: string,
  options: SendOutlookEmailOptions
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const accessToken = await getValidAccessToken(accountId);

    // Build the email message
    const message: OutlookEmailMessage = {
      message: {
        subject: options.subject,
        body: {
          contentType: options.isHtml ? "HTML" : "Text",
          content: options.body,
        },
        toRecipients: [
          {
            emailAddress: {
              address: options.to,
              name: options.toName,
            },
          },
        ],
      },
      saveToSentItems: true,
    };

    // Add CC recipients
    if (options.cc && options.cc.length > 0) {
      message.message.ccRecipients = options.cc.map((recipient) => ({
        emailAddress: {
          address: recipient.address,
          name: recipient.name,
        },
      }));
    }

    // Add BCC recipients
    if (options.bcc && options.bcc.length > 0) {
      message.message.bccRecipients = options.bcc.map((recipient) => ({
        emailAddress: {
          address: recipient.address,
          name: recipient.name,
        },
      }));
    }

    // Add reply-to
    if (options.replyTo) {
      message.message.replyTo = [
        {
          emailAddress: {
            address: options.replyTo,
          },
        },
      ];
    }

    // Send via Microsoft Graph API
    const response = await fetch(
      "https://graph.microsoft.com/v1.0/me/sendMail",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("[Outlook] sendMail error:", errorData);
      throw new Error(
        errorData?.error?.message || `Failed to send email: ${response.status}`
      );
    }

    // Update account stats
    await prisma.workspaceEmailAccount.update({
      where: { id: accountId },
      data: {
        lastUsedAt: new Date(),
        totalSent: { increment: 1 },
      },
    });

    // Microsoft Graph doesn't return messageId on sendMail
    // We generate a reference ID for tracking
    const messageId = `outlook-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    return { success: true, messageId };
  } catch (error) {
    console.error("[Outlook] Send email error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send email with reply headers for threading
 */
export async function sendOutlookReply(
  accountId: string,
  options: SendOutlookEmailOptions & {
    inReplyTo?: string;
    references?: string[];
  }
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  // For Outlook, we need to use the reply API or include threading headers
  // For simplicity, we'll use the same sendMail API with proper subject prefixing
  const subject = options.subject.startsWith("Re:")
    ? options.subject
    : `Re: ${options.subject}`;

  return sendOutlookEmail(accountId, {
    ...options,
    subject,
  });
}


