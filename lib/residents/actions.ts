"use server";

import { Prisma, UnitStatus, UserRole, UserStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAuditLog } from "@/lib/audit/logger";
import { requireCondominiumRole } from "@/lib/auth/authorization";
import { prisma } from "@/lib/prisma";
import { residentStatusSchema, updateResidentSchema } from "@/lib/residents/validation";

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

function redirectWithMessage(path: string, params: Record<string, string>): never {
  const searchParams = new URLSearchParams(params);

  redirect(`${path}?${searchParams.toString()}`);
}

async function getOwnedResident(id: string, condominiumId: string) {
  return prisma.user.findFirst({
    where: {
      condominiumId,
      id,
      role: UserRole.RESIDENT,
    },
    include: {
      unit: {
        select: {
          apartment: true,
          block: true,
          id: true,
          status: true,
        },
      },
    },
  });
}

function handleResidentError(error: unknown, path: string): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    const target = Array.isArray(error.meta?.target)
      ? error.meta.target.join(", ")
      : String(error.meta?.target ?? "");

    if (target.includes("email")) {
      redirectWithMessage(path, { error: "Já existe um usuário com este e-mail." });
    }

    if (target.includes("username")) {
      redirectWithMessage(path, { error: "Já existe um usuário com este username." });
    }
  }

  redirectWithMessage(path, {
    error: "Não foi possível salvar o morador. Tente novamente.",
  });
}

export async function updateResidentAction(id: string, formData: FormData) {
  const { condominiumId, user: admin } = await requireCondominiumRole("ADMIN");
  const errorPath = `/admin/moradores/${id}/editar`;
  const parsed = updateResidentSchema.safeParse({
    email: getStringValue(formData, "email"),
    name: getStringValue(formData, "name"),
    phone: getStringValue(formData, "phone"),
    username: getStringValue(formData, "username"),
  });

  if (!parsed.success) {
    redirectWithMessage(errorPath, {
      error: parsed.error.issues[0]?.message ?? "Dados inválidos.",
    });
  }

  const resident = await getOwnedResident(id, condominiumId);

  if (!resident) {
    redirectWithMessage("/admin/moradores", {
      error: "Morador não encontrado.",
    });
  }

  try {
    await prisma.user.update({
      where: { id: resident.id },
      data: parsed.data,
    });
  } catch (error) {
    handleResidentError(error, errorPath);
  }

  await createAuditLog({
    action: "UPDATE",
    description: `Morador ${parsed.data.name} atualizado.`,
    entityId: resident.id,
    entityType: "User",
    module: "RESIDENT",
    user: admin,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/moradores");
  revalidatePath(`/admin/moradores/${resident.id}`);
  revalidatePath(resident.unit ? `/admin/unidades/${resident.unit.id}` : "/admin/unidades");
  redirectWithMessage(`/admin/moradores/${resident.id}`, {
    success: "Morador atualizado com sucesso.",
  });
}

export async function changeResidentStatusAction(formData: FormData) {
  const { condominiumId, user: admin } = await requireCondominiumRole("ADMIN");
  const parsed = residentStatusSchema.safeParse({
    id: getStringValue(formData, "id"),
    status: getStringValue(formData, "status"),
  });

  if (!parsed.success) {
    redirectWithMessage("/admin/moradores", {
      error: parsed.error.issues[0]?.message ?? "Morador inválido.",
    });
  }

  const resident = await getOwnedResident(parsed.data.id, condominiumId);

  if (!resident) {
    redirectWithMessage("/admin/moradores", {
      error: "Morador não encontrado.",
    });
  }

  if (parsed.data.status === UserStatus.ACTIVE && resident.unit?.status === UnitStatus.INACTIVE) {
    redirectWithMessage(`/admin/moradores/${resident.id}`, {
      error: "Não é possível ativar morador vinculado a unidade inativa.",
    });
  }

  await prisma.user.update({
    where: { id: resident.id },
    data: { status: parsed.data.status },
  });

  await createAuditLog({
    action: parsed.data.status === UserStatus.ACTIVE ? "ACTIVATE" : "INACTIVATE",
    description:
      parsed.data.status === UserStatus.ACTIVE
        ? `Morador ${resident.name} ativado.`
        : `Morador ${resident.name} inativado.`,
    entityId: resident.id,
    entityType: "User",
    module: "RESIDENT",
    user: admin,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/moradores");
  revalidatePath(`/admin/moradores/${resident.id}`);
  revalidatePath(resident.unit ? `/admin/unidades/${resident.unit.id}` : "/admin/unidades");
  redirectWithMessage(`/admin/moradores/${resident.id}`, {
    success:
      parsed.data.status === UserStatus.ACTIVE
        ? "Morador ativado com sucesso."
        : "Morador inativado com sucesso.",
  });
}
