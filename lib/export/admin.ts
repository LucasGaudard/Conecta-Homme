import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";

export async function requireAdminExport() {
  const user = await getCurrentUser();

  if (!user || user.role !== UserRole.ADMIN) {
    redirect("/login");
  }

  return user;
}
