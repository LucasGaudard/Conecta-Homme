import { UserRole } from "@prisma/client";

export const accountRoleLabels: Record<UserRole, string> = {
  ADMIN: "Admin",
  PORTER: "Portaria",
  RESIDENT: "Morador",
};

export const accountRouteByRole: Record<UserRole, string> = {
  ADMIN: "/admin/configuracoes",
  PORTER: "/portaria/configuracoes",
  RESIDENT: "/morador/configuracoes",
};

export function formatAccountDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}
