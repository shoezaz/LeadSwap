"use server";

import { authActionClient } from "../safe-action";
import { z } from "zod";
import { prisma } from "@leadswap/prisma";

const createOutreachCampaignSchema = z.object({
  workspaceId: z.string(),
  programId: z.string().optional(),
  
  // Campaign Info
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  type: z.enum(["paid_collaboration", "gifting", "no_strings_seeding", "usage_rights"]),
  
  // Brand Info
  brandName: z.string().min(1, "Brand name is required"),
  brandWebsite: z.string().url().optional().or(z.literal("")),
  brandInstagram: z.string().optional(),
  brandDescription: z.string().optional(),
  productName: z.string().optional(),
  productDescription: z.string().optional(),
  
  // Budget
  budgetTotal: z.number().positive("Budget must be positive"),
  budgetMaxPerCreator: z.number().positive().optional(),
  currency: z.string().default("USD"),
  
  // Settings
  approvalMode: z.enum(["manual", "auto", "hybrid"]).default("manual"),
  approvalThreshold: z.number().positive().optional(),
  aiEnabled: z.boolean().default(true),
  
  // Targeting
  targetAudience: z.string().optional(),
  targetNiches: z.array(z.string()).default([]),
  targetPlatforms: z.array(z.string()).default([]),
  
  // Deliverables
  deliverables: z.object({
    posts: z.number().optional(),
    stories: z.number().optional(),
    reels: z.number().optional(),
    tiktoks: z.number().optional(),
    youtube: z.number().optional(),
  }).optional(),
  
  usageRights: z.object({
    organic_days: z.number().default(30),
    paid_ads_days: z.number().default(0),
  }).optional(),
  
  // Dates
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export type CreateOutreachCampaignInput = z.infer<typeof createOutreachCampaignSchema>;

export const createOutreachCampaignAction = authActionClient
  .schema(createOutreachCampaignSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { user } = ctx;
    
    // Verify workspace access
    const workspace = await prisma.project.findFirst({
      where: {
        id: parsedInput.workspaceId,
        users: {
          some: { userId: user.id },
        },
      },
    });

    if (!workspace) {
      throw new Error("Workspace not found or access denied");
    }

    // Create the campaign
    const campaign = await prisma.outreachCampaign.create({
      data: {
        workspaceId: parsedInput.workspaceId,
        programId: parsedInput.programId,
        userId: user.id,
        
        name: parsedInput.name,
        description: parsedInput.description,
        type: parsedInput.type,
        status: "draft",
        
        brandName: parsedInput.brandName,
        brandWebsite: parsedInput.brandWebsite || null,
        brandInstagram: parsedInput.brandInstagram,
        brandDescription: parsedInput.brandDescription,
        productName: parsedInput.productName,
        productDescription: parsedInput.productDescription,
        
        budgetTotal: parsedInput.budgetTotal,
        budgetMaxPerCreator: parsedInput.budgetMaxPerCreator,
        currency: parsedInput.currency,
        
        approvalMode: parsedInput.approvalMode,
        approvalThreshold: parsedInput.approvalThreshold,
        aiEnabled: parsedInput.aiEnabled,
        
        targetAudience: parsedInput.targetAudience,
        targetNiches: parsedInput.targetNiches,
        targetPlatforms: parsedInput.targetPlatforms,
        
        deliverables: parsedInput.deliverables,
        usageRights: parsedInput.usageRights,
        
        startDate: parsedInput.startDate ? new Date(parsedInput.startDate) : null,
        endDate: parsedInput.endDate ? new Date(parsedInput.endDate) : null,
      },
    });

    // Log audit
    await prisma.outreachAuditLog.create({
      data: {
        campaignId: campaign.id,
        userId: user.id,
        action: "campaign_created",
        metadata: {
          name: campaign.name,
          type: campaign.type,
          budgetTotal: parsedInput.budgetTotal,
        },
      },
    });

    return {
      success: true,
      campaign: {
        id: campaign.id,
        name: campaign.name,
        status: campaign.status,
      },
    };
  });

