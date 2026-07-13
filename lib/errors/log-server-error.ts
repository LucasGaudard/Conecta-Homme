import { Prisma } from "@prisma/client";

type ServerErrorContext = {
  action: string;
  condominiumId?: string | null;
  metadata?: Record<string, unknown>;
  module: string;
  role?: string | null;
  userId?: string | null;
};

const sensitiveKeys = [
  "password",
  "passwordHash",
  "token",
  "resetToken",
  "authSecret",
  "AUTH_SECRET",
  "databaseUrl",
  "DATABASE_URL",
  "apiKey",
  "secret",
];

const sensitiveTextPatterns = [
  /AUTH_SECRET=[^\s]+/gi,
  /DATABASE_URL=[^\s]+/gi,
  /passwordHash["':=\s]+[^\s,}]+/gi,
  /password["':=\s]+[^\s,}]+/gi,
  /token["':=\s]+[^\s,}]+/gi,
  /secret["':=\s]+[^\s,}]+/gi,
  /apiKey["':=\s]+[^\s,}]+/gi,
];

function redactSensitiveText(value: string) {
  return sensitiveTextPatterns.reduce(
    (current, pattern) => current.replace(pattern, "[REDACTED]"),
    value,
  );
}

function sanitizeValue(value: unknown): unknown {
  if (typeof value === "string") {
    return redactSensitiveText(value);
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value && typeof value === "object") {
    return sanitizeRecord(value as Record<string, unknown>);
  }

  return value;
}

function sanitizeRecord(record: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(record).map(([key, value]) => [
      key,
      sensitiveKeys.some((sensitiveKey) => sensitiveKey.toLowerCase() === key.toLowerCase())
        ? "[REDACTED]"
        : sanitizeValue(value),
    ]),
  );
}

export function logServerError(error: unknown, context: ServerErrorContext) {
  const prismaError =
    error instanceof Prisma.PrismaClientKnownRequestError ? error : undefined;

  console.error("[server-action-error]", {
    action: context.action,
    code: prismaError?.code,
    condominiumId: context.condominiumId,
    message: error instanceof Error ? redactSensitiveText(error.message) : redactSensitiveText(String(error)),
    metadata: context.metadata ? sanitizeRecord(context.metadata) : undefined,
    module: context.module,
    prismaMeta: prismaError?.meta ? sanitizeRecord(prismaError.meta) : undefined,
    role: context.role,
    stack: error instanceof Error && error.stack ? redactSensitiveText(error.stack) : undefined,
    userId: context.userId,
  });
}

export type { ServerErrorContext };
