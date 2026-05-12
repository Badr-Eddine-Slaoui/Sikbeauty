/*
  Warnings:

  - The values [Professional] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `currency` on the `carts` table. All the data in the column will be lost.
  - You are about to drop the column `exchange_rate` on the `carts` table. All the data in the column will be lost.
  - You are about to drop the column `company_name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `job_title` on the `users` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('admin', 'Individual');
ALTER TABLE "users" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
COMMIT;

-- AlterTable
ALTER TABLE "carts" DROP COLUMN "currency",
DROP COLUMN "exchange_rate";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "company_name",
DROP COLUMN "country",
DROP COLUMN "job_title";

-- DropEnum
DROP TYPE "Currency";
