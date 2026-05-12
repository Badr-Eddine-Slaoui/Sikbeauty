/*
  Warnings:

  - You are about to drop the column `price_idividual` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `price_professional` on the `products` table. All the data in the column will be lost.
  - Added the required column `price` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "price_idividual",
DROP COLUMN "price_professional",
ADD COLUMN     "price" INTEGER NOT NULL;
