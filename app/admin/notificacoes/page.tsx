import { Bell, BellRing, CheckCheck, DoorOpen, Package, Settings, UserCheck } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { MetricCard } from "@/components/dashboard/metric-card";
import { NotificationFilters } from "@/components/notifications/notification-filters";
import { NotificationList } from "@/components/notifications/notification-list";
import { SubmitButton } from "@/components/ui/submit-button";
import { markAllNotificationsAsReadAction } from "@/lib/notifications/actions";
import { getNotificationsPageData } from "@/lib/notifications/queries";
import { parseNotificationFilters } from "@/lib/notifications/validation";

type AdminNotificationsPageProps = {
  searchParams: Promise<{
    status?: string;
    type?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function AdminNotificationsPage({
  searchParams,
}: AdminNotificationsPageProps) {
  const filters = parseNotificationFilters(await searchParams);
  const data = await getNotificationsPageData("ADMIN", filters);

  return (
    <DashboardShell
      eyebrow="Central administrativa"
      title="Notificacoes"
      description="Acompanhe notificacoes administrativas, globais e a visao geral das mensagens persistidas do sistema."
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Visiveis para admin"
          value={data.stats.totalCount}
          description="Notificacoes administrativas ou globais disponiveis."
          icon={Bell}
          tone="info"
        />
        <MetricCard
          title="Nao lidas"
          value={data.stats.unreadCount}
          description="Pendencias de leitura no seu perfil."
          icon={BellRing}
          tone={data.stats.unreadCount > 0 ? "warning" : "success"}
        />
        <MetricCard
          title="Sistema geral"
          value={data.systemOverview?.totalCount ?? 0}
          description="Total de notificacoes registradas no sistema."
          icon={Settings}
          tone="info"
        />
        <MetricCard
          title="Nao lidas no sistema"
          value={data.systemOverview?.unreadCount ?? 0}
          description="Volume geral ainda nao lido."
          icon={CheckCheck}
          tone={(data.systemOverview?.unreadCount ?? 0) > 0 ? "warning" : "success"}
        />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Encomendas" value={data.stats.packageCount} description="Notificacoes do tipo PACKAGE." icon={Package} tone="info" />
        <MetricCard title="Visitantes" value={data.stats.visitorCount} description="Notificacoes do tipo VISITOR." icon={UserCheck} tone="info" />
        <MetricCard title="Acessos" value={data.stats.accessCount} description="Notificacoes do tipo ACCESS." icon={DoorOpen} tone="info" />
        <MetricCard title="Sistema" value={data.stats.systemCount} description="Notificacoes do tipo SYSTEM." icon={Settings} tone="info" />
      </section>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1">
          <NotificationFilters
            route={data.route}
            status={data.filters.status}
            type={data.filters.type}
          />
        </div>
        {data.stats.unreadCount > 0 ? (
          <form action={markAllNotificationsAsReadAction}>
            <input type="hidden" name="redirectTo" value={data.route} />
            <SubmitButton variant="outline" pendingLabel="Marcando...">
              <CheckCheck className="h-4 w-4" />
              Marcar todas como lidas
            </SubmitButton>
          </form>
        ) : null}
      </div>

      <NotificationList
        readNotifications={data.readNotifications}
        redirectTo={data.route}
        unreadNotifications={data.unreadNotifications}
      />
    </DashboardShell>
  );
}
