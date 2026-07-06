import { requireCondominiumRole } from "@/lib/auth/authorization";

export async function requireAdminExport() {
  return requireCondominiumRole("ADMIN");
}
