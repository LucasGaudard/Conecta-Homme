import { PackageStatus, VisitorStatus } from "@prisma/client";
import { redirect } from "next/navigation";
import { requireCondominiumRole } from "@/lib/auth/authorization";
import { prisma } from "@/lib/prisma";

async function requireResident() {
  const { condominiumId, user: currentUser } = await requireCondominiumRole("RESIDENT");

  const user = await prisma.user.findUnique({
    where: {
      id: currentUser.id,
    },
    select: {
      email: true,
      id: true,
      name: true,
      unitId: true,
      username: true,
    },
  });

  if (!user?.unitId) {
    redirect("/morador?error=Usuário sem unidade vinculada.");
  }

  return {
    condominiumId,
    ...user,
    unitId: user.unitId,
  };
}

export async function getResidentContext() {
  const resident = await requireResident();
  const unit = await prisma.unit.findFirst({
    where: {
      condominiumId: resident.condominiumId,
      id: resident.unitId,
    },
  });

  if (!unit) {
    redirect("/morador?error=Unidade não encontrada.");
  }

  return { resident, unit };
}

export async function getResidentDashboardData() {
  const { resident, unit } = await getResidentContext();
  const { condominiumId } = resident;
  const now = new Date();

  const [
    packagesWaitingPickup,
    authorizedVisitors,
    recentAccesses,
    waitingPackages,
    activeVisitors,
    recentNotifications,
  ] = await Promise.all([
    prisma.package.count({
      where: {
        status: PackageStatus.WAITING_PICKUP,
        unitId: unit.id,
      },
    }),
    prisma.visitAuthorization.count({
      where: {
        endsAt: {
          gte: now,
        },
        condominiumId,
        status: VisitorStatus.AUTHORIZED,
        unitId: unit.id,
      },
    }),
    prisma.accessLog.findMany({
      where: {
        condominiumId,
        unitId: unit.id,
      },
      orderBy: {
        occurredAt: "desc",
      },
      take: 5,
      include: {
        porter: {
          select: {
            name: true,
          },
        },
      },
    }),
    prisma.package.findMany({
      where: {
        status: PackageStatus.WAITING_PICKUP,
        unitId: unit.id,
      },
      orderBy: {
        receivedAt: "desc",
      },
      take: 4,
    }),
    prisma.visitAuthorization.findMany({
      where: {
        endsAt: {
          gte: now,
        },
        condominiumId,
        status: VisitorStatus.AUTHORIZED,
        unitId: unit.id,
      },
      include: {
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
      take: 4,
    }),
    prisma.notification.findMany({
      where: {
        unitId: unit.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    }),
  ]);

  return {
    activeVisitors,
    recentAccesses,
    recentNotifications,
    resident,
    stats: {
      authorizedVisitors,
      packagesWaitingPickup,
      recentAccesses: recentAccesses.length,
      residenceStatus: unit.presenceStatus,
    },
    unit,
    waitingPackages,
  };
}

export async function getResidentVisitors() {
  const { resident, unit } = await getResidentContext();

  return prisma.visitAuthorization.findMany({
    where: {
      condominiumId: resident.condominiumId,
      unitId: unit.id,
    },
    include: {
      unit: {
        select: {
          apartment: true,
          block: true,
        },
      },
      visitor: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getResidentPackages() {
  const { unit } = await getResidentContext();

  return prisma.package.findMany({
    where: {
      unitId: unit.id,
    },
    orderBy: {
      receivedAt: "desc",
    },
  });
}

export async function getResidentAccesses() {
  const { resident, unit } = await getResidentContext();

  return prisma.accessLog.findMany({
    where: {
      condominiumId: resident.condominiumId,
      unitId: unit.id,
    },
    include: {
      porter: {
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
  });
}

export async function getResidentSettings() {
  return getResidentContext();
}
