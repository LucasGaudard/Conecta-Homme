"use server";

import { Prisma, PresenceStatus, UnitStatus, UserRole, UserStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAuditLog } from "@/lib/audit/logger";
import { requireCondominiumRole } from "@/lib/auth/authorization";
import { hashPassword } from "@/lib/auth/password";
import { prisma } from "@/lib/prisma";
import { createUnitSchema, updateUnitSchema } from "@/lib/units/validation";

async function requireAdmin() {
  return requireCondominiumRole("ADMIN");
}

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

function getCreatePayload(formData: FormData) {
  return {
    apartment: getStringValue(formData, "apartment"),
    block: getStringValue(formData, "block"),
    cpf: getStringValue(formData, "cpf"),
    email: getStringValue(formData, "email"),
    phone: getStringValue(formData, "phone"),
    residentEmail: getStringValue(formData, "residentEmail"),
    residentName: getStringValue(formData, "residentName"),
    residentPassword: getStringValue(formData, "residentPassword"),
    residentUsername: getStringValue(formData, "residentUsername"),
    responsibleName: getStringValue(formData, "responsibleName"),
  };
}

function getUpdatePayload(formData: FormData) {
  return {
    cpf: getStringValue(formData, "cpf"),
    email: getStringValue(formData, "email"),
    phone: getStringValue(formData, "phone"),
    presenceStatus: getStringValue(formData, "presenceStatus"),
    responsibleName: getStringValue(formData, "responsibleName"),
    status: getStringValue(formData, "status"),
  };
}

function redirectWithError(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

function handlePrismaError(error: unknown, path: string): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    const target = Array.isArray(error.meta?.target)
      ? error.meta.target.join(", ")
      : String(error.meta?.target ?? "");

    if (
      target.includes("Unit_condominiumId_block_apartment_key") ||
      target.includes("condominiumId") ||
      target.includes("block") ||
      target.includes("apartment")
    ) {
      redirectWithError(path, "Já existe uma unidade com este bloco e apartamento neste condomínio.");
    }

    if (target.includes("email")) {
      redirectWithError(path, "Já existe um usuário com este e-mail.");
    }

    if (target.includes("username")) {
      redirectWithError(path, "Já existe um usuário com este username.");
    }
  }

  redirectWithError(path, "Não foi possível salvar os dados. Tente novamente.");
}

async function getOwnedUnitId(unitId: string, condominiumId: string) {
  const unit = await prisma.unit.findFirst({
    where: {
      condominiumId,
      id: unitId,
    },
    select: {
      id: true,
    },
  });

  return unit?.id ?? null;
}

export async function createUnitAction(formData: FormData) {
  const { condominiumId, user: admin } = await requireAdmin();
  const parsed = createUnitSchema.safeParse(getCreatePayload(formData));

  if (!parsed.success) {
    redirectWithError("/admin/unidades/nova", parsed.error.issues[0]?.message ?? "Dados inválidos.");
  }

  const data = parsed.data;
  let createdUnitId = "";
  let createdUnitLabel = "";

  try {
    const passwordHash = await hashPassword(data.residentPassword);
    const unit = await prisma.$transaction(async (tx) => {
      const createdUnit = await tx.unit.create({
        data: {
          apartment: data.apartment,
          block: data.block,
          condominiumId,
          cpf: data.cpf,
          email: data.email,
          phone: data.phone,
          presenceStatus: PresenceStatus.AWAY,
          responsibleName: data.responsibleName,
          status: UnitStatus.ACTIVE,
        },
      });

      await tx.user.create({
        data: {
          condominiumId,
          email: data.residentEmail,
          name: data.residentName,
          passwordHash,
          role: UserRole.RESIDENT,
          status: UserStatus.ACTIVE,
          unitId: createdUnit.id,
          username: data.residentUsername,
        },
      });

      return createdUnit;
    });

    createdUnitId = unit.id;
    createdUnitLabel = `${unit.block}-${unit.apartment}`;
  } catch (error) {
    handlePrismaError(error, "/admin/unidades/nova");
  }

  await createAuditLog({
    action: "CREATE",
    description: `Unidade ${createdUnitLabel} cadastrada.`,
    entityId: createdUnitId,
    entityType: "Unit",
    module: "UNIT",
    user: admin,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/unidades");
  redirect(`/admin/unidades/${createdUnitId}?success=${encodeURIComponent("Unidade cadastrada com sucesso.")}`);
}

export async function updateUnitAction(unitId: string, formData: FormData) {
  const { condominiumId, user: admin } = await requireAdmin();
  const parsed = updateUnitSchema.safeParse(getUpdatePayload(formData));
  const errorPath = `/admin/unidades/${unitId}/editar`;
  let updatedUnitLabel = "";

  if (!parsed.success) {
    redirectWithError(errorPath, parsed.error.issues[0]?.message ?? "Dados inválidos.");
  }

  const ownedUnitId = await getOwnedUnitId(unitId, condominiumId);

  if (!ownedUnitId) {
    redirectWithError("/admin/unidades", "Unidade não encontrada.");
  }

  try {
    const unit = await prisma.unit.update({
      where: { id: ownedUnitId },
      data: parsed.data,
    });
    updatedUnitLabel = `${unit.block}-${unit.apartment}`;
  } catch (error) {
    handlePrismaError(error, errorPath);
  }

  await createAuditLog({
    action: "UPDATE",
    description: `Unidade ${updatedUnitLabel} atualizada.`,
    entityId: ownedUnitId,
    entityType: "Unit",
    module: "UNIT",
    user: admin,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/unidades");
  revalidatePath(`/admin/unidades/${ownedUnitId}`);
  redirect(`/admin/unidades/${ownedUnitId}?success=${encodeURIComponent("Unidade atualizada com sucesso.")}`);
}

export async function inactivateUnitAction(unitId: string) {
  const { condominiumId, user: admin } = await requireAdmin();
  const ownedUnitId = await getOwnedUnitId(unitId, condominiumId);

  if (!ownedUnitId) {
    redirectWithError("/admin/unidades", "Unidade não encontrada.");
  }

  const unit = await prisma.$transaction(async (tx) => {
    const updatedUnit = await tx.unit.update({
      where: { id: ownedUnitId },
      data: {
        status: UnitStatus.INACTIVE,
      },
    });

    await tx.user.updateMany({
      where: {
        condominiumId,
        role: UserRole.RESIDENT,
        unitId: ownedUnitId,
      },
      data: {
        status: UserStatus.INACTIVE,
      },
    });

    return updatedUnit;
  });

  await createAuditLog({
    action: "INACTIVATE",
    description: `Unidade ${unit.block}-${unit.apartment} inativada.`,
    entityId: unit.id,
    entityType: "Unit",
    module: "UNIT",
    user: admin,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/unidades");
  revalidatePath(`/admin/unidades/${ownedUnitId}`);
  redirect(`/admin/unidades?success=${encodeURIComponent("Unidade inativada com sucesso.")}`);
}
