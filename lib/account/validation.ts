import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : undefined))
  .optional();

export const updateAccountSchema = z.object({
  email: z.string().trim().email("Informe um e-mail valido."),
  name: z.string().trim().min(1, "Informe seu nome."),
  password: z
    .string()
    .transform((value) => value.trim())
    .refine((value) => value.length === 0 || value.length >= 6, {
      message: "A senha deve ter pelo menos 6 caracteres.",
    })
    .optional(),
  phone: optionalText,
});

export type UpdateAccountInput = z.infer<typeof updateAccountSchema>;
