-- CreateTable
CREATE TABLE "PRODUCT" (
    "id" SERIAL NOT NULL,
    "product_name" VARCHAR(100) NOT NULL,
    "product_image_url" TEXT,
    "product_ingredients" VARCHAR(255),
    "product_summary" TEXT,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PRODUCT_pkey" PRIMARY KEY ("id")
);

