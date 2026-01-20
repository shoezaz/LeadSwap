"use server";

import { authActionClient } from "../safe-action";
import { z } from "zod";
import { prisma } from "@leadswap/prisma";
import { outreachEngine } from "@/lib/outreach";
import { EmailTemplateType } from "@prisma/client";

// -----------------------------------------------------------------------------
// Add Creators to Campaign
// -----------------------------------------------------------------------------

const addCreatorsToCampaignSchema = z.object({
  campaignId: z.string(),
  creators: z.array(z.object({
    email: z.string().email(),
    name: z.string().optional(),
    platform: z.string().optional(),
    handle: z.string().optional(),
    profileUrl: z.string().url().optional(),
    specificContent: z.string().optional(),
    specificDetail: z.string().optional(),
    icebreaker: z.string().optional(),
  })),
});

export const addCreatorsToCampaignAction = authActionClient
  .schema(addCreatorsToCampaignSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { campaignId, creators } = parsedInput;
    const { user } = ctx;

    // Verify campaign access
    const campaign = await prisma.outreachCampaign.findFirst({
      where: {
        id: campaignId,
        workspace: {
          users: { some: { userId: user.id } },
        },
      },
    });

    if (!campaign) {
      throw new Error("Campaign not found or access denied");
    }

    // Create conversations for each creator
    const results = await Promise.all(
      creators.map(async (creator) => {
        try {
          // Check if conversation already exists
          const existing = await prisma.outreachConversation.findUnique({
            where: {
              campaignId_creatorEmail: {
                campaignId,
                creatorEmail: creator.email,
              },
            },
          });

          if (existing) {
            return { email: creator.email, status: "exists", id: existing.id };
          }

          // Create new conversation
          const conversation = await prisma.outreachConversation.create({
            data: {
              campaignId,
              creatorEmail: creator.email,
              creatorName: creator.name,
              creatorPlatform: creator.platform,
              creatorHandle: creator.handle,
              creatorProfileUrl: creator.profileUrl,
              specificContent: creator.specificContent,
              specificDetail: creator.specificDetail,
              icebreaker: creator.icebreaker,
              status: "pending_outreach",
            },
          });

          return { email: creator.email, status: "created", id: conversation.id };
        } catch (error) {
          return { email: creator.email, status: "error", error: String(error) };
        }
      })
    );

    const created = results.filter(r => r.status === "created").length;
    const existing = results.filter(r => r.status === "exists").length;
    const errors = results.filter(r => r.status === "error").length;

    return {
      success: true,
      summary: { created, existing, errors },
      results,
    };
  });

// -----------------------------------------------------------------------------
// Send Initial Outreach
// -----------------------------------------------------------------------------

const sendInitialOutreachSchema = z.object({
  conversationId: z.string(),
  templateType: z.nativeEnum(EmailTemplateType).optional(),
  customSubject: z.string().optional(),
  customBody: z.string().optional(),
  variables: z.record(z.string()).optional(),
});

export const sendInitialOutreachAction = authActionClient
  .schema(sendInitialOutreachSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { conversationId, templateType, customSubject, customBody, variables } = parsedInput;
    const { user } = ctx;

    // Verify conversation access
    const conversation = await prisma.outreachConversation.findFirst({
      where: {
        id: conversationId,
        campaign: {
          workspace: {
            users: { some: { userId: user.id } },
          },
        },
      },
      include: {
        campaign: {
          include: {
            workspace: true,
          },
        },
      },
    });

    if (!conversation) {
      throw new Error("Conversation not found or access denied");
    }

    // Get sender info
    const senderName = user.name || conversation.campaign.brandName;
    const senderEmail = conversation.campaign.workspace.supportEmail || 
                        `outreach@${conversation.campaign.workspace.slug}.cliqo.com`;

    // Send outreach
    const result = await outreachEngine.sendInitialOutreach({
      conversationId,
      templateType,
      customSubject,
      customBody,
      variables,
      senderName,
      senderEmail,
    });

    return result;
  });

// -----------------------------------------------------------------------------
// Send Follow-Up
// -----------------------------------------------------------------------------

const sendFollowUpSchema = z.object({
  conversationId: z.string(),
  followUpNumber: z.union([z.literal(1), z.literal(2), z.literal(3)]),
});

export const sendFollowUpAction = authActionClient
  .schema(sendFollowUpSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { conversationId, followUpNumber } = parsedInput;
    const { user } = ctx;

    // Verify conversation access
    const conversation = await prisma.outreachConversation.findFirst({
      where: {
        id: conversationId,
        campaign: {
          workspace: {
            users: { some: { userId: user.id } },
          },
        },
      },
      include: {
        campaign: {
          include: {
            workspace: true,
          },
        },
      },
    });

    if (!conversation) {
      throw new Error("Conversation not found or access denied");
    }

    const senderName = user.name || conversation.campaign.brandName;
    const senderEmail = conversation.campaign.workspace.supportEmail || 
                        `outreach@${conversation.campaign.workspace.slug}.cliqo.com`;

    const result = await outreachEngine.sendFollowUp(
      conversationId,
      followUpNumber,
      senderName,
      senderEmail
    );

    return result;
  });

// -----------------------------------------------------------------------------
// Bulk Send Outreach
// -----------------------------------------------------------------------------

const bulkSendOutreachSchema = z.object({
  campaignId: z.string(),
  conversationIds: z.array(z.string()).optional(), // If not provided, send to all pending
  maxToSend: z.number().min(1).max(100).default(50),
});

export const bulkSendOutreachAction = authActionClient
  .schema(bulkSendOutreachSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { campaignId, conversationIds, maxToSend } = parsedInput;
    const { user } = ctx;

    // Verify campaign access
    const campaign = await prisma.outreachCampaign.findFirst({
      where: {
        id: campaignId,
        workspace: {
          users: { some: { userId: user.id } },
        },
      },
      include: { workspace: true },
    });

    if (!campaign) {
      throw new Error("Campaign not found or access denied");
    }

    if (campaign.status !== "active") {
      throw new Error("Campaign must be active to send outreach");
    }

    // Get conversations to send
    const whereClause = conversationIds
      ? { id: { in: conversationIds }, campaignId }
      : { campaignId, status: "pending_outreach" as const };

    const conversations = await prisma.outreachConversation.findMany({
      where: whereClause,
      take: maxToSend,
    });

    const senderName = user.name || campaign.brandName;
    const senderEmail = campaign.workspace.supportEmail || 
                        `outreach@${campaign.workspace.slug}.cliqo.com`;

    // Send to each (with rate limiting consideration)
    const results = await Promise.all(
      conversations.map(async (conv) => {
        try {
          const result = await outreachEngine.sendInitialOutreach({
            conversationId: conv.id,
            senderName,
            senderEmail,
          });
          return { 
            conversationId: conv.id, 
            email: conv.creatorEmail,
            ...result 
          };
        } catch (error) {
          return {
            conversationId: conv.id,
            email: conv.creatorEmail,
            success: false,
            error: String(error),
          };
        }
      })
    );

    const sent = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    const pendingApproval = results.filter(r => r.requiresApproval).length;

    return {
      success: true,
      summary: { sent, failed, pendingApproval },
      results,
    };
  });

