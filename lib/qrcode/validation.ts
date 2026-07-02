import { AccessType } from "@prisma/client";
import { z } from "zod";

export const validateQrTokenSchema = z.object({
  token: z.string().trim().min(1, "Informe o codigo do QR Code."),
});

export const registerQrAccessSchema = z.object({
  accessType: z.nativeEnum(AccessType),
  token: z.string().trim().min(1, "Informe o codigo do QR Code."),
});

export const generateVisitorQrCodeSchema = z
  .object({
    authorizationId: z.string().min(1, "Visitante invalido."),
    expiresAt: z.string().min(1, "Informe a validade do QR Code."),
  })
  .refine(
    (data) => {
      const expiresAt = new Date(data.expiresAt);

      return expiresAt.toString() !== "Invalid Date" && expiresAt > new Date();
    },
    {
      message: "A validade deve ser uma data futura.",
      path: ["expiresAt"],
    },
  );
