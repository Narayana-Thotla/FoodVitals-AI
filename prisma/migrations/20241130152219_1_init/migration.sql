/*
  Warnings:

  - You are about to drop the `PRODUCT` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "PRODUCT";

-- CreateTable
CREATE TABLE "product" (
    "id" SERIAL NOT NULL,
    "product_name" VARCHAR(100) NOT NULL,
    "product_image_url" TEXT,
    "product_ingredients" VARCHAR(255),
    "product_summary" TEXT,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);
