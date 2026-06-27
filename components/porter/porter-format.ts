import type { AccessMethod, AccessType, PresenceStatus } from "@prisma/client";

export function formatPorterPresenceStatus(status: PresenceStatus) {
  const labels = {
    AWAY: "Nao estou em casa",
    DO_NOT_DISTURB: "Nao quero receber visitas",
    HOME: "Estou em casa",
  };

  return labels[status];
}

export function formatAccessType(accessType: AccessType) {
  return accessType === "ENTRY" ? "Entrada" : "Saida";
}

export function formatAccessMethod(accessMethod: AccessMethod) {
  return accessMethod === "QR_CODE" ? "QR Code" : "Manual";
}

export function formatShortDateTime(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "2-digit",
  }).format(date);
}
