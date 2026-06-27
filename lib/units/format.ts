import type { PresenceStatus, UnitStatus, UserStatus } from "@prisma/client";

export function maskCpf(cpf?: string | null) {
  const digits = cpf?.replace(/\D/g, "");

  if (!digits) {
    return "Nao informado";
  }

  if (digits.length < 4) {
    return "***";
  }

  return `***.***.***-${digits.slice(-2)}`;
}

export function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function formatUnitStatus(status: UnitStatus | UserStatus) {
  const labels = {
    ACTIVE: "Ativo",
    INACTIVE: "Inativo",
  };

  return labels[status];
}

export function formatPresenceStatus(status: PresenceStatus) {
  const labels = {
    AWAY: "Ausente",
    DO_NOT_DISTURB: "Nao perturbe",
    HOME: "Em casa",
  };

  return labels[status];
}
