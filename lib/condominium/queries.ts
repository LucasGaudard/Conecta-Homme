import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { requireCondominiumRole } from "@/lib/auth/authorization";
import {
  CONDOMINIUM_SETTINGS_ID,
  defaultCondominiumSettings,
} from "@/lib/condominium/constants";
import { prisma } from "@/lib/prisma";

export async function requireAdminUser() {
  return (await requireCondominiumRole(UserRole.ADMIN)).user;
}

export async function getCondominiumSettings() {
  const { condominiumId } = await requireCondominiumRole(UserRole.ADMIN);
  const condominium = await prisma.condominium.findFirst({
    where: {
      id: condominiumId,
    },
    select: {
      address: true,
      email: true,
      logoUrl: true,
      name: true,
      phone: true,
      porterHours: true,
      updatedAt: true,
    },
  });

  if (!condominium) {
    redirect("/login");
  }

  return condominium;
}

// Legacy V1.x compatibility only. V2.0 admin settings use Condominium scoped by
// the authenticated tenant, not this shared singleton.
export async function getLegacyCondominiumSettings() {
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
