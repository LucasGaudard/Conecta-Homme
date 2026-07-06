-- Add tenant columns in a backward-compatible way.
ALTER TABLE "Package" ADD COLUMN "condominiumId" TEXT;
ALTER TABLE "Notification" ADD COLUMN "condominiumId" TEXT;
ALTER TABLE "AuditLog" ADD COLUMN "condominiumId" TEXT;

-- Packages are always tied to a unit.
UPDATE "Package" p
SET "condominiumId" = u."condominiumId"
FROM "Unit" u
WHERE p."unitId" = u."id"
  AND p."condominiumId" IS NULL;

-- Notifications inherit from unit first, then user.
UPDATE "Notification" n
SET "condominiumId" = u."condominiumId"
FROM "Unit" u
WHERE n."unitId" = u."id"
  AND n."condominiumId" IS NULL;

UPDATE "Notification" n
SET "condominiumId" = usr."condominiumId"
FROM "User" usr
WHERE n."userId" = usr."id"
  AND usr."condominiumId" IS NOT NULL
  AND n."condominiumId" IS NULL;

-- Legacy tenant notifications without owner/unit are kept under the demo condominium.
UPDATE "Notification"
SET "condominiumId" = (
    SELECT "id"
    FROM "Condominium"
    WHERE "slug" = 'conecta-homme-demo'
    LIMIT 1
)
WHERE "condominiumId" IS NULL;

-- Audit logs inherit from the acting tenant user. SUPER_ADMIN/global logs remain null.
UPDATE "AuditLog" a
SET "condominiumId" = usr."condominiumId"
FROM "User" usr
WHERE a."userId" = usr."id"
  AND usr."condominiumId" IS NOT NULL
  AND a."condominiumId" IS NULL;

-- Legacy non-super-admin logs without a resolvable user are assigned to demo to preserve tenant audit visibility.
UPDATE "AuditLog"
SET "condominiumId" = (
    SELECT "id"
    FROM "Condominium"
    WHERE "slug" = 'conecta-homme-demo'
    LIMIT 1
)
WHERE "condominiumId" IS NULL
  AND "userRole" <> 'SUPER_ADMIN';

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "Package" WHERE "condominiumId" IS NULL) THEN
        RAISE EXCEPTION 'Unable to backfill Package.condominiumId.';
    END IF;

    IF EXISTS (SELECT 1 FROM "Notification" WHERE "condominiumId" IS NULL) THEN
        RAISE EXCEPTION 'Unable to backfill Notification.condominiumId.';
    END IF;
END $$;

ALTER TABLE "Package" ALTER COLUMN "condominiumId" SET NOT NULL;

CREATE INDEX "Package_condominiumId_idx" ON "Package"("condominiumId");
CREATE INDEX "Notification_condominiumId_idx" ON "Notification"("condominiumId");
CREATE INDEX "AuditLog_condominiumId_idx" ON "AuditLog"("condominiumId");

ALTER TABLE "Package" ADD CONSTRAINT "Package_condominiumId_fkey" FOREIGN KEY ("condominiumId") REFERENCES "Condominium"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_condominiumId_fkey" FOREIGN KEY ("condominiumId") REFERENCES "Condominium"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_condominiumId_fkey" FOREIGN KEY ("condominiumId") REFERENCES "Condominium"("id") ON DELETE SET NULL ON UPDATE CASCADE;
