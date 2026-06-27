import { Activity, Building2, Package, UserCheck } from "lucide-react";
import { FeedbackAlert } from "@/components/admin/feedback-alert";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PorterStatCard } from "@/components/porter/porter-stat-card";
import { RecentAccessList } from "@/components/porter/recent-access-list";
import { UnitResultCard } from "@/components/porter/unit-result-card";
import { UnitSearch } from "@/components/porter/unit-search";
import {
  getPorterDashboardData,
  searchPorterUnits,
} from "@/lib/porter/queries";

type PorterDashboardPageProps = {
  searchParams: Promise<{
    error?: string;
    q?: string;
    success?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function PorterDashboardPage({
  searchParams,
}: PorterDashboardPageProps) {
  const { error, q = "", success } = await searchParams;
  const [dashboardData, units] = await Promise.all([
    getPorterDashboardData(),
    searchPorterUnits(q),
  ]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-normal text-navy-950">
          Painel da portaria
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-slate-500">
          Consulta rapida de unidades, status de presenca e registro manual de
          entrada e saida.
        </p>
      </div>

      <FeedbackAlert error={error} success={success} />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <PorterStatCard
          title="Unidades ativas"
          value={dashboardData.stats.totalActiveUnits}
          description="Unidades liberadas para operacao."
          icon={Building2}
        />
        <PorterStatCard
          title="Visitantes hoje"
          value={dashboardData.stats.visitorsAuthorizedToday}
          description="Autorizacoes validas para hoje."
          icon={UserCheck}
        />
        <PorterStatCard
          title="Encomendas pendentes"
          value={dashboardData.stats.packagesWaitingPickup}
          description="Aguardando retirada."
          icon={Package}
        />
        <PorterStatCard
          title="Acessos hoje"
          value={dashboardData.stats.accessLogsToday}
          description="Entradas e saidas registradas."
          icon={Activity}
        />
      </section>

      <UnitSearch defaultValue={q} />

      {q.trim().length > 0 ? (
        <section className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-navy-950">
              Resultado da busca
            </h3>
            <p className="text-sm text-slate-500">
              {units.length} unidade(s) encontrada(s).
            </p>
          </div>

          {units.length === 0 ? (
            <EmptyState message="Nenhuma unidade encontrada para a busca informada." />
          ) : (
            <div className="space-y-4">
              {units.map((unit) => (
                <UnitResultCard key={unit.id} unit={unit} query={q} />
              ))}
            </div>
          )}
        </section>
      ) : (
        <EmptyState message="Use a busca para localizar rapidamente uma unidade." />
      )}

      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-navy-950">
            Ultimos acessos
          </h3>
          <p className="text-sm text-slate-500">
            Registros recentes de entrada e saida.
          </p>
        </div>
        <RecentAccessList accesses={dashboardData.recentAccessLogs} />
      </section>
    </div>
  );
}
