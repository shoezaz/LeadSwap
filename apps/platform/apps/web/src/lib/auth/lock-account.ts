import { prisma } from "@leadswap/prisma";
import { User } from "@leadswap/prisma/client";
import { MAX_LOGIN_ATTEMPTS } from "./constants";

export const incrementLoginAttempts = async (
  user: Pick<User, "id" | "email">,
) => {
  // Use transaction to atomically increment and lock if threshold exceeded
  // This prevents race conditions where multiple concurrent requests could
  // all pass the threshold check before any acquire the lock
  const result = await prisma.$transaction(async (tx) => {
    const updated = await tx.user.update({
      where: { id: user.id },
      data: {
        invalidLoginAttempts: {
          increment: 1,
        },
      },
      select: {
        lockedAt: true,
        invalidLoginAttempts: true,
      },
    });

    // Atomically lock the account if threshold is reached and not already locked
    if (!updated.lockedAt && updated.invalidLoginAttempts >= MAX_LOGIN_ATTEMPTS) {
      const locked = await tx.user.update({
        where: {
          id: user.id,
          lockedAt: null, // Only lock if not already locked (prevents double-lock)
        },
        data: {
          lockedAt: new Date(),
        },
        select: {
          lockedAt: true,
          invalidLoginAttempts: true,
        },
      });

      return locked;
    }

    return updated;
  });

  return {
    invalidLoginAttempts: result.invalidLoginAttempts,
    lockedAt: result.lockedAt,
  };
};

export const exceededLoginAttemptsThreshold = (
  user: Pick<User, "invalidLoginAttempts">,
) => {
  return user.invalidLoginAttempts >= MAX_LOGIN_ATTEMPTS;
};
