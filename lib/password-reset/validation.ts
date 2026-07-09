import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Informe um e-mail valido."),
});

export const resetPasswordSchema = z
  .object({
    confirmPassword: z.string(),
    newPassword: z.string().min(6, "A nova senha deve ter pelo menos 6 caracteres."),
    token: z.string().trim().min(1, "Token invalido."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "A confirmacao da nova senha nao confere.",
    path: ["confirmPassword"],
  });

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
