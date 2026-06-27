import type { UserRole } from "@prisma/client";

export const SESSION_COOKIE_NAME = "conecta_homme_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export const roleHomePath: Record<UserRole, string> = {
  ADMIN: "/admin",
  PORTER: "/portaria",
  RESIDENT: "/morador",
};

export const protectedPathRoles: Array<{
  path: string;
  role: UserRole;
}> = [
  { path: "/admin", role: "ADMIN" },
  { path: "/portaria", role: "PORTER" },
  { path: "/morador", role: "RESIDENT" },
];
