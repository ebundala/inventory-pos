/*
  Warnings:

  - Added the required column `updatedAt` to the `casbin_rule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "casbin_rule" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
