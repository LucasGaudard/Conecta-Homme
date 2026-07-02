import { NotificationStatus, NotificationType, UserRole } from "@prisma/client";
import { z } from "zod";

export const notificationTypeFilterSchema = z
  .enum(["ALL", ...Object.values(NotificationType)] as [string, ...string[]])
  .default("ALL");

export const notificationStatusFilterSchema = z
  .enum(["ALL", ...Object.values(NotificationStatus)] as [string, ...string[]])
  .default("ALL");

export const notificationProfileSchema = z.enum([
  UserRole.ADMIN,
  UserRole.PORTER,
  UserRole.RESIDENT,
]);

export const notificationIdSchema = z.string().min(1, "Notificacao invalida.");

export type NotificationStatusFilter = z.infer<typeof notificationStatusFilterSchema>;
export type NotificationTypeFilter = z.infer<typeof notificationTypeFilterSchema>;

export function parseNotificationFilters(searchParams: {
  status?: string;
  type?: string;
}) {
  return {
    status: notificationStatusFilterSchema.catch("ALL").parse(searchParams.status),
    type: notificationTypeFilterSchema.catch("ALL").parse(searchParams.type),
  };
}
