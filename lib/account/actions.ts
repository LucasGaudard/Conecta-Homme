"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAuditLog } from "@/lib/audit/logger";
import { requireCondominiumRole, requireSuperAdmin } from "@/lib/auth/authorization";
import { getCurrentUser } from "@/lib/auth/current-user";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { accountRouteByRole } from "@/lib/account/format";
import { updateAccountSchema } from "@/lib/account/validation";
import { prisma } from "@/lib/prisma";

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

function redirectWithMessage(path: string, params: Record<string, string>): never {
  const searchParams = new URLSearchParams(params);

  redirect(`${path}?${searchParams.toString()}`);
}

export async function updateAccountAction(formData: FormData) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  const actor =
    currentUser.role === "SUPER_ADMIN"
      ? await requireSuperAdmin()
      : (await requireCondominiumRole(currentUser.role)).user;
  const route = accountRouteByRole[currentUser.role];
  const parsed = updateAccountSchema.safeParse({
    confirmPassword: getStringValue(formData, "confirmPassword"),
    currentPassword: getStringValue(formData, "currentPassword"),
    email: getStringValue(formData, "email"),
    name: getStringValue(formData, "name"),
    newPassword: getStringValue(formData, "newPassword"),
    phone: getStringValue(formData, "phone"),
  });

  if (!parsed.success) {
    redirectWithMessage(route, {
      error: parsed.error.issues[0]?.message ?? "Dados inválidos.",
    });
  }

  const data = parsed.data;
  const newPassword = data.newPassword?.trim() ?? "";
  const wantsPasswordChange = newPassword.length > 0;
  let passwordHash: string | undefined;

  if (wantsPasswordChange) {
    const storedUser = await prisma.user.findFirst({
      where: {
        id: actor.id,
        ...(actor.role === "SUPER_ADMIN"
          ? { condominiumId: null }
          : { condominiumId: actor.condominiumId }),
      },
      select: {
        passwordHash: true,
      },
    });

    if (!storedUser) {
      redirect("/login");
    }

    const passwordMatches = await verifyPassword(
      data.currentPassword?.trim() ?? "",
      storedUser.passwordHash,
    );

    if (!passwordMatches) {
      redirectWithMessage(route, {
        error: "Senha atual invalida.",
      });
    }

    passwordHash = await hashPassword(newPassword);
  }

  try {
    const updated = await prisma.user.updateMany({
      where: {
        id: actor.id,
        ...(actor.role === "SUPER_ADMIN"
          ? { condominiumId: null }
          : { condominiumId: actor.condominiumId }),
      },
      data: {
        email: data.email,
        name: data.name,
        phone: data.phone,
        ...(passwordHash ? { passwordHash } : {}),
      },
    });
    if (updated.count === 0) {
      redirect("/login");
    }

    await createAuditLog({
      action: "UPDATE",
      description: "Conta do usuário atualizada.",
      entityId: actor.id,
      entityType: "User",
      module: "ACCOUNT",
      user: actor,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      redirectWithMessage(route, {
        error: "Este e-mail já está em uso por outro usuário.",
      });
    }

    throw error;
  }

  revalidatePath("/admin");
  revalidatePath("/admin/configuracoes");
  revalidatePath("/portaria");
  revalidatePath("/portaria/configuracoes");
  revalidatePath("/morador");
  revalidatePath("/morador/configuracoes");
  redirectWithMessage(route, {
    success: "Conta atualizada com sucesso.",
  });
}
