import type { AccessMethod, AccessType, PresenceStatus } from "@prisma/client";

export function formatPorterPresenceStatus(status: PresenceStatus) {
  const labels = {
    AWAY: "Não estou em casa",
    DO_NOT_DISTURB: "Não quero receber visitas",
    HOME: "Estou em casa",
  };

  return labels[status];
}

export function formatAccessType(accessType: AccessType) {
  return accessType === "ENTRY" ? "Entrada" : "Saída";
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
