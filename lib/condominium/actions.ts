"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAuditLog } from "@/lib/audit/logger";
import {
  CONDOMINIUM_SETTINGS_ID,
  defaultCondominiumSettings,
} from "@/lib/condominium/constants";
import { requireAdminUser } from "@/lib/condominium/queries";
import { updateCondominiumSettingsSchema } from "@/lib/condominium/validation";
import { prisma } from "@/lib/prisma";

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

function redirectWithMessage(params: Record<string, string>): never {
  const searchParams = new URLSearchParams(params);

  redirect(`/admin/condominio?${searchParams.toString()}`);
}

export async function updateCondominiumSettingsAction(formData: FormData) {
  const admin = await requireAdminUser();

  const parsed = updateCondominiumSettingsSchema.safeParse({
    address: getStringValue(formData, "address"),
    email: getStringValue(formData, "email"),
    logoUrl: getStringValue(formData, "logoUrl"),
    name: getStringValue(formData, "name"),
    phone: getStringValue(formData, "phone"),
    porterHours: getStringValue(formData, "porterHours"),
  });

  if (!parsed.success) {
    redirectWithMessage({
      error: parsed.error.issues[0]?.message ?? "Dados invalidos.",
    });
  }

  const data = parsed.data;

  const settings = await prisma.condominiumSettings.upsert({
    where: {
      id: CONDOMINIUM_SETTINGS_ID,
    },
    update: data,
    create: {
      id: CONDOMINIUM_SETTINGS_ID,
      ...defaultCondominiumSettings,
      ...data,
    },
  });

  await createAuditLog({
    action: "UPDATE",
    description: `Configuracoes do condominio ${settings.name} atualizadas.`,
    entityId: settings.id,
    entityType: "CondominiumSettings",
    module: "CONDOMINIUM",
    user: admin,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/condominio");
  redirectWithMessage({
    success: "Configuracoes do condominio atualizadas.",
  });
}
