import { LeisureSpaceStatus, SpaceReservationStatus } from "@prisma/client";
import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : undefined))
  .optional();

const optionalDate = z
  .string()
  .trim()
  .optional()
  .refine((value) => !value || !Number.isNaN(new Date(`${value}T00:00:00`).getTime()), {
    message: "Data invalida.",
  });

const requiredDate = z
  .string()
  .trim()
  .min(1, "Informe a data.")
  .refine((value) => !Number.isNaN(new Date(`${value}T00:00:00`).getTime()), {
    message: "Data invalida.",
  });

const requiredTime = z
  .string()
  .trim()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Horario invalido.");

export const createLeisureSpaceSchema = z.object({
  capacity: z
    .string()
    .trim()
    .transform((value) => (value.length > 0 ? Number(value) : undefined))
    .pipe(z.number().int().positive("Informe uma capacidade valida.").optional()),
  description: optionalText,
  location: optionalText,
  name: z.string().trim().min(2, "Informe o nome do espaco."),
  rules: optionalText,
});

export const updateLeisureSpaceSchema = createLeisureSpaceSchema.extend({
  status: z.nativeEnum(LeisureSpaceStatus),
});

export const requestReservationSchema = z
  .object({
    date: requiredDate,
    endTime: requiredTime,
    notes: optionalText,
    spaceId: z.string().min(1, "Selecione um espaco."),
    startTime: requiredTime,
  })
  .refine((data) => new Date(`${data.date}T${data.endTime}`) > new Date(`${data.date}T${data.startTime}`), {
    message: "O horario final deve ser posterior ao horario inicial.",
    path: ["endTime"],
  });

export const reservationIdSchema = z.string().min(1, "Reserva invalida.");

export const rejectReservationSchema = z.object({
  id: reservationIdSchema,
  rejectionReason: z.string().trim().min(3, "Informe o motivo da recusa."),
});

export const adminReservationFiltersSchema = z.object({
  from: optionalDate,
  q: z.string().optional(),
  spaceId: z.string().optional(),
  status: z.nativeEnum(SpaceReservationStatus).or(z.literal("ALL")).optional(),
  to: optionalDate,
  unitId: z.string().optional(),
});
