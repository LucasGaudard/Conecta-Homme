import type { Notification } from "@prisma/client";
import { NotificationCard } from "@/components/notifications/notification-card";
import { NotificationEmptyState } from "@/components/notifications/notification-empty-state";

type NotificationListProps = {
  readNotifications: Notification[];
  redirectTo: string;
  unreadNotifications: Notification[];
};

export function NotificationList({
  readNotifications,
  redirectTo,
  unreadNotifications,
}: NotificationListProps) {
  const hasNotifications =
    unreadNotifications.length > 0 || readNotifications.length > 0;

  if (!hasNotifications) {
    return (
      <NotificationEmptyState message="Nenhuma notificacao encontrada para os filtros selecionados." />
    );
  }

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold text-navy-950">Nao lidas</h2>
          <p className="text-sm text-slate-500">
            {unreadNotifications.length} notificacao(oes) aguardando leitura.
          </p>
        </div>
        {unreadNotifications.length === 0 ? (
          <NotificationEmptyState message="Voce nao possui notificacoes nao lidas." />
        ) : (
          <div className="space-y-3">
            {unreadNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                redirectTo={redirectTo}
              />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold text-navy-950">Lidas</h2>
          <p className="text-sm text-slate-500">
            {readNotifications.length} notificacao(oes) ja visualizada(s).
          </p>
        </div>
        {readNotifications.length === 0 ? (
          <NotificationEmptyState message="Nenhuma notificacao lida neste filtro." />
        ) : (
          <div className="space-y-3">
            {readNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                redirectTo={redirectTo}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
