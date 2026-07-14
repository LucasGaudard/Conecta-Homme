import { UserRole } from "@prisma/client";
import { notFound } from "next/navigation";
import { requireCondominiumRole } from "@/lib/auth/authorization";
import { prisma } from "@/lib/prisma";

export async function getResidents(query = "") {
  const { condominiumId } = await requireCondominiumRole("ADMIN");
  const normalizedQuery = query.trim();

  return prisma.user.findMany({
    where: {
      condominiumId,
      role: UserRole.RESIDENT,
      OR: normalizedQuery
        ? [
            { name: { contains: normalizedQuery, mode: "insensitive" } },
            { email: { contains: normalizedQuery, mode: "insensitive" } },
            { phone: { contains: normalizedQuery, mode: "insensitive" } },
            { username: { contains: normalizedQuery, mode: "insensitive" } },
            {
              unit: {
                condominiumId,
                OR: [
                  { block: { contains: normalizedQuery, mode: "insensitive" } },
                  { apartment: { contains: normalizedQuery, mode: "insensitive" } },
                ],
              },
            },
          ]
        : undefined,
    },
    include: {
      unit: {
        select: {
          apartment: true,
          block: true,
          id: true,
          responsibleName: true,
          status: true,
        },
      },
    },
    orderBy: [{ status: "asc" }, { name: "asc" }],
  });
}

export async function getResidentById(id: string) {
  const { condominiumId } = await requireCondominiumRole("ADMIN");
  const resident = await prisma.user.findFirst({
    where: {
      condominiumId,
      id,
      role: UserRole.RESIDENT,
    },
    include: {
      unit: {
        select: {
          apartment: true,
          block: true,
          cpf: true,
          email: true,
          id: true,
          phone: true,
          responsibleName: true,
          status: true,
        },
      },
    },
  });

  if (!resident) {
    notFound();
  }

  return resident;
}
