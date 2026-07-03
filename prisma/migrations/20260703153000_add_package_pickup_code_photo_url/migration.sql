-- Add optional package pickup authentication code and photo URL.
ALTER TABLE "Package" ADD COLUMN "pickupCode" TEXT;
ALTER TABLE "Package" ADD COLUMN "photoUrl" TEXT;
