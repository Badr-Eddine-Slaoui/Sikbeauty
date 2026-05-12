/*
  Warnings:

  - You are about to alter the column `totalPrice` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `price_idividual` on the `products` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `price_professional` on the `products` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - Added the required column `exchange_rate` to the `carts` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('USD', 'MAD', 'EUR');

-- AlterTable
ALTER TABLE "carts" ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'USD',
ADD COLUMN     "exchange_rate" DECIMAL(65,30) NOT NULL;

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "totalPrice" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "price_idividual" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "price_professional" SET DATA TYPE DECIMAL(65,30);
