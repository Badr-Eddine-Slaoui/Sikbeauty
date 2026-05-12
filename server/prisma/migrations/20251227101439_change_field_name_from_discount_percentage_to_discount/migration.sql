/*
  Warnings:

  - The values [FIXED] on the enum `DiscountType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `discount_percentage` on the `products` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DiscountType_new" AS ENUM ('PRICE', 'PERCENT');
ALTER TABLE "products" ALTER COLUMN "Discount_type" TYPE "DiscountType_new" USING ("Discount_type"::text::"DiscountType_new");
ALTER TABLE "cart_items" ALTER COLUMN "Discount_type" TYPE "DiscountType_new" USING ("Discount_type"::text::"DiscountType_new");
ALTER TYPE "DiscountType" RENAME TO "DiscountType_old";
ALTER TYPE "DiscountType_new" RENAME TO "DiscountType";
DROP TYPE "DiscountType_old";
COMMIT;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "discount_percentage",
ADD COLUMN     "discount" INTEGER;
