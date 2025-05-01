/*
  Warnings:

  - You are about to alter the column `name` on the `Car` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `price` on the `Car` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(12,4)`.
  - You are about to alter the column `description` on the `Car` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(300)`.
  - You are about to alter the column `color` on the `Car` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(30)`.
  - You are about to alter the column `model` on the `Car` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(30)`.
  - You are about to alter the column `year` on the `Car` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `SmallInt`.
  - You are about to alter the column `totalValue` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(12,4)`.
  - You are about to drop the column `address` on the `User` table. All the data in the column will be lost.
  - You are about to alter the column `email` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(254)`.
  - You are about to alter the column `password` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `cpf` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(15)`.
  - You are about to alter the column `firstName` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `lastName` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `cnpj` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(18)`.
  - Added the required column `methodPayment` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `neighborhood` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numberAddress` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zipCode` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('CREATED', 'CANCELED', 'FINISHED');

-- AlterTable
ALTER TABLE "Car" ALTER COLUMN "name" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "price" SET DATA TYPE DECIMAL(12,4),
ALTER COLUMN "description" SET DATA TYPE VARCHAR(300),
ALTER COLUMN "color" SET DATA TYPE VARCHAR(30),
ALTER COLUMN "model" SET DATA TYPE VARCHAR(30),
ALTER COLUMN "year" SET DATA TYPE SMALLINT;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "methodPayment" VARCHAR(30) NOT NULL,
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'CREATED',
ALTER COLUMN "totalValue" SET DATA TYPE DECIMAL(12,4);

-- AlterTable
ALTER TABLE "User" DROP COLUMN "address",
ADD COLUMN     "city" VARCHAR(50) NOT NULL,
ADD COLUMN     "complement" VARCHAR(50),
ADD COLUMN     "country" VARCHAR(50) NOT NULL,
ADD COLUMN     "neighborhood" VARCHAR(50) NOT NULL,
ADD COLUMN     "numberAddress" VARCHAR(10) NOT NULL,
ADD COLUMN     "phone" VARCHAR(15) NOT NULL,
ADD COLUMN     "state" VARCHAR(50) NOT NULL,
ADD COLUMN     "street" VARCHAR(100) NOT NULL,
ADD COLUMN     "zipCode" VARCHAR(9) NOT NULL,
ALTER COLUMN "email" SET DATA TYPE VARCHAR(254),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "cpf" SET DATA TYPE VARCHAR(15),
ALTER COLUMN "firstName" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "lastName" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "cnpj" SET DATA TYPE VARCHAR(18);
