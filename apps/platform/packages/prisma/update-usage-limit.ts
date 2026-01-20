import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function updateUsageLimit() {
  const email = "shoezazhareddine@gmail.com";

  try {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        projects: {
          include: {
            project: true,
          },
        },
      },
    });

    if (!user) {
      console.log(`❌ User with email ${email} not found`);
      return;
    }

    console.log(`Found user: ${user.name || user.email}`);

    if (user.projects.length === 0) {
      console.log(`❌ No workspace found for this user`);
      return;
    }

    // Update all workspaces for this user
    for (const projectUser of user.projects) {
      await prisma.project.update({
        where: { id: projectUser.projectId },
        data: {
          usageLimit: 1000000,
          linksLimit: 1000000,
          plan: "enterprise",
        },
      });

      console.log(`✅ Updated workspace: ${projectUser.project.name}`);
      console.log(`   - Usage limit: 1,000,000`);
      console.log(`   - Links limit: 1,000,000`);
      console.log(`   - Plan: enterprise`);
    }

    console.log(`\n🎉 All workspaces updated for ${email}`);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

updateUsageLimit();
