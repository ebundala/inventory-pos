/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Site` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "Site";

-- CreateTable
CREATE TABLE "jackson_index" (
    "id" SERIAL NOT NULL,
    "key" VARCHAR(1500) NOT NULL,
    "storeKey" VARCHAR(1500) NOT NULL,

    CONSTRAINT "PK_a95aa83f01e3c73e126856b7820" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jackson_store" (
    "key" VARCHAR(1500) NOT NULL,
    "value" TEXT NOT NULL,
    "iv" VARCHAR(64),
    "tag" VARCHAR(64),
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMP(6),

    CONSTRAINT "PK_87b6fc1475fbd1228d2f53c6f4a" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "jackson_ttl" (
    "key" VARCHAR(1500) NOT NULL,
    "expiresAt" BIGINT NOT NULL,

    CONSTRAINT "PK_7c9bcdfb4d82e873e19935ec806" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE INDEX "_jackson_index_key" ON "jackson_index"("key");

-- CreateIndex
CREATE INDEX "_jackson_index_key_store" ON "jackson_index"("key", "storeKey");

-- CreateIndex
CREATE INDEX "_jackson_ttl_expires_at" ON "jackson_ttl"("expiresAt");
