"use server";

import { randomUUID } from "node:crypto";
import { AccessMethod, QRCodeStatus, QRCodeType, UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAuditLog } from "@/lib/audit/logger";
import { getCurrentUser } from "@/lib/auth/current-user";
import { prisma } from "@/lib/prisma";
import { getQrValidationResult } from "@/lib/qrcode/queries";
import { registerQrAccessSchema } from "@/lib/qrcode/validation";

async function requireResidentUnit() {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== UserRole.RESIDENT) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: currentUser.id },
    select: { id: true, unitId: true },
  });

  if (!user?.unitId) {
    redirect("/morador?error=Usuario sem unidade vinculada.");
  }

  return {
    email: currentUser.email,
    unitId: user.unitId,
    userId: user.id,
    userName: currentUser.name,
    userRole: currentUser.role,
  };
}

async function requirePorter() {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== UserRole.PORTER) {
    redirect("/login");
  }

  return currentUser;
}

function tokenValue() {
  return `ch_${randomUUID()}`;
}

function redirectWith(path: string, params: Record<string, string>): never {
  const searchParams = new URLSearchParams(params);

  redirect(`${path}?${searchParams.toString()}`);
}

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

export async function generateResidentQrCodeAction() {
  const resident = await requireResidentUnit();
  const { unitId } = resident;
  const existing = await prisma.qRCodeToken.findFirst({
    where: {
      status: QRCodeStatus.ACTIVE,
      type: QRCodeType.RESIDENT,
      unitId,
    },
  });

  if (!existing) {
    const token = await prisma.qRCodeToken.create({
      data: {
        status: QRCodeStatus.ACTIVE,
        token: tokenValue(),
        type: QRCodeType.RESIDENT,
        unitId,
      },
    });
    await createAuditLog({
      action: "GENERATE",
      description: "QR Code permanente do morador gerado.",
      entityId: token.id,
      entityType: "QRCodeToken",
      module: "QRCODE",
      user: {
        email: resident.email,
        id: resident.userId,
        name: resident.userName,
        role: resident.userRole,
      },
    });
  } else {
    await createAuditLog({
      action: "GENERATE",
      description: "QR Code permanente do morador reutilizado.",
      entityId: existing.id,
      entityType: "QRCodeToken",
      module: "QRCODE",
      user: {
        email: resident.email,
        id: resident.userId,
        name: resident.userName,
        role: resident.userRole,
      },
    });
  }

  revalidatePath("/morador");
  revalidatePath("/morador/qrcode");
  redirectWith("/morador/qrcode", {
    success: "QR Code do morador pronto para uso.",
  });
}

export async function generateVisitorQrCodeAction(authorizationId: string) {
  const resident = await requireResidentUnit();
  const { unitId } = resident;
  const authorization = await prisma.visitAuthorization.findFirst({
    where: {
      id: authorizationId,
      status: "AUTHORIZED",
      unitId,
    },
    include: {
      visitor: true,
    },
  });

  if (!authorization || authorization.endsAt < new Date()) {
    redirectWith("/morador/visitantes", {
      error: "Visitante nao autorizado para gerar QR Code.",
    });
  }

  const existing = await prisma.qRCodeToken.findFirst({
    where: {
      status: QRCodeStatus.ACTIVE,
      type: QRCodeType.VISITOR,
      visitAuthorizationId: authorization.id,
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!existing) {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 12);

    const token = await prisma.qRCodeToken.create({
      data: {
        expiresAt,
        status: QRCodeStatus.ACTIVE,
        token: tokenValue(),
        type: QRCodeType.VISITOR,
        unitId,
        visitAuthorizationId: authorization.id,
        visitorId: authorization.visitorId,
      },
    });
    await createAuditLog({
      action: "GENERATE",
      description: `QR Code temporario gerado para visitante ${authorization.visitor.name}.`,
      entityId: token.id,
      entityType: "QRCodeToken",
      module: "QRCODE",
      user: {
        email: resident.email,
        id: resident.userId,
        name: resident.userName,
        role: resident.userRole,
      },
    });
  } else {
    await createAuditLog({
      action: "GENERATE",
      description: `QR Code temporario reutilizado para visitante ${authorization.visitor.name}.`,
      entityId: existing.id,
      entityType: "QRCodeToken",
      module: "QRCODE",
      user: {
        email: resident.email,
        id: resident.userId,
        name: resident.userName,
        role: resident.userRole,
      },
    });
  }

  revalidatePath("/morador/visitantes");
  redirectWith("/morador/visitantes", {
    success: "QR Code temporario gerado.",
  });
}

export async function registerQrAccessAction(formData: FormData) {
  const porter = await requirePorter();
  const parsed = registerQrAccessSchema.safeParse({
    accessType: getStringValue(formData, "accessType"),
    token: getStringValue(formData, "token"),
  });

  if (!parsed.success) {
    redirectWith("/portaria/validar-qr", {
      error: parsed.error.issues[0]?.message ?? "Dados invalidos.",
    });
  }

  const result = await getQrValidationResult(parsed.data.token);

  if (!result?.allowed || !("unit" in result) || !result.unit) {
    await createAuditLog({
      action: "VALIDATE",
      description: `Tentativa de validacao de QR Code recusada: ${result?.reason ?? "QR Code invalido"}.`,
      entityId: parsed.data.token,
      entityType: "QRCodeToken",
      module: "QRCODE",
      user: porter,
    });
    redirectWith("/portaria/validar-qr", {
      error: result?.reason ?? "QR Code invalido",
      token: parsed.data.token,
    });
  }

  const accessLog = await prisma.accessLog.create({
    data: {
      accessMethod: AccessMethod.QR_CODE,
      accessType: parsed.data.accessType,
      occurredAt: new Date(),
      porterId: porter.id,
      unitId: result.unit.id,
      visitorId: result.visitor?.id,
    },
  });

  await createAuditLog({
    action: "VALIDATE",
    description:
      parsed.data.accessType === "ENTRY"
        ? "Entrada via QR Code validada pela portaria."
        : "Saida via QR Code validada pela portaria.",
    entityId: accessLog.id,
    entityType: "AccessLog",
    module: "QRCODE",
    user: porter,
  });

  revalidatePath("/portaria");
  revalidatePath("/portaria/validar-qr");
  revalidatePath("/morador/acessos");
  redirectWith("/portaria/validar-qr", {
    success:
      parsed.data.accessType === "ENTRY"
        ? "Entrada via QR Code registrada."
        : "Saida via QR Code registrada.",
    token: parsed.data.token,
  });
}
