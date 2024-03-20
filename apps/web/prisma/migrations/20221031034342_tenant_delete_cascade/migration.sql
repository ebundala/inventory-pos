/*
  Warnings:

  - Made the column `productId` on table `ProductVariant` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ProductVariant" ALTER COLUMN "productId" SET NOT NULL;
