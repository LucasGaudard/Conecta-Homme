const unsafeMessagePatterns = [
  /database_url/i,
  /auth_secret/i,
  /passwordhash/i,
  /password hash/i,
  /token/i,
  /secret/i,
  /api[_-]?key/i,
  /prisma/i,
  /sql/i,
  /select\s.+\sfrom/i,
  /insert\s+into/i,
  /update\s.+\sset/i,
  /delete\s+from/i,
];

export class AppError extends Error {
  readonly safeMessage: string;

  constructor(message: string) {
    super(message);
    this.name = "AppError";
    this.safeMessage = message;
  }
}

export function isSafeErrorMessage(message: string) {
  const normalized = message.trim();

  if (!normalized || normalized.length > 240) {
    return false;
  }

  return !unsafeMessagePatterns.some((pattern) => pattern.test(normalized));
}
