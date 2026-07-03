import { PresenceStatus } from "@prisma/client";
import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : undefined))
  .optional();

export const updatePresenceSchema = z.object({
  presenceStatus: z.nativeEnum(PresenceStatus),
});

export const createVisitorAuthorizationSchema = z
  .object({
    date: z.string().min(1, "Informe a data."),
    document: optionalText,
    endTime: z.string().min(1, "Informe o horário final."),
    name: z.string().trim().min(1, "Informe o nome do visitante."),
    notes: optionalText,
    phone: optionalText,
    startTime: z.string().min(1, "Informe o horário inicial."),
  })
  .refine(
    (data) => {
      const startsAt = new Date(`${data.date}T${data.startTime}`);
      const endsAt = new Date(`${data.date}T${data.endTime}`);

      return startsAt.toString() !== "Invalid Date" && endsAt > startsAt;
    },
    {
      message: "O horário final deve ser maior que o horário inicial.",
      path: ["endTime"],
    },
  );

export const updateResidentSettingsSchema = z.object({
  email: optionalText.pipe(z.string().email("Informe um e-mail válido.").optional()),
  password: z
    .string()
    .transform((value) => value.trim())
    .refine((value) => value.length === 0 || value.length >= 6, {
      message: "A senha deve ter pelo menos 6 caracteres.",
    })
    .optional(),
  phone: optionalText,
  responsibleName: z.string().trim().min(1, "Informe o nome responsável."),
});

export type CreateVisitorAuthorizationInput = z.infer<
  typeof createVisitorAuthorizationSchema
>;
export type UpdateResidentSettingsInput = z.infer<
  typeof updateResidentSettingsSchema
>;
