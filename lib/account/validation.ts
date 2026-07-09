import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : undefined))
  .optional();

export const updateAccountSchema = z
  .object({
    confirmPassword: z.string().optional(),
    currentPassword: z.string().optional(),
    email: z.string().trim().email("Informe um e-mail valido."),
    name: z.string().trim().min(1, "Informe seu nome."),
    newPassword: z.string().optional(),
    phone: optionalText,
  })
  .superRefine((data, ctx) => {
    const currentPassword = data.currentPassword?.trim() ?? "";
    const newPassword = data.newPassword?.trim() ?? "";
    const confirmPassword = data.confirmPassword?.trim() ?? "";
    const wantsPasswordChange =
      currentPassword.length > 0 ||
      newPassword.length > 0 ||
      confirmPassword.length > 0;

    if (!wantsPasswordChange) {
      return;
    }

    if (!currentPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Informe a senha atual.",
        path: ["currentPassword"],
      });
    }

    if (newPassword.length < 6) {
      ctx.addIssue({
        code: "custom",
        message: "A nova senha deve ter pelo menos 6 caracteres.",
        path: ["newPassword"],
      });
    }

    if (newPassword !== confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "A confirmacao da nova senha nao confere.",
        path: ["confirmPassword"],
      });
    }
  });

export type UpdateAccountInput = z.infer<typeof updateAccountSchema>;
