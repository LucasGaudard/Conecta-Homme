import type { UserRole } from "@prisma/client";
import { CondominiumStatus } from "@prisma/client";
import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth/current-user";
import { prisma } from "@/lib/prisma";

type TenantRole = Exclude<UserRole, "SUPER_ADMIN">;

export async function requireCondominiumRole(...roles: TenantRole[]) {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      condominium: {
        select: {
          id: true,
          status: true,
        },
      },
      condominiumId: true,
      email: true,
      id: true,
      name: true,
      role: true,
      status: true,
    },
  });

  if (
    !user ||
    user.status !== "ACTIVE" ||
    user.role === "SUPER_ADMIN" ||
    !roles.includes(user.role as TenantRole) ||
    !user.condominiumId ||
    !user.condominium
  ) {
    redirect("/login");
  }

  if (user.condominium.status !== CondominiumStatus.ACTIVE) {
    redirect("/condominio-bloqueado");
  }

  return {
    condominiumId: user.condominiumId,
    user,
  };
}
