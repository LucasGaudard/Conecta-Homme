"use server";

import { CondominiumStatus, Prisma, UserRole, UserStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAuditLog } from "@/lib/audit/logger";
import { requireSuperAdmin } from "@/lib/auth/authorization";
import { hashPassword } from "@/lib/auth/password";
import { prisma } from "@/lib/prisma";
import {
  condominiumIdSchema,
  condominiumStatusActionSchema,
  createCondominiumSchema,
  updateCondominiumSchema,
} from "@/lib/super-admin/validation";

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

function redirectWithMessage(path: string, params: Record<string, string>): never {
  const searchParams = new URLSearchParams(params);

  redirect(`${path}?${searchParams.toString()}`);
}

function parseTrialEndsAt(value?: string) {
  return value ? new Date(`${value}T00:00:00`) : undefined;
}

function handlePrismaError(error: unknown, path: string): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    const target = Array.isArray(error.meta?.target)
      ? error.meta.target.join(", ")
      : String(error.meta?.target ?? "");

    if (target.includes("slug")) {
      redirectWithMessage(path, { error: "Ja existe um condominio com este slug." });
    }

    if (target.includes("email")) {
      redirectWithMessage(path, { error: "Ja existe um usuario com este e-mail." });
    }
  }

  redirectWithMessage(path, {
    error: "Nao foi possivel salvar os dados. Tente novamente.",
  });
}

function getCondominiumPayload(formData: FormData) {
  return {
    address: getStringValue(formData, "address"),
    billingEmail: getStringValue(formData, "billingEmail"),
    document: getStringValue(formData, "document"),
    email: getStringValue(formData, "email"),
    logoUrl: getStringValue(formData, "logoUrl"),
    name: getStringValue(formData, "name"),
    phone: getStringValue(formData, "phone"),
    planCode: getStringValue(formData, "planCode"),
    porterHours: getStringValue(formData, "porterHours"),
    slug: getStringValue(formData, "slug"),
    trialEndsAt: getStringValue(formData, "trialEndsAt"),
  };
}

export async function createCondominiumAction(formData: FormData) {
  const superAdmin = await requireSuperAdmin();
  const parsed = createCondominiumSchema.safeParse({
    ...getCondominiumPayload(formData),
    adminEmail: getStringValue(formData, "adminEmail"),
    adminName: getStringValue(formData, "adminName"),
    adminPassword: getStringValue(formData, "adminPassword"),
    adminPhone: getStringValue(formData, "adminPhone"),
  });

  if (!parsed.success) {
    redirectWithMessage("/super-admin/condominios/novo", {
      error: parsed.error.issues[0]?.message ?? "Dados invalidos.",
    });
  }

  const data = parsed.data;
  let createdId = "";

  try {
    const result = await prisma.$transaction(async (tx) => {
      const condominium = await tx.condominium.create({
        data: {
          address: data.address,
          billingEmail: data.billingEmail,
          document: data.document,
          email: data.email,
          logoUrl: data.logoUrl,
          name: data.name,
          phone: data.phone,
          planCode: data.planCode,
          porterHours: data.porterHours,
          slug: data.slug,
          status: CondominiumStatus.ACTIVE,
          trialEndsAt: parseTrialEndsAt(data.trialEndsAt),
        },
      });

      await createAuditLog(
        {
          action: "CREATE",
          description: `Condominio ${condominium.name} criado.`,
          entityId: condominium.id,
          entityType: "Condominium",
          module: "PLATFORM",
          user: superAdmin,
        },
        tx,
      );

      if (data.adminEmail && data.adminName && data.adminPassword) {
        const admin = await tx.user.create({
          data: {
            condominiumId: condominium.id,
            email: data.adminEmail,
            name: data.adminName,
            passwordHash: await hashPassword(data.adminPassword),
            phone: data.adminPhone,
            role: UserRole.ADMIN,
            status: UserStatus.ACTIVE,
          },
        });

        await createAuditLog(
          {
            action: "CREATE",
            description: `Admin inicial ${admin.name} criado para ${condominium.name}.`,
            entityId: admin.id,
            entityType: "User",
            module: "PLATFORM",
            user: superAdmin,
          },
          tx,
        );
      }

      return condominium;
    });

    createdId = result.id;
  } catch (error) {
    handlePrismaError(error, "/super-admin/condominios/novo");
  }

  revalidatePath("/super-admin");
  revalidatePath("/super-admin/condominios");
  redirectWithMessage(`/super-admin/condominios/${createdId}`, {
    success: "Condominio criado com sucesso.",
  });
}

export async function updateCondominiumAction(id: string, formData: FormData) {
  const superAdmin = await requireSuperAdmin();
  const parsedId = condominiumIdSchema.safeParse(id);
  const parsed = updateCondominiumSchema.safeParse({
    ...getCondominiumPayload(formData),
    status: getStringValue(formData, "status"),
  });
  const errorPath = `/super-admin/condominios/${id}/editar`;

  if (!parsedId.success || !parsed.success) {
    redirectWithMessage(errorPath, {
      error: parsed.error?.issues[0]?.message ?? "Condominio invalido.",
    });
  }

  const data = parsed.data;

  try {
    const updated = await prisma.condominium.update({
      where: { id: parsedId.data },
      data: {
        address: data.address,
        billingEmail: data.billingEmail,
        document: data.document,
        email: data.email,
        logoUrl: data.logoUrl,
        name: data.name,
        phone: data.phone,
        planCode: data.planCode,
        porterHours: data.porterHours,
        slug: data.slug,
        status: data.status,
        trialEndsAt: parseTrialEndsAt(data.trialEndsAt),
      },
    });

    await createAuditLog({
      action: "UPDATE",
      description: `Condominio ${updated.name} atualizado.`,
      entityId: updated.id,
      entityType: "Condominium",
      module: "PLATFORM",
      user: superAdmin,
    });
  } catch (error) {
    handlePrismaError(error, errorPath);
  }

  revalidatePath("/super-admin");
  revalidatePath("/super-admin/condominios");
  revalidatePath(`/super-admin/condominios/${id}`);
  redirectWithMessage(`/super-admin/condominios/${id}`, {
    success: "Condominio atualizado com sucesso.",
  });
}

export async function changeCondominiumStatusAction(formData: FormData) {
  const superAdmin = await requireSuperAdmin();
  const parsed = condominiumStatusActionSchema.safeParse({
    id: getStringValue(formData, "id"),
    status: getStringValue(formData, "status"),
  });

  if (!parsed.success) {
    redirectWithMessage("/super-admin/condominios", {
      error: parsed.error.issues[0]?.message ?? "Dados invalidos.",
    });
  }

  const updated = await prisma.condominium.update({
    where: { id: parsed.data.id },
    data: { status: parsed.data.status },
  });

  await createAuditLog({
    action: "STATUS",
    description: `Status do condominio ${updated.name} alterado para ${updated.status}.`,
    entityId: updated.id,
    entityType: "Condominium",
    module: "PLATFORM",
    user: superAdmin,
  });

  revalidatePath("/super-admin");
  revalidatePath("/super-admin/condominios");
  revalidatePath(`/super-admin/condominios/${updated.id}`);
  redirectWithMessage("/super-admin/condominios", {
    success: "Status do condominio atualizado com sucesso.",
  });
}
