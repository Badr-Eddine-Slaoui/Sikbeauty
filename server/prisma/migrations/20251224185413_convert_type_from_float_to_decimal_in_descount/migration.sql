/*
  Warnings:

  - You are about to alter the column `discount_percentage` on the `products` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.

*/
-- AlterTable
ALTER TABLE "carts" ALTER COLUMN "currency" SET DEFAULT 'MAD',
ALTER COLUMN "exchange_rate" SET DEFAULT 11;

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "discount_percentage" SET DATA TYPE DECIMAL(65,30);
