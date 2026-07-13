import { Prisma } from "@prisma/client";
import { isNextRouterError } from "next/dist/client/components/is-next-router-error";
import { ZodError } from "zod";
import { AppError, isSafeErrorMessage } from "@/lib/errors/app-error";
import { logServerError, type ServerErrorContext } from "@/lib/errors/log-server-error";
import { getPrismaErrorMessage, type PrismaErrorMessages } from "@/lib/errors/prisma-error";
import { getValidationErrorMessage } from "@/lib/errors/validation-error";

type HandleActionErrorOptions = {
  context: ServerErrorContext;
  fallbackMessage: string;
  prisma?: PrismaErrorMessages;
};

export function handleActionError(error: unknown, options: HandleActionErrorOptions) {
  if (isNextRouterError(error)) {
    throw error;
  }

  logServerError(error, options.context);

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return getPrismaErrorMessage(error, options.prisma);
  }

  if (error instanceof ZodError) {
    return getValidationErrorMessage(error);
  }

  if (error instanceof AppError) {
    return error.safeMessage;
  }

  if (error instanceof Error && isSafeErrorMessage(error.message)) {
    return error.message;
  }

  return options.fallbackMessage;
}
