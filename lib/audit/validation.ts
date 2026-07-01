import { UserRole } from "@prisma/client";
import { z } from "zod";
import { auditActions, auditModules } from "@/lib/audit/constants";

const optionalFilter = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 && value !== "ALL" ? value : undefined))
  .optional();

export const auditFiltersSchema = z.object({
  action: z.enum(["ALL", ...auditActions]).catch("ALL").optional(),
  from: optionalFilter,
  module: z.enum(["ALL", ...auditModules]).catch("ALL").optional(),
  page: optionalFilter,
  pageSize: optionalFilter,
  role: z.enum(["ALL", ...Object.values(UserRole)] as [string, ...string[]]).catch("ALL").optional(),
  to: optionalFilter,
  user: optionalFilter,
});

export type AuditFiltersInput = z.infer<typeof auditFiltersSchema>;

export function parseAuditFilters(searchParams: Record<string, string | undefined>) {
  return auditFiltersSchema.parse(searchParams);
}
