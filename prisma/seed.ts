import { PrismaClient, UserRole } from "@prisma/client";
import { hashPassword } from "../lib/auth/password";

const prisma = new PrismaClient();

async function main() {
  const superAdminPasswordHash = await hashPassword("superadmin123");
  const adminPasswordHash = await hashPassword("admin123");
  const porterPasswordHash = await hashPassword("portaria123");
  const residentPasswordHash = await hashPassword("morador123");

  const condominium = await prisma.condominium.upsert({
    where: { slug: "conecta-homme-demo" },
    update: {
      name: "Conecta Homme Demo",
      porterHours: "24 horas",
      status: "ACTIVE",
    },
    create: {
      name: "Conecta Homme Demo",
      slug: "conecta-homme-demo",
      porterHours: "24 horas",
      status: "ACTIVE",
    },
  });

  await prisma.condominiumSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      name: "Conecta Homme",
      porterHours: "24 horas",
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: "admin@conectahomme.com" },
    update: {
      condominiumId: condominium.id,
      passwordHash: adminPasswordHash,
    },
    create: {
      condominiumId: condominium.id,
      name: "Administrador Conecta Homme",
      email: "admin@conectahomme.com",
      passwordHash: adminPasswordHash,
      role: UserRole.ADMIN,
    },
  });

  const porter = await prisma.user.upsert({
    where: { email: "portaria@conectahomme.com" },
    update: {
      condominiumId: condominium.id,
      passwordHash: porterPasswordHash,
    },
    create: {
      condominiumId: condominium.id,
      name: "Portaria Conecta Homme",
      email: "portaria@conectahomme.com",
      passwordHash: porterPasswordHash,
      role: UserRole.PORTER,
    },
  });

  const unit = await prisma.unit.upsert({
    where: {
      block_apartment: {
        block: "A",
        apartment: "201",
      },
    },
    update: {},
    create: {
      block: "A",
      apartment: "201",
      responsibleName: "Morador A201",
      email: "morador@conectahomme.com",
    },
  });

  const resident = await prisma.user.upsert({
    where: { email: "morador@conectahomme.com" },
    update: {
      condominiumId: condominium.id,
      unitId: unit.id,
      passwordHash: residentPasswordHash,
      username: "a201",
    },
    create: {
      condominiumId: condominium.id,
      name: "Morador A201",
      email: "morador@conectahomme.com",
      username: "a201",
      passwordHash: residentPasswordHash,
      role: UserRole.RESIDENT,
      unitId: unit.id,
    },
  });

  const superAdmin = await prisma.user.upsert({
    where: { email: "superadmin@conectahomme.com" },
    update: {
      condominiumId: null,
      passwordHash: superAdminPasswordHash,
      role: UserRole.SUPER_ADMIN,
    },
    create: {
      name: "Super Admin Conecta Homme",
      email: "superadmin@conectahomme.com",
      passwordHash: superAdminPasswordHash,
      role: UserRole.SUPER_ADMIN,
    },
  });

  console.info({
    admin: admin.email,
    condominium: condominium.slug,
    porter: porter.email,
    superAdmin: superAdmin.email,
    unit: `${unit.block}-${unit.apartment}`,
    resident: resident.email,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
