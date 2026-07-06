import { PackageStatus, PresenceStatus, UnitStatus, UserRole, VisitorStatus } from "@prisma/client";
import { requireCondominiumRole } from "@/lib/auth/authorization";
import { prisma } from "@/lib/prisma";

function getTodayRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return { end, start };
}

export async function getPorterDashboardData() {
  const { condominiumId } = await requireCondominiumRole("PORTER");
  const { end, start } = getTodayRange();

  const [
    totalActiveUnits,
    visitorsAuthorizedToday,
    packagesWaitingPickup,
    accessLogsToday,
    recentAccessLogs,
    pendingPackages,
    todayVisitors,
    doNotDisturbUnits,
  ] = await Promise.all([
    prisma.unit.count({
      where: {
        condominiumId,
        status: UnitStatus.ACTIVE,
      },
    }),
    prisma.visitAuthorization.count({
      where: {
        endsAt: {
          gte: start,
        },
        startsAt: {
          lt: end,
        },
        status: VisitorStatus.AUTHORIZED,
        unit: {
          condominiumId,
        },
      },
    }),
    prisma.package.count({
      where: {
        status: PackageStatus.WAITING_PICKUP,
        unit: {
          condominiumId,
        },
      },
    }),
    prisma.accessLog.count({
      where: {
        occurredAt: {
          gte: start,
          lt: end,
        },
        unit: {
          condominiumId,
        },
      },
    }),
    getRecentAccessLogs(condominiumId),
    prisma.package.findMany({
      where: {
        status: PackageStatus.WAITING_PICKUP,
        unit: {
          condominiumId,
        },
      },
      include: {
        unit: {
          select: {
            apartment: true,
            block: true,
            responsibleName: true,
          },
        },
      },
      orderBy: {
        receivedAt: "desc",
      },
      take: 5,
    }),
    prisma.visitAuthorization.findMany({
      where: {
        endsAt: {
          gte: start,
        },
        startsAt: {
          lt: end,
        },
        status: VisitorStatus.AUTHORIZED,
        unit: {
          condominiumId,
        },
      },
      include: {
        unit: {
          select: {
            apartment: true,
            block: true,
            responsibleName: true,
          },
        },
        visitor: {
          select: {
            name: true,
            phone: true,
          },
        },
      },
      orderBy: {
        startsAt: "asc",
      },
      take: 6,
    }),
    prisma.unit.findMany({
      where: {
        condominiumId,
        presenceStatus: PresenceStatus.DO_NOT_DISTURB,
        status: UnitStatus.ACTIVE,
      },
      orderBy: [{ block: "asc" }, { apartment: "asc" }],
      select: {
        apartment: true,
        block: true,
        id: true,
        responsibleName: true,
      },
      take: 6,
    }),
  ]);

  return {
    doNotDisturbUnits,
    pendingPackages,
    recentAccessLogs,
    stats: {
      accessLogsToday,
      packagesWaitingPickup,
      totalActiveUnits,
      visitorsAuthorizedToday,
    },
    todayVisitors,
  };
}

export async function searchPorterUnits(query: string) {
  const { condominiumId } = await requireCondominiumRole("PORTER");
  const normalizedQuery = query.trim();

  if (normalizedQuery.length === 0) {
    return [];
  }

  return prisma.unit.findMany({
    include: {
      accessLogs: {
        include: {
          porter: {
            select: {
              name: true,
            },
          },
          user: {
            select: {
              name: true,
            },
          },
          visitor: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          occurredAt: "desc",
        },
        take: 4,
      },
      packages: {
        where: {
          status: PackageStatus.WAITING_PICKUP,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 4,
      },
      users: {
        where: {
          condominiumId,
          role: UserRole.RESIDENT,
        },
        orderBy: {
          name: "asc",
        },
        select: {
          name: true,
          status: true,
        },
      },
      visitAuthorizations: {
        include: {
          visitor: {
            select: {
              name: true,
              phone: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 4,
      },
    },
    orderBy: [
      {
        block: "asc",
      },
      {
        apartment: "asc",
      },
    ],
    take: 8,
    where: {
      condominiumId,
      OR: [
        {
          block: {
            contains: normalizedQuery,
            mode: "insensitive",
          },
        },
        {
          apartment: {
            contains: normalizedQuery,
            mode: "insensitive",
          },
        },
        {
          responsibleName: {
            contains: normalizedQuery,
            mode: "insensitive",
          },
        },
        {
          phone: {
            contains: normalizedQuery,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: normalizedQuery,
            mode: "insensitive",
          },
        },
      ],
    },
  });
}

export async function getRecentAccessLogs(condominiumId?: string) {
  const context = condominiumId
    ? { condominiumId }
    : await requireCondominiumRole("PORTER");

  return prisma.accessLog.findMany({
    where: {
      unit: {
        condominiumId: context.condominiumId,
      },
    },
    include: {
      porter: {
        select: {
          name: true,
        },
      },
      unit: {
        select: {
          apartment: true,
          block: true,
          responsibleName: true,
        },
      },
      user: {
        select: {
          name: true,
        },
      },
      visitor: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      occurredAt: "desc",
    },
    take: 10,
  });
}
