-- Add nullable column first so existing rows can be safely backfilled.
ALTER TABLE "Unit" ADD COLUMN "condominiumId" TEXT;

-- Prefer the tenant already attached to a resident of the unit when available.
UPDATE "Unit" u
SET "condominiumId" = resident_units."condominiumId"
FROM (
    SELECT DISTINCT ON ("unitId")
        "unitId",
        "condominiumId"
    FROM "User"
    WHERE "unitId" IS NOT NULL
      AND "condominiumId" IS NOT NULL
      AND "role" = 'RESIDENT'
    ORDER BY "unitId", "createdAt" ASC
) resident_units
WHERE u."id" = resident_units."unitId"
  AND u."condominiumId" IS NULL;

-- Legacy units without a linked tenant user are assigned to the demo condominium.
UPDATE "Unit"
SET "condominiumId" = (
    SELECT "id"
    FROM "Condominium"
    WHERE "slug" = 'conecta-homme-demo'
    LIMIT 1
)
WHERE "condominiumId" IS NULL;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "Unit" WHERE "condominiumId" IS NULL) THEN
        RAISE EXCEPTION 'Unable to backfill Unit.condominiumId. Ensure condominium slug conecta-homme-demo exists before applying this migration.';
    END IF;
END $$;

ALTER TABLE "Unit" ALTER COLUMN "condominiumId" SET NOT NULL;

DROP INDEX "Unit_block_apartment_key";

CREATE UNIQUE INDEX "Unit_condominiumId_block_apartment_key" ON "Unit"("condominiumId", "block", "apartment");
CREATE INDEX "Unit_condominiumId_idx" ON "Unit"("condominiumId");

ALTER TABLE "Unit" ADD CONSTRAINT "Unit_condominiumId_fkey" FOREIGN KEY ("condominiumId") REFERENCES "Condominium"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
