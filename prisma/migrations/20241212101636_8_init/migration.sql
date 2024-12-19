-- CreateTable
CREATE TABLE "usersubscription" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "stripe_customer_id" TEXT,
    "stripe_subscription_id" TEXT,
    "stripe_price_id" TEXT,
    "stripe_current_period_end" TIMESTAMP(3),

    CONSTRAINT "usersubscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usersubscription_email_key" ON "usersubscription"("email");

-- CreateIndex
CREATE UNIQUE INDEX "usersubscription_stripe_customer_id_key" ON "usersubscription"("stripe_customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "usersubscription_stripe_subscription_id_key" ON "usersubscription"("stripe_subscription_id");
