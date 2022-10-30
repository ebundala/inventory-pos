import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

if(process.env.NODE_ENV === "development") global.prisma = global.prisma || new PrismaClient();

export const prisma = global.prisma || new PrismaClient();
