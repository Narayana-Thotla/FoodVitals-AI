/*
  Warnings:

  - The primary key for the `healthprofile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `healthprofile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[user_id]` on the table `healthprofile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `healthprofile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "healthprofile" DROP CONSTRAINT "healthprofile_pkey",
ADD COLUMN     "user_id" INTEGER NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "healthprofile_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "product" ADD COLUMN     "user_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "useraddedlist" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "product_code" VARCHAR(100) NOT NULL,
    "product_name" VARCHAR(100) NOT NULL,
    "product_image_url" TEXT,
    "product_ingredients" TEXT,
    "product_summary" TEXT,

    CONSTRAINT "useraddedlist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "useraddedlist_product_code_key" ON "useraddedlist"("product_code");

-- CreateIndex
CREATE UNIQUE INDEX "healthprofile_user_id_key" ON "healthprofile"("user_id");

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "useraddedlist" ADD CONSTRAINT "useraddedlist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "healthprofile" ADD CONSTRAINT "healthprofile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
