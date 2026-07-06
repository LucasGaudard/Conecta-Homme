import Link from "next/link";
import { Building2, CheckCircle2, PauseCircle, Users, XCircle } from "lucide-react";
import { MetricCard } from "@/components/dashboard/metric-card";
import { Button } from "@/components/ui/button";
import { CondominiumStatusBadge } from "@/components/super-admin/condominium-status-badge";
import { formatCondominiumDate } from "@/lib/super-admin/format";
import { getSuperAdminDashboardData } from "@/lib/super-admin/queries";

export const dynamic = "force-dynamic";

export default async function SuperAdminPage() {
  const data = await getSuperAdminDashboardData();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-normal text-navy-950">
            Super Admin
          </h2>
          <p className="max-w-2xl text-sm leading-6 text-slate-500">
            Área de gestão da plataforma Conecta Homme.
          </p>
        </div>
        <Button asChild>
          <Link href="/super-admin/condominios/novo">
            <Building2 className="h-4 w-4" />
            Novo condomínio
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard
          title="Total"
          value={data.stats.totalCondominiums}
          description="Condomínios cadastrados na plataforma."
          icon={Building2}
        />
        <MetricCard
          title="Ativos"
          value={data.stats.activeCondominiums}
          description="Condomínios com operação liberada."
          icon={CheckCircle2}
          tone="success"
        />
        <MetricCard
          title="Suspensos"
          value={data.stats.suspendedCondominiums}
          description="Condomínios com acesso operacional bloqueado."
          icon={PauseCircle}
          tone="warning"
        />
        <MetricCard
          title="Inativos"
          value={data.stats.inactiveCondominiums}
          description="Condomínios sem operação ativa."
          icon={XCircle}
          tone="danger"
        />
        <MetricCard
          title="Usuários tenant"
          value={data.stats.totalTenantUsers}
          description="Usuários vinculados a condomínios."
          icon={Users}
        />
      </div>

      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-navy-950">
            Últimos condomínios cadastrados
          </h3>
          <p className="text-sm text-slate-500">
            Acompanhe as entradas mais recentes da plataforma.
          </p>
        </div>
        {data.latestCondominiums.length === 0 ? (
          <div className="surface-card p-8 text-center">
            <p className="text-sm font-medium text-navy-950">
              Nenhum condomínio cadastrado.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {data.latestCondominiums.map((item) => (
              <Link
                key={item.id}
                href={`/super-admin/condominios/${item.id}`}
                className="surface-card surface-card-hover flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-medium text-navy-950">{item.name}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {item.slug} · {formatCondominiumDate(item.createdAt)}
                  </p>
                </div>
                <CondominiumStatusBadge status={item.status} />
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
