import type { Notification, NotificationStatus } from "@prisma/client";
import { CheckCircle2 } from "lucide-react";
import { markNotificationAsReadAction } from "@/lib/notifications/actions";
import {
  formatNotificationDateTime,
  getNotificationIcon,
  notificationStatusLabels,
  notificationTypeLabels,
} from "@/lib/notifications/format";
import { cn } from "@/lib/utils";
import { SubmitButton } from "@/components/ui/submit-button";

type NotificationCardProps = {
  notification: Notification;
  redirectTo: string;
};

const statusClasses: Record<NotificationStatus, string> = {
  READ: "border-slate-200 bg-white",
  UNREAD: "border-navy-100 bg-navy-50/70 shadow-soft",
};

export function NotificationCard({
  notification,
  redirectTo,
}: NotificationCardProps) {
  const Icon = getNotificationIcon(notification.type);
  const unread = notification.status === "UNREAD";

  return (
    <article
      className={cn(
        "rounded-lg border p-4 transition duration-200",
        statusClasses[notification.status],
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 gap-3">
          <span
            className={cn(
              "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-md border",
              unread
                ? "border-navy-100 bg-white text-navy-900"
                : "border-slate-200 bg-slate-50 text-slate-500",
            )}
          >
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold text-navy-950">
                {notification.title}
              </h3>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase",
                  unread
                    ? "bg-navy-950 text-white"
                    : "bg-slate-100 text-slate-500",
                )}
              >
                {notificationStatusLabels[notification.status]}
              </span>
            </div>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              {notification.message}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span>{notificationTypeLabels[notification.type]}</span>
              <span aria-hidden="true">·</span>
              <time dateTime={notification.createdAt.toISOString()}>
                {formatNotificationDateTime(notification.createdAt)}
              </time>
            </div>
          </div>
        </div>

        {unread ? (
          <form action={markNotificationAsReadAction} className="sm:shrink-0">
            <input type="hidden" name="id" value={notification.id} />
            <input type="hidden" name="redirectTo" value={redirectTo} />
            <SubmitButton variant="outline" size="sm" pendingLabel="Marcando...">
              <CheckCircle2 className="h-4 w-4" />
              Marcar como lida
            </SubmitButton>
          </form>
        ) : null}
      </div>
    </article>
  );
}
