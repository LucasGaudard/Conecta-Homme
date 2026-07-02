import { Activity, AlertTriangle, Building2, Package, UserCheck } from "lucide-react";
import { FeedbackAlert } from "@/components/admin/feedback-alert";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { AlertCard } from "@/components/dashboard/alert-card";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { MetricCard } from "@/components/dashboard/metric-card";
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
    recentAccessDir?: string;
    recentAccessPage?: string;
    recentAccessPageSize?: string;
    recentAccessSort?: string;
    success?: string;
  }>;
};

export const dynamic = "force-dynamic";

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default async function PorterDashboardPage({
  searchParams,
}: PorterDashboardPageProps) {
  const params = await searchParams;
  const { error, q = "", success } = params;
  const [dashboardData, units] = await Promise.all([
    getPorterDashboardData(),
    searchPorterUnits(q),
  ]);
  const packageItems = dashboardData.pendingPackages.map((item) => ({
    description: [
      item.unit ? `Unidade ${item.unit.block}-${item.unit.apartment}` : null,
      item.unit?.responsibleName,
      item.carrier ? `Transportadora: ${item.carrier}` : null,
    ]
      .filter(Boolean)
      .join(" · "),
    icon: <Package className="h-4 w-4" />,
    id: item.id,
    meta: formatTime(item.receivedAt),
    title: item.description ?? "Encomenda pendente",
  }));
  const visitorItems = dashboardData.todayVisitors.map((item) => ({
    description: [
      `Unidade ${item.unit.block}-${item.unit.apartment}`,
      item.visitor.phone ? `Telefone: ${item.visitor.phone}` : null,
    ]
      .filter(Boolean)
      .join(" · "),
    icon: <UserCheck className="h-4 w-4" />,
    id: item.id,
    meta: formatTime(item.startsAt),
    title: item.visitor.name,
  }));
  const alerts = dashboardData.doNotDisturbUnits.map((unit) => ({
    description: `${unit.responsibleName} solicitou privacidade para a unidade.`,
    id: unit.id,
    title: `Unidade ${unit.block}-${unit.apartment}`,
    tone: "danger" as const,
  }));

  return (
    <DashboardShell
      eyebrow="Operacao da portaria"
      title="Painel da portaria"
      description="Busca rapida de unidades, movimentacoes recentes, visitantes do dia e pendencias que precisam de atencao."
    >
      <FeedbackAlert error={error} success={success} />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Unidades ativas"
          value={dashboardData.stats.totalActiveUnits}
          description="Unidades liberadas para operacao."
          icon={Building2}
          tone="info"
        />
        <MetricCard
          title="Visitantes hoje"
          value={dashboardData.stats.visitorsAuthorizedToday}
          description="Autorizacoes validas para hoje."
          icon={UserCheck}
          tone="success"
        />
        <MetricCard
          title="Encomendas pendentes"
          value={dashboardData.stats.packagesWaitingPickup}
          description="Aguardando retirada."
          icon={Package}
          tone={dashboardData.stats.packagesWaitingPickup > 0 ? "warning" : "success"}
        />
        <MetricCard
          title="Acessos hoje"
          value={dashboardData.stats.accessLogsToday}
          description="Entradas e saidas registradas."
          icon={Activity}
          tone="info"
        />
      </section>

      <section className="surface-card p-5">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-navy-950">Busca operacional</h3>
          <p className="mt-1 text-sm text-slate-500">
            Localize rapidamente uma unidade para consultar status, visitantes e registrar acessos.
          </p>
        </div>
        <UnitSearch defaultValue={q} />
      </section>

      {q.trim().length > 0 ? (
        <section className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-navy-950">Resultado da busca</h3>
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
      ) : null}

      <section className="grid gap-4 xl:grid-cols-3">
        <ActivityFeed
          title="Encomendas pendentes"
          emptyMessage="Nenhuma encomenda pendente."
          items={packageItems}
        />
        <ActivityFeed
          title="Visitantes do dia"
          emptyMessage="Nenhum visitante autorizado para hoje."
          items={visitorItems}
        />
        <AlertCard
          title="Nao perturbe"
          emptyMessage="Nenhuma unidade em nao perturbe."
          items={alerts}
          icon={AlertTriangle}
        />
      </section>

      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-navy-950">Ultimos acessos</h3>
          <p className="text-sm text-slate-500">
            Registros recentes de entrada e saida.
          </p>
        </div>
        <RecentAccessList accesses={dashboardData.recentAccessLogs} searchParams={params} />
      </section>
    </DashboardShell>
  );
}
