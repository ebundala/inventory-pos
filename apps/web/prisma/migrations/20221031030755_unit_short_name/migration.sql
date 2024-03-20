/*
  Warnings:

  - You are about to drop the column `ShortName` on the `Unit` table. All the data in the column will be lost.
  - Added the required column `shortName` to the `Unit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Unit" DROP COLUMN "ShortName",
ADD COLUMN     "shortName" VARCHAR(192) NOT NULL;
