import { UserStatus } from "@prisma/client";
import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : undefined))
  .optional();

export const createPorterSchema = z.object({
  email: z.string().trim().email("Informe um e-mail valido."),
  name: z.string().trim().min(1, "Informe o nome do porteiro."),
  password: z.string().min(6, "A senha inicial deve ter pelo menos 6 caracteres."),
  phone: optionalText,
  status: z.nativeEnum(UserStatus).default(UserStatus.ACTIVE),
});

export const updatePorterSchema = z.object({
  email: z.string().trim().email("Informe um e-mail valido."),
  name: z.string().trim().min(1, "Informe o nome do porteiro."),
  password: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || value.length >= 6, {
      message: "A nova senha deve ter pelo menos 6 caracteres.",
    }),
  phone: optionalText,
  status: z.nativeEnum(UserStatus),
});
