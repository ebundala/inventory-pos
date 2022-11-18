import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
 var prismaAdmin: PrismaClient | undefined;
}
const log = [
  { emit: 'stdout', level: 'query' },
  { emit: 'stdout', level: 'info' },
  { emit: 'stdout', level: 'warn' },
  { emit: 'stdout', level: 'error' }
 ];

if(process.env.NODE_ENV === "development") global.prisma = global.prisma || new PrismaClient({
  log: log,
  datasources:{db:{url:process.env.DATABASE_USER_URL}}
});


if(process.env.NODE_ENV === "development") global.prismaAdmin = global.prismaAdmin || new PrismaClient({
  log: log,
  datasources:{db:{url:process.env.DATABASE_URL}}
});

export const prismaAdmin = global.prismaAdmin || new PrismaClient({ log: log,  datasources:{db:{url:process.env.DATABASE_URL}}});


export const prisma = global.prisma || new PrismaClient({ log: log,  datasources:{db:{url:process.env.DATABASE_USER_URL}}});
