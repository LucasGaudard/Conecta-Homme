import { CondominiumStatus, type UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";

type TenantRole = Exclude<UserRole, "SUPER_ADMIN">;

const blockedCondominiumMessages: Record<
  Exclude<CondominiumStatus, "ACTIVE">,
  string
> = {
  INACTIVE: "Este condomínio está inativo. Entre em contato com a administração da plataforma.",
  SUSPENDED: "Este condomínio está suspenso. Entre em contato com a administração da plataforma.",
};

function blockedCondominiumUrl(status: Exclude<CondominiumStatus, "ACTIVE">) {
  const searchParams = new URLSearchParams({
    status,
    message: blockedCondominiumMessages[status],
  });

  return `/condominio-bloqueado?${searchParams.toString()}`;
}

export async function requireSuperAdmin() {
  const user = await getCurrentUser();

  if (!user || user.role !== "SUPER_ADMIN" || user.condominiumId !== null) {
    redirect("/login");
  }

  return user;
}

export async function requireTenantUser() {
  const user = await getCurrentUser();

  if (!user || user.role === "SUPER_ADMIN" || !user.condominiumId || !user.condominium) {
    redirect("/login");
  }

  if (user.condominium.status !== CondominiumStatus.ACTIVE) {
    redirect(blockedCondominiumUrl(user.condominium.status));
  }

  return {
    condominium: user.condominium,
    condominiumId: user.condominiumId,
    user,
  };
}

export async function requireCondominiumRole(...roles: TenantRole[]) {
  const context = await requireTenantUser();

  if (!roles.includes(context.user.role as TenantRole)) {
    redirect("/login");
  }

  return context;
}

export async function getTenantContext() {
  return requireTenantUser();
}
