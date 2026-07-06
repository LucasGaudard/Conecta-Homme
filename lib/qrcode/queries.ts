import { QRCodeStatus, QRCodeType, UnitStatus, VisitorStatus } from "@prisma/client";
import { redirect } from "next/navigation";
import { requireCondominiumRole } from "@/lib/auth/authorization";
import { prisma } from "@/lib/prisma";
import { normalizeQrAccessCode } from "@/lib/qrcode/access-code";

export async function getResidentQrCodeData() {
  const { condominiumId, user: currentUser } = await requireCondominiumRole("RESIDENT");
  const user = await prisma.user.findUnique({
    where: { id: currentUser.id },
    include: {
      unit: true,
    },
  });

  if (!user?.unit || user.unit.condominiumId !== condominiumId) {
    redirect("/morador?error=Usuário sem unidade vinculada.");
  }

  const qrCode = await prisma.qRCodeToken.findFirst({
    where: {
      condominiumId,
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
  const { condominiumId, user: currentUser } = await requireCondominiumRole("RESIDENT");
  const user = await prisma.user.findUnique({
    where: { id: currentUser.id },
    select: { unitId: true },
  });

  if (!user?.unitId) {
    redirect("/morador?error=Usuário sem unidade vinculada.");
  }

  return prisma.qRCodeToken.findMany({
    where: {
      condominiumId,
      status: QRCodeStatus.ACTIVE,
      type: QRCodeType.VISITOR,
      visitAuthorization: {
        condominiumId,
        unitId: user.unitId,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getQrValidationResult(token: string, tenantCondominiumId?: string) {
  const condominiumId =
    tenantCondominiumId ?? (await requireCondominiumRole("PORTER")).condominiumId;
  const normalizedToken = normalizeQrAccessCode(token);

  if (!normalizedToken) {
    return null;
  }

  const qrCode = await prisma.qRCodeToken.findFirst({
    where: {
      condominiumId,
      OR: [
        { accessCode: normalizedToken },
        { token: token.trim() },
      ],
    },
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
      reason: "QR Code inválido",
      token: normalizedToken,
    };
  }

  if (qrCode.expiresAt && qrCode.expiresAt < new Date()) {
    await prisma.qRCodeToken.updateMany({
      where: { condominiumId, id: qrCode.id },
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

  if (!unit || unit.condominiumId !== condominiumId) {
    return {
      allowed: false,
      reason: "QR Code inválido",
      token: normalizedToken,
    };
  }

  if (visitor && visitor.condominiumId !== condominiumId) {
    return {
      allowed: false,
      reason: "QR Code inválido",
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
      authorization.condominiumId !== condominiumId ||
      authorization.status !== VisitorStatus.AUTHORIZED ||
      authorization.endsAt < new Date()
    ) {
      return {
        allowed: false,
        reason: "Visitante não autorizado",
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
