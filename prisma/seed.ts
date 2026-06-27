import { createHash } from "node:crypto";
import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

function passwordHash(password: string) {
  return createHash("sha256").update(password).digest("hex");
}

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: "admin@conectahomme.com" },
    update: {},
    create: {
      name: "Administrador Conecta Homme",
      email: "admin@conectahomme.com",
      passwordHash: passwordHash("admin123"),
      role: UserRole.ADMIN,
    },
  });

  const porter = await prisma.user.upsert({
    where: { email: "portaria@conectahomme.com" },
    update: {},
    create: {
      name: "Portaria Conecta Homme",
      email: "portaria@conectahomme.com",
      passwordHash: passwordHash("portaria123"),
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
    },
    create: {
      name: "Morador A201",
      email: "morador@conectahomme.com",
      username: "a201",
      passwordHash: passwordHash("morador123"),
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
