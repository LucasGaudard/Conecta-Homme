import { Prisma, UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import {
  clampPage,
  normalizePage,
  normalizePageSize,
  pageCount,
} from "@/components/ui/data-table-params";
import { getCurrentUser } from "@/lib/auth/current-user";
import type { AuditFiltersInput } from "@/lib/audit/validation";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user || user.role !== UserRole.ADMIN) {
    redirect("/login");
  }

  return user;
}

function parseDateStart(value?: string) {
  if (!value) {
    return undefined;
  }

  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function parseDateEnd(value?: string) {
  if (!value) {
    return undefined;
  }

  const date = new Date(`${value}T23:59:59.999`);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export async function getAuditLogs(filters: AuditFiltersInput) {
  await requireAdmin();

  const pageSize = normalizePageSize(filters.pageSize);
  const requestedPage = normalizePage(filters.page);
  const from = parseDateStart(filters.from);
  const to = parseDateEnd(filters.to);
  const where: Prisma.AuditLogWhereInput = {
    ...(filters.action ? { action: filters.action } : {}),
    ...(filters.module ? { module: filters.module } : {}),
    ...(filters.role ? { userRole: filters.role as UserRole } : {}),
    ...(filters.user
      ? {
          OR: [
            {
              userName: {
                contains: filters.user,
                mode: "insensitive",
              },
            },
            {
              userEmail: {
                contains: filters.user,
                mode: "insensitive",
              },
            },
          ],
        }
      : {}),
    ...(from || to
      ? {
          createdAt: {
            ...(from ? { gte: from } : {}),
            ...(to ? { lte: to } : {}),
          },
        }
      : {}),
  };

  const totalItems = await prisma.auditLog.count({ where });
  const totalPages = pageCount(totalItems, pageSize);
  const page = clampPage(requestedPage, totalPages);
  const logs = await prisma.auditLog.findMany({
    orderBy: {
      createdAt: "desc",
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
    where,
  });

  return {
    logs,
    pagination: {
      page,
      pageSize,
      totalItems,
      totalPages,
    },
  };
}
