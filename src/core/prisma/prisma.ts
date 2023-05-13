import { PrismaClient } from "@prisma/client";
import { Enforcer } from "casbin";

declare global {
  var prisma: PrismaClient | undefined;
 var prismaAdmin: PrismaClient | undefined;
 var enforcer: Enforcer | undefined
}
const log = ['query', 'info', 'warn', 'error'] as any;

global.prisma = global.prisma || new PrismaClient({
  log: log,
  datasources:{db:{url:process.env.DATABASE_USER_URL}}
});


global.prismaAdmin = global.prismaAdmin || new PrismaClient({
  log: log,
  datasources:{db:{url:process.env.DATABASE_URL}}
});

export const prismaAdmin = global.prismaAdmin || new PrismaClient({ log: log,  datasources:{db:{url:process.env.DATABASE_URL}}});


export const prisma = global.prisma || new PrismaClient({ log: log,  datasources:{db:{url:process.env.DATABASE_USER_URL}}});
