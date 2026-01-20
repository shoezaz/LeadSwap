import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function updateBalance() {
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
      // Create new partner
      console.log("Creating new partner...");
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

    // Find any existing program
    const program = await prisma.program.findFirst({
      orderBy: { createdAt: "desc" },
    });

    if (!program) {
      console.log("❌ No program found in the database. Please create a program first through the application.");
      return;
    }

    console.log(`Using program: ${program.name} (${program.id})`);

    // Check if partner is enrolled in this program
    let enrollment = await prisma.programEnrollment.findUnique({
      where: {
        partnerId_programId: {
          partnerId: partner.id,
          programId: program.id,
        },
      },
    });

    if (!enrollment) {
      console.log("Enrolling partner in program...");
      enrollment = await prisma.programEnrollment.create({
        data: {
          programId: program.id,
          partnerId: partner.id,
          status: "approved",
        },
      });
      console.log(`✅ Partner enrolled in program`);
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

    console.log(`\n✅ Commission created with $${(balanceAmount / 100).toLocaleString()} USD earnings`);
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

    console.log(`\n🎉 Total pending balance for ${email}: $${((totalEarnings._sum.earnings || 0) / 100).toLocaleString()} USD`);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

updateBalance();
