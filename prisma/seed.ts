import { PrismaClient, UserRole } from "@prisma/client";
import { hashPassword } from "../lib/auth/password";

const prisma = new PrismaClient();

async function main() {
  const adminPasswordHash = await hashPassword("admin123");
  const porterPasswordHash = await hashPassword("portaria123");
  const residentPasswordHash = await hashPassword("morador123");

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
      passwordHash: adminPasswordHash,
    },
    create: {
      name: "Administrador Conecta Homme",
      email: "admin@conectahomme.com",
      passwordHash: adminPasswordHash,
      role: UserRole.ADMIN,
    },
  });

  const porter = await prisma.user.upsert({
    where: { email: "portaria@conectahomme.com" },
    update: {
      passwordHash: porterPasswordHash,
    },
    create: {
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
      unitId: unit.id,
      passwordHash: residentPasswordHash,
      username: "a201",
    },
    create: {
      name: "Morador A201",
      email: "morador@conectahomme.com",
      username: "a201",
      passwordHash: residentPasswordHash,
      role: UserRole.RESIDENT,
      unitId: unit.id,
    },
  });

  console.info({
    admin: admin.email,
    porter: porter.email,
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
