import type { AccessMethod, AccessType, PackageStatus, VisitorStatus } from "@prisma/client";

export function formatReportDate(date?: Date | null) {
  if (!date) {
    return "Nao informado";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function formatDayKey(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  }).format(date);
}

export function formatAccessType(type: AccessType) {
  return type === "ENTRY" ? "Entrada" : "Saida";
}

export function formatAccessMethod(method: AccessMethod) {
  return method === "QR_CODE" ? "QR Code" : "Manual";
}

export function formatPackageStatus(status: PackageStatus) {
  return status === "WAITING_PICKUP" ? "Aguardando retirada" : "Entregue";
}

export function formatVisitorStatus(status: VisitorStatus) {
  const labels = {
    AUTHORIZED: "Autorizado",
    CANCELED: "Cancelado",
    EXPIRED: "Expirado",
    USED: "Utilizado",
  };

  return labels[status];
}
