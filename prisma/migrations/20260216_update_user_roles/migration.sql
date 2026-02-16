-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('OBRERO', 'TRABAJADOR', 'EMPLEADO', 'ADMIN');

-- Step 1: Add temporary column with new enum type
ALTER TABLE "users" ADD COLUMN "rol_new" "UserRole";

-- Step 2: Migrate existing data to new enum values
-- Map 'empleado' -> EMPLEADO
UPDATE "users" SET "rol_new" = 'EMPLEADO' WHERE LOWER("rol") = 'empleado';

-- Map 'admin', 'gestor', 'administrativo' -> ADMIN
UPDATE "users" SET "rol_new" = 'ADMIN' 
WHERE LOWER("rol") IN ('admin', 'gestor', 'administrativo');

-- Map 'trabajador' -> TRABAJADOR
UPDATE "users" SET "rol_new" = 'TRABAJADOR' WHERE LOWER("rol") = 'trabajador';

-- Map 'obrero' -> OBRERO
UPDATE "users" SET "rol_new" = 'OBRERO' WHERE LOWER("rol") = 'obrero';

-- Map any remaining NULL or unrecognized values to OBRERO (new default)
UPDATE "users" SET "rol_new" = 'OBRERO' WHERE "rol_new" IS NULL;

-- Step 3: Drop old column
ALTER TABLE "users" DROP COLUMN "rol";

-- Step 4: Rename new column to original name
ALTER TABLE "users" RENAME COLUMN "rol_new" TO "rol";

-- Step 5: Set NOT NULL constraint and default value
ALTER TABLE "users" ALTER COLUMN "rol" SET NOT NULL;
ALTER TABLE "users" ALTER COLUMN "rol" SET DEFAULT 'OBRERO';
