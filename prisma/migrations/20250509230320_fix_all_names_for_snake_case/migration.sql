/*
  Warnings:

  - You are about to drop the column `firstName` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `numberAddress` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `zipCode` on the `user` table. All the data in the column will be lost.
  - Added the required column `first_name` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number_address` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zip_code` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "numberAddress",
DROP COLUMN "zipCode",
ADD COLUMN     "first_name" VARCHAR(50) NOT NULL,
ADD COLUMN     "last_name" VARCHAR(50) NOT NULL,
ADD COLUMN     "number_address" VARCHAR(10) NOT NULL,
ADD COLUMN     "zip_code" VARCHAR(9) NOT NULL;
