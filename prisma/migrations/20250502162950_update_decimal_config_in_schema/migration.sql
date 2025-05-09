/*
  Warnings:

  - You are about to alter the column `price` on the `Car` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,4)` to `Decimal(12,2)`.
  - You are about to alter the column `totalValue` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,4)` to `Decimal(12,2)`.

*/
-- AlterTable
ALTER TABLE "Car" ALTER COLUMN "price" SET DATA TYPE DECIMAL(12,2);

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "totalValue" SET DATA TYPE DECIMAL(12,2);
