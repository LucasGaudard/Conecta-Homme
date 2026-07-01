import {
  Bell,
  BellRing,
  DoorOpen,
  Package,
  Settings,
  UserCheck,
} from "lucide-react";
import { NotificationStatus, NotificationType, UserRole } from "@prisma/client";

export const notificationTypeLabels: Record<NotificationType, string> = {
  ACCESS: "Acesso",
  PACKAGE: "Encomenda",
  SYSTEM: "Sistema",
  VISITOR: "Visitante",
};

export const notificationStatusLabels: Record<NotificationStatus, string> = {
  READ: "Lida",
  UNREAD: "Nao lida",
};

export const notificationRouteByRole: Record<UserRole, string> = {
  ADMIN: "/admin/notificacoes",
  PORTER: "/portaria/notificacoes",
  RESIDENT: "/morador/notificacoes",
};

export const notificationRoleLabels: Record<UserRole, string> = {
  ADMIN: "Admin",
  PORTER: "Portaria",
  RESIDENT: "Morador",
};

export function getNotificationIcon(type: NotificationType) {
  const icons = {
    ACCESS: DoorOpen,
    PACKAGE: Package,
    SYSTEM: Settings,
    VISITOR: UserCheck,
  };

  return icons[type] ?? Bell;
}

export function formatNotificationDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
  }).format(date);
}

export function formatNotificationDateTime(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function getNotificationBellLabel(unreadCount: number) {
  if (unreadCount === 0) {
    return "Nenhuma notificacao nao lida";
  }

  if (unreadCount === 1) {
    return "1 notificacao nao lida";
  }

  return `${unreadCount} notificacoes nao lidas`;
}

export function getNotificationBellIcon(unreadCount: number) {
  return unreadCount > 0 ? BellRing : Bell;
}
