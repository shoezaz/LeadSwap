"use server";

import { authActionClient } from "../safe-action";
import { z } from "zod";
import { prisma } from "@leadswap/prisma";
import { outreachEngine, budgetManager, aiNegotiator } from "@/lib/outreach";

// -----------------------------------------------------------------------------
// Create Offer
// -----------------------------------------------------------------------------

const createOfferSchema = z.object({
  conversationId: z.string(),
  amount: z.number().positive("Amount must be positive"),
  deliverables: z.object({
    posts: z.number().optional(),
    stories: z.number().optional(),
    reels: z.number().optional(),
    tiktoks: z.number().optional(),
    youtube: z.number().optional(),
  }),
  usageRights: z.object({
    organic_days: z.number().default(30),
    paid_ads_days: z.number().default(0),
  }).optional(),
  sendImmediately: z.boolean().default(false),
});

export const createOfferAction = authActionClient
  .schema(createOfferSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { conversationId, amount, deliverables, usageRights, sendImmediately } = parsedInput;
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
      include: { campaign: true },
    });

    if (!conversation) {
      throw new Error("Conversation not found or access denied");
    }

    // Validate budget
    const validation = await budgetManager.validateBudget(
      conversation.campaignId,
      amount
    );

    if (!validation.valid) {
      throw new Error(validation.reason || "Budget validation failed");
    }

    // Create offer
    const result = await outreachEngine.createOffer(
      conversationId,
      amount,
      deliverables,
      usageRights
    );

    if (!result.success) {
      throw new Error(result.error || "Failed to create offer");
    }

    // If sendImmediately and approved, mark as sent
    if (sendImmediately && result.offerId) {
      const offer = await prisma.creatorOffer.findUnique({
        where: { id: result.offerId },
      });

      if (offer && offer.status === "approved") {
        await prisma.creatorOffer.update({
          where: { id: result.offerId },
          data: {
            status: "sent",
            sentAt: new Date(),
          },
        });

        // Update conversation status
        await prisma.outreachConversation.update({
          where: { id: conversationId },
          data: { status: "offer_sent" },
        });
      }
    }

    return {
      success: true,
      offerId: result.offerId,
    };
  });

// -----------------------------------------------------------------------------
// Accept Offer (Creator Response)
// -----------------------------------------------------------------------------

const respondToOfferSchema = z.object({
  offerId: z.string(),
  response: z.enum(["accept", "decline", "counter"]),
  counterAmount: z.number().positive().optional(),
  counterDeliverables: z.any().optional(),
  reason: z.string().optional(),
});

export const respondToOfferAction = authActionClient
  .schema(respondToOfferSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { offerId, response, counterAmount, counterDeliverables, reason } = parsedInput;
    const { user } = ctx;

    // Verify offer access
    const offer = await prisma.creatorOffer.findFirst({
      where: {
        id: offerId,
        campaign: {
          workspace: {
            users: { some: { userId: user.id } },
          },
        },
      },
      include: {
        campaign: true,
        conversation: true,
      },
    });

    if (!offer) {
      throw new Error("Offer not found or access denied");
    }

    switch (response) {
      case "accept":
        return await outreachEngine.acceptOffer(offerId);

      case "decline":
        return await outreachEngine.declineOffer(offerId, reason);

      case "counter":
        if (!counterAmount) {
          throw new Error("Counter amount required for counter-offer");
        }

        // Create new offer version
        const newOffer = await prisma.creatorOffer.create({
          data: {
            campaignId: offer.campaignId,
            conversationId: offer.conversationId,
            creatorId: offer.creatorId,
            amount: counterAmount,
            currency: offer.currency,
            deliverables: counterDeliverables || offer.deliverables,
            usageRights: offer.usageRights,
            status: "draft",
            version: offer.version + 1,
            parentOfferId: offer.id,
            creatorRate: counterAmount,
            creatorCounter: {
              amount: counterAmount,
              deliverables: counterDeliverables,
              reason,
            },
          },
        });

        // Update conversation
        await prisma.outreachConversation.update({
          where: { id: offer.conversationId },
          data: { status: "negotiating" },
        });

        // Mark original as counter-offered
        await prisma.creatorOffer.update({
          where: { id: offerId },
          data: { status: "counter_offered" },
        });

        return { success: true, newOfferId: newOffer.id };

      default:
        throw new Error("Invalid response type");
    }
  });

// -----------------------------------------------------------------------------
// Approve Pending Offer
// -----------------------------------------------------------------------------

const approveOfferSchema = z.object({
  offerId: z.string(),
  sendAfterApproval: z.boolean().default(true),
});

export const approveOfferAction = authActionClient
  .schema(approveOfferSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { offerId, sendAfterApproval } = parsedInput;
    const { user } = ctx;

    // Verify offer access
    const offer = await prisma.creatorOffer.findFirst({
      where: {
        id: offerId,
        status: "pending_approval",
        campaign: {
          workspace: {
            users: { some: { userId: user.id } },
          },
        },
      },
    });

    if (!offer) {
      throw new Error("Offer not found or not pending approval");
    }

    // Approve
    await prisma.creatorOffer.update({
      where: { id: offerId },
      data: {
        status: sendAfterApproval ? "sent" : "approved",
        approvedBy: user.id,
        approvedAt: new Date(),
        sentAt: sendAfterApproval ? new Date() : null,
      },
    });

    if (sendAfterApproval) {
      await prisma.outreachConversation.update({
        where: { id: offer.conversationId },
        data: { status: "offer_sent" },
      });
    }

    // Log
    await prisma.outreachAuditLog.create({
      data: {
        campaignId: offer.campaignId,
        conversationId: offer.conversationId,
        offerId,
        userId: user.id,
        action: "offer_approved",
        metadata: { sendAfterApproval },
      },
    });

    return { success: true };
  });

// -----------------------------------------------------------------------------
// AI-Assisted Negotiation Response
// -----------------------------------------------------------------------------

const generateNegotiationResponseSchema = z.object({
  conversationId: z.string(),
  creatorMessage: z.string(),
});

export const generateNegotiationResponseAction = authActionClient
  .schema(generateNegotiationResponseSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { conversationId, creatorMessage } = parsedInput;
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
        campaign: true,
        messages: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        offers: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });

    if (!conversation) {
      throw new Error("Conversation not found or access denied");
    }

    const campaign = conversation.campaign;

    // Build context
    const campaignContext = {
      campaignId: campaign.id,
      brandName: campaign.brandName,
      productName: campaign.productName || undefined,
      productDescription: campaign.productDescription || undefined,
      budgetMin: Number(campaign.budgetTotal) * 0.3, // 30% of total as min
      budgetMax: campaign.budgetMaxPerCreator 
        ? Number(campaign.budgetMaxPerCreator)
        : Number(campaign.budgetTotal) * 0.5, // 50% of total as max per creator
      budgetIdeal: campaign.budgetMaxPerCreator
        ? Number(campaign.budgetMaxPerCreator) * 0.7
        : Number(campaign.budgetTotal) * 0.3,
      budgetAbsoluteMax: campaign.budgetMaxPerCreator
        ? Number(campaign.budgetMaxPerCreator)
        : Number(campaign.budgetTotal) * 0.6,
      desiredDeliverables: campaign.deliverables,
      flexibleDeliverables: true,
      availablePerks: ["Free Product", "Social Repost", "Long-term Partnership"],
      usageRightsDays: (campaign.usageRights as any)?.organic_days || 30,
      canOfferPaidUsage: (campaign.usageRights as any)?.paid_ads_days > 0,
    };

    // Analyze creator's message
    const analysis = await aiNegotiator.analyzeCreatorResponse(
      creatorMessage,
      campaignContext
    );

    if (!analysis) {
      throw new Error("Failed to analyze creator response");
    }

    // Build conversation history
    const history = {
      messages: conversation.messages.map(m => ({
        sender: m.sender as "brand" | "creator",
        content: m.content,
        timestamp: m.createdAt,
      })),
      previousOffers: conversation.offers.map(o => ({
        amount: Number(o.amount),
        status: o.status,
      })),
    };

    // Generate response
    const response = await aiNegotiator.generateNegotiationResponse(
      analysis,
      campaignContext,
      history
    );

    if (!response) {
      throw new Error("Failed to generate negotiation response");
    }

    return {
      success: true,
      analysis,
      response,
    };
  });

// -----------------------------------------------------------------------------
// Get Budget Status
// -----------------------------------------------------------------------------

const getBudgetStatusSchema = z.object({
  campaignId: z.string(),
});

export const getBudgetStatusAction = authActionClient
  .schema(getBudgetStatusSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { campaignId } = parsedInput;
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

    const status = await budgetManager.getBudgetStatus(campaignId);
    const breakdown = await budgetManager.getBudgetBreakdown(campaignId);
    const forecast = await budgetManager.forecastUtilization(campaignId);

    return {
      success: true,
      status,
      breakdown,
      forecast,
    };
  });

