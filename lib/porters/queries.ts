import { UserRole } from "@prisma/client";
import { notFound } from "next/navigation";
import { requireCondominiumRole } from "@/lib/auth/authorization";
import { prisma } from "@/lib/prisma";

export async function getPorters() {
  const { condominiumId } = await requireCondominiumRole("ADMIN");

  return prisma.user.findMany({
    where: {
      condominiumId,
      role: UserRole.PORTER,
    },
    orderBy: [{ status: "asc" }, { name: "asc" }],
    select: {
      createdAt: true,
      email: true,
      id: true,
      name: true,
      phone: true,
      status: true,
    },
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
    select: {
      createdAt: true,
      email: true,
      id: true,
      name: true,
      phone: true,
      status: true,
    },
  });

  if (!porter) {
    notFound();
  }

  return porter;
}
