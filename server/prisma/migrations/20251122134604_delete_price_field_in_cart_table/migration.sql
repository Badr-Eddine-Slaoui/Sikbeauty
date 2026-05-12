/*
  Warnings:

  - You are about to drop the column `discount` on the `cart_items` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `cart_items` table. All the data in the column will be lost.
  - You are about to drop the column `unit_price` on the `cart_items` table. All the data in the column will be lost.
  - You are about to drop the `order_items` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `order_id` to the `cart_items` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_order_id_fkey";

-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_product_id_fkey";

-- AlterTable
ALTER TABLE "cart_items" DROP COLUMN "discount",
DROP COLUMN "price",
DROP COLUMN "unit_price",
ADD COLUMN     "order_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "order_items";

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
