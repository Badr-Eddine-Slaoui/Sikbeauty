/*
  Warnings:

  - You are about to drop the column `providerPaymentId` on the `payment` table. All the data in the column will be lost.
  - Added the required column `amount` to the `payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stripe_session_id` to the `payment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('USD', 'MAD', 'EUR');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "PaymentStatus" ADD VALUE 'EXPIRED';
ALTER TYPE "PaymentStatus" ADD VALUE 'REFUNDED';

-- AlterTable
ALTER TABLE "payment" DROP COLUMN "providerPaymentId",
ADD COLUMN     "amount" INTEGER NOT NULL,
ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'EUR',
ADD COLUMN     "stripe_charge_id" TEXT,
ADD COLUMN     "stripe_payment_intent_id" TEXT,
ADD COLUMN     "stripe_session_id" TEXT NOT NULL,
ALTER COLUMN "provider" SET DEFAULT 'STRIPE';
