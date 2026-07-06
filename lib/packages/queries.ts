import { PackageStatus } from "@prisma/client";
import { redirect } from "next/navigation";
import { requireCondominiumRole } from "@/lib/auth/authorization";
import { prisma } from "@/lib/prisma";
import { adminPackageFiltersSchema } from "@/lib/packages/validation";

export async function searchUnitsForPackage(query: string) {
  const { condominiumId } = await requireCondominiumRole("PORTER");
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return [];
  }

  return prisma.unit.findMany({
    where: {
      condominiumId,
      OR: [
        { block: { contains: normalizedQuery, mode: "insensitive" } },
        { apartment: { contains: normalizedQuery, mode: "insensitive" } },
        { responsibleName: { contains: normalizedQuery, mode: "insensitive" } },
        { phone: { contains: normalizedQuery, mode: "insensitive" } },
        { email: { contains: normalizedQuery, mode: "insensitive" } },
      ],
    },
    orderBy: [{ block: "asc" }, { apartment: "asc" }],
    take: 8,
  });
}

export async function getPorterPackages() {
  const { condominiumId } = await requireCondominiumRole("PORTER");

  return prisma.package.findMany({
    where: {
      condominiumId,
      unit: {
        condominiumId,
      },
    },
    include: {
      deliveredBy: { select: { name: true } },
      receivedBy: { select: { name: true } },
      unit: { select: { apartment: true, block: true, responsibleName: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 30,
  });
}

export async function getResidentPackageList() {
  const { condominiumId, user } = await requireCondominiumRole("RESIDENT");
  const resident = await prisma.user.findUnique({
    where: { id: user.id },
    select: { unitId: true },
  });

  if (!resident?.unitId) {
    redirect("/morador?error=Usuário sem unidade vinculada.");
  }

  return prisma.package.findMany({
    where: {
      condominiumId,
      unit: {
        condominiumId,
      },
      unitId: resident.unitId,
    },
    orderBy: { receivedAt: "desc" },
  });
}

export async function getAdminPackages(filters: {
  from?: string;
  q?: string;
  status?: string;
  to?: string;
}) {
  const { condominiumId } = await requireCondominiumRole("ADMIN");
  const parsedResult = adminPackageFiltersSchema.safeParse(filters);
  const parsed = parsedResult.success ? parsedResult.data : {};
  const query = parsed.q?.trim();
  const receivedAt =
    parsed.from || parsed.to
      ? {
          gte: parsed.from ? new Date(`${parsed.from}T00:00:00`) : undefined,
          lte: parsed.to ? new Date(`${parsed.to}T23:59:59`) : undefined,
        }
      : undefined;

  return prisma.package.findMany({
    where: {
      condominiumId,
      receivedAt,
      status:
        parsed.status && parsed.status !== "ALL"
          ? (parsed.status as PackageStatus)
          : undefined,
      unit: query
        ? {
            condominiumId,
            OR: [
              { block: { contains: query, mode: "insensitive" } },
              { apartment: { contains: query, mode: "insensitive" } },
              { responsibleName: { contains: query, mode: "insensitive" } },
            ],
          }
        : {
            condominiumId,
          },
    },
    include: {
      deliveredBy: { select: { name: true } },
      receivedBy: { select: { name: true } },
      unit: { select: { apartment: true, block: true, responsibleName: true } },
    },
    orderBy: { receivedAt: "desc" },
  });
}
