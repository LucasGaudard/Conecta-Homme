import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { prisma } from "@/lib/prisma";

export async function getAccountSettingsData() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: currentUser.id,
    },
    select: {
      createdAt: true,
      email: true,
      id: true,
      name: true,
      phone: true,
      role: true,
      username: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  return user;
}
