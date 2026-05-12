/*
  Warnings:

  - You are about to drop the column `phone` on the `user_addresses` table. All the data in the column will be lost.
  - Added the required column `phone_country_code` to the `user_addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone_number` to the `user_addresses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_addresses" DROP COLUMN "phone",
ADD COLUMN     "phone_country_code" TEXT NOT NULL,
ADD COLUMN     "phone_number" TEXT NOT NULL;
