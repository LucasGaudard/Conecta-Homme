"use server";

import { NotificationStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getVisibleNotificationWhereForCurrentUser } from "@/lib/notifications/queries";
import { notificationIdSchema } from "@/lib/notifications/validation";
import { prisma } from "@/lib/prisma";

function getOptionalString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

function revalidateNotificationSurfaces(route: string) {
  revalidatePath(route);
  revalidatePath("/admin");
  revalidatePath("/portaria");
  revalidatePath("/morador");
}

export async function markNotificationAsReadAction(formData: FormData) {
  const parsed = notificationIdSchema.safeParse(getOptionalString(formData, "id"));
  const redirectTo = getOptionalString(formData, "redirectTo");

  if (!parsed.success) {
    redirect(redirectTo || "/login");
  }

  const { route, where } = await getVisibleNotificationWhereForCurrentUser();

  await prisma.notification.updateMany({
    where: {
      AND: [
        where,
        {
          id: parsed.data,
          status: NotificationStatus.UNREAD,
        },
      ],
    },
    data: {
      readAt: new Date(),
      status: NotificationStatus.READ,
    },
  });

  revalidateNotificationSurfaces(route);

  if (redirectTo) {
    redirect(redirectTo);
  }
}

export async function markAllNotificationsAsReadAction(formData: FormData) {
  const redirectTo = getOptionalString(formData, "redirectTo");
  const { route, where } = await getVisibleNotificationWhereForCurrentUser();

  await prisma.notification.updateMany({
    where: {
      AND: [
        where,
        {
          status: NotificationStatus.UNREAD,
        },
      ],
    },
    data: {
      readAt: new Date(),
      status: NotificationStatus.READ,
    },
  });

  revalidateNotificationSurfaces(route);

  if (redirectTo) {
    redirect(redirectTo);
  }
}
