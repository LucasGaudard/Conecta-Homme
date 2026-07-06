import { UserRole } from "@prisma/client";
import { requireCondominiumRole } from "@/lib/auth/authorization";
import { prisma } from "@/lib/prisma";

export async function getUnits() {
  const { condominiumId } = await requireCondominiumRole("ADMIN");

  return prisma.unit.findMany({
    include: {
      _count: {
        select: {
          users: {
            where: {
              condominiumId,
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
    where: {
      condominiumId,
    },
  });
}

export async function getUnitById(unitId: string) {
  const { condominiumId } = await requireCondominiumRole("ADMIN");

  return prisma.unit.findFirst({
    where: {
      condominiumId,
      id: unitId,
    },
    include: {
      _count: {
        select: {
          accessLogs: {
            where: {
              condominiumId,
            },
          },
          packages: {
            where: {
              condominiumId,
              status: "WAITING_PICKUP",
            },
          },
          users: {
            where: {
              condominiumId,
              role: UserRole.RESIDENT,
            },
          },
          visitAuthorizations: {
            where: {
              condominiumId,
            },
          },
        },
      },
      accessLogs: {
        where: {
          condominiumId,
        },
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
        where: {
          condominiumId,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      },
      users: {
        where: {
          condominiumId,
          role: UserRole.RESIDENT,
        },
        orderBy: {
          name: "asc",
        },
      },
      visitAuthorizations: {
        where: {
          condominiumId,
        },
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
