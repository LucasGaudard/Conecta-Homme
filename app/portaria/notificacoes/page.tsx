import { Bell, BellRing, CheckCheck, DoorOpen, Package, Settings, UserCheck } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { MetricCard } from "@/components/dashboard/metric-card";
import { NotificationFilters } from "@/components/notifications/notification-filters";
import { NotificationList } from "@/components/notifications/notification-list";
import { SubmitButton } from "@/components/ui/submit-button";
import { markAllNotificationsAsReadAction } from "@/lib/notifications/actions";
import { getNotificationsPageData } from "@/lib/notifications/queries";
import { parseNotificationFilters } from "@/lib/notifications/validation";

type PorterNotificationsPageProps = {
  searchParams: Promise<{
    status?: string;
    type?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function PorterNotificationsPage({
  searchParams,
}: PorterNotificationsPageProps) {
  const filters = parseNotificationFilters(await searchParams);
  const data = await getNotificationsPageData("PORTER", filters);

  return (
    <DashboardShell
      eyebrow="Central da portaria"
      title="Notificações"
      description="Visualize notificações operacionais vinculadas ao seu usuário de portaria."
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Total" value={data.stats.totalCount} description="Notificações disponíveis para a portaria." icon={Bell} tone="info" />
        <MetricCard title="Não lidas" value={data.stats.unreadCount} description="Pendências de leitura." icon={BellRing} tone={data.stats.unreadCount > 0 ? "warning" : "success"} />
        <MetricCard title="Lidas" value={data.stats.readCount} description="Notificações já acompanhadas." icon={CheckCheck} tone="success" />
        <MetricCard title="Sistema" value={data.stats.systemCount} description="Mensagens operacionais do sistema." icon={Settings} tone="info" />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Encomendas" value={data.stats.packageCount} description="Notificações do tipo PACKAGE." icon={Package} tone="info" />
        <MetricCard title="Visitantes" value={data.stats.visitorCount} description="Notificações do tipo VISITOR." icon={UserCheck} tone="info" />
        <MetricCard title="Acessos" value={data.stats.accessCount} description="Notificações do tipo ACCESS." icon={DoorOpen} tone="info" />
        <MetricCard title="Sistema" value={data.stats.systemCount} description="Notificações do tipo SYSTEM." icon={Settings} tone="info" />
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
