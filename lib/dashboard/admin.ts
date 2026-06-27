import { AccessMethod, AccessType, PackageStatus, UserRole, UserStatus, VisitorStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

function getTodayRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return { end, start };
}

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "2-digit",
  }).format(date);
}

function formatAccessType(accessType: AccessType) {
  return accessType === AccessType.ENTRY ? "Entrada" : "Saida";
}

function formatAccessMethod(accessMethod: AccessMethod) {
  return accessMethod === AccessMethod.QR_CODE ? "QR Code" : "Manual";
}

export async function getAdminDashboardData() {
  const { end, start } = getTodayRange();

  const [
    totalUnits,
    totalActiveResidents,
    totalActivePorters,
    packagesWaitingPickup,
    visitorsAuthorizedToday,
    accessLogsToday,
    recentAccessLogs,
    recentPackages,
    recentVisitAuthorizations,
  ] = await Promise.all([
    prisma.unit.count(),
    prisma.user.count({
      where: {
        role: UserRole.RESIDENT,
        status: UserStatus.ACTIVE,
      },
    }),
    prisma.user.count({
      where: {
        role: UserRole.PORTER,
        status: UserStatus.ACTIVE,
      },
    }),
    prisma.package.count({
      where: {
        status: PackageStatus.WAITING_PICKUP,
      },
    }),
    prisma.visitAuthorization.count({
      where: {
        startsAt: {
          lt: end,
        },
        status: VisitorStatus.AUTHORIZED,
        endsAt: {
          gte: start,
        },
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
    prisma.accessLog.findMany({
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
    }),
    prisma.package.findMany({
      include: {
        unit: {
          select: {
            apartment: true,
            block: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    }),
    prisma.visitAuthorization.findMany({
      include: {
        authorizedBy: {
          select: {
            name: true,
          },
        },
        unit: {
          select: {
            apartment: true,
            block: true,
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
    }),
  ]);

  return {
    recentAccessLogs: recentAccessLogs.map((accessLog) => ({
      description: [
        accessLog.unit
          ? `Unidade ${accessLog.unit.block}-${accessLog.unit.apartment}`
          : "Unidade nao informada",
        formatAccessMethod(accessLog.accessMethod),
        accessLog.porter?.name ? `Portaria: ${accessLog.porter.name}` : null,
      ]
        .filter(Boolean)
        .join(" · "),
      id: accessLog.id,
      meta: formatDateTime(accessLog.occurredAt),
      title: `${formatAccessType(accessLog.accessType)} - ${
        accessLog.user?.name ?? accessLog.visitor?.name ?? "Pessoa nao identificada"
      }`,
    })),
    recentPackages: recentPackages.map((item) => ({
      description: [
        item.unit ? `Unidade ${item.unit.block}-${item.unit.apartment}` : null,
        item.carrier ? `Transportadora: ${item.carrier}` : null,
        item.trackingCode ? `Codigo: ${item.trackingCode}` : null,
      ]
        .filter(Boolean)
        .join(" · "),
      id: item.id,
      meta: formatDateTime(item.createdAt),
      title: item.description ?? "Encomenda sem descricao",
    })),
    recentVisitAuthorizations: recentVisitAuthorizations.map((authorization) => ({
      description: [
        `Unidade ${authorization.unit.block}-${authorization.unit.apartment}`,
        `Autorizado por ${authorization.authorizedBy.name}`,
      ].join(" · "),
      id: authorization.id,
      meta: formatDateTime(authorization.createdAt),
      title: authorization.visitor.name,
    })),
    stats: {
      accessLogsToday,
      packagesWaitingPickup,
      totalActivePorters,
      totalActiveResidents,
      totalUnits,
      visitorsAuthorizedToday,
    },
  };
}
