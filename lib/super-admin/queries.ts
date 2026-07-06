import { CondominiumStatus, UserRole } from "@prisma/client";
import { notFound } from "next/navigation";
import { requireSuperAdmin } from "@/lib/auth/authorization";
import { prisma } from "@/lib/prisma";

export async function getSuperAdminDashboardData() {
  await requireSuperAdmin();

  const [
    totalCondominiums,
    activeCondominiums,
    suspendedCondominiums,
    inactiveCondominiums,
    totalTenantUsers,
    latestCondominiums,
  ] = await Promise.all([
    prisma.condominium.count(),
    prisma.condominium.count({ where: { status: CondominiumStatus.ACTIVE } }),
    prisma.condominium.count({ where: { status: CondominiumStatus.SUSPENDED } }),
    prisma.condominium.count({ where: { status: CondominiumStatus.INACTIVE } }),
    prisma.user.count({ where: { role: { not: UserRole.SUPER_ADMIN }, condominiumId: { not: null } } }),
    prisma.condominium.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  return {
    latestCondominiums,
    stats: {
      activeCondominiums,
      inactiveCondominiums,
      suspendedCondominiums,
      totalCondominiums,
      totalTenantUsers,
    },
  };
}

export async function getCondominiumsList() {
  await requireSuperAdmin();

  return prisma.condominium.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          users: true,
        },
      },
    },
  });
}

export async function getCondominiumById(id: string) {
  await requireSuperAdmin();

  const condominium = await prisma.condominium.findUnique({
    where: { id },
    include: {
      users: {
        orderBy: { name: "asc" },
        select: {
          email: true,
          id: true,
          name: true,
          phone: true,
          role: true,
          status: true,
        },
      },
    },
  });

  if (!condominium) {
    notFound();
  }

  const [unitCount, auditLogs] = await Promise.all([
    prisma.unit.count({
      where: {
        condominiumId: condominium.id,
      },
    }),
    prisma.auditLog.findMany({
      where: {
        OR: [
          { condominiumId: condominium.id },
          { entityType: "Condominium", entityId: condominium.id },
          { user: { condominiumId: condominium.id } },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ]);

  return {
    auditLogs,
    condominium,
    users: {
      admins: condominium.users.filter((user) => user.role === UserRole.ADMIN),
      porters: condominium.users.filter((user) => user.role === UserRole.PORTER),
      residents: condominium.users.filter((user) => user.role === UserRole.RESIDENT),
    },
    unitCount,
  };
}
