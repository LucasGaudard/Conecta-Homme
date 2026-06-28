import { AccessMethod, AccessType, PackageStatus, VisitorStatus } from "@prisma/client";
import { z } from "zod";

const optionalDate = z
  .string()
  .trim()
  .optional()
  .refine((value) => !value || !Number.isNaN(new Date(`${value}T00:00:00`).getTime()), {
    message: "Data invalida.",
  });

export const reportFiltersSchema = z.object({
  accessMethod: z.nativeEnum(AccessMethod).or(z.literal("ALL")).optional(),
  accessType: z.nativeEnum(AccessType).or(z.literal("ALL")).optional(),
  from: optionalDate,
  packageStatus: z.nativeEnum(PackageStatus).or(z.literal("ALL")).optional(),
  q: z.string().optional(),
  to: optionalDate,
  visitorStatus: z.nativeEnum(VisitorStatus).or(z.literal("ALL")).optional(),
});

export type ReportFilters = z.infer<typeof reportFiltersSchema>;
