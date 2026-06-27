import {
  AccessMethod,
  AccessType,
  PackageStatus,
  UserRole,
  UserStatus,
  VisitorStatus,
} from "@prisma/client";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { prisma } from "@/lib/prisma";
import { formatDayKey } from "@/lib/reports/format";
import { reportFiltersSchema, type ReportFilters } from "@/lib/reports/validation";

async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user || user.role !== UserRole.ADMIN) {
    redirect("/login");
  }
}

function getDateRange(filters: ReportFilters) {
  const from = filters.from ? new Date(`${filters.from}T00:00:00`) : undefined;
  const to = filters.to ? new Date(`${filters.to}T23:59:59`) : undefined;

  return { from, to };
}

function unitSearch(query?: string) {
  const normalized = query?.trim();

  if (!normalized) {
    return undefined;
  }

  return {
    OR: [
      { block: { contains: normalized, mode: "insensitive" as const } },
      { apartment: { contains: normalized, mode: "insensitive" as const } },
      { responsibleName: { contains: normalized, mode: "insensitive" as const } },
    ],
  };
}

function countByStatus<T extends string>(items: Array<{ status: T }>) {
  return items.reduce<Record<string, number>>((acc, item) => {
    acc[item.status] = (acc[item.status] ?? 0) + 1;
    return acc;
  }, {});
}

function accessByDay(items: Array<{ occurredAt: Date }>) {
  const grouped = items.reduce<Record<string, number>>((acc, item) => {
    const key = formatDayKey(item.occurredAt);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(grouped).map(([name, total]) => ({ name, total }));
}

export async function getAdminReportsData(rawFilters: ReportFilters) {
  await requireAdmin();
  const filters = reportFiltersSchema.parse(rawFilters);
  const { from, to } = getDateRange(filters);
  const unitWhere = unitSearch(filters.q);

  const accessWhere = {
    accessMethod:
      filters.accessMethod && filters.accessMethod !== "ALL"
        ? (filters.accessMethod as AccessMethod)
        : undefined,
    accessType:
      filters.accessType && filters.accessType !== "ALL"
        ? (filters.accessType as AccessType)
        : undefined,
    occurredAt:
      from || to
        ? {
            gte: from,
            lte: to,
          }
        : undefined,
    unit: unitWhere,
  };
  const packageWhere = {
    receivedAt:
      from || to
        ? {
            gte: from,
            lte: to,
          }
        : undefined,
    status:
      filters.packageStatus && filters.packageStatus !== "ALL"
        ? (filters.packageStatus as PackageStatus)
        : undefined,
    unit: unitWhere,
  };
  const visitorWhere = {
    createdAt:
      from || to
        ? {
            gte: from,
            lte: to,
          }
        : undefined,
    status:
      filters.visitorStatus && filters.visitorStatus !== "ALL"
        ? (filters.visitorStatus as VisitorStatus)
        : undefined,
    unit: unitWhere,
  };

  const [
    totalUnits,
    activeUnits,
    activeResidents,
    activePorters,
    authorizedVisitors,
    waitingPackages,
    accessLogs,
    packages,
    visitors,
    waitingPackagesTotal,
    deliveredPackagesTotal,
  ] = await Promise.all([
    prisma.unit.count(),
    prisma.unit.count({ where: { status: "ACTIVE" } }),
    prisma.user.count({ where: { role: UserRole.RESIDENT, status: UserStatus.ACTIVE } }),
    prisma.user.count({ where: { role: UserRole.PORTER, status: UserStatus.ACTIVE } }),
    prisma.visitAuthorization.count({ where: { status: VisitorStatus.AUTHORIZED } }),
    prisma.package.count({ where: { status: PackageStatus.WAITING_PICKUP } }),
    prisma.accessLog.findMany({
      where: accessWhere,
      include: {
        porter: { select: { name: true } },
        unit: { select: { apartment: true, block: true, responsibleName: true } },
      },
      orderBy: { occurredAt: "desc" },
    }),
    prisma.package.findMany({
      where: packageWhere,
      include: {
        deliveredBy: { select: { name: true } },
        receivedBy: { select: { name: true } },
        unit: { select: { apartment: true, block: true, responsibleName: true } },
      },
      orderBy: { receivedAt: "desc" },
    }),
    prisma.visitAuthorization.findMany({
      where: visitorWhere,
      include: {
        authorizedBy: { select: { name: true } },
        unit: { select: { apartment: true, block: true, responsibleName: true } },
        visitor: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.package.count({ where: { ...packageWhere, status: PackageStatus.WAITING_PICKUP } }),
    prisma.package.count({ where: { ...packageWhere, status: PackageStatus.DELIVERED } }),
  ]);

  const packageStatusCounts = countByStatus(packages);
  const visitorStatusCounts = countByStatus(visitors);

  return {
    accessLogs,
    charts: {
      accessByDay: accessByDay(accessLogs),
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
    packages,
    packageTotals: {
      deliveredPackagesTotal,
      waitingPackagesTotal,
    },
    summary: {
      accessLogsInPeriod: accessLogs.length,
      activePorters,
      activeResidents,
      activeUnits,
      authorizedVisitors,
      totalUnits,
      waitingPackages,
    },
    visitors,
  };
}
