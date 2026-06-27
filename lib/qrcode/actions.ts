"use server";

import { randomUUID } from "node:crypto";
import { AccessMethod, QRCodeStatus, QRCodeType, UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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
    unitId: user.unitId,
    userId: user.id,
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
  const { unitId } = await requireResidentUnit();
  const existing = await prisma.qRCodeToken.findFirst({
    where: {
      status: QRCodeStatus.ACTIVE,
      type: QRCodeType.RESIDENT,
      unitId,
    },
  });

  if (!existing) {
    await prisma.qRCodeToken.create({
      data: {
        status: QRCodeStatus.ACTIVE,
        token: tokenValue(),
        type: QRCodeType.RESIDENT,
        unitId,
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
  const { unitId } = await requireResidentUnit();
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

    await prisma.qRCodeToken.create({
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
    redirectWith("/portaria/validar-qr", {
      error: result?.reason ?? "QR Code invalido",
      token: parsed.data.token,
    });
  }

  await prisma.accessLog.create({
    data: {
      accessMethod: AccessMethod.QR_CODE,
      accessType: parsed.data.accessType,
      occurredAt: new Date(),
      porterId: porter.id,
      unitId: result.unit.id,
      visitorId: result.visitor?.id,
    },
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
