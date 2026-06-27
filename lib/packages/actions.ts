"use server";

import { NotificationStatus, NotificationType, PackageStatus, UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { prisma } from "@/lib/prisma";
import { createPackageSchema, deliverPackageSchema } from "@/lib/packages/validation";

async function requirePorter() {
  const user = await getCurrentUser();

  if (!user || user.role !== UserRole.PORTER) {
    redirect("/login");
  }

  return user;
}

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

function redirectToPorterPackages(query: string | undefined, params: Record<string, string>): never {
  const searchParams = new URLSearchParams(params);

  if (query) {
    searchParams.set("q", query);
  }

  redirect(`/portaria/encomendas?${searchParams.toString()}`);
}

export async function createPackageAction(formData: FormData) {
  const porter = await requirePorter();
  const parsed = createPackageSchema.safeParse({
    carrier: getStringValue(formData, "carrier"),
    description: getStringValue(formData, "description"),
    query: getStringValue(formData, "query"),
    trackingCode: getStringValue(formData, "trackingCode"),
    unitId: getStringValue(formData, "unitId"),
  });

  if (!parsed.success) {
    redirectToPorterPackages(getStringValue(formData, "query"), {
      error: parsed.error.issues[0]?.message ?? "Dados invalidos.",
    });
  }

  const data = parsed.data;

  await prisma.$transaction([
    prisma.package.create({
      data: {
        carrier: data.carrier,
        description: data.description,
        receivedAt: new Date(),
        receivedById: porter.id,
        status: PackageStatus.WAITING_PICKUP,
        trackingCode: data.trackingCode,
        unitId: data.unitId,
      },
    }),
    prisma.notification.create({
      data: {
        message: "Uma encomenda foi registrada para sua unidade.",
        status: NotificationStatus.UNREAD,
        title: "Nova encomenda recebida",
        type: NotificationType.PACKAGE,
        unitId: data.unitId,
      },
    }),
  ]);

  revalidatePath("/admin");
  revalidatePath("/admin/encomendas");
  revalidatePath("/morador");
  revalidatePath("/morador/encomendas");
  revalidatePath("/portaria");
  revalidatePath("/portaria/encomendas");
  redirectToPorterPackages(data.query, {
    success: "Encomenda cadastrada com sucesso.",
  });
}

export async function deliverPackageAction(formData: FormData) {
  const porter = await requirePorter();
  const parsed = deliverPackageSchema.safeParse({
    packageId: getStringValue(formData, "packageId"),
    pickedUpByName: getStringValue(formData, "pickedUpByName"),
  });

  if (!parsed.success) {
    redirectToPorterPackages(undefined, {
      error: parsed.error.issues[0]?.message ?? "Dados invalidos.",
    });
  }

  await prisma.package.update({
    where: { id: parsed.data.packageId },
    data: {
      deliveredAt: new Date(),
      deliveredById: porter.id,
      pickedUpByName: parsed.data.pickedUpByName,
      status: PackageStatus.DELIVERED,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/encomendas");
  revalidatePath("/morador");
  revalidatePath("/morador/encomendas");
  revalidatePath("/portaria");
  revalidatePath("/portaria/encomendas");
  redirectToPorterPackages(undefined, {
    success: "Encomenda marcada como entregue.",
  });
}
