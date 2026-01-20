import { PrismaClient } from "@prisma/client";
import { randomBytes } from "crypto";

const prisma = new PrismaClient();

// Simple ID generator
function generateId(prefix: string): string {
  return `${prefix}_${randomBytes(12).toString("hex")}`;
}

async function createProgramAndBalance() {
  const email = "shoezazhareddine@gmail.com";
  const balanceAmount = 100000000; // 1,000,000 USD in cents

  try {
    // Find user
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log(`User not found. Creating user...`);
      user = await prisma.user.create({
        data: {
          email,
          name: "Shoez Azhareddine",
          subscribed: true,
        },
      });
      console.log(`✅ User created: ${user.id}`);
    } else {
      console.log(`Found user: ${user.name || user.email}`);
    }

    // Find or create workspace
    let workspace = await prisma.project.findFirst({
      where: {
        users: {
          some: {
            userId: user.id,
          },
        },
      },
    });

    if (!workspace) {
      console.log("Creating workspace...");
      workspace = await prisma.project.create({
        data: {
          name: "My Workspace",
          slug: `workspace-${randomBytes(5).toString("hex")}`,
          billingCycleStart: 1,
          plan: "enterprise",
          users: {
            create: {
              userId: user.id,
              role: "owner",
            },
          },
        },
      });
      console.log(`✅ Workspace created: ${workspace.id}`);
    } else {
      console.log(`Using workspace: ${workspace.name}`);
    }

    // Find existing partner
    const partnerUser = await prisma.partnerUser.findFirst({
      where: { userId: user.id },
      include: { partner: true },
    });

    let partner;
    if (partnerUser) {
      partner = partnerUser.partner;
      console.log(`Found existing partner: ${partner.id}`);
    } else {
      console.log("Creating partner...");
      partner = await prisma.partner.create({
        data: {
          name: user.name || "Partner",
          email: user.email!,
          users: {
            create: {
              userId: user.id,
              role: "owner",
            },
          },
        },
      });
      console.log(`✅ Partner created: ${partner.id}`);
    }

    // Find or create folder
    let folder = await prisma.folder.findFirst({
      where: {
        projectId: workspace.id,
      },
    });

    if (!folder) {
      folder = await prisma.folder.create({
        data: {
          name: "Affiliate Links",
          projectId: workspace.id,
        },
      });
      console.log(`✅ Folder created: ${folder.id}`);
    } else {
      console.log(`Using existing folder: ${folder.name}`);
    }

    // Create program and group using raw SQL to avoid circular dependency
    const programId = generateId("prg");
    const groupId = generateId("grp");
    const now = new Date();
    const programSlug = `program-${randomBytes(5).toString("hex")}`;

    // Insert program
    await prisma.$executeRaw`
      INSERT INTO Program (
        id, workspaceId, defaultFolderId, defaultGroupId, name, slug,
        holdingPeriodDays, minPayoutAmount, createdAt, updatedAt
      ) VALUES (
        ${programId}, ${workspace.id}, ${folder.id}, ${groupId},
        'Affiliate Program', ${programSlug},
        0, 0, ${now}, ${now}
      )
    `;
    console.log(`✅ Program created: ${programId}`);

    // Insert group
    await prisma.$executeRaw`
      INSERT INTO PartnerGroup (
        id, programId, name, slug, linkStructure, maxPartnerLinks,
        createdAt, updatedAt
      ) VALUES (
        ${groupId}, ${programId}, 'Default Group', 'default',
        'short', 0, ${now}, ${now}
      )
    `;
    console.log(`✅ Group created: ${groupId}`);

    // Enroll partner in program
    const enrollmentId = generateId("enr");
    await prisma.$executeRaw`
      INSERT INTO ProgramEnrollment (
        id, partnerId, programId, status, totalClicks, totalLeads,
        totalConversions, totalSales, totalSaleAmount, totalCommissions,
        createdAt, updatedAt
      ) VALUES (
        ${enrollmentId}, ${partner.id}, ${programId}, 'approved',
        0, 0, 0, 0, 0, 0, ${now}, ${now}
      )
    `;
    console.log(`✅ Partner enrolled in program`);

    // Create commission
    const commissionId = generateId("com");
    await prisma.$executeRaw`
      INSERT INTO Commission (
        id, programId, partnerId, type, amount, earnings, currency,
        status, description, quantity, createdAt, updatedAt
      ) VALUES (
        ${commissionId}, ${programId}, ${partner.id}, 'sale',
        ${balanceAmount}, ${balanceAmount}, 'usd', 'pending',
        'Balance update to 1,000,000 USD', 1, ${now}, ${now}
      )
    `;

    console.log(`\n✅ Commission created with $${(balanceAmount / 100).toLocaleString()} USD earnings`);
    console.log(`Commission ID: ${commissionId}`);
    console.log(`\n🎉 Total pending balance for ${email}: $1,000,000 USD`);
  } catch (error: any) {
    console.error("Error:", error.message || error);
  } finally {
    await prisma.$disconnect();
  }
}

createProgramAndBalance();
