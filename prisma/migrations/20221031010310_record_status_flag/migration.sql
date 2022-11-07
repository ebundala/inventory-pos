/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `Adjustment` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Brand` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Currency` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Department` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Designation` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `EmployeeAccount` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `EmployeeExperience` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Expense` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `ExpenseCategory` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Holiday` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Leave` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `OfficeShift` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `PaymentPurchase` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `PaymentPurchaseReturn` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `PaymentSale` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `PaymentSaleReturn` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `PosSetting` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `ProductVariant` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `ProductWarehouse` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Provider` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Purchase` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `PurchaseReturn` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `PurchaseReturnDetail` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Quotation` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Sale` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `SaleReturn` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Setting` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Shipment` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Transfer` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Unit` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Warehouse` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `leaveType` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Adjustment" DROP COLUMN "deletedAt",
ADD COLUMN     "recordStatus" "RecordStatus" NOT NULL DEFAULT E'ACTIVE';

-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "deletedAt",
ADD COLUMN     "recordStatus" "RecordStatus" NOT NULL DEFAULT E'ACTIVE';

-- AlterTable
ALTER TABLE "Brand" DROP COLUMN "deletedAt",
ADD COLUMN     "recordStatus" "RecordStatus" NOT NULL DEFAULT E'ACTIVE';

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "deletedAt",
ADD COLUMN     "recordStatus" "RecordStatus" NOT NULL DEFAULT E'ACTIVE';

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "deletedAt",
ADD COLUMN     "recordStatus" "RecordStatus" NOT NULL DEFAULT E'ACTIVE';

-- AlterTable
ALTER TABLE "Currency" DROP COLUMN "deletedAt",
ADD COLUMN     "recordStatus" "RecordStatus" NOT NULL DEFAULT E'ACTIVE';

-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "deletedAt",
ADD COLUMN     "recordStatus" "RecordStatus" NOT NULL DEFAULT E'ACTIVE';

-- AlterTable
ALTER TABLE "Department" DROP COLUMN "deletedAt",
ADD COLUMN     "recordStatus" "RecordStatus" NOT NULL DEFAULT E'ACTIVE';

-- AlterTable
ALTER TABLE "Designation" DROP COLUMN "deletedAt",
ADD COLUMN     "recordStatus" "RecordStatus" NOT NULL DEFAULT E'ACTIVE';

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "deletedAt",
ADD COLUMN     "recordStatus" "RecordStatus" NOT NULL DEFAULT E'ACTIVE';

-- AlterTable
ALTER TABLE "EmployeeAccount" DROP COLUMN "deletedAt",
ADD COLUMN     "recordStatus" "RecordStatus" NOT NULL DEFAULT E'ACTIVE';

-- AlterTable
ALTER TABLE "EmployeeExperience" DROP COLUMN "deletedAt",
ADD COLUMN     "recordStatus" "RecordStatus" NOT NULL DEFAULT E'ACTIVE';

-- AlterTable
ALTER TABLE "Expense" DROP COLUMN "deletedAt",
ADD COLUMN     "recordStatus" "RecordStatus" NOT NULL DEFAULT E'ACTIVE';

-- AlterTable
ALTER TABLE "ExpenseCategory" DROP COLUMN "deletedAt",
ADD COLUMN     "recordStatus" "RecordStatus" NOT NULL DEFAULT E'ACTIVE';

-- AlterTable
ALTER TABLE "Holiday" DROP COLUMN "deletedAt",
ADD COLUMN     "recordStatus" "RecordStatus" NOT NULL DEFAULT E'ACTIVE';

-- AlterTable
ALTER TABLE "Leave" DROP COLUMN "deletedAt",
ADD COLUMN     "recordStatus" "RecordStatus" NOT NULL DEFAULT E'ACTIVE';

-- AlterTable
ALTER TABLE "OfficeShift" DROP COLUMN "deletedAt",
ADD COLUMN     "recordStatus" "RecordStatus" NOT NULL DEFAULT E'ACTIVE';

-- AlterTable
ALTER TABLE "PaymentPurchase" DROP COLUMN "deletedAt",
ADD COLUMN     "recordStatus" "RecordStatus" NOT NULL DEFAULT E'ACTIVE';

-- AlterTable
ALTER TABLE "PaymentPurchaseReturn" DROP COLUMN "deletedAt",
ADD COLUMN     "recordStatus" "RecordStatus" NOT NULL DEFAULT E'ACTIVE';

-- AlterTable
ALTER TABLE "PaymentSale" DROP COLUMN "deletedAt",
ADD COLUMN     "recordStatus" "RecordStatus" NOT NULL DEFAULT E'ACTIVE';

-- AlterTable
ALTER TABLE "PaymentSaleReturn" DROP COLUMN "deletedAt",
ADD COLUMN     "recordStatus" "RecordStatus" NOT NULL DEFAULT E'ACTIVE';

-- AlterTable
ALTER TABLE "PosSetting" DROP COLUMN "deletedAt",
ADD COLUMN     "recordStatus" "RecordStatus" NOT NULL DEFAULT E'ACTIVE';

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "deletedAt",
ADD COLUMN     "recordStatus" "RecordStatus" NOT NULL DEFAULT E'ACTIVE';

-- AlterTable
ALTER TABLE "ProductVariant" DROP COLUMN "deletedAt",
ADD COLUMN     "recordStatus" "RecordStatus" NOT NULL DEFAULT E'ACTIVE';

-- AlterTable
ALTER TABLE "ProductWarehouse" DROP COLUMN "deletedAt",
ADD COLUMN     "recordStatus" "RecordStatus" NOT NULL DEFAULT E'ACTIVE';

-- AlterTable
ALTER TABLE "Provider" DROP COLUMN "deletedAt",
ADD COLUMN     "recordStatus" "RecordStatus" NOT NULL DEFAULT E'ACTIVE';

-- AlterTable
ALTER TABLE "Purchase" DROP COLUMN "deletedAt",
ADD COLUMN     "recordStatus" "RecordStatus" NOT NULL DEFAULT E'ACTIVE';

-- AlterTable
ALTER TABLE "PurchaseReturn" DROP COLUMN "deletedAt",
ADD COLUMN     "recordStatus" "RecordStatus" NOT NULL DEFAULT E'ACTIVE';

-- AlterTable
ALTER TABLE "PurchaseReturnDetail" DROP COLUMN "deletedAt",
ADD COLUMN     "recordStatus" "RecordStatus" NOT NULL DEFAULT E'ACTIVE';

-- AlterTable
ALTER TABLE "Quotation" DROP COLUMN "deletedAt",
ADD COLUMN     "recordStatus" "RecordStatus" NOT NULL DEFAULT E'ACTIVE';

-- AlterTable
ALTER TABLE "Sale" DROP COLUMN "deletedAt",
ADD COLUMN     "recordStatus" "RecordStatus" NOT NULL DEFAULT E'ACTIVE';

-- AlterTable
ALTER TABLE "SaleReturn" DROP COLUMN "deletedAt",
ADD COLUMN     "recordStatus" "RecordStatus" NOT NULL DEFAULT E'ACTIVE';

-- AlterTable
ALTER TABLE "Setting" DROP COLUMN "deletedAt",
ADD COLUMN     "recordStatus" "RecordStatus" NOT NULL DEFAULT E'ACTIVE';

-- AlterTable
ALTER TABLE "Shipment" DROP COLUMN "deletedAt",
ADD COLUMN     "recordStatus" "RecordStatus" NOT NULL DEFAULT E'ACTIVE';

-- AlterTable
ALTER TABLE "Transfer" DROP COLUMN "deletedAt",
ADD COLUMN     "recordStatus" "RecordStatus" NOT NULL DEFAULT E'ACTIVE';

-- AlterTable
ALTER TABLE "Unit" DROP COLUMN "deletedAt",
ADD COLUMN     "recordStatus" "RecordStatus" NOT NULL DEFAULT E'ACTIVE';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "deletedAt",
ADD COLUMN     "recordStatus" "RecordStatus" NOT NULL DEFAULT E'ACTIVE';

-- AlterTable
ALTER TABLE "Warehouse" DROP COLUMN "deletedAt",
ADD COLUMN     "recordStatus" "RecordStatus" NOT NULL DEFAULT E'ACTIVE';

-- AlterTable
ALTER TABLE "leaveType" DROP COLUMN "deletedAt",
ADD COLUMN     "recordStatus" "RecordStatus" NOT NULL DEFAULT E'ACTIVE';

-- CreateIndex
CREATE INDEX "casbin_rule_v0_v1_v2_idx" ON "casbin_rule"("v0", "v1", "v2");
