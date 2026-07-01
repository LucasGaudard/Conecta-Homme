import type { Prisma, UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type AuditUser = {
  email?: string | null;
  id: string;
  name?: string | null;
  role: UserRole;
};

type AuditInput = {
  action: string;
  description: string;
  entityId?: string;
  entityType?: string;
  module: string;
  user: AuditUser;
};

type PrismaLike = typeof prisma | Prisma.TransactionClient;

export async function createAuditLog(
  input: AuditInput,
  client: PrismaLike = prisma,
) {
  await client.auditLog.create({
    data: {
      action: input.action,
      description: input.description,
      entityId: input.entityId,
      entityType: input.entityType,
      module: input.module,
      userEmail: input.user.email,
      userId: input.user.id,
      userName: input.user.name,
      userRole: input.user.role,
    },
  });
}
