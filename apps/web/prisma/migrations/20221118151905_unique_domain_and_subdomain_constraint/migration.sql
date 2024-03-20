/*
  Warnings:

  - A unique constraint covering the columns `[customDomain,subdomain]` on the table `Tenant` will be added. If there are existing duplicate values, this will fail.
  - Made the column `subdomain` on table `Tenant` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Tenant_customDomain_key";

-- AlterTable
ALTER TABLE "Tenant" ALTER COLUMN "subdomain" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_customDomain_subdomain_key" ON "Tenant"("customDomain", "subdomain");
