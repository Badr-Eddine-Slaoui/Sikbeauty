/*
  Warnings:

  - You are about to drop the column `discount_threshold` on the `products` table. All the data in the column will be lost.
  - You are about to alter the column `discount_percentage` on the `products` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - Added the required column `unit_price` to the `cart_items` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('FIXED', 'PERCENT');

-- AlterTable
ALTER TABLE "cart_items" ADD COLUMN     "Discount_type" "DiscountType",
ADD COLUMN     "discount" INTEGER,
ADD COLUMN     "unit_price" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "carts" ALTER COLUMN "currency" SET DEFAULT 'USD',
ALTER COLUMN "exchange_rate" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "discount_threshold",
ADD COLUMN     "Discount_type" "DiscountType",
ALTER COLUMN "discount_percentage" SET DATA TYPE INTEGER;
