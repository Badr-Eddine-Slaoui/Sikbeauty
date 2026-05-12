/*
  Warnings:

  - A unique constraint covering the columns `[stripe_session_id]` on the table `payment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "payment_stripe_session_id_key" ON "payment"("stripe_session_id");
