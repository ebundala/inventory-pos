/*
  Warnings:

  - You are about to drop the column `createdAt` on the `casbin_rule` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `casbin_rule` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "casbin_rule_v0_v1_v2_idx";

-- AlterTable
ALTER TABLE "casbin_rule" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";
