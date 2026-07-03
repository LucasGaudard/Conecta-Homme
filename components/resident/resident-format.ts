import type { AccessMethod, AccessType, PackageStatus, PresenceStatus, VisitorStatus } from "@prisma/client";

export function formatResidentPresenceStatus(status: PresenceStatus) {
  const labels = {
    AWAY: "Não estou em casa",
    DO_NOT_DISTURB: "Não quero receber visitas",
    HOME: "Estou em casa",
  };

  return labels[status];
}

export function formatVisitorStatus(status: VisitorStatus, endsAt: Date) {
  if (status === "AUTHORIZED" && endsAt < new Date()) {
    return "Expirado";
  }

  const labels = {
    AUTHORIZED: "Autorizado",
    CANCELED: "Cancelado",
    EXPIRED: "Expirado",
    USED: "Utilizado",
  };

  return labels[status];
}

export function formatPackageStatus(status: PackageStatus) {
  return status === "WAITING_PICKUP" ? "Aguardando retirada" : "Entregue";
}

export function formatAccessType(status: AccessType) {
  return status === "ENTRY" ? "Entrada" : "Saída";
}

export function formatAccessMethod(method: AccessMethod) {
  return method === "QR_CODE" ? "QR Code" : "Manual";
}

export function formatDateTime(date?: Date | null) {
  if (!date) {
    return "Não informado";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}
