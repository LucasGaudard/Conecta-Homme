"use server";

import { Prisma, UserRole, UserStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAuditLog } from "@/lib/audit/logger";
import { requireCondominiumRole } from "@/lib/auth/authorization";
import { hashPassword } from "@/lib/auth/password";
import { prisma } from "@/lib/prisma";
import {
  createPorterSchema,
  porterStatusSchema,
  resetPorterPasswordSchema,
  updatePorterSchema,
} from "@/lib/porters/validation";

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

function redirectWithMessage(path: string, params: Record<string, string>): never {
  const searchParams = new URLSearchParams(params);

  redirect(`${path}?${searchParams.toString()}`);
}

function handlePorterError(error: unknown, path: string): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    redirectWithMessage(path, {
      error: "Já existe um usuário com este e-mail.",
    });
  }

  redirectWithMessage(path, {
    error: "Não foi possível salvar o porteiro.",
  });
}

async function getOwnedPorter(id: string, condominiumId: string) {
  return prisma.user.findFirst({
    where: {
      condominiumId,
      id,
      role: UserRole.PORTER,
    },
  });
}

export async function createPorterAction(formData: FormData) {
  const { condominiumId, user: admin } = await requireCondominiumRole("ADMIN");
  const parsed = createPorterSchema.safeParse({
    email: getStringValue(formData, "email"),
    name: getStringValue(formData, "name"),
    password: getStringValue(formData, "password"),
    phone: getStringValue(formData, "phone"),
    porterShiftDescription: getStringValue(formData, "porterShiftDescription"),
  });

  if (!parsed.success) {
    redirectWithMessage("/admin/porteiros/novo", {
      error: parsed.error.issues[0]?.message ?? "Dados inválidos.",
    });
  }

  const data = parsed.data;

  try {
    const porter = await prisma.user.create({
      data: {
        condominiumId,
        email: data.email.toLowerCase(),
        name: data.name,
        passwordHash: await hashPassword(data.password),
        phone: data.phone,
        porterShiftDescription: data.porterShiftDescription,
        role: UserRole.PORTER,
        status: UserStatus.ACTIVE,
      },
    });

    await createAuditLog({
      action: "CREATE",
      description: `Porteiro ${porter.name} cadastrado.`,
      entityId: porter.id,
      entityType: "User",
      module: "PORTER",
      user: admin,
    });

    revalidatePath("/admin/porteiros");
    redirectWithMessage(`/admin/porteiros/${porter.id}`, {
      success: "Porteiro cadastrado com sucesso.",
    });
  } catch (error) {
    handlePorterError(error, "/admin/porteiros/novo");
  }
}

export async function updatePorterAction(id: string, formData: FormData) {
  const { condominiumId, user: admin } = await requireCondominiumRole("ADMIN");
  const parsed = updatePorterSchema.safeParse({
    email: getStringValue(formData, "email"),
    name: getStringValue(formData, "name"),
    phone: getStringValue(formData, "phone"),
    porterShiftDescription: getStringValue(formData, "porterShiftDescription"),
  });
  const errorPath = `/admin/porteiros/${id}/editar`;

  if (!parsed.success) {
    redirectWithMessage(errorPath, {
      error: parsed.error.issues[0]?.message ?? "Dados inválidos.",
    });
  }

  const currentPorter = await getOwnedPorter(id, condominiumId);

  if (!currentPorter) {
    redirectWithMessage("/admin/porteiros", {
      error: "Porteiro não encontrado.",
    });
  }

  try {
    const porter = await prisma.user.update({
      where: { id: currentPorter.id },
      data: {
        email: parsed.data.email.toLowerCase(),
        name: parsed.data.name,
        phone: parsed.data.phone,
        porterShiftDescription: parsed.data.porterShiftDescription,
      },
    });

    await createAuditLog({
      action: "UPDATE",
      description: `Porteiro ${porter.name} atualizado.`,
      entityId: porter.id,
      entityType: "User",
      module: "PORTER",
      user: admin,
    });

    revalidatePath("/admin/porteiros");
    revalidatePath(`/admin/porteiros/${id}`);
    redirectWithMessage(`/admin/porteiros/${id}`, {
      success: "Porteiro atualizado com sucesso.",
    });
  } catch (error) {
    handlePorterError(error, errorPath);
  }
}

export async function changePorterStatusAction(formData: FormData) {
  const { condominiumId, user: admin } = await requireCondominiumRole("ADMIN");
  const parsed = porterStatusSchema.safeParse({
    id: getStringValue(formData, "id"),
    status: getStringValue(formData, "status"),
  });

  if (!parsed.success) {
    redirectWithMessage("/admin/porteiros", {
      error: parsed.error.issues[0]?.message ?? "Porteiro inválido.",
    });
  }

  const currentPorter = await getOwnedPorter(parsed.data.id, condominiumId);

  if (!currentPorter) {
    redirectWithMessage("/admin/porteiros", {
      error: "Porteiro não encontrado.",
    });
  }

  const porter = await prisma.user.update({
    where: { id: currentPorter.id },
    data: { status: parsed.data.status },
  });

  await createAuditLog({
    action: parsed.data.status === UserStatus.ACTIVE ? "ACTIVATE" : "INACTIVATE",
    description:
      parsed.data.status === UserStatus.ACTIVE
        ? `Porteiro ${porter.name} ativado.`
        : `Porteiro ${porter.name} inativado.`,
    entityId: porter.id,
    entityType: "User",
    module: "PORTER",
    user: admin,
  });

  revalidatePath("/admin/porteiros");
  revalidatePath(`/admin/porteiros/${porter.id}`);
  redirectWithMessage("/admin/porteiros", {
    success:
      parsed.data.status === UserStatus.ACTIVE
        ? "Porteiro ativado com sucesso."
        : "Porteiro inativado com sucesso.",
  });
}

export async function resetPorterPasswordAction(formData: FormData) {
  const { condominiumId, user: admin } = await requireCondominiumRole("ADMIN");
  const parsed = resetPorterPasswordSchema.safeParse({
    id: getStringValue(formData, "id"),
    password: getStringValue(formData, "password"),
  });

  if (!parsed.success) {
    redirectWithMessage("/admin/porteiros", {
      error: parsed.error.issues[0]?.message ?? "Senha temporária inválida.",
    });
  }

  const currentPorter = await getOwnedPorter(parsed.data.id, condominiumId);

  if (!currentPorter) {
    redirectWithMessage("/admin/porteiros", {
      error: "Porteiro não encontrado.",
    });
  }

  await prisma.user.update({
    where: { id: currentPorter.id },
    data: {
      passwordHash: await hashPassword(parsed.data.password),
    },
  });

  await createAuditLog({
    action: "RESET_PASSWORD",
    description: `Senha temporária do porteiro ${currentPorter.name} redefinida pelo administrador.`,
    entityId: currentPorter.id,
    entityType: "User",
    module: "PORTER",
    user: admin,
  });

  revalidatePath("/admin/porteiros");
  revalidatePath(`/admin/porteiros/${currentPorter.id}`);
  redirectWithMessage(`/admin/porteiros/${currentPorter.id}`, {
    success: "Senha temporária redefinida com sucesso.",
  });
}
