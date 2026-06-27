import {
  Activity,
  Building2,
  CheckCircle2,
  DoorOpen,
  Package,
  ShieldCheck,
  UserCheck,
  Users,
} from "lucide-react";
import { ReportChart } from "@/components/reports/report-chart";
import { ReportFilters } from "@/components/reports/report-filters";
import { ReportStatCard } from "@/components/reports/report-stat-card";
import { ReportTable } from "@/components/reports/report-table";
import { getAdminReportsData } from "@/lib/reports/queries";
import { reportFiltersSchema } from "@/lib/reports/validation";

type AdminReportsPageProps = {
  searchParams: Promise<{
    accessMethod?: string;
    accessType?: string;
    from?: string;
    packageStatus?: string;
    q?: string;
    to?: string;
    visitorStatus?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function AdminReportsPage({
  searchParams,
}: AdminReportsPageProps) {
  const rawFilters = await searchParams;
  const filters = reportFiltersSchema.parse(rawFilters);
  const data = await getAdminReportsData(filters);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-normal text-navy-950">
          Relatorios
        </h2>
        <p className="max-w-3xl text-sm leading-6 text-slate-500">
          Acompanhe movimentacoes do condominio com filtros por periodo,
          unidade, acessos, encomendas e visitantes.
        </p>
      </div>

      <ReportFilters filters={filters} />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ReportStatCard
          title="Total de unidades"
          value={data.summary.totalUnits}
          description="Unidades cadastradas."
          icon={Building2}
        />
        <ReportStatCard
          title="Unidades ativas"
          value={data.summary.activeUnits}
          description="Unidades com status ativo."
          icon={CheckCircle2}
        />
        <ReportStatCard
          title="Moradores ativos"
          value={data.summary.activeResidents}
          description="Usuarios residentes ativos."
          icon={Users}
        />
        <ReportStatCard
          title="Porteiros ativos"
          value={data.summary.activePorters}
          description="Usuarios da portaria ativos."
          icon={ShieldCheck}
        />
        <ReportStatCard
          title="Visitantes autorizados"
          value={data.summary.authorizedVisitors}
          description="Autorizacoes ativas no sistema."
          icon={UserCheck}
        />
        <ReportStatCard
          title="Encomendas aguardando"
          value={data.summary.waitingPackages}
          description="Pendentes de retirada."
          icon={Package}
        />
        <ReportStatCard
          title="Acessos no periodo"
          value={data.summary.accessLogsInPeriod}
          description="Entradas e saidas filtradas."
          icon={DoorOpen}
        />
        <ReportStatCard
          title="Encomendas entregues"
          value={data.packageTotals.deliveredPackagesTotal}
          description="Total entregue no filtro."
          icon={Activity}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <ReportChart title="Acessos por dia" data={data.charts.accessByDay} />
        <ReportChart title="Encomendas por status" data={data.charts.packagesByStatus} />
        <ReportChart title="Visitantes por status" data={data.charts.visitorsByStatus} />
      </section>

      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-navy-950">
            Relatorio de acessos
          </h3>
          <p className="text-sm text-slate-500">
            Entradas e saidas por periodo, unidade, tipo e metodo.
          </p>
        </div>
        <ReportTable type="access" rows={data.accessLogs} />
      </section>

      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-navy-950">
            Relatorio de encomendas
          </h3>
          <p className="text-sm text-slate-500">
            Total aguardando retirada: {data.packageTotals.waitingPackagesTotal} · Total entregues: {data.packageTotals.deliveredPackagesTotal}
          </p>
        </div>
        <ReportTable type="package" rows={data.packages} />
      </section>

      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-navy-950">
            Relatorio de visitantes
          </h3>
          <p className="text-sm text-slate-500">
            Visitantes autorizados por periodo, status e unidade.
          </p>
        </div>
        <ReportTable type="visitor" rows={data.visitors} />
      </section>
    </div>
  );
}
