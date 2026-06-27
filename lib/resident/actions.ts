"use server";

import { Prisma, UserRole, VisitorStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { hashPassword } from "@/lib/auth/password";
import { prisma } from "@/lib/prisma";
import {
  createVisitorAuthorizationSchema,
  updatePresenceSchema,
  updateResidentSettingsSchema,
} from "@/lib/resident/validation";

async function requireResidentUnit() {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== UserRole.RESIDENT) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: currentUser.id,
    },
    select: {
      id: true,
      unitId: true,
    },
  });

  if (!user?.unitId) {
    redirect("/morador?error=Usuario sem unidade vinculada.");
  }

  return {
    unitId: user.unitId,
    userId: user.id,
  };
}

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

function redirectWithMessage(path: string, params: Record<string, string>): never {
  const searchParams = new URLSearchParams(params);

  redirect(`${path}?${searchParams.toString()}`);
}

export async function updateResidentPresenceAction(formData: FormData) {
  const { unitId } = await requireResidentUnit();
  const parsed = updatePresenceSchema.safeParse({
    presenceStatus: getStringValue(formData, "presenceStatus"),
  });

  if (!parsed.success) {
    redirectWithMessage("/morador", {
      error: parsed.error.issues[0]?.message ?? "Status invalido.",
    });
  }

  await prisma.unit.update({
    where: {
      id: unitId,
    },
    data: {
      presenceStatus: parsed.data.presenceStatus,
    },
  });

  revalidatePath("/morador");
  revalidatePath("/portaria");
  redirectWithMessage("/morador", {
    success: "Status da residencia atualizado.",
  });
}

export async function createVisitorAuthorizationAction(formData: FormData) {
  const { unitId, userId } = await requireResidentUnit();
  const parsed = createVisitorAuthorizationSchema.safeParse({
    date: getStringValue(formData, "date"),
    document: getStringValue(formData, "document"),
    endTime: getStringValue(formData, "endTime"),
    name: getStringValue(formData, "name"),
    notes: getStringValue(formData, "notes"),
    phone: getStringValue(formData, "phone"),
    startTime: getStringValue(formData, "startTime"),
  });

  if (!parsed.success) {
    redirectWithMessage("/morador/visitantes", {
      error: parsed.error.issues[0]?.message ?? "Dados invalidos.",
    });
  }

  const data = parsed.data;
  const startsAt = new Date(`${data.date}T${data.startTime}`);
  const endsAt = new Date(`${data.date}T${data.endTime}`);

  await prisma.$transaction(async (tx) => {
    const visitor = await tx.visitor.create({
      data: {
        document: data.document,
        name: data.name,
        phone: data.phone,
      },
    });

    await tx.visitAuthorization.create({
      data: {
        authorizedById: userId,
        endsAt,
        notes: data.notes,
        startsAt,
        status: VisitorStatus.AUTHORIZED,
        unitId,
        visitorId: visitor.id,
      },
    });
  });

  revalidatePath("/morador");
  revalidatePath("/morador/visitantes");
  revalidatePath("/portaria");
  redirectWithMessage("/morador/visitantes", {
    success: "Visitante autorizado com sucesso.",
  });
}

export async function cancelVisitorAuthorizationAction(authorizationId: string) {
  const { unitId } = await requireResidentUnit();

  await prisma.visitAuthorization.update({
    where: {
      id: authorizationId,
      unitId,
    },
    data: {
      status: VisitorStatus.CANCELED,
    },
  });

  revalidatePath("/morador");
  revalidatePath("/morador/visitantes");
  revalidatePath("/portaria");
  redirectWithMessage("/morador/visitantes", {
    success: "Autorizacao cancelada.",
  });
}

export async function updateResidentSettingsAction(formData: FormData) {
  const { unitId, userId } = await requireResidentUnit();
  const parsed = updateResidentSettingsSchema.safeParse({
    email: getStringValue(formData, "email"),
    password: getStringValue(formData, "password"),
    phone: getStringValue(formData, "phone"),
    responsibleName: getStringValue(formData, "responsibleName"),
  });

  if (!parsed.success) {
    redirectWithMessage("/morador/configuracoes", {
      error: parsed.error.issues[0]?.message ?? "Dados invalidos.",
    });
  }

  const data = parsed.data;
  const operations: Prisma.PrismaPromise<unknown>[] = [
    prisma.unit.update({
      where: {
        id: unitId,
      },
      data: {
        email: data.email,
        phone: data.phone,
        responsibleName: data.responsibleName,
      },
    }),
  ];

  if (data.password && data.password.length > 0) {
    operations.push(
      prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          passwordHash: await hashPassword(data.password),
        },
      }),
    );
  }

  await prisma.$transaction(operations);

  revalidatePath("/morador");
  revalidatePath("/morador/configuracoes");
  revalidatePath("/portaria");
  redirectWithMessage("/morador/configuracoes", {
    success: "Configuracoes atualizadas.",
  });
}
