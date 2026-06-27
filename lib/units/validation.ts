import { PresenceStatus, UnitStatus } from "@prisma/client";
import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : undefined))
  .optional();

export const createUnitSchema = z.object({
  apartment: z.string().trim().min(1, "Informe o apartamento."),
  block: z.string().trim().min(1, "Informe o bloco."),
  cpf: optionalText,
  email: optionalText.pipe(z.string().email("Informe um e-mail valido.").optional()),
  phone: optionalText,
  residentEmail: z
    .string()
    .trim()
    .toLowerCase()
    .email("Informe o e-mail do morador."),
  residentName: z.string().trim().min(1, "Informe o nome do morador."),
  residentPassword: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
  residentUsername: optionalText.transform((value) => value?.toLowerCase()),
  responsibleName: z.string().trim().min(1, "Informe o responsavel."),
});

export const updateUnitSchema = z.object({
  cpf: optionalText,
  email: optionalText.pipe(z.string().email("Informe um e-mail valido.").optional()),
  phone: optionalText,
  presenceStatus: z.nativeEnum(PresenceStatus),
  responsibleName: z.string().trim().min(1, "Informe o responsavel."),
  status: z.nativeEnum(UnitStatus),
});

export type CreateUnitInput = z.infer<typeof createUnitSchema>;
export type UpdateUnitInput = z.infer<typeof updateUnitSchema>;
