"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function verifyMeter(meterNumber: string) {
  return await prisma.meter.findUnique({
    where: { meterNumber },
    include: { user: true },
  });
}

export async function getDemoMeters() {
  const roles = [
    { role: "TEACHER", name: "Manoj (Educator)", meterId: "MTR-MANOJ" },
    { role: "PARENT", name: "Guardian of Ranjith", meterId: "MTR-PARENT" },
    { role: "CHILD", name: "Ranjith", meterId: "MTR-RANJITH" }
  ];

  for (const r of roles) {
    let meter = await prisma.meter.findUnique({
      where: { meterNumber: r.meterId },
      include: { user: true }
    });

    if (!meter) {
      await prisma.user.create({
        data: {
          name: r.name,
          role: r.role,
          points: 150,
          level: 1,
          meter: {
            create: {
              meterNumber: r.meterId,
              joulesGenerated: 50,
              joulesNeeded: 0,
              joulesFulfilled: 0,
            }
          }
        }
      });
    }
  }

  return {
    teacher: "MTR-MANOJ",
    parent: "MTR-PARENT",
    child: "MTR-RANJITH"
  };
}

export async function activateMeter(role: string, name: string, email?: string) {
  const meterNumber = "MTR-" + Math.random().toString(36).substring(2, 8).toUpperCase();
  if (email) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new Error("This email is already registered to another meter.");
  }

  const user = await prisma.user.create({
    data: {
      name,
      email: email || null,
      role: role.toUpperCase(),
      points: 100,
      level: 1,
      meter: {
        create: {
          meterNumber,
          joulesGenerated: 10,
          joulesNeeded: 0,
          joulesFulfilled: 0,
        },
      },
      activities: {
        create: {
          type: "JOINED",
          message: `${name} activated a new Energy Meter!`,
        }
      }
    },
    include: {
      meter: true,
    },
  });

  return meterNumber;
}

/**
 * STEP 1: PROPOSE FULFILLMENT
 * Someone says "I've got this!". It moves to PENDING.
 */
export async function proposeFulfillment(needId: string, helperMeterNumber: string) {
  const need = await prisma.need.findUnique({ where: { id: needId } });
  if (!need || need.status !== "LOGGED") return null;

  const helperMeter = await prisma.meter.findUnique({
    where: { meterNumber: helperMeterNumber },
    include: { user: true }
  });

  if (!helperMeter || !helperMeter.user) throw new Error("Helper not found");
  if (need.userId === helperMeter.user.id) throw new Error("You cannot fulfill your own gap!");

  await prisma.need.update({
    where: { id: needId },
    data: {
      status: "PENDING",
      fulfilledById: helperMeter.user.id
    }
  });

  revalidatePath("/needs");
  revalidatePath("/dashboard");
  return true;
}

/**
 * STEP 2: CONFIRM FULFILLMENT (Teacher Only)
 * Teacher verifies the item was received. Awards points and energy.
 */
export async function confirmFulfillment(needId: string) {
  const need = await prisma.need.findUnique({
    where: { id: needId },
    include: { 
      user: { include: { meter: true } },
      fulfilledBy: { include: { meter: true } }
    }
  });

  if (!need || need.status !== "PENDING" || !need.fulfilledBy) return null;

  // 1. AWARD ENERGY TO RECIPIENT
  if (need.user.meter) {
    await prisma.meter.update({
      where: { id: need.user.meter.id },
      data: {
        joulesNeeded: Math.max(0, need.user.meter.joulesNeeded - need.jouleProxy),
        joulesFulfilled: need.user.meter.joulesFulfilled + need.jouleProxy,
      }
    });
  }

  // 2. AWARD POINTS & ENERGY TO HELPER
  const helper = need.fulfilledBy;
  if (helper.meter) {
    const newPoints = helper.points + 100;
    const newLevel = Math.floor(newPoints / 500) + 1;

    await prisma.user.update({
      where: { id: helper.id },
      data: { points: newPoints, level: newLevel }
    });

    await prisma.meter.update({
      where: { id: helper.meter.id },
      data: { joulesGenerated: helper.meter.joulesGenerated + need.jouleProxy }
    });
  }

  // 3. COMPLETE THE NEED
  await prisma.need.update({
    where: { id: needId },
    data: { status: "FULFILLED" }
  });

  await prisma.activity.create({
    data: {
      type: "FULFILLED",
      message: `Teacher verified: ${helper.name}'s contribution for ${need.user.name} is complete! ⚡`,
      userId: helper.id,
      meterId: helper.meter?.id,
    }
  });

  revalidatePath("/dashboard");
  revalidatePath("/needs");
  return true;
}

export async function getMeterStats(meterNumber: string) {
  const meter = await prisma.meter.findUnique({
    where: { meterNumber },
    include: { 
      user: {
        include: {
          badges: true,
          activities: { orderBy: { createdAt: 'desc' }, take: 5 }
        }
      }
    },
  });
  return meter;
}

export async function sendThanks(needId: string, message: string) {
  const need = await prisma.need.update({
    where: { id: needId },
    data: { thanksMessage: message }
  });

  if (need.fulfilledById) {
    await prisma.activity.create({
      data: {
        type: "FULFILLED",
        message: `💖 Gratitude Note: "${message}"`,
        userId: need.fulfilledById,
      }
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/needs");
  return true;
}

export async function deleteNeed(needId: string) {
  await prisma.need.delete({
    where: { id: needId }
  });
  revalidatePath("/dashboard");
  revalidatePath("/needs");
  revalidatePath("/admin/database");
  return true;
}

export async function deleteActivity(activityId: string) {
  await prisma.activity.delete({
    where: { id: activityId }
  });
  revalidatePath("/dashboard");
  return true;
}

export async function getSchoolStats() {
  const totals = await prisma.meter.aggregate({
    _sum: { joulesGenerated: true, joulesFulfilled: true, joulesNeeded: true }
  });
  const activeMeters = await prisma.meter.count();
  const recentActivities = await prisma.activity.findMany({
    orderBy: { createdAt: 'desc' }, take: 10, include: { user: true }
  });
  const pendingNeeds = await prisma.need.findMany({
    where: { status: "PENDING" },
    include: { user: true, fulfilledBy: true }
  });
  return { totals, activeMeters, recentActivities, pendingNeeds };
}

export async function logNeed(meterNumber: string, title: string, category: string, description: string) {
  const meter = await prisma.meter.findUnique({
    where: { meterNumber },
    include: { user: true },
  });
  const proxyMap: Record<string, number> = {
    Learning: 50, Care: 40, Nutrition: 60, Safety: 80, Tools: 30, Wellbeing: 50, Mobility: 45, Restoration: 55,
  };
  const jouleProxy = proxyMap[category] ?? 50;
  if (!meter?.user?.id) throw new Error("Meter not found");

  const need = await prisma.need.create({
    data: {
      title, description, category, jouleProxy, status: "LOGGED", userId: meter.user.id,
    },
  });

  await prisma.meter.update({
    where: { id: meter.id },
    data: { joulesNeeded: meter.joulesNeeded + jouleProxy },
  });

  revalidatePath("/dashboard");
  revalidatePath("/needs");
  return need;
}

export async function getNeeds(meterNumber: string) {
  return prisma.need.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true, fulfilledBy: true }
  });
}

export async function getAllData() {
  const [users, meters, needs] = await Promise.all([
    prisma.user.findMany({ include: { meter: true } }),
    prisma.meter.findMany(),
    prisma.need.findMany()
  ]);
  return { users, meters, needs };
}

export async function recoverMeterId(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { meter: true }
  });
  if (!user || !user.meter) throw new Error("No account found with this email.");
  return user.meter.meterNumber;
}

export async function getClassroomRoster() {
  return await prisma.user.findMany({
    where: { role: "CHILD" },
    include: { meter: true },
    orderBy: { name: "asc" }
  });
}

export async function getPublicUrl() {
  try {
    const fs = require('fs');
    const path = require('path');
    const tunnelPath = path.join(process.cwd(), 'public', 'tunnel.txt');
    if (fs.existsSync(tunnelPath)) {
      return fs.readFileSync(tunnelPath, 'utf8').trim();
    }
  } catch (e) {
    console.error("Error reading tunnel URL", e);
  }
  return null;
}
