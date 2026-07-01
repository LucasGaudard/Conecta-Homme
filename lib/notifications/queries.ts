import { NotificationStatus, NotificationType, Prisma, UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import {
  type NotificationStatusFilter,
  type NotificationTypeFilter,
} from "@/lib/notifications/validation";
import { prisma } from "@/lib/prisma";

export type NotificationRole = UserRole;

async function getNotificationContext(expectedRole?: NotificationRole) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  if (expectedRole && currentUser.role !== expectedRole) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: currentUser.id,
    },
    select: {
      id: true,
      role: true,
      unitId: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  if (expectedRole && user.role !== expectedRole) {
    redirect("/login");
  }

  return user;
}

export function getNotificationRoute(role: NotificationRole) {
  if (role === UserRole.ADMIN) {
    return "/admin/notificacoes";
  }

  if (role === UserRole.PORTER) {
    return "/portaria/notificacoes";
  }

  return "/morador/notificacoes";
}

function getVisibleNotificationWhere(user: {
  id: string;
  role: UserRole;
  unitId: string | null;
}): Prisma.NotificationWhereInput {
  if (user.role === UserRole.RESIDENT) {
    return {
      OR: [
        { userId: user.id },
        ...(user.unitId ? [{ unitId: user.unitId }] : []),
      ],
    };
  }

  if (user.role === UserRole.ADMIN) {
    return {
      OR: [
        { userId: user.id },
        {
          AND: [{ userId: null }, { unitId: null }],
        },
      ],
    };
  }

  return {
    userId: user.id,
  };
}

function getFilterWhere(filters: {
  status: NotificationStatusFilter;
  type: NotificationTypeFilter;
}): Prisma.NotificationWhereInput {
  return {
    ...(filters.status !== "ALL"
      ? { status: filters.status as NotificationStatus }
      : {}),
    ...(filters.type !== "ALL" ? { type: filters.type as NotificationType } : {}),
  };
}

export async function getNotificationHeaderData(role: NotificationRole) {
  const user = await getNotificationContext(role);
  const where = getVisibleNotificationWhere(user);
  const [unreadCount, latest] = await Promise.all([
    prisma.notification.count({
      where: {
        AND: [where, { status: NotificationStatus.UNREAD }],
      },
    }),
    prisma.notification.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    }),
  ]);

  return {
    latest,
    route: getNotificationRoute(role),
    unreadCount,
  };
}

export async function getNotificationsPageData(
  role: NotificationRole,
  filters: {
    status: NotificationStatusFilter;
    type: NotificationTypeFilter;
  },
) {
  const user = await getNotificationContext(role);
  const visibleWhere = getVisibleNotificationWhere(user);
  const filterWhere = getFilterWhere(filters);
  const where = {
    AND: [visibleWhere, filterWhere],
  };

  const [
    notifications,
    totalCount,
    unreadCount,
    readCount,
    packageCount,
    visitorCount,
    accessCount,
    systemCount,
    systemOverview,
  ] = await Promise.all([
    prisma.notification.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.notification.count({ where: visibleWhere }),
    prisma.notification.count({
      where: {
        AND: [visibleWhere, { status: NotificationStatus.UNREAD }],
      },
    }),
    prisma.notification.count({
      where: {
        AND: [visibleWhere, { status: NotificationStatus.READ }],
      },
    }),
    prisma.notification.count({
      where: {
        AND: [visibleWhere, { type: NotificationType.PACKAGE }],
      },
    }),
    prisma.notification.count({
      where: {
        AND: [visibleWhere, { type: NotificationType.VISITOR }],
      },
    }),
    prisma.notification.count({
      where: {
        AND: [visibleWhere, { type: NotificationType.ACCESS }],
      },
    }),
    prisma.notification.count({
      where: {
        AND: [visibleWhere, { type: NotificationType.SYSTEM }],
      },
    }),
    role === UserRole.ADMIN
      ? Promise.all([
          prisma.notification.count(),
          prisma.notification.count({
            where: {
              status: NotificationStatus.UNREAD,
            },
          }),
        ])
      : Promise.resolve(null),
  ]);

  const unreadNotifications = notifications.filter(
    (notification) => notification.status === NotificationStatus.UNREAD,
  );
  const readNotifications = notifications.filter(
    (notification) => notification.status === NotificationStatus.READ,
  );

  return {
    filters,
    notifications,
    readNotifications,
    route: getNotificationRoute(role),
    stats: {
      accessCount,
      packageCount,
      readCount,
      systemCount,
      totalCount,
      unreadCount,
      visitorCount,
    },
    systemOverview: systemOverview
      ? {
          totalCount: systemOverview[0],
          unreadCount: systemOverview[1],
        }
      : null,
    unreadNotifications,
  };
}

export async function getVisibleNotificationWhereForCurrentUser() {
  const user = await getNotificationContext();

  return {
    role: user.role as NotificationRole,
    route: getNotificationRoute(user.role as NotificationRole),
    where: getVisibleNotificationWhere(user),
  };
}
