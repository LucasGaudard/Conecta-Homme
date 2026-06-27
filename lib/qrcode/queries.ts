import { QRCodeStatus, QRCodeType, UnitStatus, VisitorStatus } from "@prisma/client";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { prisma } from "@/lib/prisma";

export async function getResidentQrCodeData() {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "RESIDENT") {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: currentUser.id },
    include: {
      unit: true,
    },
  });

  if (!user?.unit) {
    redirect("/morador?error=Usuario sem unidade vinculada.");
  }

  const qrCode = await prisma.qRCodeToken.findFirst({
    where: {
      status: QRCodeStatus.ACTIVE,
      type: QRCodeType.RESIDENT,
      unitId: user.unit.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    qrCode,
    unit: user.unit,
  };
}

export async function getVisitorQrCodesForResident() {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "RESIDENT") {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: currentUser.id },
    select: { unitId: true },
  });

  if (!user?.unitId) {
    redirect("/morador?error=Usuario sem unidade vinculada.");
  }

  return prisma.qRCodeToken.findMany({
    where: {
      status: QRCodeStatus.ACTIVE,
      type: QRCodeType.VISITOR,
      visitAuthorization: {
        unitId: user.unitId,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getQrValidationResult(token: string) {
  const normalizedToken = token.trim();

  if (!normalizedToken) {
    return null;
  }

  const qrCode = await prisma.qRCodeToken.findUnique({
    where: { token: normalizedToken },
    include: {
      unit: true,
      visitor: true,
      visitAuthorization: {
        include: {
          unit: true,
          visitor: true,
        },
      },
    },
  });

  if (!qrCode) {
    return {
      allowed: false,
      reason: "QR Code invalido",
      token: normalizedToken,
    };
  }

  if (qrCode.expiresAt && qrCode.expiresAt < new Date()) {
    await prisma.qRCodeToken.update({
      where: { id: qrCode.id },
      data: { status: QRCodeStatus.EXPIRED },
    });

    return {
      allowed: false,
      reason: "QR Code expirado",
      token: normalizedToken,
    };
  }

  if (qrCode.status === QRCodeStatus.CANCELED) {
    return {
      allowed: false,
      reason: "QR Code cancelado",
      token: normalizedToken,
    };
  }

  if (qrCode.status !== QRCodeStatus.ACTIVE) {
    return {
      allowed: false,
      reason: "QR Code expirado",
      token: normalizedToken,
    };
  }

  const unit = qrCode.unit ?? qrCode.visitAuthorization?.unit;
  const visitor = qrCode.visitor ?? qrCode.visitAuthorization?.visitor ?? null;

  if (!unit) {
    return {
      allowed: false,
      reason: "QR Code invalido",
      token: normalizedToken,
    };
  }

  if (unit.status !== UnitStatus.ACTIVE) {
    return {
      allowed: false,
      reason: "Unidade inativa",
      token: normalizedToken,
      unit,
      visitor,
      qrCode,
    };
  }

  if (qrCode.type === QRCodeType.VISITOR) {
    const authorization = qrCode.visitAuthorization;

    if (
      !authorization ||
      authorization.status !== VisitorStatus.AUTHORIZED ||
      authorization.endsAt < new Date()
    ) {
      return {
        allowed: false,
        reason: "Visitante nao autorizado",
        token: normalizedToken,
        unit,
        visitor,
        qrCode,
      };
    }
  }

  return {
    allowed: true,
    reason: "Acesso autorizado",
    token: normalizedToken,
    unit,
    visitor,
    qrCode,
  };
}
