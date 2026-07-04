import type { LeisureSpaceStatus, SpaceReservationStatus } from "@prisma/client";

export function formatReservationDateTime(value: Date | null | undefined) {
  if (!value) return "Nao informado";

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(value);
}

export function formatReservationTimeRange(startAt: Date, endAt: Date) {
  const date = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
  }).format(startAt);
  const time = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${date}, ${time.format(startAt)} - ${time.format(endAt)}`;
}

export function formatSpaceStatus(status: LeisureSpaceStatus) {
  return status === "ACTIVE" ? "Ativo" : "Inativo";
}

export function formatReservationStatus(status: SpaceReservationStatus) {
  const labels: Record<SpaceReservationStatus, string> = {
    APPROVED: "Aprovada",
    CANCELED: "Cancelada",
    PENDING: "Pendente",
    REJECTED: "Recusada",
  };

  return labels[status];
}

export function formatUnitLabel(unit?: { apartment: string; block: string } | null) {
  if (!unit) return "Nao informada";

  return `${unit.block}-${unit.apartment}`;
}
