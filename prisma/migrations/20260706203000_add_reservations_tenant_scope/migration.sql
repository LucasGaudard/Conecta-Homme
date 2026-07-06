-- Add nullable tenant columns first so existing leisure spaces and reservations can be backfilled.
ALTER TABLE "LeisureSpace" ADD COLUMN "condominiumId" TEXT;
ALTER TABLE "SpaceReservation" ADD COLUMN "condominiumId" TEXT;

-- Reservations inherit from their unit first.
UPDATE "SpaceReservation" sr
SET "condominiumId" = u."condominiumId"
FROM "Unit" u
WHERE sr."unitId" = u."id"
  AND sr."condominiumId" IS NULL;

-- Fallback for legacy reservation rows if a tenant user is still resolvable.
UPDATE "SpaceReservation" sr
SET "condominiumId" = requester."condominiumId"
FROM "User" requester
WHERE sr."requestedById" = requester."id"
  AND requester."condominiumId" IS NOT NULL
  AND sr."condominiumId" IS NULL;

-- Spaces inherit from related reservations when available.
UPDATE "LeisureSpace" ls
SET "condominiumId" = reservations."condominiumId"
FROM (
    SELECT DISTINCT ON ("spaceId")
        "spaceId",
        "condominiumId"
    FROM "SpaceReservation"
    WHERE "condominiumId" IS NOT NULL
    ORDER BY "spaceId", "createdAt" ASC
) reservations
WHERE ls."id" = reservations."spaceId"
  AND ls."condominiumId" IS NULL;

-- Legacy orphan spaces are assigned to the demo condominium to preserve data.
UPDATE "LeisureSpace"
SET "condominiumId" = (
    SELECT "id"
    FROM "Condominium"
    WHERE "slug" = 'conecta-homme-demo'
    LIMIT 1
)
WHERE "condominiumId" IS NULL;

-- Reservations that still have no tenant inherit from their now-backfilled space.
UPDATE "SpaceReservation" sr
SET "condominiumId" = ls."condominiumId"
FROM "LeisureSpace" ls
WHERE sr."spaceId" = ls."id"
  AND ls."condominiumId" IS NOT NULL
  AND sr."condominiumId" IS NULL;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "LeisureSpace" WHERE "condominiumId" IS NULL) THEN
        RAISE EXCEPTION 'Unable to backfill LeisureSpace.condominiumId.';
    END IF;

    IF EXISTS (SELECT 1 FROM "SpaceReservation" WHERE "condominiumId" IS NULL) THEN
        RAISE EXCEPTION 'Unable to backfill SpaceReservation.condominiumId.';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM "SpaceReservation" sr
        JOIN "LeisureSpace" ls ON ls."id" = sr."spaceId"
        WHERE sr."condominiumId" <> ls."condominiumId"
    ) THEN
        RAISE EXCEPTION 'SpaceReservation tenant does not match LeisureSpace tenant.';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM "SpaceReservation" sr
        JOIN "Unit" u ON u."id" = sr."unitId"
        WHERE sr."condominiumId" <> u."condominiumId"
    ) THEN
        RAISE EXCEPTION 'SpaceReservation tenant does not match Unit tenant.';
    END IF;
END $$;

ALTER TABLE "LeisureSpace" ALTER COLUMN "condominiumId" SET NOT NULL;
ALTER TABLE "SpaceReservation" ALTER COLUMN "condominiumId" SET NOT NULL;

CREATE INDEX "LeisureSpace_condominiumId_idx" ON "LeisureSpace"("condominiumId");
CREATE INDEX "SpaceReservation_condominiumId_idx" ON "SpaceReservation"("condominiumId");

ALTER TABLE "LeisureSpace" ADD CONSTRAINT "LeisureSpace_condominiumId_fkey" FOREIGN KEY ("condominiumId") REFERENCES "Condominium"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "SpaceReservation" ADD CONSTRAINT "SpaceReservation_condominiumId_fkey" FOREIGN KEY ("condominiumId") REFERENCES "Condominium"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Recreate the overlap guard with tenant included explicitly. The space id already scopes conflicts,
-- but condominiumId makes the isolation invariant visible to PostgreSQL.
ALTER TABLE "SpaceReservation" DROP CONSTRAINT "SpaceReservation_no_approved_overlap";

ALTER TABLE "SpaceReservation"
  ADD CONSTRAINT "SpaceReservation_no_approved_overlap"
  EXCLUDE USING gist (
    "condominiumId" WITH =,
    "spaceId" WITH =,
    tsrange("startAt", "endAt", '[)') WITH &&
  )
  WHERE ("status" = 'APPROVED');
