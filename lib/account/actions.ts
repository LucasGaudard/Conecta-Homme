"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAuditLog } from "@/lib/audit/logger";
import { getCurrentUser } from "@/lib/auth/current-user";
import { hashPassword } from "@/lib/auth/password";
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

  const route = accountRouteByRole[currentUser.role];
  const parsed = updateAccountSchema.safeParse({
    email: getStringValue(formData, "email"),
    name: getStringValue(formData, "name"),
    password: getStringValue(formData, "password"),
    phone: getStringValue(formData, "phone"),
  });

  if (!parsed.success) {
    redirectWithMessage(route, {
      error: parsed.error.issues[0]?.message ?? "Dados invalidos.",
    });
  }

  const data = parsed.data;
  const passwordHash =
    data.password && data.password.length > 0
      ? await hashPassword(data.password)
      : undefined;

  try {
    await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        email: data.email,
        name: data.name,
        phone: data.phone,
        ...(passwordHash ? { passwordHash } : {}),
      },
    });
    await createAuditLog({
      action: "UPDATE",
      description: "Conta do usuario atualizada.",
      entityId: currentUser.id,
      entityType: "User",
      module: "ACCOUNT",
      user: currentUser,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      redirectWithMessage(route, {
        error: "Este e-mail ja esta em uso por outro usuario.",
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
