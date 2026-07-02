import {
  Activity,
  AlertTriangle,
  Building2,
  Package,
  ShieldCheck,
  UserCheck,
  Users,
} from "lucide-react";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { AlertCard } from "@/components/dashboard/alert-card";
import { DashboardChart } from "@/components/dashboard/dashboard-chart";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { MetricCard } from "@/components/dashboard/metric-card";
import { getAdminDashboardData } from "@/lib/dashboard/admin";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const {
    alerts,
    charts,
    recentAccessLogs,
    recentPackages,
    recentVisitAuthorizations,
    stats,
  } = await getAdminDashboardData();
  const activityItems = [
    ...recentAccessLogs.map((item) => ({
      ...item,
      icon: <Activity className="h-4 w-4" />,
    })),
    ...recentPackages.map((item) => ({
      ...item,
      icon: <Package className="h-4 w-4" />,
    })),
    ...recentVisitAuthorizations.map((item) => ({
      ...item,
      icon: <UserCheck className="h-4 w-4" />,
    })),
  ].slice(0, 8);

  return (
    <DashboardShell
      eyebrow="Painel executivo"
      title="Dashboard administrativo"
      description="Visao estrategica do condominio com operacao, alertas, movimentacoes e indicadores atualizados em tempo real."
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          title="Total de unidades"
          value={stats.totalUnits}
          description="Unidades cadastradas no condominio."
          icon={Building2}
          tone="info"
        />
        <MetricCard
          title="Moradores ativos"
          value={stats.totalActiveResidents}
          description="Usuarios residentes com status ativo."
          icon={Users}
          tone="success"
        />
        <MetricCard
          title="Porteiros ativos"
          value={stats.totalActivePorters}
          description="Usuarios de portaria com status ativo."
          icon={ShieldCheck}
          tone="info"
        />
        <MetricCard
          title="Encomendas pendentes"
          value={stats.packagesWaitingPickup}
          description="Encomendas aguardando retirada."
          icon={Package}
          tone={stats.packagesWaitingPickup > 0 ? "warning" : "success"}
        />
        <MetricCard
          title="Visitantes hoje"
          value={stats.visitorsAuthorizedToday}
          description="Autorizacoes validas para o dia atual."
          icon={UserCheck}
          tone="info"
        />
        <MetricCard
          title="Acessos hoje"
          value={stats.accessLogsToday}
          description="Entradas e saidas registradas hoje."
          icon={Activity}
          tone="success"
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <DashboardChart title="Acessos nos ultimos 7 dias" data={charts.accessByDay} />
        <DashboardChart title="Encomendas por status" data={charts.packagesByStatus} />
        <DashboardChart title="Visitantes por status" data={charts.visitorsByStatus} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
        <ActivityFeed
          title="Atividades recentes"
          emptyMessage="Nenhuma atividade operacional recente."
          items={activityItems}
        />
        <AlertCard
          title="Alertas importantes"
          emptyMessage="Nenhum alerta relevante no momento."
          items={alerts}
          icon={AlertTriangle}
        />
      </section>
    </DashboardShell>
  );
}
