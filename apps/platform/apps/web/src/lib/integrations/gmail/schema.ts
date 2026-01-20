import { z } from "zod";

// Gmail OAuth token response schema
export const gmailAuthTokenSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string().optional(),
  expires_in: z.number(),
  token_type: z.string(),
  scope: z.string(),
});

export type GmailAuthToken = z.infer<typeof gmailAuthTokenSchema>;

// Gmail user profile schema
export const gmailUserProfileSchema = z.object({
  emailAddress: z.string().email(),
  messagesTotal: z.number().optional(),
  threadsTotal: z.number().optional(),
  historyId: z.string().optional(),
});

export type GmailUserProfile = z.infer<typeof gmailUserProfileSchema>;

// Gmail message schema
export const gmailMessageSchema = z.object({
  id: z.string(),
  threadId: z.string(),
  labelIds: z.array(z.string()).optional(),
  historyId: z.string().optional(),
});

export type GmailMessage = z.infer<typeof gmailMessageSchema>;

// Send email request schema
export const sendGmailRequestSchema = z.object({
  to: z.string().email(),
  subject: z.string(),
  body: z.string(),
  bodyHtml: z.string().optional(),
  replyTo: z.string().email().optional(),
  inReplyTo: z.string().optional(),
  threadId: z.string().optional(),
});

export type SendGmailRequest = z.infer<typeof sendGmailRequestSchema>;

