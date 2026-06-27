import { AccessType } from "@prisma/client";
import { z } from "zod";

export const registerManualAccessSchema = z.object({
  accessType: z.nativeEnum(AccessType),
  notes: z
    .string()
    .trim()
    .transform((value) => (value.length > 0 ? value : undefined))
    .optional(),
  query: z.string().optional(),
  unitId: z.string().min(1, "Selecione uma unidade."),
});

export type RegisterManualAccessInput = z.infer<
  typeof registerManualAccessSchema
>;
