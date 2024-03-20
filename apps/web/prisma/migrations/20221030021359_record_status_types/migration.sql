/*
  Warnings:

  - You are about to drop the column `userId` on the `Tenant` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "RecordStatus" AS ENUM ('ACTIVE', 'DELETED', 'EDITING');

-- CreateEnum
CREATE TYPE "ProcessStatus" AS ENUM ('APPROVED', 'DENIED', 'PENDING', 'COMPLETED');

-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Tenant" DROP COLUMN "userId",
ADD COLUMN     "recordStatus" "RecordStatus" NOT NULL DEFAULT E'ACTIVE';

-- CreateTable
CREATE TABLE "TenantInvite" (
    "tenantId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "invitorId" TEXT NOT NULL,
    "status" "ProcessStatus" NOT NULL DEFAULT E'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TenantInvite_pkey" PRIMARY KEY ("tenantId","email")
);

-- CreateTable
CREATE TABLE "_tenant_members" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_tenant_members_AB_unique" ON "_tenant_members"("A", "B");

-- CreateIndex
CREATE INDEX "_tenant_members_B_index" ON "_tenant_members"("B");
