import type { AuditLog } from "@prisma/client";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import type { SearchParamRecord } from "@/components/ui/data-table-params";
import { AuditEmptyState } from "@/components/audit/audit-empty-state";
import {
  formatAuditDate,
  getAuditActionLabel,
  getAuditModuleLabel,
  getAuditRoleLabel,
} from "@/lib/audit/format";

type AuditLogListProps = {
  logs: AuditLog[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
  searchParams: SearchParamRecord;
};

export function AuditLogList({
  logs,
  pagination,
  searchParams,
}: AuditLogListProps) {
  if (logs.length === 0) {
    return (
      <div className="space-y-4">
        <AuditEmptyState />
        <DataTablePagination
          page={pagination.page}
          pageParam="page"
          pageSize={pagination.pageSize}
          pageSizeParam="pageSize"
          searchParams={searchParams}
          totalItems={pagination.totalItems}
          totalPages={pagination.totalPages}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="table-shell hidden lg:block">
        <table className="data-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Usuario</th>
              <th>Perfil</th>
              <th>Acao</th>
              <th>Modulo</th>
              <th>Descricao</th>
              <th>Entidade</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td className="whitespace-nowrap">{formatAuditDate(log.createdAt)}</td>
                <td>
                  <div className="min-w-0">
                    <p className="font-medium text-navy-950">
                      {log.userName ?? "Sistema"}
                    </p>
                    <p className="text-xs text-slate-500">{log.userEmail ?? "-"}</p>
                  </div>
                </td>
                <td>{getAuditRoleLabel(log.userRole)}</td>
                <td>{getAuditActionLabel(log.action)}</td>
                <td>{getAuditModuleLabel(log.module)}</td>
                <td className="max-w-sm">{log.description}</td>
                <td>
                  {log.entityType && log.entityId
                    ? `${log.entityType} · ${log.entityId}`
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mobile-list lg:hidden">
        {logs.map((log) => (
          <article key={log.id} className="mobile-card">
            <div className="mobile-card-header">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-navy-950">
                  {getAuditActionLabel(log.action)} · {getAuditModuleLabel(log.module)}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {formatAuditDate(log.createdAt)}
                </p>
              </div>
              <span className="rounded-full bg-navy-50 px-2.5 py-1 text-xs font-semibold text-navy-900">
                {getAuditRoleLabel(log.userRole)}
              </span>
            </div>
            <div className="mobile-field-grid">
              <div className="mobile-field">
                <p className="mobile-field-label">Usuario</p>
                <p className="mobile-field-value">
                  {log.userName ?? "Sistema"} · {log.userEmail ?? "-"}
                </p>
              </div>
              <div className="mobile-field">
                <p className="mobile-field-label">Descricao</p>
                <p className="mobile-field-value">{log.description}</p>
              </div>
              <div className="mobile-field">
                <p className="mobile-field-label">Entidade</p>
                <p className="mobile-field-value">
                  {log.entityType && log.entityId
                    ? `${log.entityType} · ${log.entityId}`
                    : "-"}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <DataTablePagination
        page={pagination.page}
        pageParam="page"
        pageSize={pagination.pageSize}
        pageSizeParam="pageSize"
        searchParams={searchParams}
        totalItems={pagination.totalItems}
        totalPages={pagination.totalPages}
      />
    </div>
  );
}
