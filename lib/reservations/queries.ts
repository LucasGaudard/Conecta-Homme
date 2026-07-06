import { LeisureSpaceStatus, SpaceReservationStatus } from "@prisma/client";
import { redirect } from "next/navigation";
import { requireCondominiumRole } from "@/lib/auth/authorization";
import { prisma } from "@/lib/prisma";
import { adminReservationFiltersSchema } from "@/lib/reservations/validation";

async function requireResident() {
  const { condominiumId, user } = await requireCondominiumRole("RESIDENT");
  const resident = await prisma.user.findUnique({
    where: { id: user.id },
    select: { id: true, name: true, unitId: true },
  });

  if (!resident?.unitId) {
    redirect("/morador?error=Usuario sem unidade vinculada.");
  }

  const unit = await prisma.unit.findFirst({
    where: {
      condominiumId,
      id: resident.unitId,
    },
    select: {
      id: true,
    },
  });

  if (!unit) {
    redirect("/morador?error=Unidade nao encontrada.");
  }

  return { ...resident, condominiumId, unitId: unit.id };
}

export async function getAdminLeisureSpaces() {
  const { condominiumId } = await requireCondominiumRole("ADMIN");

  return prisma.leisureSpace.findMany({
    where: {
      condominiumId,
    },
    include: {
      _count: {
        select: {
          reservations: {
            where: {
              condominiumId,
            },
          },
        },
      },
    },
    orderBy: [{ status: "asc" }, { name: "asc" }],
  });
}

export async function getActiveLeisureSpaces() {
  const { condominiumId } = await requireCondominiumRole("RESIDENT");

  return prisma.leisureSpace.findMany({
    where: {
      condominiumId,
      status: LeisureSpaceStatus.ACTIVE,
    },
    orderBy: { name: "asc" },
  });
}

export async function getAdminReservationFilters() {
  const { condominiumId } = await requireCondominiumRole("ADMIN");

  const [spaces, units] = await Promise.all([
    prisma.leisureSpace.findMany({
      where: {
        condominiumId,
      },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.unit.findMany({
      where: {
        condominiumId,
      },
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
  const { condominiumId } = await requireCondominiumRole("ADMIN");
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
      condominiumId,
      spaceId: parsed.spaceId || undefined,
      startAt,
      status:
        parsed.status && parsed.status !== "ALL"
          ? (parsed.status as SpaceReservationStatus)
          : undefined,
      unitId: parsed.unitId || undefined,
      OR: query
        ? [
            { space: { condominiumId, name: { contains: query, mode: "insensitive" } } },
            { requestedBy: { condominiumId, name: { contains: query, mode: "insensitive" } } },
            { unit: { condominiumId, responsibleName: { contains: query, mode: "insensitive" } } },
            { unit: { condominiumId, block: { contains: query, mode: "insensitive" } } },
            { unit: { condominiumId, apartment: { contains: query, mode: "insensitive" } } },
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
      where: {
        condominiumId: resident.condominiumId,
        status: LeisureSpaceStatus.ACTIVE,
      },
      orderBy: { name: "asc" },
    }),
    prisma.spaceReservation.findMany({
      where: {
        condominiumId: resident.condominiumId,
        unitId: resident.unitId,
      },
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
  const { condominiumId } = await requireCondominiumRole("PORTER");
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  return prisma.spaceReservation.findMany({
    where: {
      condominiumId,
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
