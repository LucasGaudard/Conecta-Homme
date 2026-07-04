-- CreateEnum
CREATE TYPE "LeisureSpaceStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "SpaceReservationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELED');

-- CreateTable
CREATE TABLE "LeisureSpace" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "capacity" INTEGER,
    "rules" TEXT,
    "status" "LeisureSpaceStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeisureSpace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpaceReservation" (
    "id" TEXT NOT NULL,
    "spaceId" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "requestedById" TEXT NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "status" "SpaceReservationStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "rejectionReason" TEXT,
    "approvedById" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SpaceReservation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LeisureSpace_status_idx" ON "LeisureSpace"("status");

-- CreateIndex
CREATE INDEX "LeisureSpace_name_idx" ON "LeisureSpace"("name");

-- CreateIndex
CREATE INDEX "SpaceReservation_spaceId_idx" ON "SpaceReservation"("spaceId");

-- CreateIndex
CREATE INDEX "SpaceReservation_unitId_idx" ON "SpaceReservation"("unitId");

-- CreateIndex
CREATE INDEX "SpaceReservation_requestedById_idx" ON "SpaceReservation"("requestedById");

-- CreateIndex
CREATE INDEX "SpaceReservation_approvedById_idx" ON "SpaceReservation"("approvedById");

-- CreateIndex
CREATE INDEX "SpaceReservation_status_idx" ON "SpaceReservation"("status");

-- CreateIndex
CREATE INDEX "SpaceReservation_startAt_idx" ON "SpaceReservation"("startAt");

-- CreateIndex
CREATE INDEX "SpaceReservation_endAt_idx" ON "SpaceReservation"("endAt");

-- EnableExtension
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- AddConstraint
ALTER TABLE "SpaceReservation"
  ADD CONSTRAINT "SpaceReservation_no_approved_overlap"
  EXCLUDE USING gist (
    "spaceId" WITH =,
    tsrange("startAt", "endAt", '[)') WITH &&
  )
  WHERE ("status" = 'APPROVED');

-- AddForeignKey
ALTER TABLE "SpaceReservation" ADD CONSTRAINT "SpaceReservation_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "LeisureSpace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpaceReservation" ADD CONSTRAINT "SpaceReservation_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpaceReservation" ADD CONSTRAINT "SpaceReservation_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpaceReservation" ADD CONSTRAINT "SpaceReservation_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
