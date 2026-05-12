/*
  Warnings:

  - A unique constraint covering the columns `[stripe_payment_intent_id]` on the table `payment` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "payment_stripe_session_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "payment_stripe_payment_intent_id_key" ON "payment"("stripe_payment_intent_id");
