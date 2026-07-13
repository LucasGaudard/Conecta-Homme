"use server";

import { Prisma, UserRole, UserStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAuditLog } from "@/lib/audit/logger";
import { requireCondominiumRole } from "@/lib/auth/authorization";
import { hashPassword } from "@/lib/auth/password";
import { prisma } from "@/lib/prisma";
import { createPorterSchema, updatePorterSchema } from "@/lib/porters/validation";

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
      error: "Ja existe um usuario com este e-mail.",
    });
  }

  redirectWithMessage(path, {
    error: "Nao foi possivel salvar o porteiro. Tente novamente.",
  });
}

export async function createPorterAction(formData: FormData) {
  const { condominiumId, user: admin } = await requireCondominiumRole("ADMIN");
  const parsed = createPorterSchema.safeParse({
    email: getStringValue(formData, "email"),
    name: getStringValue(formData, "name"),
    password: getStringValue(formData, "password"),
    phone: getStringValue(formData, "phone"),
    status: getStringValue(formData, "status") || UserStatus.ACTIVE,
  });

  if (!parsed.success) {
    redirectWithMessage("/admin/porteiros/novo", {
      error: parsed.error.issues[0]?.message ?? "Dados invalidos.",
    });
  }

  let porterId = "";

  try {
    const porter = await prisma.user.create({
      data: {
        condominiumId,
        email: parsed.data.email,
        name: parsed.data.name,
        passwordHash: await hashPassword(parsed.data.password),
        phone: parsed.data.phone,
        role: UserRole.PORTER,
        status: parsed.data.status,
      },
    });
    porterId = porter.id;

    await createAuditLog({
      action: "CREATE",
      description: `Porteiro ${porter.name} cadastrado.`,
      entityId: porter.id,
      entityType: "User",
      module: "PORTER",
      user: admin,
    });
  } catch (error) {
    handlePorterError(error, "/admin/porteiros/novo");
  }

  revalidatePath("/admin/porteiros");
  redirectWithMessage("/admin/porteiros", {
    success: "Porteiro cadastrado com sucesso.",
    ...(porterId ? { id: porterId } : {}),
  });
}

export async function updatePorterAction(id: string, formData: FormData) {
  const { condominiumId, user: admin } = await requireCondominiumRole("ADMIN");
  const parsed = updatePorterSchema.safeParse({
    email: getStringValue(formData, "email"),
    name: getStringValue(formData, "name"),
    password: getStringValue(formData, "password"),
    phone: getStringValue(formData, "phone"),
    status: getStringValue(formData, "status"),
  });
  const path = `/admin/porteiros/${id}/editar`;

  if (!parsed.success) {
    redirectWithMessage(path, {
      error: parsed.error.issues[0]?.message ?? "Dados invalidos.",
    });
  }

  const existing = await prisma.user.findFirst({
    where: {
      condominiumId,
      id,
      role: UserRole.PORTER,
    },
    select: { id: true },
  });

  if (!existing) {
    redirectWithMessage("/admin/porteiros", {
      error: "Porteiro nao encontrado.",
    });
  }

  try {
    const passwordHash = parsed.data.password
      ? await hashPassword(parsed.data.password)
      : undefined;
    const updated = await prisma.user.updateMany({
      where: {
        condominiumId,
        id: existing.id,
        role: UserRole.PORTER,
      },
      data: {
        email: parsed.data.email,
        name: parsed.data.name,
        phone: parsed.data.phone,
        status: parsed.data.status,
        ...(passwordHash ? { passwordHash } : {}),
      },
    });

    if (updated.count === 0) {
      redirectWithMessage("/admin/porteiros", {
        error: "Porteiro nao encontrado.",
      });
    }

    await createAuditLog({
      action: "UPDATE",
      description: `Porteiro ${parsed.data.name} atualizado.`,
      entityId: existing.id,
      entityType: "User",
      module: "PORTER",
      user: admin,
    });
  } catch (error) {
    handlePorterError(error, path);
  }

  revalidatePath("/admin/porteiros");
  revalidatePath(path);
  redirectWithMessage("/admin/porteiros", {
    success: "Porteiro atualizado com sucesso.",
  });
}

export async function changePorterStatusAction(id: string, status: UserStatus) {
  const { condominiumId, user: admin } = await requireCondominiumRole("ADMIN");
  const updated = await prisma.user.updateMany({
    where: {
      condominiumId,
      id,
      role: UserRole.PORTER,
    },
    data: { status },
  });

  if (updated.count === 0) {
    redirectWithMessage("/admin/porteiros", {
      error: "Porteiro nao encontrado.",
    });
  }

  await createAuditLog({
    action: status === UserStatus.ACTIVE ? "ACTIVATE" : "INACTIVATE",
    description:
      status === UserStatus.ACTIVE
        ? "Porteiro ativado pelo admin."
        : "Porteiro inativado pelo admin.",
    entityId: id,
    entityType: "User",
    module: "PORTER",
    user: admin,
  });

  revalidatePath("/admin/porteiros");
  redirectWithMessage("/admin/porteiros", {
    success:
      status === UserStatus.ACTIVE
        ? "Porteiro ativado com sucesso."
        : "Porteiro inativado com sucesso.",
  });
}
