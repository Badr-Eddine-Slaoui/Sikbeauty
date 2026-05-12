/*
  Warnings:

  - You are about to drop the column `Discount_type` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "Discount_type",
ADD COLUMN     "discount_type" "DiscountType";
