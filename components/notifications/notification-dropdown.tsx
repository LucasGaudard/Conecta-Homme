import Link from "next/link";
import type { Notification } from "@prisma/client";
import { ArrowRight, CheckCheck } from "lucide-react";
import { NotificationEmptyState } from "@/components/notifications/notification-empty-state";
import { SubmitButton } from "@/components/ui/submit-button";
import { markAllNotificationsAsReadAction } from "@/lib/notifications/actions";
import {
  formatNotificationDate,
  getNotificationIcon,
  notificationTypeLabels,
} from "@/lib/notifications/format";
import { cn } from "@/lib/utils";

type NotificationDropdownProps = {
  latest: Notification[];
  route: string;
  unreadCount: number;
};

export function NotificationDropdown({
  latest,
  route,
  unreadCount,
}: NotificationDropdownProps) {
  return (
    <div className="absolute right-0 top-12 z-50 w-[calc(100vw-2rem)] max-w-sm rounded-lg border border-slate-200 bg-white p-3 shadow-elevated">
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <p className="text-sm font-semibold text-navy-950">Notificacoes</p>
          <p className="mt-0.5 text-xs text-slate-500">
            {unreadCount} nao lida(s)
          </p>
        </div>
        {unreadCount > 0 ? (
          <form action={markAllNotificationsAsReadAction}>
            <input type="hidden" name="redirectTo" value={route} />
            <SubmitButton variant="ghost" size="sm" pendingLabel="Marcando...">
              <CheckCheck className="h-4 w-4" />
              Todas
            </SubmitButton>
          </form>
        ) : null}
      </div>

      <div className="max-h-80 overflow-y-auto py-2">
        {latest.length === 0 ? (
          <NotificationEmptyState message="Nenhuma notificacao recente." />
        ) : (
          <div className="space-y-1">
            {latest.map((notification) => {
              const Icon = getNotificationIcon(notification.type);
              const unread = notification.status === "UNREAD";

              return (
                <Link
                  key={notification.id}
                  href={route}
                  className={cn(
                    "flex gap-3 rounded-md p-3 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20",
                    unread && "bg-navy-50/70",
                  )}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white text-navy-900">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-navy-950">
                      {notification.title}
                    </span>
                    <span className="mt-0.5 line-clamp-2 block text-xs leading-5 text-slate-500">
                      {notification.message}
                    </span>
                    <span className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-400">
                      {notificationTypeLabels[notification.type]}
                      <span aria-hidden="true">·</span>
                      {formatNotificationDate(notification.createdAt)}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <ButtonLink href={route} />
    </div>
  );
}

function ButtonLink({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="mt-2 flex h-10 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-navy-950 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20"
    >
      Ver todas
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}
