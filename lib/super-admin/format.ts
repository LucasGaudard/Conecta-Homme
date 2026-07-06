import type { CondominiumStatus } from "@prisma/client";

export const condominiumStatusLabels: Record<CondominiumStatus, string> = {
  ACTIVE: "Ativo",
  INACTIVE: "Inativo",
  SUSPENDED: "Suspenso",
};

export function formatCondominiumStatus(status: CondominiumStatus) {
  return condominiumStatusLabels[status];
}

export function formatNullable(value?: string | null) {
  return value && value.trim().length > 0 ? value : "Nao informado";
}

export function formatCondominiumDate(date: Date | null | undefined) {
  if (!date) return "Nao informado";

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}
