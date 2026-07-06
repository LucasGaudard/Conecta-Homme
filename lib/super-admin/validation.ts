import { CondominiumStatus } from "@prisma/client";
import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : undefined))
  .optional();

const slugSchema = z
  .string()
  .trim()
  .min(2, "Informe um slug.")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use apenas letras minusculas, numeros e hifens.");

const optionalDate = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : undefined))
  .pipe(
    z
      .string()
      .refine((value) => !Number.isNaN(new Date(`${value}T00:00:00`).getTime()), {
        message: "Data invalida.",
      })
      .optional(),
  );

const baseCondominiumSchema = z.object({
  address: optionalText,
  billingEmail: optionalText.pipe(z.string().email("Informe um e-mail de cobrança valido.").optional()),
  document: optionalText,
  email: optionalText.pipe(z.string().email("Informe um e-mail valido.").optional()),
  logoUrl: optionalText.pipe(z.string().url("Informe uma URL de logo valida.").optional()),
  name: z.string().trim().min(2, "Informe o nome do condominio."),
  phone: optionalText,
  planCode: optionalText,
  porterHours: optionalText,
  slug: slugSchema,
  trialEndsAt: optionalDate,
});

export const createCondominiumSchema = baseCondominiumSchema
  .extend({
    adminEmail: optionalText.pipe(z.string().email("Informe um e-mail valido para o admin.").optional()),
    adminName: optionalText,
    adminPassword: optionalText,
    adminPhone: optionalText,
  })
  .superRefine((data, ctx) => {
    const hasAnyAdminField = Boolean(data.adminEmail || data.adminName || data.adminPassword || data.adminPhone);
    const hasRequiredAdminFields = Boolean(data.adminEmail && data.adminName && data.adminPassword);

    if (hasAnyAdminField && !hasRequiredAdminFields) {
      ctx.addIssue({
        code: "custom",
        message: "Para criar o admin inicial, informe nome, e-mail e senha.",
        path: ["adminEmail"],
      });
    }

    if (data.adminPassword && data.adminPassword.length < 6) {
      ctx.addIssue({
        code: "custom",
        message: "A senha inicial deve ter pelo menos 6 caracteres.",
        path: ["adminPassword"],
      });
    }
  });

export const updateCondominiumSchema = baseCondominiumSchema.extend({
  status: z.nativeEnum(CondominiumStatus),
});

export const condominiumIdSchema = z.string().min(1, "Condominio invalido.");

export const condominiumStatusActionSchema = z.object({
  id: condominiumIdSchema,
  status: z.nativeEnum(CondominiumStatus),
});
