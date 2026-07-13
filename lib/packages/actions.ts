"use server";

import { NotificationStatus, NotificationType, PackageStatus, UnitStatus, UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAuditLog } from "@/lib/audit/logger";
import { requireCondominiumRole } from "@/lib/auth/authorization";
import { prisma } from "@/lib/prisma";
import { createPackageSchema, deliverPackageSchema } from "@/lib/packages/validation";

async function requirePackageOperator() {
  return requireCondominiumRole("ADMIN", "PORTER");
}

function packageRoute(role: UserRole) {
  return role === UserRole.ADMIN ? "/admin/encomendas" : "/portaria/encomendas";
}

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

function redirectToPackages(
  role: UserRole,
  query: string | undefined,
  params: Record<string, string>,
): never {
  const searchParams = new URLSearchParams(params);

  if (query) {
    searchParams.set("q", query);
  }

  redirect(`${packageRoute(role)}?${searchParams.toString()}`);
}

function revalidatePackageSurfaces() {
  revalidatePath("/admin");
  revalidatePath("/admin/encomendas");
  revalidatePath("/morador");
  revalidatePath("/morador/encomendas");
  revalidatePath("/morador/notificacoes");
  revalidatePath("/portaria");
  revalidatePath("/portaria/encomendas");
}

export async function createPackageAction(formData: FormData) {
  const { condominiumId, user: operator } = await requirePackageOperator();
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
    redirectToPackages(operator.role, getStringValue(formData, "query"), {
      error: parsed.error.issues[0]?.message ?? "Dados invalidos.",
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
    redirectToPackages(operator.role, data.query, {
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
        receivedById: operator.id,
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
    user: operator,
  });

  revalidatePackageSurfaces();
  redirectToPackages(operator.role, data.query, {
    success: "Encomenda cadastrada com sucesso.",
  });
}

export async function deliverPackageAction(formData: FormData) {
  const { condominiumId, user: operator } = await requirePackageOperator();
  const parsed = deliverPackageSchema.safeParse({
    packageId: getStringValue(formData, "packageId"),
    pickedUpByName: getStringValue(formData, "pickedUpByName"),
  });

  if (!parsed.success) {
    redirectToPackages(operator.role, undefined, {
      error: parsed.error.issues[0]?.message ?? "Dados invalidos.",
    });
  }

  const packageRecord = await prisma.package.findFirst({
    where: {
      condominiumId,
      id: parsed.data.packageId,
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
    redirectToPackages(operator.role, undefined, {
      error: "Encomenda inexistente ou ja entregue.",
    });
  }

  const updated = await prisma.package.updateMany({
    where: {
      condominiumId,
      id: parsed.data.packageId,
      status: PackageStatus.WAITING_PICKUP,
      unit: {
        condominiumId,
      },
    },
    data: {
      deliveredAt: new Date(),
      deliveredById: operator.id,
      pickedUpByName: parsed.data.pickedUpByName,
      status: PackageStatus.DELIVERED,
    },
  });

  if (updated.count === 0) {
    redirectToPackages(operator.role, undefined, {
      error: "Encomenda inexistente ou ja entregue.",
    });
  }

  await createAuditLog({
    action: "DELIVER",
    description: `Encomenda entregue para ${parsed.data.pickedUpByName}.`,
    entityId: packageRecord.id,
    entityType: "Package",
    module: "PACKAGE",
    user: operator,
  });

  revalidatePackageSurfaces();
  redirectToPackages(operator.role, undefined, {
    success: "Encomenda marcada como entregue.",
  });
}
