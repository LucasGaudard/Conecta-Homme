import { PackageStatus, UnitStatus, UserRole, VisitorStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

function getTodayRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return { end, start };
}

export async function getPorterDashboardData() {
  const { end, start } = getTodayRange();

  const [
    totalActiveUnits,
    visitorsAuthorizedToday,
    packagesWaitingPickup,
    accessLogsToday,
    recentAccessLogs,
  ] = await Promise.all([
    prisma.unit.count({
      where: {
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
      },
    }),
    prisma.package.count({
      where: {
        status: PackageStatus.WAITING_PICKUP,
      },
    }),
    prisma.accessLog.count({
      where: {
        occurredAt: {
          gte: start,
          lt: end,
        },
      },
    }),
    getRecentAccessLogs(),
  ]);

  return {
    recentAccessLogs,
    stats: {
      accessLogsToday,
      packagesWaitingPickup,
      totalActiveUnits,
      visitorsAuthorizedToday,
    },
  };
}

export async function searchPorterUnits(query: string) {
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

export async function getRecentAccessLogs() {
  return prisma.accessLog.findMany({
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
