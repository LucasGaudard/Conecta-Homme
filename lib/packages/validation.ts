import { PackageStatus } from "@prisma/client";
import { z } from "zod";

const optionalDate = z
  .string()
  .trim()
  .optional()
  .refine((value) => !value || !Number.isNaN(new Date(`${value}T00:00:00`).getTime()), {
    message: "Data inválida.",
  });

const optionalText = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : undefined))
  .optional();

const packageDescription = z
  .string()
  .transform((value) => value.trim().replace(/\s+/g, " "))
  .pipe(
    z
      .string()
      .min(3, "Informe uma descrição da encomenda.")
      .max(300, "A descrição deve ter no máximo 300 caracteres."),
  );

export const createPackageSchema = z.object({
  carrier: optionalText,
  description: packageDescription,
  pickupCode: optionalText,
  query: z.string().optional(),
  trackingCode: optionalText,
  unitId: z.string().min(1, "Selecione uma unidade."),
});

export const deliverPackageSchema = z.object({
  packageId: z.string().min(1, "Encomenda inválida."),
  pickedUpByName: z.string().trim().min(1, "Informe quem retirou a encomenda."),
});

export const adminPackageFiltersSchema = z.object({
  from: optionalDate,
  q: z.string().optional(),
  status: z.nativeEnum(PackageStatus).or(z.literal("ALL")).optional(),
  to: optionalDate,
});
