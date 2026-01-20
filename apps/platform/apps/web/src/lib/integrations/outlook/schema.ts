import { z } from "zod";

// Microsoft OAuth token response
export const outlookAuthTokenSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string().optional(),
  expires_in: z.number(),
  token_type: z.string(),
  scope: z.string().optional(),
});

export type OutlookAuthToken = z.infer<typeof outlookAuthTokenSchema>;

// Microsoft Graph user profile
export const outlookUserProfileSchema = z.object({
  id: z.string(),
  displayName: z.string().nullable(),
  mail: z.string().nullable(),
  userPrincipalName: z.string(),
});

export type OutlookUserProfile = z.infer<typeof outlookUserProfileSchema>;

// Email message schema for Microsoft Graph
export const outlookEmailMessageSchema = z.object({
  message: z.object({
    subject: z.string(),
    body: z.object({
      contentType: z.enum(["Text", "HTML"]),
      content: z.string(),
    }),
    toRecipients: z.array(
      z.object({
        emailAddress: z.object({
          address: z.string().email(),
          name: z.string().optional(),
        }),
      })
    ),
    ccRecipients: z
      .array(
        z.object({
          emailAddress: z.object({
            address: z.string().email(),
            name: z.string().optional(),
          }),
        })
      )
      .optional(),
    bccRecipients: z
      .array(
        z.object({
          emailAddress: z.object({
            address: z.string().email(),
            name: z.string().optional(),
          }),
        })
      )
      .optional(),
    replyTo: z
      .array(
        z.object({
          emailAddress: z.object({
            address: z.string().email(),
            name: z.string().optional(),
          }),
        })
      )
      .optional(),
  }),
  saveToSentItems: z.boolean().default(true),
});

export type OutlookEmailMessage = z.infer<typeof outlookEmailMessageSchema>;


