import { FileClock } from "lucide-react";
import { AuditFilters } from "@/components/audit/audit-filters";
import { AuditLogList } from "@/components/audit/audit-log-list";
import { MetricCard } from "@/components/dashboard/metric-card";
import type { SearchParamRecord } from "@/components/ui/data-table-params";
import { getAuditLogs } from "@/lib/audit/queries";
import { parseAuditFilters } from "@/lib/audit/validation";

type AdminAuditPageProps = {
  searchParams: Promise<{
    action?: string;
    from?: string;
    module?: string;
    page?: string;
    pageSize?: string;
    role?: string;
    to?: string;
    user?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function AdminAuditPage({
  searchParams,
}: AdminAuditPageProps) {
  const params = await searchParams;
  const filters = parseAuditFilters(params);
  const { logs, pagination } = await getAuditLogs(filters);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-normal text-navy-950">
          Auditoria
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-slate-500">
          Acompanhe acoes importantes realizadas no sistema, com usuario,
          perfil, modulo, entidade afetada e data de execucao.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          title="Registros filtrados"
          value={pagination.totalItems}
          description="Total encontrado para os filtros atuais."
          icon={FileClock}
          tone="info"
        />
      </section>

      <AuditFilters filters={filters} />
      <AuditLogList
        logs={logs}
        pagination={pagination}
        searchParams={params as SearchParamRecord}
      />
    </div>
  );
}
