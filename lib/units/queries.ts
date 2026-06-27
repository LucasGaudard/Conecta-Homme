import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function getUnits() {
  return prisma.unit.findMany({
    include: {
      _count: {
        select: {
          users: {
            where: {
              role: UserRole.RESIDENT,
            },
          },
        },
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
  });
}

export async function getUnitById(unitId: string) {
  return prisma.unit.findUnique({
    where: {
      id: unitId,
    },
    include: {
      _count: {
        select: {
          accessLogs: true,
          packages: {
            where: {
              status: "WAITING_PICKUP",
            },
          },
          users: {
            where: {
              role: UserRole.RESIDENT,
            },
          },
          visitAuthorizations: true,
        },
      },
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
        take: 5,
      },
      packages: {
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      },
      users: {
        where: {
          role: UserRole.RESIDENT,
        },
        orderBy: {
          name: "asc",
        },
      },
      visitAuthorizations: {
        include: {
          authorizedBy: {
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
          createdAt: "desc",
        },
        take: 5,
      },
    },
  });
}
