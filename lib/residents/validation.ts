import { UserStatus } from "@prisma/client";
import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : undefined))
  .optional();

export const updateResidentSchema = z.object({
  email: z.string().trim().email("Informe um e-mail válido."),
  name: z.string().trim().min(1, "Informe o nome do morador."),
  phone: optionalText,
  username: optionalText.transform((value) => value?.toLowerCase()),
});

export const residentStatusSchema = z.object({
  id: z.string().min(1, "Morador inválido."),
  status: z.nativeEnum(UserStatus),
});
