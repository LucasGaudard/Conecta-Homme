import { PackageStatus, UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { prisma } from "@/lib/prisma";
import { adminPackageFiltersSchema } from "@/lib/packages/validation";

async function requireRole(role: UserRole) {
  const user = await getCurrentUser();

  if (!user || user.role !== role) {
    redirect("/login");
  }

  return user;
}

export async function searchUnitsForPackage(query: string) {
  await requireRole(UserRole.PORTER);
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return [];
  }

  return prisma.unit.findMany({
    where: {
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
  await requireRole(UserRole.PORTER);

  return prisma.package.findMany({
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
  const user = await requireRole(UserRole.RESIDENT);
  const resident = await prisma.user.findUnique({
    where: { id: user.id },
    select: { unitId: true },
  });

  if (!resident?.unitId) {
    redirect("/morador?error=Usuario sem unidade vinculada.");
  }

  return prisma.package.findMany({
    where: { unitId: resident.unitId },
    orderBy: { receivedAt: "desc" },
  });
}

export async function getAdminPackages(filters: {
  from?: string;
  q?: string;
  status?: string;
  to?: string;
}) {
  await requireRole(UserRole.ADMIN);
  const parsed = adminPackageFiltersSchema.parse(filters);
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
      receivedAt,
      status:
        parsed.status && parsed.status !== "ALL"
          ? (parsed.status as PackageStatus)
          : undefined,
      unit: query
        ? {
            OR: [
              { block: { contains: query, mode: "insensitive" } },
              { apartment: { contains: query, mode: "insensitive" } },
              { responsibleName: { contains: query, mode: "insensitive" } },
            ],
          }
        : undefined,
    },
    include: {
      deliveredBy: { select: { name: true } },
      receivedBy: { select: { name: true } },
      unit: { select: { apartment: true, block: true, responsibleName: true } },
    },
    orderBy: { receivedAt: "desc" },
  });
}
