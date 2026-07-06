-- Add nullable tenant columns first so existing operational data can be backfilled safely.
ALTER TABLE "Visitor" ADD COLUMN "condominiumId" TEXT;
ALTER TABLE "VisitAuthorization" ADD COLUMN "condominiumId" TEXT;
ALTER TABLE "AccessLog" ADD COLUMN "condominiumId" TEXT;
ALTER TABLE "QRCodeToken" ADD COLUMN "condominiumId" TEXT;

-- Visit authorizations are always tied to a unit.
UPDATE "VisitAuthorization" va
SET "condominiumId" = u."condominiumId"
FROM "Unit" u
WHERE va."unitId" = u."id"
  AND va."condominiumId" IS NULL;

-- Access logs prefer the unit tenant, then visitor/user/porter tenant when the unit is absent.
UPDATE "AccessLog" al
SET "condominiumId" = u."condominiumId"
FROM "Unit" u
WHERE al."unitId" = u."id"
  AND al."condominiumId" IS NULL;

UPDATE "AccessLog" al
SET "condominiumId" = usr."condominiumId"
FROM "User" usr
WHERE al."userId" = usr."id"
  AND usr."condominiumId" IS NOT NULL
  AND al."condominiumId" IS NULL;

UPDATE "AccessLog" al
SET "condominiumId" = porter."condominiumId"
FROM "User" porter
WHERE al."porterId" = porter."id"
  AND porter."condominiumId" IS NOT NULL
  AND al."condominiumId" IS NULL;

-- Visitors inherit from their authorizations first, then access logs.
UPDATE "Visitor" v
SET "condominiumId" = va."condominiumId"
FROM (
    SELECT DISTINCT ON ("visitorId")
        "visitorId",
        "condominiumId"
    FROM "VisitAuthorization"
    WHERE "condominiumId" IS NOT NULL
    ORDER BY "visitorId", "createdAt" ASC
) va
WHERE v."id" = va."visitorId"
  AND v."condominiumId" IS NULL;

UPDATE "Visitor" v
SET "condominiumId" = al."condominiumId"
FROM (
    SELECT DISTINCT ON ("visitorId")
        "visitorId",
        "condominiumId"
    FROM "AccessLog"
    WHERE "visitorId" IS NOT NULL
      AND "condominiumId" IS NOT NULL
    ORDER BY "visitorId", "createdAt" ASC
) al
WHERE v."id" = al."visitorId"
  AND v."condominiumId" IS NULL;

-- QR codes inherit from unit, authorization, then visitor.
UPDATE "QRCodeToken" qr
SET "condominiumId" = u."condominiumId"
FROM "Unit" u
WHERE qr."unitId" = u."id"
  AND qr."condominiumId" IS NULL;

UPDATE "QRCodeToken" qr
SET "condominiumId" = va."condominiumId"
FROM "VisitAuthorization" va
WHERE qr."visitAuthorizationId" = va."id"
  AND va."condominiumId" IS NOT NULL
  AND qr."condominiumId" IS NULL;

UPDATE "QRCodeToken" qr
SET "condominiumId" = v."condominiumId"
FROM "Visitor" v
WHERE qr."visitorId" = v."id"
  AND v."condominiumId" IS NOT NULL
  AND qr."condominiumId" IS NULL;

-- Legacy orphan records fall back to the demo condominium to preserve data.
UPDATE "Visitor"
SET "condominiumId" = (
    SELECT "id"
    FROM "Condominium"
    WHERE "slug" = 'conecta-homme-demo'
    LIMIT 1
)
WHERE "condominiumId" IS NULL;

UPDATE "VisitAuthorization"
SET "condominiumId" = (
    SELECT "id"
    FROM "Condominium"
    WHERE "slug" = 'conecta-homme-demo'
    LIMIT 1
)
WHERE "condominiumId" IS NULL;

UPDATE "AccessLog"
SET "condominiumId" = (
    SELECT "id"
    FROM "Condominium"
    WHERE "slug" = 'conecta-homme-demo'
    LIMIT 1
)
WHERE "condominiumId" IS NULL;

UPDATE "QRCodeToken"
SET "condominiumId" = (
    SELECT "id"
    FROM "Condominium"
    WHERE "slug" = 'conecta-homme-demo'
    LIMIT 1
)
WHERE "condominiumId" IS NULL;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "Visitor" WHERE "condominiumId" IS NULL) THEN
        RAISE EXCEPTION 'Unable to backfill Visitor.condominiumId.';
    END IF;

    IF EXISTS (SELECT 1 FROM "VisitAuthorization" WHERE "condominiumId" IS NULL) THEN
        RAISE EXCEPTION 'Unable to backfill VisitAuthorization.condominiumId.';
    END IF;

    IF EXISTS (SELECT 1 FROM "AccessLog" WHERE "condominiumId" IS NULL) THEN
        RAISE EXCEPTION 'Unable to backfill AccessLog.condominiumId.';
    END IF;

    IF EXISTS (SELECT 1 FROM "QRCodeToken" WHERE "condominiumId" IS NULL) THEN
        RAISE EXCEPTION 'Unable to backfill QRCodeToken.condominiumId.';
    END IF;
END $$;

ALTER TABLE "Visitor" ALTER COLUMN "condominiumId" SET NOT NULL;
ALTER TABLE "VisitAuthorization" ALTER COLUMN "condominiumId" SET NOT NULL;
ALTER TABLE "AccessLog" ALTER COLUMN "condominiumId" SET NOT NULL;
ALTER TABLE "QRCodeToken" ALTER COLUMN "condominiumId" SET NOT NULL;

CREATE INDEX "Visitor_condominiumId_idx" ON "Visitor"("condominiumId");
CREATE INDEX "VisitAuthorization_condominiumId_idx" ON "VisitAuthorization"("condominiumId");
CREATE INDEX "AccessLog_condominiumId_idx" ON "AccessLog"("condominiumId");
CREATE INDEX "QRCodeToken_condominiumId_idx" ON "QRCodeToken"("condominiumId");

ALTER TABLE "Visitor" ADD CONSTRAINT "Visitor_condominiumId_fkey" FOREIGN KEY ("condominiumId") REFERENCES "Condominium"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "VisitAuthorization" ADD CONSTRAINT "VisitAuthorization_condominiumId_fkey" FOREIGN KEY ("condominiumId") REFERENCES "Condominium"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "AccessLog" ADD CONSTRAINT "AccessLog_condominiumId_fkey" FOREIGN KEY ("condominiumId") REFERENCES "Condominium"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "QRCodeToken" ADD CONSTRAINT "QRCodeToken_condominiumId_fkey" FOREIGN KEY ("condominiumId") REFERENCES "Condominium"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
