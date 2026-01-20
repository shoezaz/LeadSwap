import { prisma } from "@leadswap/prisma";
import { gmailOAuthProvider } from "./oauth";
import type { SendGmailRequest } from "./schema";

interface GmailSendResult {
  success: boolean;
  messageId?: string;
  threadId?: string;
  error?: string;
}

/**
 * Encode email message to base64url format for Gmail API
 */
function encodeMessage(
  from: string,
  to: string,
  subject: string,
  body: string,
  bodyHtml?: string,
  replyTo?: string,
  inReplyTo?: string,
  references?: string
): string {
  const boundary = `boundary_${Date.now()}`;

  let message = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    replyTo ? `Reply-To: ${replyTo}` : null,
    inReplyTo ? `In-Reply-To: ${inReplyTo}` : null,
    references ? `References: ${references}` : null,
    "MIME-Version: 1.0",
  ]
    .filter(Boolean)
    .join("\r\n");

  if (bodyHtml) {
    // Multipart message with both plain text and HTML
    message += `\r\nContent-Type: multipart/alternative; boundary="${boundary}"`;
    message += "\r\n\r\n";
    message += `--${boundary}\r\n`;
    message += "Content-Type: text/plain; charset=UTF-8\r\n\r\n";
    message += body;
    message += `\r\n--${boundary}\r\n`;
    message += "Content-Type: text/html; charset=UTF-8\r\n\r\n";
    message += bodyHtml;
    message += `\r\n--${boundary}--`;
  } else {
    message += "\r\nContent-Type: text/plain; charset=UTF-8\r\n\r\n";
    message += body;
  }

  // Convert to base64url encoding
  return Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * Get a valid access token, refreshing if necessary
 */
async function getValidAccessToken(
  emailAccountId: string
): Promise<{ accessToken: string; email: string } | null> {
  const account = await prisma.workspaceEmailAccount.findUnique({
    where: { id: emailAccountId },
  });

  if (!account || !account.isActive) {
    return null;
  }

  // Check if token needs refresh
  const needsRefresh =
    !account.tokenExpiresAt ||
    new Date(account.tokenExpiresAt.getTime() - 5 * 60 * 1000) < new Date();

  if (needsRefresh && account.refreshToken) {
    try {
      const newToken = await gmailOAuthProvider.refreshToken(
        account.refreshToken
      );

      // Update token in database
      await prisma.workspaceEmailAccount.update({
        where: { id: emailAccountId },
        data: {
          accessToken: newToken.access_token,
          tokenExpiresAt: new Date(Date.now() + newToken.expires_in * 1000),
          ...(newToken.refresh_token && {
            refreshToken: newToken.refresh_token,
          }),
        },
      });

      return {
        accessToken: newToken.access_token,
        email: account.email,
      };
    } catch (error) {
      console.error("[Gmail] Token refresh failed:", error);
      // Mark account as inactive
      await prisma.workspaceEmailAccount.update({
        where: { id: emailAccountId },
        data: { isActive: false },
      });
      return null;
    }
  }

  return {
    accessToken: account.accessToken,
    email: account.email,
  };
}

/**
 * Send email via Gmail API
 */
export async function sendViaGmail(
  emailAccountId: string,
  request: SendGmailRequest
): Promise<GmailSendResult> {
  const auth = await getValidAccessToken(emailAccountId);

  if (!auth) {
    return {
      success: false,
      error: "Gmail account not available or token expired",
    };
  }

  const { to, subject, body, bodyHtml, replyTo, inReplyTo, threadId } = request;

  const raw = encodeMessage(
    auth.email,
    to,
    subject,
    body,
    bodyHtml,
    replyTo,
    inReplyTo,
    inReplyTo
  );

  try {
    const response = await fetch(
      "https://www.googleapis.com/gmail/v1/users/me/messages/send",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          raw,
          ...(threadId && { threadId }),
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("[Gmail] Send error:", error);

      // Handle specific errors
      if (response.status === 401) {
        // Token invalid - mark account inactive
        await prisma.workspaceEmailAccount.update({
          where: { id: emailAccountId },
          data: { isActive: false },
        });
      }

      return {
        success: false,
        error: error.error?.message || "Failed to send email via Gmail",
      };
    }

    const data = await response.json();

    // Update usage stats
    await prisma.workspaceEmailAccount.update({
      where: { id: emailAccountId },
      data: {
        totalSent: { increment: 1 },
        lastUsedAt: new Date(),
      },
    });

    return {
      success: true,
      messageId: data.id,
      threadId: data.threadId,
    };
  } catch (error) {
    console.error("[Gmail] Send exception:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get the default email account for a workspace
 */
export async function getDefaultEmailAccount(workspaceId: string) {
  // Try to find default account
  let account = await prisma.workspaceEmailAccount.findFirst({
    where: {
      workspaceId,
      isDefault: true,
      isActive: true,
    },
  });

  // Fall back to any active account
  if (!account) {
    account = await prisma.workspaceEmailAccount.findFirst({
      where: {
        workspaceId,
        isActive: true,
      },
      orderBy: { createdAt: "asc" },
    });
  }

  return account;
}

/**
 * List all email accounts for a workspace
 */
export async function listEmailAccounts(workspaceId: string) {
  return prisma.workspaceEmailAccount.findMany({
    where: { workspaceId },
    select: {
      id: true,
      provider: true,
      email: true,
      displayName: true,
      isDefault: true,
      isActive: true,
      lastUsedAt: true,
      totalSent: true,
      createdAt: true,
    },
    orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
  });
}

