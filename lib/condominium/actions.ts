"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAuditLog } from "@/lib/audit/logger";
import { requireCondominiumRole } from "@/lib/auth/authorization";
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
  const { condominiumId, user: admin } = await requireCondominiumRole("ADMIN");

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
      error: parsed.error.issues[0]?.message ?? "Dados inválidos.",
    });
  }

  const data = parsed.data;

  const settings = await prisma.condominium.update({
    where: {
      id: condominiumId,
    },
    data,
  });

  await createAuditLog({
    action: "UPDATE",
    description: `Configurações do condomínio ${settings.name} atualizadas.`,
    entityId: settings.id,
    entityType: "Condominium",
    module: "CONDOMINIUM",
    user: admin,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/condominio");
  redirectWithMessage({
    success: "Configurações do condomínio atualizadas.",
  });
}
