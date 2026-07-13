import { Prisma } from "@prisma/client";

type PrismaErrorMessages = {
  missingColumn?: string;
  notFound?: string;
  unique?: Record<string, string>;
};

function getPrismaTarget(error: Prisma.PrismaClientKnownRequestError) {
  return Array.isArray(error.meta?.target)
    ? error.meta.target.join(", ")
    : String(error.meta?.target ?? "");
}

export function getPrismaErrorMessage(
  error: Prisma.PrismaClientKnownRequestError,
  messages: PrismaErrorMessages = {},
) {
  if (error.code === "P2002") {
    const target = getPrismaTarget(error);
    const customMessage = Object.entries(messages.unique ?? {}).find(([field]) =>
      target.includes(field),
    )?.[1];

    return customMessage ?? "Ja existe um registro com estes dados.";
  }

  if (error.code === "P2025") {
    return messages.notFound ?? "Registro nao encontrado.";
  }

  if (error.code === "P2022") {
    return (
      messages.missingColumn ??
      "Incompatibilidade entre o sistema e o banco de dados. Acione o suporte."
    );
  }

  return "Nao foi possivel concluir a operacao. Tente novamente ou acione o suporte.";
}

export type { PrismaErrorMessages };
