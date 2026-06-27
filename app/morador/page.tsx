import { History, Home, Package, UserCheck } from "lucide-react";
import { ResidentStatCard } from "@/components/resident/resident-stat-card";
import { ResidentStatusCard } from "@/components/resident/resident-status-card";
import { getResidentDashboardData } from "@/lib/resident/queries";
import { formatResidentPresenceStatus } from "@/components/resident/resident-format";

type ResidentDashboardPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function ResidentDashboardPage({
  searchParams,
}: ResidentDashboardPageProps) {
  const [{ error, success }, data] = await Promise.all([
    searchParams,
    getResidentDashboardData(),
  ]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-normal text-navy-950">
          Dashboard do morador
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-slate-500">
          Unidade {data.unit.block}-{data.unit.apartment}: acompanhe acessos,
          visitantes, encomendas e status da residencia.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ResidentStatCard
          title="Encomendas aguardando retirada"
          value={data.stats.packagesWaitingPickup}
          description="Itens pendentes na portaria."
          icon={Package}
        />
        <ResidentStatCard
          title="Visitantes autorizados"
          value={data.stats.authorizedVisitors}
          description="Autorizacoes ainda validas."
          icon={UserCheck}
        />
        <ResidentStatCard
          title="Ultimos acessos"
          value={data.stats.recentAccesses}
          description="Registros recentes da sua unidade."
          icon={History}
        />
        <ResidentStatCard
          title="Status da residencia"
          value={formatResidentPresenceStatus(data.stats.residenceStatus)}
          description="Visivel para a portaria."
          icon={Home}
        />
      </section>

      <ResidentStatusCard
        presenceStatus={data.unit.presenceStatus}
        error={error}
        success={success}
      />
    </div>
  );
}
