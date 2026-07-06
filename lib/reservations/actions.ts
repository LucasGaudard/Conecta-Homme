"use server";

import {
  LeisureSpaceStatus,
  NotificationStatus,
  NotificationType,
  Prisma,
  SpaceReservationStatus,
} from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAuditLog } from "@/lib/audit/logger";
import { requireCondominiumRole } from "@/lib/auth/authorization";
import { prisma } from "@/lib/prisma";
import {
  createLeisureSpaceSchema,
  rejectReservationSchema,
  requestReservationSchema,
  reservationIdSchema,
  updateLeisureSpaceSchema,
} from "@/lib/reservations/validation";

async function requireResidentUnit() {
  const { condominiumId, user } = await requireCondominiumRole("RESIDENT");
  const resident = await prisma.user.findUnique({
    where: { id: user.id },
    select: { email: true, id: true, name: true, role: true, unitId: true },
  });

  if (!resident?.unitId) {
    redirect("/morador?error=Usuario sem unidade vinculada.");
  }

  const unit = await prisma.unit.findFirst({
    where: {
      condominiumId,
      id: resident.unitId,
    },
    select: {
      id: true,
    },
  });

  if (!unit) {
    redirect("/morador?error=Unidade nao encontrada.");
  }

  return { ...resident, condominiumId, unitId: unit.id };
}

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

function redirectWithMessage(path: string, params: Record<string, string>): never {
  const searchParams = new URLSearchParams(params);

  redirect(`${path}?${searchParams.toString()}`);
}

function getReservationDateRange(data: { date: string; endTime: string; startTime: string }) {
  return {
    endAt: new Date(`${data.date}T${data.endTime}`),
    startAt: new Date(`${data.date}T${data.startTime}`),
  };
}

async function hasApprovedConflict(
  condominiumId: string,
  spaceId: string,
  startAt: Date,
  endAt: Date,
  exceptId?: string,
) {
  const conflict = await prisma.spaceReservation.findFirst({
    where: {
      condominiumId,
      id: exceptId ? { not: exceptId } : undefined,
      spaceId,
      status: SpaceReservationStatus.APPROVED,
      startAt: { lt: endAt },
      endAt: { gt: startAt },
    },
    select: { id: true },
  });

  return Boolean(conflict);
}

function revalidateReservationSurfaces() {
  revalidatePath("/admin");
  revalidatePath("/admin/espacos");
  revalidatePath("/admin/reservas");
  revalidatePath("/morador");
  revalidatePath("/morador/reservas");
  revalidatePath("/morador/notificacoes");
  revalidatePath("/portaria");
  revalidatePath("/portaria/reservas");
}

function handleSpacePrismaError(error: unknown, path: string): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    redirectWithMessage(path, {
      error: "Ja existe um espaco com este nome neste condominio.",
    });
  }

  redirectWithMessage(path, {
    error: "Nao foi possivel salvar o espaco. Tente novamente.",
  });
}

export async function createLeisureSpaceAction(formData: FormData) {
  const { condominiumId, user: admin } = await requireCondominiumRole("ADMIN");
  const parsed = createLeisureSpaceSchema.safeParse({
    capacity: getStringValue(formData, "capacity"),
    description: getStringValue(formData, "description"),
    location: getStringValue(formData, "location"),
    name: getStringValue(formData, "name"),
    rules: getStringValue(formData, "rules"),
  });

  if (!parsed.success) {
    redirectWithMessage("/admin/espacos", {
      error: parsed.error.issues[0]?.message ?? "Dados invalidos.",
    });
  }

  let space;

  try {
    space = await prisma.leisureSpace.create({
      data: {
        ...parsed.data,
        condominiumId,
        status: LeisureSpaceStatus.ACTIVE,
      },
    });
  } catch (error) {
    handleSpacePrismaError(error, "/admin/espacos");
  }

  await createAuditLog({
    action: "CREATE",
    description: `Espaco ${space.name} cadastrado.`,
    entityId: space.id,
    entityType: "LeisureSpace",
    module: "RESERVATION",
    user: admin,
  });

  revalidateReservationSurfaces();
  redirectWithMessage("/admin/espacos", {
    success: "Espaco cadastrado com sucesso.",
  });
}

export async function updateLeisureSpaceAction(spaceId: string, formData: FormData) {
  const { condominiumId, user: admin } = await requireCondominiumRole("ADMIN");
  const parsed = updateLeisureSpaceSchema.safeParse({
    capacity: getStringValue(formData, "capacity"),
    description: getStringValue(formData, "description"),
    location: getStringValue(formData, "location"),
    name: getStringValue(formData, "name"),
    rules: getStringValue(formData, "rules"),
    status: getStringValue(formData, "status"),
  });

  if (!parsed.success) {
    redirectWithMessage("/admin/espacos", {
      error: parsed.error.issues[0]?.message ?? "Dados invalidos.",
    });
  }

  const existing = await prisma.leisureSpace.findFirst({
    where: {
      condominiumId,
      id: spaceId,
    },
    select: {
      id: true,
    },
  });

  if (!existing) {
    redirectWithMessage("/admin/espacos", {
      error: "Espaco inexistente.",
    });
  }

  try {
    const updated = await prisma.leisureSpace.updateMany({
      where: { condominiumId, id: existing.id },
      data: parsed.data,
    });

    if (updated.count === 0) {
      redirectWithMessage("/admin/espacos", {
        error: "Espaco inexistente.",
      });
    }
  } catch (error) {
    handleSpacePrismaError(error, "/admin/espacos");
  }

  await createAuditLog({
    action: parsed.data.status === LeisureSpaceStatus.INACTIVE ? "INACTIVATE" : "UPDATE",
    description:
      parsed.data.status === LeisureSpaceStatus.INACTIVE
        ? `Espaco ${parsed.data.name} inativado.`
        : `Espaco ${parsed.data.name} atualizado.`,
    entityId: existing.id,
    entityType: "LeisureSpace",
    module: "RESERVATION",
    user: admin,
  });

  revalidateReservationSurfaces();
  redirectWithMessage("/admin/espacos", {
    success:
      parsed.data.status === LeisureSpaceStatus.INACTIVE
        ? "Espaco inativado com sucesso."
        : "Espaco atualizado com sucesso.",
  });
}

export async function inactivateLeisureSpaceAction(spaceId: string) {
  const { condominiumId, user: admin } = await requireCondominiumRole("ADMIN");
  const space = await prisma.leisureSpace.findFirst({
    where: {
      condominiumId,
      id: spaceId,
    },
    select: {
      id: true,
      name: true,
    },
  });

  if (!space) {
    redirectWithMessage("/admin/espacos", {
      error: "Espaco inexistente.",
    });
  }

  const updated = await prisma.leisureSpace.updateMany({
    where: { condominiumId, id: space.id },
    data: { status: LeisureSpaceStatus.INACTIVE },
  });

  if (updated.count === 0) {
    redirectWithMessage("/admin/espacos", {
      error: "Espaco inexistente.",
    });
  }

  await createAuditLog({
    action: "INACTIVATE",
    description: `Espaco ${space.name} inativado.`,
    entityId: space.id,
    entityType: "LeisureSpace",
    module: "RESERVATION",
    user: admin,
  });

  revalidateReservationSurfaces();
  redirectWithMessage("/admin/espacos", {
    success: "Espaco inativado com sucesso.",
  });
}

export async function requestSpaceReservationAction(formData: FormData) {
  const resident = await requireResidentUnit();
  const parsed = requestReservationSchema.safeParse({
    date: getStringValue(formData, "date"),
    endTime: getStringValue(formData, "endTime"),
    notes: getStringValue(formData, "notes"),
    spaceId: getStringValue(formData, "spaceId"),
    startTime: getStringValue(formData, "startTime"),
  });

  if (!parsed.success) {
    redirectWithMessage("/morador/reservas", {
      error: parsed.error.issues[0]?.message ?? "Dados invalidos.",
    });
  }

  const space = await prisma.leisureSpace.findFirst({
    where: {
      condominiumId: resident.condominiumId,
      id: parsed.data.spaceId,
      status: LeisureSpaceStatus.ACTIVE,
    },
    select: { id: true, name: true },
  });

  if (!space) {
    redirectWithMessage("/morador/reservas", {
      error: "Espaco inexistente ou inativo.",
    });
  }

  const { endAt, startAt } = getReservationDateRange(parsed.data);

  if (await hasApprovedConflict(resident.condominiumId, space.id, startAt, endAt)) {
    redirectWithMessage("/morador/reservas", {
      error: "Este horario ja esta reservado para o espaco selecionado.",
    });
  }

  const reservation = await prisma.spaceReservation.create({
    data: {
      condominiumId: resident.condominiumId,
      endAt,
      notes: parsed.data.notes,
      requestedById: resident.id,
      spaceId: space.id,
      startAt,
      status: SpaceReservationStatus.PENDING,
      unitId: resident.unitId,
    },
  });

  await createAuditLog({
    action: "REQUEST",
    description: `Reserva solicitada para ${space.name}.`,
    entityId: reservation.id,
    entityType: "SpaceReservation",
    module: "RESERVATION",
    user: resident,
  });

  revalidateReservationSurfaces();
  redirectWithMessage("/morador/reservas", {
    success: "Reserva solicitada com sucesso.",
  });
}

async function getAdminReservation(condominiumId: string, id: string) {
  return prisma.spaceReservation.findFirst({
    where: {
      condominiumId,
      id,
    },
    include: {
      space: { select: { id: true, name: true } },
      unit: { select: { id: true } },
    },
  });
}

export async function approveSpaceReservationAction(formData: FormData) {
  const { condominiumId, user: admin } = await requireCondominiumRole("ADMIN");
  const parsed = reservationIdSchema.safeParse(getStringValue(formData, "id"));

  if (!parsed.success) {
    redirectWithMessage("/admin/reservas", { error: "Reserva invalida." });
  }

  const reservation = await getAdminReservation(condominiumId, parsed.data);

  if (!reservation || reservation.status !== SpaceReservationStatus.PENDING) {
    redirectWithMessage("/admin/reservas", {
      error: "Reserva inexistente ou ja analisada.",
    });
  }

  if (
    await hasApprovedConflict(
      condominiumId,
      reservation.spaceId,
      reservation.startAt,
      reservation.endAt,
      reservation.id,
    )
  ) {
    redirectWithMessage("/admin/reservas", {
      error: "Ja existe uma reserva aprovada neste horario para o espaco.",
    });
  }

  await prisma.$transaction(async (tx) => {
    const updated = await tx.spaceReservation.updateMany({
      where: {
        condominiumId,
        id: reservation.id,
        status: SpaceReservationStatus.PENDING,
      },
      data: {
        approvedAt: new Date(),
        approvedById: admin.id,
        rejectionReason: null,
        status: SpaceReservationStatus.APPROVED,
      },
    });

    if (updated.count === 0) {
      redirectWithMessage("/admin/reservas", {
        error: "Reserva inexistente ou ja analisada.",
      });
    }

    await tx.notification.create({
      data: {
        condominiumId,
        message: `Sua reserva para ${reservation.space.name} foi aprovada.`,
        status: NotificationStatus.UNREAD,
        title: "Reserva aprovada",
        type: NotificationType.SYSTEM,
        unitId: reservation.unit.id,
      },
    });

    await createAuditLog(
      {
        action: "APPROVE",
        description: `Reserva para ${reservation.space.name} aprovada.`,
        entityId: reservation.id,
        entityType: "SpaceReservation",
        module: "RESERVATION",
        user: admin,
      },
      tx,
    );
  });

  revalidateReservationSurfaces();
  redirectWithMessage("/admin/reservas", {
    success: "Reserva aprovada com sucesso.",
  });
}

export async function rejectSpaceReservationAction(formData: FormData) {
  const { condominiumId, user: admin } = await requireCondominiumRole("ADMIN");
  const parsed = rejectReservationSchema.safeParse({
    id: getStringValue(formData, "id"),
    rejectionReason: getStringValue(formData, "rejectionReason"),
  });

  if (!parsed.success) {
    redirectWithMessage("/admin/reservas", {
      error: parsed.error.issues[0]?.message ?? "Dados invalidos.",
    });
  }

  const reservation = await getAdminReservation(condominiumId, parsed.data.id);

  if (!reservation || reservation.status !== SpaceReservationStatus.PENDING) {
    redirectWithMessage("/admin/reservas", {
      error: "Reserva inexistente ou ja analisada.",
    });
  }

  await prisma.$transaction(async (tx) => {
    const updated = await tx.spaceReservation.updateMany({
      where: {
        condominiumId,
        id: reservation.id,
        status: SpaceReservationStatus.PENDING,
      },
      data: {
        approvedAt: null,
        approvedById: admin.id,
        rejectionReason: parsed.data.rejectionReason,
        status: SpaceReservationStatus.REJECTED,
      },
    });

    if (updated.count === 0) {
      redirectWithMessage("/admin/reservas", {
        error: "Reserva inexistente ou ja analisada.",
      });
    }

    await tx.notification.create({
      data: {
        condominiumId,
        message: `Sua reserva para ${reservation.space.name} foi recusada. Motivo: ${parsed.data.rejectionReason}`,
        status: NotificationStatus.UNREAD,
        title: "Reserva recusada",
        type: NotificationType.SYSTEM,
        unitId: reservation.unit.id,
      },
    });

    await createAuditLog(
      {
        action: "REJECT",
        description: `Reserva para ${reservation.space.name} recusada.`,
        entityId: reservation.id,
        entityType: "SpaceReservation",
        module: "RESERVATION",
        user: admin,
      },
      tx,
    );
  });

  revalidateReservationSurfaces();
  redirectWithMessage("/admin/reservas", {
    success: "Reserva recusada com sucesso.",
  });
}

export async function cancelSpaceReservationByAdminAction(formData: FormData) {
  const { condominiumId, user: admin } = await requireCondominiumRole("ADMIN");
  const parsed = reservationIdSchema.safeParse(getStringValue(formData, "id"));

  if (!parsed.success) {
    redirectWithMessage("/admin/reservas", { error: "Reserva invalida." });
  }

  const reservation = await getAdminReservation(condominiumId, parsed.data);

  if (!reservation || reservation.status === SpaceReservationStatus.CANCELED) {
    redirectWithMessage("/admin/reservas", {
      error: "Reserva inexistente ou ja cancelada.",
    });
  }

  await prisma.$transaction(async (tx) => {
    const updated = await tx.spaceReservation.updateMany({
      where: {
        condominiumId,
        id: reservation.id,
        status: { not: SpaceReservationStatus.CANCELED },
      },
      data: {
        status: SpaceReservationStatus.CANCELED,
      },
    });

    if (updated.count === 0) {
      redirectWithMessage("/admin/reservas", {
        error: "Reserva inexistente ou ja cancelada.",
      });
    }

    await tx.notification.create({
      data: {
        condominiumId,
        message: `Sua reserva para ${reservation.space.name} foi cancelada pela administracao.`,
        status: NotificationStatus.UNREAD,
        title: "Reserva cancelada",
        type: NotificationType.SYSTEM,
        unitId: reservation.unit.id,
      },
    });

    await createAuditLog(
      {
        action: "CANCEL",
        description: `Reserva para ${reservation.space.name} cancelada pelo admin.`,
        entityId: reservation.id,
        entityType: "SpaceReservation",
        module: "RESERVATION",
        user: admin,
      },
      tx,
    );
  });

  revalidateReservationSurfaces();
  redirectWithMessage("/admin/reservas", {
    success: "Reserva cancelada com sucesso.",
  });
}

export async function cancelSpaceReservationByResidentAction(formData: FormData) {
  const resident = await requireResidentUnit();
  const parsed = reservationIdSchema.safeParse(getStringValue(formData, "id"));

  if (!parsed.success) {
    redirectWithMessage("/morador/reservas", { error: "Reserva invalida." });
  }

  const reservation = await prisma.spaceReservation.findFirst({
    where: {
      condominiumId: resident.condominiumId,
      id: parsed.data,
      unitId: resident.unitId,
    },
    include: {
      space: { select: { name: true } },
    },
  });

  if (!reservation || reservation.status !== SpaceReservationStatus.PENDING) {
    redirectWithMessage("/morador/reservas", {
      error: "Apenas solicitacoes pendentes podem ser canceladas pelo morador.",
    });
  }

  const updated = await prisma.spaceReservation.updateMany({
    where: {
      condominiumId: resident.condominiumId,
      id: reservation.id,
      status: SpaceReservationStatus.PENDING,
      unitId: resident.unitId,
    },
    data: { status: SpaceReservationStatus.CANCELED },
  });

  if (updated.count === 0) {
    redirectWithMessage("/morador/reservas", {
      error: "Apenas solicitacoes pendentes podem ser canceladas pelo morador.",
    });
  }

  await createAuditLog({
    action: "CANCEL",
    description: `Reserva para ${reservation.space.name} cancelada pelo morador.`,
    entityId: reservation.id,
    entityType: "SpaceReservation",
    module: "RESERVATION",
    user: resident,
  });

  revalidateReservationSurfaces();
  redirectWithMessage("/morador/reservas", {
    success: "Solicitacao cancelada com sucesso.",
  });
}
