/*
  Warnings:

  - You are about to drop the column `method_payment` on the `order` table. All the data in the column will be lost.
  - Added the required column `payment_method` to the `order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "order" DROP COLUMN "method_payment",
ADD COLUMN     "payment_method" VARCHAR(30) NOT NULL;
