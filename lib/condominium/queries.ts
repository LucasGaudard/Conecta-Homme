import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import {
  CONDOMINIUM_SETTINGS_ID,
  defaultCondominiumSettings,
} from "@/lib/condominium/constants";
import { prisma } from "@/lib/prisma";

export async function requireAdminUser() {
  const user = await getCurrentUser();

  if (!user || user.role !== UserRole.ADMIN) {
    redirect("/login");
  }

  return user;
}

export async function getCondominiumSettings() {
  await requireAdminUser();

  return prisma.condominiumSettings.upsert({
    where: {
      id: CONDOMINIUM_SETTINGS_ID,
    },
    update: {},
    create: {
      id: CONDOMINIUM_SETTINGS_ID,
      ...defaultCondominiumSettings,
    },
  });
}
