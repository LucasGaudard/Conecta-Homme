"use server";

import { CondominiumStatus, UserStatus } from "@prisma/client";
import { redirect } from "next/navigation";
import { hashPassword } from "@/lib/auth/password";
import { sendEmail } from "@/lib/email/send-email";
import { prisma } from "@/lib/prisma";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/lib/password-reset/validation";
import {
  createPasswordResetToken,
  getPasswordResetExpiresAt,
  hashPasswordResetToken,
  PASSWORD_RESET_EXPIRES_IN_MINUTES,
} from "@/lib/password-reset/tokens";

const forgotGenericMessage =
  "Se existir uma conta com esse e-mail, enviaremos as instrucoes.";

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

function redirectWithMessage(path: string, params: Record<string, string>): never {
  const searchParams = new URLSearchParams(params);

  redirect(`${path}?${searchParams.toString()}`);
}

function getAppUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

function canResetPassword(user: {
  condominium: { status: CondominiumStatus } | null;
  condominiumId: string | null;
  role: string;
  status: UserStatus;
}) {
  if (user.status !== UserStatus.ACTIVE) {
    return false;
  }

  if (user.role === "SUPER_ADMIN") {
    return user.condominiumId === null;
  }

  return user.condominium?.status === CondominiumStatus.ACTIVE;
}

export async function requestPasswordResetAction(formData: FormData) {
  const parsed = forgotPasswordSchema.safeParse({
    email: getStringValue(formData, "email"),
  });

  if (!parsed.success) {
    redirectWithMessage("/esqueci-minha-senha", {
      error: parsed.error.issues[0]?.message ?? "Informe um e-mail valido.",
    });
  }

  const normalizedEmail = parsed.data.email.toLowerCase();
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: {
      condominium: { select: { status: true } },
      condominiumId: true,
      email: true,
      id: true,
      name: true,
      role: true,
      status: true,
    },
  });

  if (user && canResetPassword(user)) {
    const token = createPasswordResetToken();
    const tokenHash = hashPasswordResetToken(token);
    const resetUrl = `${getAppUrl()}/redefinir-senha?token=${encodeURIComponent(token)}`;

    await prisma.$transaction(async (tx) => {
      await tx.passwordResetToken.updateMany({
        where: {
          userId: user.id,
          usedAt: null,
        },
        data: {
          usedAt: new Date(),
        },
      });

      await tx.passwordResetToken.create({
        data: {
          expiresAt: getPasswordResetExpiresAt(),
          tokenHash,
          userId: user.id,
        },
      });
    });

    await sendEmail({
      html: `
        <p>Ola, ${user.name}.</p>
        <p>Recebemos uma solicitacao para redefinir sua senha no Conecta Homme.</p>
        <p><a href="${resetUrl}">Clique aqui para criar uma nova senha</a>.</p>
        <p>Este link expira em ${PASSWORD_RESET_EXPIRES_IN_MINUTES} minutos.</p>
        <p>Se voce nao solicitou esta alteracao, ignore este e-mail.</p>
      `,
      subject: "Redefinicao de senha - Conecta Homme",
      text: [
        `Ola, ${user.name}.`,
        "Recebemos uma solicitacao para redefinir sua senha no Conecta Homme.",
        `Acesse: ${resetUrl}`,
        `Este link expira em ${PASSWORD_RESET_EXPIRES_IN_MINUTES} minutos.`,
        "Se voce nao solicitou esta alteracao, ignore este e-mail.",
      ].join("\n\n"),
      to: user.email,
    });
  }

  redirectWithMessage("/esqueci-minha-senha", {
    success: forgotGenericMessage,
  });
}

export async function resetPasswordAction(formData: FormData) {
  const parsed = resetPasswordSchema.safeParse({
    confirmPassword: getStringValue(formData, "confirmPassword"),
    newPassword: getStringValue(formData, "newPassword"),
    token: getStringValue(formData, "token"),
  });
  const token = getStringValue(formData, "token");

  if (!parsed.success) {
    redirectWithMessage(`/redefinir-senha?token=${encodeURIComponent(token)}`, {
      error: parsed.error.issues[0]?.message ?? "Dados invalidos.",
    });
  }

  const tokenHash = hashPasswordResetToken(parsed.data.token);
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
    include: {
      user: {
        select: {
          condominium: { select: { status: true } },
          condominiumId: true,
          id: true,
          role: true,
          status: true,
        },
      },
    },
  });

  if (
    !resetToken ||
    resetToken.usedAt ||
    resetToken.expiresAt < new Date() ||
    !canResetPassword(resetToken.user)
  ) {
    redirectWithMessage("/redefinir-senha", {
      error: "Link de redefinicao invalido ou expirado.",
    });
  }

  const passwordHash = await hashPassword(parsed.data.newPassword);

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash },
    });

    await tx.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { usedAt: new Date() },
    });
  });

  redirectWithMessage("/login", {
    success: "Senha redefinida com sucesso. Entre com a nova senha.",
  });
}
