-- Add optional shift/working-hours description for condominium porters.
-- Existing users and porters remain valid with NULL.
ALTER TABLE "User" ADD COLUMN "porterShiftDescription" TEXT;
