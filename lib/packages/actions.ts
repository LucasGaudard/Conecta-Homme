"use server";

import { NotificationStatus, NotificationType, PackageStatus, UnitStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAuditLog } from "@/lib/audit/logger";
import { requireCondominiumRole } from "@/lib/auth/authorization";
import { prisma } from "@/lib/prisma";
import { createPackageSchema, deliverPackageSchema } from "@/lib/packages/validation";

async function requirePorter() {
  return requireCondominiumRole("PORTER");
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
  const { condominiumId, user: porter } = await requirePorter();
  const parsed = createPackageSchema.safeParse({
    carrier: getStringValue(formData, "carrier"),
    description: getStringValue(formData, "description"),
    photoUrl: getStringValue(formData, "photoUrl"),
    pickupCode: getStringValue(formData, "pickupCode"),
    query: getStringValue(formData, "query"),
    trackingCode: getStringValue(formData, "trackingCode"),
    unitId: getStringValue(formData, "unitId"),
  });

  if (!parsed.success) {
    redirectToPorterPackages(getStringValue(formData, "query"), {
      error: parsed.error.issues[0]?.message ?? "Dados inválidos.",
    });
  }

  const data = parsed.data;
  const unit = await prisma.unit.findFirst({
    where: {
      condominiumId,
      id: data.unitId,
    },
    select: { status: true },
  });

  if (!unit || unit.status !== UnitStatus.ACTIVE) {
    redirectToPorterPackages(data.query, {
      error: "Unidade inexistente ou inativa.",
    });
  }

  const createdPackage = await prisma.$transaction(async (tx) => {
    const packageRecord = await tx.package.create({
      data: {
        carrier: data.carrier,
        condominiumId,
        description: data.description,
        photoUrl: data.photoUrl,
        pickupCode: data.pickupCode,
        receivedAt: new Date(),
        receivedById: porter.id,
        status: PackageStatus.WAITING_PICKUP,
        trackingCode: data.trackingCode,
        unitId: data.unitId,
      },
    });

    await tx.notification.create({
      data: {
        condominiumId,
        message: "Uma encomenda foi registrada para sua unidade.",
        status: NotificationStatus.UNREAD,
        title: "Nova encomenda recebida",
        type: NotificationType.PACKAGE,
        unitId: data.unitId,
      },
    });

    return packageRecord;
  });

  await createAuditLog({
    action: "CREATE",
    description: "Encomenda cadastrada para unidade.",
    entityId: createdPackage.id,
    entityType: "Package",
    module: "PACKAGE",
    user: porter,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/encomendas");
  revalidatePath("/morador");
  revalidatePath("/morador/encomendas");
  revalidatePath("/morador/notificacoes");
  revalidatePath("/portaria");
  revalidatePath("/portaria/encomendas");
  redirectToPorterPackages(data.query, {
    success: "Encomenda cadastrada com sucesso.",
  });
}

export async function deliverPackageAction(formData: FormData) {
  const { condominiumId, user: porter } = await requirePorter();
  const parsed = deliverPackageSchema.safeParse({
    packageId: getStringValue(formData, "packageId"),
    pickedUpByName: getStringValue(formData, "pickedUpByName"),
  });

  if (!parsed.success) {
    redirectToPorterPackages(undefined, {
      error: parsed.error.issues[0]?.message ?? "Dados inválidos.",
    });
  }

  const packageRecord = await prisma.package.findFirst({
    where: {
      id: parsed.data.packageId,
      condominiumId,
      status: PackageStatus.WAITING_PICKUP,
      unit: {
        condominiumId,
      },
    },
    select: {
      id: true,
    },
  });

  if (!packageRecord) {
    redirectToPorterPackages(undefined, {
      error: "Encomenda inexistente ou já entregue.",
    });
  }

  const updated = await prisma.package.updateMany({
    where: {
      id: parsed.data.packageId,
      condominiumId,
      status: PackageStatus.WAITING_PICKUP,
      unit: {
        condominiumId,
      },
    },
    data: {
      deliveredAt: new Date(),
      deliveredById: porter.id,
      pickedUpByName: parsed.data.pickedUpByName,
      status: PackageStatus.DELIVERED,
    },
  });

  if (updated.count === 0) {
    redirectToPorterPackages(undefined, {
      error: "Encomenda inexistente ou já entregue.",
    });
  }

  await createAuditLog({
    action: "DELIVER",
    description: `Encomenda entregue para ${parsed.data.pickedUpByName}.`,
    entityId: packageRecord.id,
    entityType: "Package",
    module: "PACKAGE",
    user: porter,
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
