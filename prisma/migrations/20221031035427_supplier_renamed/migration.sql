/*
  Warnings:

  - You are about to drop the column `providerId` on the `Purchase` table. All the data in the column will be lost.
  - You are about to drop the column `providerId` on the `PurchaseReturn` table. All the data in the column will be lost.
  - You are about to drop the `Provider` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `supplierId` to the `Purchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `supplierId` to the `PurchaseReturn` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Purchase_providerId_idx";

-- DropIndex
DROP INDEX "PurchaseReturn_providerId_idx";

-- AlterTable
ALTER TABLE "Purchase" DROP COLUMN "providerId",
ADD COLUMN     "supplierId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "PurchaseReturn" DROP COLUMN "providerId",
ADD COLUMN     "supplierId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Provider";

-- CreateTable
CREATE TABLE "Supplier" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" INTEGER NOT NULL,
    "email" VARCHAR(192) NOT NULL,
    "phone" TEXT,
    "country" TEXT,
    "city" TEXT,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "recordStatus" "RecordStatus" NOT NULL DEFAULT E'ACTIVE',
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Supplier_tenantId_idx" ON "Supplier"("tenantId");

-- CreateIndex
CREATE INDEX "Purchase_supplierId_idx" ON "Purchase"("supplierId");

-- CreateIndex
CREATE INDEX "PurchaseReturn_supplierId_idx" ON "PurchaseReturn"("supplierId");
