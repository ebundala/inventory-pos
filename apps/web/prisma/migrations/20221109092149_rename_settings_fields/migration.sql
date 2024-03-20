/*
  Warnings:

  - You are about to drop the column `CompanyAdress` on the `Setting` table. All the data in the column will be lost.
  - You are about to drop the column `CompanyName` on the `Setting` table. All the data in the column will be lost.
  - You are about to drop the column `CompanyPhone` on the `Setting` table. All the data in the column will be lost.
  - Added the required column `companyAdress` to the `Setting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyName` to the `Setting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyPhone` to the `Setting` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Setting" DROP COLUMN "CompanyAdress",
DROP COLUMN "CompanyName",
DROP COLUMN "CompanyPhone",
ADD COLUMN     "companyAdress" TEXT NOT NULL,
ADD COLUMN     "companyName" TEXT NOT NULL,
ADD COLUMN     "companyPhone" TEXT NOT NULL;
