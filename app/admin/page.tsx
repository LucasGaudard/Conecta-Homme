import {
  Activity,
  Building2,
  Package,
  ShieldCheck,
  UserCheck,
  Users,
} from "lucide-react";
import { RecentList } from "@/components/dashboard/recent-list";
import { StatCard } from "@/components/dashboard/stat-card";
import { getAdminDashboardData } from "@/lib/dashboard/admin";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const {
    recentAccessLogs,
    recentPackages,
    recentVisitAuthorizations,
    stats,
  } = await getAdminDashboardData();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-normal text-navy-950">
          Dashboard administrativo
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-slate-500">
          Visao geral operacional com dados atuais de unidades, pessoas,
          acessos, visitantes e encomendas.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Total de unidades"
          value={stats.totalUnits}
          description="Unidades cadastradas no condominio."
          icon={Building2}
        />
        <StatCard
          title="Moradores ativos"
          value={stats.totalActiveResidents}
          description="Usuarios residentes com status ativo."
          icon={Users}
        />
        <StatCard
          title="Porteiros ativos"
          value={stats.totalActivePorters}
          description="Usuarios de portaria com status ativo."
          icon={ShieldCheck}
        />
        <StatCard
          title="Encomendas pendentes"
          value={stats.packagesWaitingPickup}
          description="Encomendas aguardando retirada."
          icon={Package}
        />
        <StatCard
          title="Visitantes hoje"
          value={stats.visitorsAuthorizedToday}
          description="Autorizações validas para o dia atual."
          icon={UserCheck}
        />
        <StatCard
          title="Acessos hoje"
          value={stats.accessLogsToday}
          description="Entradas e saidas registradas hoje."
          icon={Activity}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <RecentList
          title="Ultimos acessos"
          emptyMessage="Nenhum acesso registrado ate o momento."
          items={recentAccessLogs}
          icon={<Activity className="h-4 w-4" />}
        />
        <RecentList
          title="Ultimas encomendas"
          emptyMessage="Nenhuma encomenda cadastrada ate o momento."
          items={recentPackages}
          icon={<Package className="h-4 w-4" />}
        />
        <RecentList
          title="Ultimos visitantes"
          emptyMessage="Nenhum visitante autorizado ate o momento."
          items={recentVisitAuthorizations}
          icon={<UserCheck className="h-4 w-4" />}
        />
      </section>
    </div>
  );
}
