import {
  AccessMethod,
  AccessType,
  PackageStatus,
  PresenceStatus,
  UserRole,
  UserStatus,
  VisitorStatus,
} from "@prisma/client";
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

function formatDay(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  }).format(date);
}

function getLastDaysRange(days: number) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (days - 1));

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  return { end, start };
}

function accessByDay(items: Array<{ occurredAt: Date }>, days: number) {
  const base = new Date();
  base.setHours(0, 0, 0, 0);
  base.setDate(base.getDate() - (days - 1));

  const labels = Array.from({ length: days }).map((_, index) => {
    const date = new Date(base);
    date.setDate(base.getDate() + index);
    return formatDay(date);
  });
  const grouped = items.reduce<Record<string, number>>((acc, item) => {
    const key = formatDay(item.occurredAt);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  return labels.map((name) => ({ name, total: grouped[name] ?? 0 }));
}

function formatAccessType(accessType: AccessType) {
  return accessType === AccessType.ENTRY ? "Entrada" : "Saida";
}

function formatAccessMethod(accessMethod: AccessMethod) {
  return accessMethod === AccessMethod.QR_CODE ? "QR Code" : "Manual";
}

export async function getAdminDashboardData() {
  const { end, start } = getTodayRange();
  const lastSevenDays = getLastDaysRange(7);

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
    accessLogsLastSevenDays,
    packagesByStatus,
    visitorsByStatus,
    doNotDisturbUnits,
    inactiveUnits,
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
    prisma.accessLog.findMany({
      where: {
        occurredAt: {
          gte: lastSevenDays.start,
          lte: lastSevenDays.end,
        },
      },
      select: {
        occurredAt: true,
      },
      orderBy: {
        occurredAt: "asc",
      },
    }),
    prisma.package.groupBy({
      by: ["status"],
      _count: {
        _all: true,
      },
    }),
    prisma.visitAuthorization.groupBy({
      by: ["status"],
      _count: {
        _all: true,
      },
    }),
    prisma.unit.findMany({
      where: {
        presenceStatus: PresenceStatus.DO_NOT_DISTURB,
      },
      orderBy: [{ block: "asc" }, { apartment: "asc" }],
      select: {
        apartment: true,
        block: true,
        id: true,
        responsibleName: true,
      },
      take: 5,
    }),
    prisma.unit.count({
      where: {
        status: "INACTIVE",
      },
    }),
  ]);
  const packageStatusCounts = Object.fromEntries(
    packagesByStatus.map((item) => [item.status, item._count._all]),
  );
  const visitorStatusCounts = Object.fromEntries(
    visitorsByStatus.map((item) => [item.status, item._count._all]),
  );

  return {
    alerts: [
      ...doNotDisturbUnits.map((unit) => ({
        description: `${unit.responsibleName} marcou a unidade como nao perturbe.`,
        id: unit.id,
        title: `Unidade ${unit.block}-${unit.apartment}`,
        tone: "warning" as const,
      })),
      ...(packagesWaitingPickup > 0
        ? [
            {
              description: "Existem encomendas aguardando retirada na portaria.",
              id: "waiting-packages",
              title: `${packagesWaitingPickup} encomenda(s) pendente(s)`,
              tone: "info" as const,
            },
          ]
        : []),
      ...(inactiveUnits > 0
        ? [
            {
              description: "Revise unidades inativas para manter a base operacional limpa.",
              id: "inactive-units",
              title: `${inactiveUnits} unidade(s) inativa(s)`,
              tone: "warning" as const,
            },
          ]
        : []),
    ],
    charts: {
      accessByDay: accessByDay(accessLogsLastSevenDays, 7),
      packagesByStatus: [
        { name: "Aguardando", total: packageStatusCounts.WAITING_PICKUP ?? 0 },
        { name: "Entregues", total: packageStatusCounts.DELIVERED ?? 0 },
      ],
      visitorsByStatus: [
        { name: "Autorizados", total: visitorStatusCounts.AUTHORIZED ?? 0 },
        { name: "Expirados", total: visitorStatusCounts.EXPIRED ?? 0 },
        { name: "Utilizados", total: visitorStatusCounts.USED ?? 0 },
        { name: "Cancelados", total: visitorStatusCounts.CANCELED ?? 0 },
      ],
    },
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
