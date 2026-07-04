import { LeisureSpaceStatus, SpaceReservationStatus, UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { prisma } from "@/lib/prisma";
import { adminReservationFiltersSchema } from "@/lib/reservations/validation";

async function requireRole(role: UserRole) {
  const user = await getCurrentUser();

  if (!user || user.role !== role) {
    redirect("/login");
  }

  return user;
}

async function requireResident() {
  const user = await requireRole(UserRole.RESIDENT);
  const resident = await prisma.user.findUnique({
    where: { id: user.id },
    select: { id: true, name: true, unitId: true },
  });

  if (!resident?.unitId) {
    redirect("/morador?error=Usuario sem unidade vinculada.");
  }

  return { ...resident, unitId: resident.unitId };
}

export async function getAdminLeisureSpaces() {
  await requireRole(UserRole.ADMIN);

  return prisma.leisureSpace.findMany({
    include: {
      _count: {
        select: { reservations: true },
      },
    },
    orderBy: [{ status: "asc" }, { name: "asc" }],
  });
}

export async function getActiveLeisureSpaces() {
  await requireRole(UserRole.RESIDENT);

  return prisma.leisureSpace.findMany({
    where: { status: LeisureSpaceStatus.ACTIVE },
    orderBy: { name: "asc" },
  });
}

export async function getAdminReservationFilters() {
  await requireRole(UserRole.ADMIN);

  const [spaces, units] = await Promise.all([
    prisma.leisureSpace.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.unit.findMany({
      orderBy: [{ block: "asc" }, { apartment: "asc" }],
      select: { apartment: true, block: true, id: true, responsibleName: true },
    }),
  ]);

  return { spaces, units };
}

export async function getAdminReservations(filters: {
  from?: string;
  q?: string;
  spaceId?: string;
  status?: string;
  to?: string;
  unitId?: string;
}) {
  await requireRole(UserRole.ADMIN);
  const parsedResult = adminReservationFiltersSchema.safeParse(filters);
  const parsed = parsedResult.success ? parsedResult.data : {};
  const query = parsed.q?.trim();
  const startAt =
    parsed.from || parsed.to
      ? {
          gte: parsed.from ? new Date(`${parsed.from}T00:00:00`) : undefined,
          lte: parsed.to ? new Date(`${parsed.to}T23:59:59`) : undefined,
        }
      : undefined;

  return prisma.spaceReservation.findMany({
    where: {
      spaceId: parsed.spaceId || undefined,
      startAt,
      status:
        parsed.status && parsed.status !== "ALL"
          ? (parsed.status as SpaceReservationStatus)
          : undefined,
      unitId: parsed.unitId || undefined,
      OR: query
        ? [
            { space: { name: { contains: query, mode: "insensitive" } } },
            { requestedBy: { name: { contains: query, mode: "insensitive" } } },
            { unit: { responsibleName: { contains: query, mode: "insensitive" } } },
            { unit: { block: { contains: query, mode: "insensitive" } } },
            { unit: { apartment: { contains: query, mode: "insensitive" } } },
          ]
        : undefined,
    },
    include: {
      approvedBy: { select: { name: true } },
      requestedBy: { select: { name: true } },
      space: true,
      unit: { select: { apartment: true, block: true, responsibleName: true } },
    },
    orderBy: { startAt: "desc" },
  });
}

export async function getResidentReservationPageData() {
  const resident = await requireResident();
  const [spaces, reservations] = await Promise.all([
    prisma.leisureSpace.findMany({
      where: { status: LeisureSpaceStatus.ACTIVE },
      orderBy: { name: "asc" },
    }),
    prisma.spaceReservation.findMany({
      where: { unitId: resident.unitId },
      include: {
        approvedBy: { select: { name: true } },
        space: true,
        unit: { select: { apartment: true, block: true, responsibleName: true } },
      },
      orderBy: { startAt: "desc" },
    }),
  ]);

  return { reservations, resident, spaces };
}

export async function getPorterTodayReservations() {
  await requireRole(UserRole.PORTER);
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  return prisma.spaceReservation.findMany({
    where: {
      endAt: { gte: start },
      startAt: { lte: end },
      status: SpaceReservationStatus.APPROVED,
    },
    include: {
      requestedBy: { select: { name: true, phone: true } },
      space: true,
      unit: { select: { apartment: true, block: true, responsibleName: true } },
    },
    orderBy: { startAt: "asc" },
  });
}
