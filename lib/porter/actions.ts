"use server";

import { AccessMethod, UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { prisma } from "@/lib/prisma";
import { registerManualAccessSchema } from "@/lib/porter/validation";

async function requirePorter() {
  const user = await getCurrentUser();

  if (!user || user.role !== UserRole.PORTER) {
    redirect("/login");
  }

  return user;
}

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

function redirectToPorter(query: string | undefined, params: Record<string, string>): never {
  const searchParams = new URLSearchParams();

  if (query) {
    searchParams.set("q", query);
  }

  for (const [key, value] of Object.entries(params)) {
    searchParams.set(key, value);
  }

  redirect(`/portaria?${searchParams.toString()}`);
}

export async function registerManualAccessAction(formData: FormData) {
  const porter = await requirePorter();
  const parsed = registerManualAccessSchema.safeParse({
    accessType: getStringValue(formData, "accessType"),
    notes: getStringValue(formData, "notes"),
    query: getStringValue(formData, "query"),
    unitId: getStringValue(formData, "unitId"),
  });

  if (!parsed.success) {
    redirectToPorter(getStringValue(formData, "query"), {
      error: parsed.error.issues[0]?.message ?? "Dados invalidos.",
    });
  }

  const data = parsed.data;

  await prisma.accessLog.create({
    data: {
      accessMethod: AccessMethod.MANUAL,
      accessType: data.accessType,
      notes: data.notes,
      occurredAt: new Date(),
      porterId: porter.id,
      unitId: data.unitId,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/portaria");
  redirectToPorter(data.query, {
    success:
      data.accessType === "ENTRY"
        ? "Entrada registrada com sucesso."
        : "Saida registrada com sucesso.",
  });
}
