import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function updateBalance() {
  const email = "shoezazhareddine@gmail.com";
  const balanceAmount = 100000000; // 1,000,000 USD in cents

  try {
    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email },
      include: {
        partners: {
          include: {
            partner: true,
          },
        },
      },
    });

    if (!user) {
      console.log(`User with email ${email} not found. Creating new user...`);
      user = await prisma.user.create({
        data: {
          email,
          name: "Shoez Azhareddine",
          subscribed: true,
        },
        include: {
          partners: {
            include: {
              partner: true,
            },
          },
        },
      });
      console.log(`✅ User created: ${user.id}`);
    } else {
      console.log(`Found user: ${user.name} (${user.email})`);
    }

    // Find or create partner
    let partner;
    if (user.partners.length > 0) {
      partner = user.partners[0].partner;
      console.log(`Found existing partner: ${partner.id}`);
    } else {
      console.log("No partner found. Creating new partner...");
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

    // Find or create workspace
    let workspace = await prisma.project.findFirst({
      orderBy: { createdAt: "asc" },
    });

    if (!workspace) {
      console.log("No workspace found. Creating new workspace...");
      workspace = await prisma.project.create({
        data: {
          name: "Test Workspace",
          slug: `test-workspace-${Date.now()}`,
          billingCycleStart: 1,
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
      console.log(`Using existing workspace: ${workspace.name}`);
    }

    // Find or create program
    let program = await prisma.program.findFirst({
      where: {
        workspaceId: workspace.id,
      },
    });

    if (!program) {
      console.log("No program found. Creating new program...");

      // Create folder first
      const folder = await prisma.folder.create({
        data: {
          name: "Default Folder",
          projectId: workspace.id,
        },
      });
      console.log(`✅ Folder created: ${folder.id}`);

      // Create group first
      const group = await prisma.partnerGroup.create({
        data: {
          name: "Default Group",
          slug: `default-group-${Date.now()}`,
          workspaceId: workspace.id,
        },
      });
      console.log(`✅ Group created: ${group.id}`);

      program = await prisma.program.create({
        data: {
          name: "Test Program",
          slug: `test-program-${Date.now()}`,
          workspaceId: workspace.id,
          defaultFolderId: folder.id,
          defaultGroupId: group.id,
        },
      });
      console.log(`✅ Program created: ${program.id}`);

      // Update group with programId
      await prisma.partnerGroup.update({
        where: { id: group.id },
        data: { programId: program.id },
      });

      // Enroll partner in program
      await prisma.programEnrollment.create({
        data: {
          programId: program.id,
          partnerId: partner.id,
          status: "approved",
        },
      });
      console.log(`✅ Partner enrolled in program`);
    } else {
      console.log(`Using existing program: ${program.name}`);

      // Check if partner is enrolled
      const enrollment = await prisma.programEnrollment.findUnique({
        where: {
          partnerId_programId: {
            partnerId: partner.id,
            programId: program.id,
          },
        },
      });

      if (!enrollment) {
        await prisma.programEnrollment.create({
          data: {
            programId: program.id,
            partnerId: partner.id,
            status: "approved",
          },
        });
        console.log(`✅ Partner enrolled in program`);
      }
    }

    // Create a commission with the balance amount
    const commission = await prisma.commission.create({
      data: {
        programId: program.id,
        partnerId: partner.id,
        type: "sale",
        amount: balanceAmount,
        earnings: balanceAmount,
        currency: "usd",
        status: "pending",
        description: "Balance update to 1,000,000 USD",
        quantity: 1,
      },
    });

    console.log(`\n✅ Commission created with $${balanceAmount / 100} USD earnings`);
    console.log(`Commission ID: ${commission.id}`);

    // Calculate total pending earnings
    const totalEarnings = await prisma.commission.aggregate({
      where: {
        partnerId: partner.id,
        status: "pending",
      },
      _sum: {
        earnings: true,
      },
    });

    console.log(`\n🎉 Total pending balance for ${email}: $${(totalEarnings._sum.earnings || 0) / 100} USD`);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

updateBalance();
