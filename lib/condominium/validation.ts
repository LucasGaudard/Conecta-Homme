import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : undefined))
  .optional();

export const updateCondominiumSettingsSchema = z.object({
  address: optionalText,
  email: optionalText.pipe(z.string().email("Informe um e-mail válido.").optional()),
  logoUrl: optionalText,
  name: z.string().trim().min(1, "Informe o nome do condomínio."),
  phone: optionalText,
  porterHours: optionalText,
});

export type UpdateCondominiumSettingsInput = z.infer<
  typeof updateCondominiumSettingsSchema
>;
