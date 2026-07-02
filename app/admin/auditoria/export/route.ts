import { getAuditLogsForExport } from "@/lib/audit/queries";
import {
  formatAuditDate,
  getAuditActionLabel,
  getAuditModuleLabel,
  getAuditRoleLabel,
} from "@/lib/audit/format";
import { parseAuditFilters } from "@/lib/audit/validation";
import { csvResponse, timestampedFilename, toCsv } from "@/lib/export/csv";
import { requireAdminExport } from "@/lib/export/admin";

export async function GET(request: Request) {
  await requireAdminExport();

  const { searchParams } = new URL(request.url);
  const filters = parseAuditFilters({
    action: searchParams.get("action") ?? undefined,
    from: searchParams.get("from") ?? undefined,
    module: searchParams.get("module") ?? undefined,
    page: "1",
    pageSize: "50",
    role: searchParams.get("role") ?? undefined,
    to: searchParams.get("to") ?? undefined,
    user: searchParams.get("user") ?? undefined,
  });
  const logs = await getAuditLogsForExport(filters);
  const csv = toCsv(logs, [
    { header: "Data", value: (item) => formatAuditDate(item.createdAt) },
    { header: "Usuario", value: (item) => item.userName ?? "Sistema" },
    { header: "E-mail", value: (item) => item.userEmail },
    { header: "Perfil", value: (item) => getAuditRoleLabel(item.userRole) },
    { header: "Acao", value: (item) => getAuditActionLabel(item.action) },
    { header: "Modulo", value: (item) => getAuditModuleLabel(item.module) },
    { header: "Descricao", value: (item) => item.description },
    { header: "Entidade", value: (item) => item.entityType },
    { header: "ID da entidade", value: (item) => item.entityId },
  ]);

  return csvResponse(csv, timestampedFilename("auditoria"));
}
