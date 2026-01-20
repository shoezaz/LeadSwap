import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function updateCommissionStatus() {
  const email = "shoezazhareddine@gmail.com";

  try {
    // Find partner
    const partner = await prisma.partner.findUnique({
      where: { email },
    });

    if (!partner) {
      console.log(`❌ Partner with email ${email} not found`);
      return;
    }

    console.log(`Found partner: ${partner.name}`);

    // Update all pending commissions to processed
    const result = await prisma.commission.updateMany({
      where: {
        partnerId: partner.id,
        status: "pending",
      },
      data: {
        status: "processed",
      },
    });

    console.log(`✅ Updated ${result.count} commissions to "processed" status`);

    // Calculate total processed earnings
    const totalEarnings = await prisma.commission.aggregate({
      where: {
        partnerId: partner.id,
        status: "processed",
      },
      _sum: {
        earnings: true,
      },
    });

    console.log(`\n🎉 Total available balance for ${email}: $${((totalEarnings._sum.earnings || 0) / 100).toLocaleString()} USD`);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

updateCommissionStatus();
