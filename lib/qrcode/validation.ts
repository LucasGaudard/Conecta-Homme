import { AccessType } from "@prisma/client";
import { z } from "zod";

export const validateQrTokenSchema = z.object({
  token: z.string().trim().min(1, "Informe o token do QR Code."),
});

export const registerQrAccessSchema = z.object({
  accessType: z.nativeEnum(AccessType),
  token: z.string().trim().min(1, "Informe o token do QR Code."),
});
