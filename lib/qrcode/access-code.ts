import type { QRCodeType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const SAFE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const CODE_LENGTH = 5;

function randomSafeCode() {
  let code = "";

  for (let index = 0; index < CODE_LENGTH; index += 1) {
    code += SAFE_CHARS[Math.floor(Math.random() * SAFE_CHARS.length)];
  }

  return code;
}

export function normalizeQrAccessCode(value: string) {
  return value.trim().toUpperCase();
}

export async function createUniqueAccessCode(type: QRCodeType) {
  const prefix = type === "RESIDENT" ? "MR" : "VT";

  for (let attempt = 0; attempt < 20; attempt += 1) {
    const accessCode = `${prefix}-${randomSafeCode()}`;
    const existing = await prisma.qRCodeToken.findUnique({
      where: {
        accessCode,
      },
      select: {
        id: true,
      },
    });

    if (!existing) {
      return accessCode;
    }
  }

  throw new Error("Não foi possível gerar um código de acesso único.");
}
