import type { UserRole } from "@prisma/client";
import { accountRoleLabels } from "@/lib/account/format";
import { auditActionLabels, auditModuleLabels } from "@/lib/audit/constants";

export function formatAuditDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function getAuditActionLabel(action: string) {
  return auditActionLabels[action] ?? action;
}

export function getAuditModuleLabel(module: string) {
  return auditModuleLabels[module] ?? module;
}

export function getAuditRoleLabel(role: UserRole) {
  return accountRoleLabels[role];
}
