import { UserStatus } from "@prisma/client";
import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : undefined))
  .optional();

export const createPorterSchema = z.object({
  email: z.string().trim().email("Informe um e-mail válido."),
  name: z.string().trim().min(2, "Informe o nome do porteiro."),
  password: z.string().min(6, "A senha inicial deve ter pelo menos 6 caracteres."),
  phone: optionalText,
  porterShiftDescription: optionalText,
});

export const updatePorterSchema = z.object({
  email: z.string().trim().email("Informe um e-mail válido."),
  name: z.string().trim().min(2, "Informe o nome do porteiro."),
  phone: optionalText,
  porterShiftDescription: optionalText,
});

export const porterStatusSchema = z.object({
  id: z.string().min(1, "Porteiro inválido."),
  status: z.nativeEnum(UserStatus),
});

export const resetPorterPasswordSchema = z.object({
  id: z.string().min(1, "Porteiro inválido."),
  password: z.string().min(6, "A senha temporária deve ter pelo menos 6 caracteres."),
});
