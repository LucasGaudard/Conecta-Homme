import type { PackageStatus } from "@prisma/client";

export function formatPackageStatus(status: PackageStatus) {
  return status === "WAITING_PICKUP" ? "Aguardando retirada" : "Entregue";
}

export function formatPackageDate(date?: Date | null) {
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
