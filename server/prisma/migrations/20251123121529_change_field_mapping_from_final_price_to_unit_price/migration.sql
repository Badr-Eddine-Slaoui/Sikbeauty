/*
  Warnings:

  - You are about to drop the column `final_price` on the `order_items` table. All the data in the column will be lost.
  - Added the required column `unit_price` to the `order_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "order_items" DROP COLUMN "final_price",
ADD COLUMN     "unit_price" DOUBLE PRECISION NOT NULL;
