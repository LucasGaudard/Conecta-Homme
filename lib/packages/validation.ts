import { PackageStatus } from "@prisma/client";
import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : undefined))
  .optional();

export const createPackageSchema = z.object({
  carrier: optionalText,
  description: optionalText,
  query: z.string().optional(),
  trackingCode: optionalText,
  unitId: z.string().min(1, "Selecione uma unidade."),
});

export const deliverPackageSchema = z.object({
  packageId: z.string().min(1, "Encomenda invalida."),
  pickedUpByName: z.string().trim().min(1, "Informe quem retirou a encomenda."),
});

export const adminPackageFiltersSchema = z.object({
  from: z.string().optional(),
  q: z.string().optional(),
  status: z.nativeEnum(PackageStatus).or(z.literal("ALL")).optional(),
  to: z.string().optional(),
});
