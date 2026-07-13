import { UserRole } from "@prisma/client";
import { notFound } from "next/navigation";
import { requireCondominiumRole } from "@/lib/auth/authorization";
import { prisma } from "@/lib/prisma";

export async function getPorters(query = "") {
  const { condominiumId } = await requireCondominiumRole("ADMIN");
  const normalizedQuery = query.trim();

  return prisma.user.findMany({
    where: {
      condominiumId,
      role: UserRole.PORTER,
      OR: normalizedQuery
        ? [
            { name: { contains: normalizedQuery, mode: "insensitive" } },
            { email: { contains: normalizedQuery, mode: "insensitive" } },
            { phone: { contains: normalizedQuery, mode: "insensitive" } },
            {
              porterShiftDescription: {
                contains: normalizedQuery,
                mode: "insensitive",
              },
            },
          ]
        : undefined,
    },
    orderBy: [{ status: "asc" }, { name: "asc" }],
  });
}

export async function getPorterById(id: string) {
  const { condominiumId } = await requireCondominiumRole("ADMIN");
  const porter = await prisma.user.findFirst({
    where: {
      condominiumId,
      id,
      role: UserRole.PORTER,
    },
  });

  if (!porter) {
    notFound();
  }

  return porter;
}
