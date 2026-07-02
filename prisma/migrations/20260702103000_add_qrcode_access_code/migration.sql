ALTER TABLE "QRCodeToken" ADD COLUMN "accessCode" TEXT;

WITH safe_chars AS (
  SELECT 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'::text AS chars
),
generated AS (
  SELECT
    id,
    (
      CASE WHEN "type" = 'RESIDENT' THEN 'MR-' ELSE 'VT-' END ||
      substr(chars, (get_byte(decode(md5(id || 'a'), 'hex'), 0) % length(chars)) + 1, 1) ||
      substr(chars, (get_byte(decode(md5(id || 'b'), 'hex'), 0) % length(chars)) + 1, 1) ||
      substr(chars, (get_byte(decode(md5(id || 'c'), 'hex'), 0) % length(chars)) + 1, 1) ||
      substr(chars, (get_byte(decode(md5(id || 'd'), 'hex'), 0) % length(chars)) + 1, 1) ||
      substr(chars, (get_byte(decode(md5(id || 'e'), 'hex'), 0) % length(chars)) + 1, 1)
    ) AS code
  FROM "QRCodeToken", safe_chars
)
UPDATE "QRCodeToken"
SET "accessCode" = generated.code
FROM generated
WHERE "QRCodeToken"."id" = generated.id;

ALTER TABLE "QRCodeToken" ALTER COLUMN "accessCode" SET NOT NULL;

CREATE UNIQUE INDEX "QRCodeToken_accessCode_key" ON "QRCodeToken"("accessCode");
CREATE INDEX "QRCodeToken_accessCode_idx" ON "QRCodeToken"("accessCode");
