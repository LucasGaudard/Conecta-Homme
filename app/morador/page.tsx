import { History, Home, Package, QrCode, UserCheck, Users } from "lucide-react";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { MetricCard } from "@/components/dashboard/metric-card";
import { QuickActionCard } from "@/components/dashboard/quick-action-card";
import { ResidentStatusCard } from "@/components/resident/resident-status-card";
import {
  formatDateTime,
  formatResidentPresenceStatus,
} from "@/components/resident/resident-format";
import { getResidentDashboardData } from "@/lib/resident/queries";

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
  const accessItems = data.recentAccesses.map((item) => ({
    description: [
      item.accessMethod === "QR_CODE" ? "QR Code" : "Manual",
      item.porter?.name ? `Portaria: ${item.porter.name}` : null,
    ]
      .filter(Boolean)
      .join(" · "),
    icon: <History className="h-4 w-4" />,
    id: item.id,
    meta: formatDateTime(item.occurredAt),
    title: item.accessType === "ENTRY" ? "Entrada registrada" : "Saída registrada",
  }));
  const packageItems = data.waitingPackages.map((item) => ({
    description: [
      item.carrier ? `Transportadora: ${item.carrier}` : null,
      item.trackingCode ? `Código: ${item.trackingCode}` : null,
    ]
      .filter(Boolean)
      .join(" · "),
    icon: <Package className="h-4 w-4" />,
    id: item.id,
    meta: formatDateTime(item.receivedAt),
    title: item.description ?? "Encomenda aguardando retirada",
  }));
  const visitorItems = data.activeVisitors.map((item) => ({
    description: item.visitor.phone ? `Telefone: ${item.visitor.phone}` : undefined,
    icon: <UserCheck className="h-4 w-4" />,
    id: item.id,
    meta: formatDateTime(item.startsAt),
    title: item.visitor.name,
  }));
  const notificationItems = data.recentNotifications.map((item) => ({
    description: item.message,
    icon: <Home className="h-4 w-4" />,
    id: item.id,
    meta: formatDateTime(item.createdAt),
    title: item.title,
  }));

  return (
    <DashboardShell
      eyebrow={`Unidade ${data.unit.block}-${data.unit.apartment}`}
      title="Dashboard do morador"
      description="Acompanhe status da residência, acessos, visitantes, encomendas e notificações da sua unidade."
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Encomendas aguardando"
          value={data.stats.packagesWaitingPickup}
          description="Itens pendentes na portaria."
          icon={Package}
          tone={data.stats.packagesWaitingPickup > 0 ? "warning" : "success"}
        />
        <MetricCard
          title="Visitantes autorizados"
          value={data.stats.authorizedVisitors}
          description="Autorizações ainda válidas."
          icon={UserCheck}
          tone="info"
        />
        <MetricCard
          title="Últimos acessos"
          value={data.stats.recentAccesses}
          description="Registros recentes da sua unidade."
          icon={History}
          tone="info"
        />
        <MetricCard
          title="Status da residência"
          value={formatResidentPresenceStatus(data.stats.residenceStatus)}
          description="Visível para a portaria."
          icon={Home}
          tone={data.stats.residenceStatus === "DO_NOT_DISTURB" ? "danger" : "success"}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <ResidentStatusCard
          presenceStatus={data.unit.presenceStatus}
          error={error}
          success={success}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <QuickActionCard
            title="Meu QR Code"
            description="Acesse seu QR permanente."
            href="/morador/qrcode"
            icon={QrCode}
          />
          <QuickActionCard
            title="Visitantes"
            description="Autorize entradas temporárias."
            href="/morador/visitantes"
            icon={Users}
          />
          <QuickActionCard
            title="Encomendas"
            description="Consulte itens na portaria."
            href="/morador/encomendas"
            icon={Package}
          />
          <QuickActionCard
            title="Acessos"
            description="Veja o histórico da unidade."
            href="/morador/acessos"
            icon={History}
          />
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <ActivityFeed
          title="Últimos acessos"
          emptyMessage="Nenhum acesso registrado para sua unidade."
          items={accessItems}
        />
        <ActivityFeed
          title="Encomendas pendentes"
          emptyMessage="Nenhuma encomenda aguardando retirada."
          items={packageItems}
        />
        <ActivityFeed
          title="Visitantes autorizados"
          emptyMessage="Nenhum visitante autorizado no momento."
          items={visitorItems}
        />
      </section>

      <ActivityFeed
        title="Notificações recentes"
        emptyMessage="Nenhuma notificacao recente."
        items={notificationItems}
      />
    </DashboardShell>
  );
}
