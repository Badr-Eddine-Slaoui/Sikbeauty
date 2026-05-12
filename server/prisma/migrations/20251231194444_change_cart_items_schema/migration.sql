/*
  Warnings:

  - You are about to drop the column `Discount_type` on the `cart_items` table. All the data in the column will be lost.
  - You are about to drop the column `discount` on the `cart_items` table. All the data in the column will be lost.
  - You are about to drop the column `unit_price` on the `cart_items` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "cart_items" DROP COLUMN "Discount_type",
DROP COLUMN "discount",
DROP COLUMN "unit_price";
